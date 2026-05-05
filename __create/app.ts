import { AsyncLocalStorage } from 'node:async_hooks';
import nodeConsole from 'node:console';
import { skipCSRFCheck } from '@auth/core';
import Credentials from '@auth/core/providers/credentials';
import { authHandler, initAuthConfig } from '@hono/auth-js';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { contextStorage } from 'hono/context-storage';
import { cors } from 'hono/cors';
import { proxy } from 'hono/proxy';
import { bodyLimit } from 'hono/body-limit';
import { requestId } from 'hono/request-id';
import { serializeError } from 'serialize-error';
import NeonAdapter from './adapter';
import { getHTMLForErrorPage } from './get-html-for-error-page';
import { isAuthAction } from './is-auth-action';
import { API_BASENAME, api } from './route-builder';
import { hash, compare } from 'bcryptjs';
import sql from '../src/app/api/utils/sql';

// Neon serverless: use HTTP/fetch mode (no WebSocket needed on Vercel)
// @neondatabase/serverless automatically uses fetch when no wsConstructor is set
// Removing neonConfig.poolQueryViaFetch = true; to use stable WebSockets and prevent timeout

const als = new AsyncLocalStorage<{ requestId: string }>();

for (const method of ['log', 'info', 'warn', 'error', 'debug'] as const) {
  const original = nodeConsole[method].bind(console);

  console[method] = (...args: unknown[]) => {
    const id = als.getStore()?.requestId;
    if (id) {
      original(`[traceId:${id}]`, ...args);
    } else {
      original(...args);
    }
  };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = NeonAdapter(pool);

export const app = new Hono();

app.use('*', requestId());

app.use('*', (c, next) => {
  const id = c.get('requestId');
  return als.run({ requestId: id }, () => next());
});

app.use(contextStorage());

app.onError((err, c) => {
  console.error('[CRITICAL HONO ERROR]', err);
  
  const isApi = c.req.path.startsWith('/api/');
  const responseBody = {
    error: err.message || 'Unknown Server Error',
    details: serializeError(err),
    path: c.req.path
  };

  if (isApi || c.req.method !== 'GET') {
    return c.json(responseBody, 500);
  }

  return c.html(getHTMLForErrorPage(err), 200);
});

app.get('/api/health', async (c) => {
  try {
    const result = await pool.query('SELECT NOW()');
    return c.json({ status: 'OK', time: result.rows[0], env: { 
      secret_set: !!process.env.AUTH_SECRET,
      db_set: !!process.env.DATABASE_URL 
    }});
  } catch (err: any) {
    return c.json({ status: 'ERROR', error: err.message }, 500);
  }
});

if (process.env.CORS_ORIGINS) {
  app.use(
    '/*',
    cors({
      origin: process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    })
  );
}

// bodyLimit middleware removed to prevent POST request hangs on Vercel
console.log("AUTH_SECRET length:", process.env.AUTH_SECRET ? process.env.AUTH_SECRET.length : 0);
console.log("DATABASE_URL defined:", process.env.DATABASE_URL ? "yes" : "no");
if (process.env.AUTH_SECRET) {
  app.use(
    '*',
    initAuthConfig((c) => ({
      secret: process.env.AUTH_SECRET,
      trustHost: true,
      basePath: '/api/auth',
      pages: {
        signIn: '/account/signin',
        signOut: '/account/logout',
      },
      skipCSRFCheck,
      session: {
        strategy: 'jwt',
      },
      callbacks: {
        session({ session, token }) {
          if (token.sub) {
            session.user.id = token.sub;
          }
          return session;
        },
      },
      cookies: {
        csrfToken: { options: { secure: true, sameSite: 'none' } },
        sessionToken: { options: { secure: true, sameSite: 'none' } },
        callbackUrl: { options: { secure: true, sameSite: 'none' } },
      },
      providers: [
        ...(process.env.NEXT_PUBLIC_CREATE_ENV === 'DEVELOPMENT'
          ? [
              Credentials({
                id: 'dev-social',
                name: 'Development Social Sign-in',
                credentials: {
                  email: { label: 'Email', type: 'email' },
                  name: { label: 'Name', type: 'text' },
                  provider: { label: 'Provider', type: 'text' },
                },
                authorize: async (credentials) => {
                  const { email, name, provider } = credentials;
                  if (!email || typeof email !== 'string') return null;

                  const existing = await adapter.getUserByEmail(email);
                  if (existing) return existing;

                  const allowedProviders = new Set(['google', 'facebook', 'twitter', 'apple']);
                  const providerName =
                    typeof provider === 'string' && allowedProviders.has(provider.toLowerCase())
                      ? provider.toLowerCase()
                      : 'google';
                  const newUser = await adapter.createUser({
                    emailVerified: null,
                    email,
                    name: typeof name === 'string' && name.length > 0 ? name : undefined,
                  });
                  await adapter.linkAccount({
                    type: 'oauth',
                    userId: newUser.id,
                    provider: providerName,
                    providerAccountId: `dev-${newUser.id}`,
                  });
                  return newUser;
                },
              }),
            ]
          : []),
        Credentials({
          id: 'credentials-signin',
          name: 'Credentials Sign in',
          credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
          },
          authorize: async (credentials) => {
            console.log('[Auth.js] authorize called with email:', credentials?.email);
            const { email, password } = credentials;
            if (!email || !password) return null;
            if (typeof email !== 'string' || typeof password !== 'string') return null;

            // Use global sql utility instead of pool adapter to prevent timeout
            const users = await sql`SELECT id, name, email FROM auth_users WHERE email = ${email}`;
            console.log('[Auth.js] authorize users found:', users.length);
            if (users.length === 0) return null;
            const user = users[0];

            const accounts = await sql`SELECT password FROM auth_accounts WHERE "userId" = ${user.id} AND provider = 'credentials' LIMIT 1`;
            if (accounts.length === 0) return null;

            const accountPassword = accounts[0].password;
            if (!accountPassword) return null;

            const isValid = await compare(password, accountPassword);
            if (!isValid) return null;

            return user;
          },
        }),
        Credentials({
          id: 'credentials-signup',
          name: 'Credentials Sign up',
          credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
            name: { label: 'Name', type: 'text' },
            image: { label: 'Image', type: 'text', required: false },
          },
          authorize: async (credentials) => {
            console.log("Credentials signup authorize called:", credentials);
            const { email, password, name, image } = credentials;
            if (!email || !password) { console.log("Missing email or password"); return null; }
            if (typeof email !== 'string' || typeof password !== 'string') { console.log("Invalid email or password type"); return null; }

            const user = await adapter.getUserByEmail(email);
            if (!user) {
              const newUser = await adapter.createUser({
                emailVerified: null,
                email,
                name: typeof name === 'string' && name.length > 0 ? name : undefined,
                image: typeof image === 'string' && image.length > 0 ? image : undefined,
              });
              await adapter.linkAccount({
                extraData: { password: await hash(password, 10) },
                type: 'credentials',
                userId: newUser.id,
                providerAccountId: newUser.id,
                provider: 'credentials',
              });
              return newUser;
            }
            return null;
          },
        }),
      ],
    }))
  );
}

app.all('/integrations/:path{.+}', async (c) => {
  const queryParams = c.req.query();
  const url = `${process.env.NEXT_PUBLIC_CREATE_BASE_URL ?? 'https://www.create.xyz'}/integrations/${c.req.param('path')}${Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : ''}`;

  return proxy(url, {
    method: c.req.method,
    body: c.req.raw.body ?? null,
    // @ts-expect-error -- duplex is accepted by the runtime
    duplex: 'half',
    redirect: 'manual',
    headers: {
      ...c.req.header(),
      'X-Forwarded-For': process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-host': process.env.NEXT_PUBLIC_CREATE_HOST,
      Host: process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-project-group-id': process.env.NEXT_PUBLIC_PROJECT_GROUP_ID,
    },
  });
});

app.use('/api/auth/*', authHandler());

app.route(API_BASENAME, api);
