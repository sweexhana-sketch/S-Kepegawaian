import { createMiddleware } from 'hono/factory';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { createRequestHandler } from 'react-router';
import { AsyncLocalStorage } from 'node:async_hooks';
import nodeConsole from 'node:console';
import { skipCSRFCheck } from '@auth/core';
import Credentials from '@auth/core/providers/credentials';
import { initAuthConfig, authHandler } from '@hono/auth-js';
import { neon, Pool, neonConfig } from '@neondatabase/serverless';
import { getContext, contextStorage } from 'hono/context-storage';
import { cors } from 'hono/cors';
import { proxy } from 'hono/proxy';
import { bodyLimit } from 'hono/body-limit';
import { requestId } from 'hono/request-id';
import { serializeError } from 'serialize-error';
import { getToken } from '@auth/core/jwt';
import React__default from 'react';
import path, { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { route, index } from '@react-router/dev/routes';
import cleanStack from 'clean-stack';
import { CredentialsSignin } from '@auth/core/errors';
import { compare, hash } from 'bcryptjs';

var defaultWebSocket = {
  upgradeWebSocket: (() => {
  }),
  injectWebSocket: (server) => server
};
async function createWebSocket({ app, enabled }) {
  if (!enabled) {
    return defaultWebSocket;
  }
  process.env.NODE_ENV === "development" ? "development" : "production";
  {
    const { createNodeWebSocket } = await import('@hono/node-ws');
    const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });
    return {
      upgradeWebSocket,
      injectWebSocket(server) {
        injectWebSocket(server);
        return server;
      }
    };
  }
}
function cleanUpgradeListeners(httpServer) {
  const upgradeListeners = httpServer.listeners("upgrade").filter((listener) => listener.name !== "hmrServerWsListener");
  for (const listener of upgradeListeners) {
    httpServer.removeListener(
      "upgrade",
      /* @ts-expect-error - we don't care */
      listener
    );
  }
}
function patchUpgradeListener(httpServer) {
  const upgradeListeners = httpServer.listeners("upgrade").filter((listener) => listener.name !== "hmrServerWsListener");
  for (const listener of upgradeListeners) {
    httpServer.removeListener(
      "upgrade",
      /* @ts-expect-error - we don't care */
      listener
    );
    httpServer.on("upgrade", (request, ...rest) => {
      if (request.headers["sec-websocket-protocol"] === "vite-hmr") {
        return;
      }
      return listener(request, ...rest);
    });
  }
}
function bindIncomingRequestSocketInfo() {
  return createMiddleware((c, next) => {
    c.env.server = {
      incoming: {
        socket: {
          remoteAddress: c.req.raw.headers.get("x-remote-address") || void 0,
          remotePort: Number(c.req.raw.headers.get("x-remote-port")) || void 0,
          remoteFamily: c.req.raw.headers.get("x-remote-family") || void 0
        }
      }
    };
    return next();
  });
}
async function importBuild() {
  return await import(
    // @ts-expect-error - Virtual module provided by React Router at build time
    './server-build.js'
  );
}
function getBuildMode() {
  return process.env.NODE_ENV === "development" ? "development" : "production";
}

// src/middleware.ts
function cache(seconds) {
  return createMiddleware(async (c, next) => {
    if (!c.req.path.match(/\.[a-zA-Z0-9]+$/) || c.req.path.endsWith(".data")) {
      return next();
    }
    await next();
    if (!c.res.ok || c.res.headers.has("cache-control")) {
      return;
    }
    c.res.headers.set("cache-control", `public, max-age=${seconds}`);
  });
}

async function createHonoServer(options) {
  const startTime = Date.now();
  const build = await importBuild();
  const basename = "/";
  const mergedOptions = {
    ...options,
    listeningListener: options?.listeningListener || ((info) => {
      console.log(`🚀 Server started on port ${info.port}`);
      console.log(`🌍 http://127.0.0.1:${info.port}`);
      console.log(`🏎️ Server started in ${Date.now() - startTime}ms`);
    }),
    port: options?.port || Number(process.env.PORT) || 3e3,
    defaultLogger: options?.defaultLogger ?? true,
    overrideGlobalObjects: options?.overrideGlobalObjects ?? false
  };
  const mode = getBuildMode();
  const PRODUCTION = mode === "production";
  const clientBuildPath = `${"build"}/client`;
  const app = new Hono(mergedOptions.app);
  const { upgradeWebSocket, injectWebSocket } = await createWebSocket({
    app,
    enabled: mergedOptions.useWebSocket ?? false
  });
  if (!PRODUCTION) {
    app.use(bindIncomingRequestSocketInfo());
  }
  await mergedOptions.beforeAll?.(app);
  app.use(
    `/${"assets"}/*`,
    cache(60 * 60 * 24 * 365),
    // 1 year
    serveStatic({ root: clientBuildPath, ...mergedOptions.serveStaticOptions?.clientAssets })
  );
  app.use(
    "*",
    cache(60 * 60),
    // 1 hour
    serveStatic({ root: PRODUCTION ? clientBuildPath : "./public", ...mergedOptions.serveStaticOptions?.publicAssets })
  );
  if (mergedOptions.defaultLogger) {
    app.use("*", logger());
  }
  if (mergedOptions.useWebSocket) {
    await mergedOptions.configure(app, { upgradeWebSocket });
  } else {
    await mergedOptions.configure?.(app);
  }
  const reactRouterApp = new Hono({
    strict: false
  });
  reactRouterApp.use((c, next) => {
    return createMiddleware(async (c2) => {
      const requestHandler = createRequestHandler(build, mode);
      const loadContext = mergedOptions.getLoadContext?.(c2, { build, mode });
      return requestHandler(c2.req.raw, loadContext instanceof Promise ? await loadContext : loadContext);
    })(c, next);
  });
  app.route(`${basename}`, reactRouterApp);
  {
    app.route(`${basename}.data`, reactRouterApp);
  }
  if (PRODUCTION) {
    const server = serve(
      {
        ...app,
        ...mergedOptions.customNodeServer,
        port: mergedOptions.port,
        overrideGlobalObjects: mergedOptions.overrideGlobalObjects,
        hostname: mergedOptions.hostname
      },
      mergedOptions.listeningListener
    );
    mergedOptions.onServe?.(server);
    injectWebSocket(server);
  } else if (globalThis.__viteDevServer?.httpServer) {
    const httpServer = globalThis.__viteDevServer.httpServer;
    cleanUpgradeListeners(httpServer);
    mergedOptions.onServe?.(httpServer);
    injectWebSocket(httpServer);
    patchUpgradeListener(httpServer);
    console.log("🚧 Dev server started");
  }
  return app;
}

function NeonAdapter(client) {
  return {
    async createVerificationToken(verificationToken) {
      const { identifier, expires, token } = verificationToken;
      const sql = `
        INSERT INTO auth_verification_token ( identifier, expires, token )
        VALUES ($1, $2, $3)
        `;
      await client.query(sql, [identifier, expires, token]);
      return verificationToken;
    },
    async useVerificationToken({
      identifier,
      token
    }) {
      const sql = `delete from auth_verification_token
      where identifier = $1 and token = $2
      RETURNING identifier, expires, token `;
      const result = await client.query(sql, [identifier, token]);
      return result.rowCount !== 0 ? result.rows[0] : null;
    },
    async createUser(user) {
      const { name, email, emailVerified, image } = user;
      const sql = `
        INSERT INTO auth_users (name, email, "emailVerified", image)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, "emailVerified", image`;
      const result = await client.query(sql, [
        name,
        email,
        emailVerified,
        image
      ]);
      return result.rows[0];
    },
    async getUser(id) {
      const sql = "select * from auth_users where id = $1";
      try {
        const result = await client.query(sql, [id]);
        return result.rowCount === 0 ? null : result.rows[0];
      } catch {
        return null;
      }
    },
    async getUserByEmail(email) {
      const sql = "select * from auth_users where email = $1";
      const result = await client.query(sql, [email]);
      if (result.rowCount === 0) {
        return null;
      }
      const userData = result.rows[0];
      const accountsData = await client.query(
        'select * from auth_accounts where "userId" = $1',
        [userData.id]
      );
      return {
        ...userData,
        accounts: accountsData.rows
      };
    },
    async getUserByAccount({
      providerAccountId,
      provider
    }) {
      const sql = `
          select u.* from auth_users u join auth_accounts a on u.id = a."userId"
          where
          a.provider = $1
          and
          a."providerAccountId" = $2`;
      const result = await client.query(sql, [provider, providerAccountId]);
      return result.rowCount !== 0 ? result.rows[0] : null;
    },
    async updateUser(user) {
      const fetchSql = "select * from auth_users where id = $1";
      const query1 = await client.query(fetchSql, [user.id]);
      const oldUser = query1.rows[0];
      const newUser = {
        ...oldUser,
        ...user
      };
      const { id, name, email, emailVerified, image } = newUser;
      const updateSql = `
        UPDATE auth_users set
        name = $2, email = $3, "emailVerified" = $4, image = $5
        where id = $1
        RETURNING name, id, email, "emailVerified", image
      `;
      const query2 = await client.query(updateSql, [
        id,
        name,
        email,
        emailVerified,
        image
      ]);
      return query2.rows[0];
    },
    async linkAccount(account) {
      const sql = `
      insert into auth_accounts
      (
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
        password
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning
        id,
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
        password
      `;
      const params = [
        account.userId,
        account.provider,
        account.type,
        account.providerAccountId,
        account.access_token,
        account.expires_at,
        account.refresh_token,
        account.id_token,
        account.scope,
        account.session_state,
        account.token_type,
        account.extraData?.password
      ];
      const result = await client.query(sql, params);
      return result.rows[0];
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === void 0) {
        throw Error("userId is undef in createSession");
      }
      const sql = `insert into auth_sessions ("userId", expires, "sessionToken")
      values ($1, $2, $3)
      RETURNING id, "sessionToken", "userId", expires`;
      const result = await client.query(sql, [userId, expires, sessionToken]);
      return result.rows[0];
    },
    async getSessionAndUser(sessionToken) {
      if (sessionToken === void 0) {
        return null;
      }
      const result1 = await client.query(
        `select * from auth_sessions where "sessionToken" = $1`,
        [sessionToken]
      );
      if (result1.rowCount === 0) {
        return null;
      }
      const session = result1.rows[0];
      const result2 = await client.query(
        "select * from auth_users where id = $1",
        [session.userId]
      );
      if (result2.rowCount === 0) {
        return null;
      }
      const user = result2.rows[0];
      return {
        session,
        user
      };
    },
    async updateSession(session) {
      const { sessionToken } = session;
      const result1 = await client.query(
        `select * from auth_sessions where "sessionToken" = $1`,
        [sessionToken]
      );
      if (result1.rowCount === 0) {
        return null;
      }
      const originalSession = result1.rows[0];
      const newSession = {
        ...originalSession,
        ...session
      };
      const sql = `
        UPDATE auth_sessions set
        expires = $2
        where "sessionToken" = $1
        `;
      const result = await client.query(sql, [
        newSession.sessionToken,
        newSession.expires
      ]);
      return result.rows[0];
    },
    async deleteSession(sessionToken) {
      const sql = `delete from auth_sessions where "sessionToken" = $1`;
      await client.query(sql, [sessionToken]);
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount;
      const sql = `delete from auth_accounts where "providerAccountId" = $1 and provider = $2`;
      await client.query(sql, [providerAccountId, provider]);
    },
    async deleteUser(userId) {
      await client.query("delete from auth_users where id = $1", [userId]);
      await client.query('delete from auth_sessions where "userId" = $1', [
        userId
      ]);
      await client.query('delete from auth_accounts where "userId" = $1', [
        userId
      ]);
    }
  };
}

const getHTMLForErrorPage = (err) => {
  return `
<html>
  <head>
    <script>
    window.onload = () => {
      const error = ${JSON.stringify(serializeError(err))};
      window.parent.postMessage({ type: 'sandbox:web:ready' }, '*');
      window.parent.postMessage({ type: 'sandbox:error:detected', error: error }, '*');

      const healthyResponse = {
        type: 'sandbox:web:healthcheck:response',
        healthy: true,
        hasError: true,
        supportsErrorDetected: true,
      };
      window.addEventListener('message', (event) => {
        if (event.data.type === 'sandbox:navigation') {
          window.location.pathname = event.data.pathname;
        }
        if (event.data.type === 'sandbox:web:healthcheck') {
          window.parent.postMessage(healthyResponse, '*');
        }
      });
      console.error(error);
    }
    <\/script>
  </head>
  <body></body>
</html>
    `;
};

const ALLOWED_PROVIDERS = new Set(['google', 'facebook', 'twitter', 'apple']);
function GET$h(request) {
  if (process.env.NEXT_PUBLIC_CREATE_ENV !== 'DEVELOPMENT') {
    return Response.json({
      error: 'not found'
    }, {
      status: 404
    });
  }
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  if (!provider || !ALLOWED_PROVIDERS.has(provider.toLowerCase())) {
    return Response.json({
      error: 'invalid provider'
    }, {
      status: 400
    });
  }
  const key = provider.toUpperCase();
  const clientId = `${key}_CLIENT_ID`;
  const clientSecret = `${key}_CLIENT_SECRET`;
  const missing = [];
  if (!process.env[clientId]) missing.push(clientId);
  if (!process.env[clientSecret]) missing.push(clientSecret);
  return Response.json({
    provider,
    missing
  });
}

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$h
}, Symbol.toStringTag, { value: 'Module' }));

const __dirname$1 = fileURLToPath(new URL(".", import.meta.url));
function buildRouteTree(dir, basePath = "") {
  const files = readdirSync(dir);
  const node = {
    path: basePath,
    children: [],
    hasPage: false,
    isParam: false,
    isCatchAll: false,
    paramName: ""
  };
  const dirName = basePath.split("/").pop();
  if (dirName?.startsWith("[") && dirName.endsWith("]")) {
    node.isParam = true;
    const paramName = dirName.slice(1, -1);
    if (paramName.startsWith("...")) {
      node.isCatchAll = true;
      node.paramName = paramName.slice(3);
    } else {
      node.paramName = paramName;
    }
  }
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      const childPath = basePath ? `${basePath}/${file}` : file;
      const childNode = buildRouteTree(filePath, childPath);
      node.children.push(childNode);
    } else if (file === "page.jsx") {
      node.hasPage = true;
    }
  }
  return node;
}
function generateRoutes(node) {
  const routes2 = [];
  if (node.hasPage) {
    const componentPath = node.path === "" ? `./${node.path}page.jsx` : `./${node.path}/page.jsx`;
    if (node.path === "") {
      routes2.push(index(componentPath));
    } else {
      let routePath = node.path;
      const segments = routePath.split("/");
      const processedSegments = segments.map((segment) => {
        if (segment.startsWith("[") && segment.endsWith("]")) {
          const paramName = segment.slice(1, -1);
          if (paramName.startsWith("...")) {
            return "*";
          }
          if (paramName.startsWith("[") && paramName.endsWith("]")) {
            return `:${paramName.slice(1, -1)}?`;
          }
          return `:${paramName}`;
        }
        return segment;
      });
      routePath = processedSegments.join("/");
      routes2.push(route(routePath, componentPath));
    }
  }
  for (const child of node.children) {
    routes2.push(...generateRoutes(child));
  }
  return routes2;
}
const tree = buildRouteTree(__dirname$1);
const notFound = route("*?", "./__create/not-found.tsx");
const routes = [...generateRoutes(tree), notFound];

function serializeClean(err) {
  // if we want to clean this more, maybe we should look at the file where it
  // is imported and above.
  err.stack = cleanStack(err.stack, {
    pathFilter: path => {
      // Filter out paths that are not relevant to the error
      return !path.includes('node_modules') && !path.includes('dist') && !path.includes('__create');
    }
  });
  return serializeError(err);
}
const getHTMLOrError = component => {
  try {
    const html = renderToString(React__default.createElement(component, {}));
    return {
      html,
      error: null
    };
  } catch (error) {
    return {
      html: null,
      error: serializeClean(error)
    };
  }
};
async function GET$g(request) {
  const results = await Promise.allSettled(routes.map(async route => {
    let component = null;
    try {
      const response = await import(/* @vite-ignore */path.join('../../../', route.file));
      component = response.default;
    } catch (error) {
      console.debug('Error importing component:', route.file, error);
    }
    if (!component) {
      return null;
    }
    getHTMLOrError(component);
    return {
      route: route.file,
      path: route.path,
      ...getHTMLOrError(component)
    };
  }));
  const cleanedResults = results.filter(result => result.status === 'fulfilled').map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return null;
  }).filter(result => result !== null);
  return Response.json({
    results: cleanedResults
  });
}

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$g
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$f(request) {
  const [token, jwt] = await Promise.all([getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL ? process.env.AUTH_URL.startsWith('https') : false,
    raw: true
  }), getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL ? process.env.AUTH_URL.startsWith('https') : false
  })]);
  if (!jwt) {
    return new Response(`
			<html>
				<body>
					<script>
						window.parent.postMessage({ type: 'AUTH_ERROR', error: 'Unauthorized' }, '*');
					</script>
				</body>
			</html>
			`, {
      status: 401,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
  const message = {
    type: 'AUTH_SUCCESS',
    jwt: token,
    user: {
      id: jwt.sub,
      email: jwt.email,
      name: jwt.name
    }
  };
  return new Response(`
		<html>
			<body>
				<script>
					window.parent.postMessage(${JSON.stringify(message)}, '*');
				</script>
			</body>
		</html>
		`, {
    headers: {
      'Content-Type': 'text/html'
    }
  });
}

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$f
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$e(request) {
  const [token, jwt] = await Promise.all([getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL ? process.env.AUTH_URL.startsWith('https') : false,
    raw: true
  }), getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL ? process.env.AUTH_URL.startsWith('https') : false
  })]);
  if (!jwt) {
    return new Response(JSON.stringify({
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  return new Response(JSON.stringify({
    jwt: token,
    user: {
      id: jwt.sub,
      email: jwt.email,
      name: jwt.name
    }
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

const __vite_glob_0_3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$e
}, Symbol.toStringTag, { value: 'Module' }));

const NullishQueryFunction = () => {
  throw new Error('No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set');
};
NullishQueryFunction.transaction = () => {
  throw new Error('No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set');
};
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : NullishQueryFunction;

function CreateAuth() {
  const auth = async () => {
    const c = getContext();
    const token = await getToken({
      req: c.req.raw,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL ? process.env.AUTH_URL.startsWith('https') : false
    });
    if (token) {
      return {
        user: {
          id: token.sub,
          email: token.email,
          name: token.name,
          image: token.picture
        },
        expires: token.exp.toString()
      };
    }
  };
  return {
    auth
  };
}

/**
 * WARNING: This file connects this app to Anythings's internal auth system. Do
 * not attempt to edit it. Modifying it will have no effect on your project as it is controlled by our system.
 * Do not import @auth/create or @auth/create anywhere else or it may break. This is an internal package.
 */
function Adapter(client) {
  return {
    async createVerificationToken(verificationToken) {
      const {
        identifier,
        expires,
        token
      } = verificationToken;
      const sql = `
        INSERT INTO auth_verification_token ( identifier, expires, token )
        VALUES ($1, $2, $3)
        `;
      await client.query(sql, [identifier, expires, token]);
      return verificationToken;
    },
    async useVerificationToken({
      identifier,
      token
    }) {
      const sql = `delete from auth_verification_token
      where identifier = $1 and token = $2
      RETURNING identifier, expires, token `;
      const result = await client.query(sql, [identifier, token]);
      return result.rowCount !== 0 ? result.rows[0] : null;
    },
    async createUser(user) {
      const {
        name,
        email,
        emailVerified,
        image
      } = user;
      const sql = `
        INSERT INTO auth_users (name, email, "emailVerified", image)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, "emailVerified", image`;
      const result = await client.query(sql, [name, email, emailVerified, image]);
      return result.rows[0];
    },
    async getUser(id) {
      const sql = 'select * from auth_users where id = $1';
      try {
        const result = await client.query(sql, [id]);
        return result.rowCount === 0 ? null : result.rows[0];
      } catch {
        return null;
      }
    },
    async getUserByEmail(email) {
      const sql = 'select * from auth_users where email = $1';
      const result = await client.query(sql, [email]);
      if (result.rowCount === 0) {
        return null;
      }
      const userData = result.rows[0];
      const accountsData = await client.query('select * from auth_accounts where "userId" = $1', [userData.id]);
      return {
        ...userData,
        accounts: accountsData.rows
      };
    },
    async getUserByAccount({
      providerAccountId,
      provider
    }) {
      const sql = `
          select u.* from auth_users u join auth_accounts a on u.id = a."userId"
          where
          a.provider = $1
          and
          a."providerAccountId" = $2`;
      const result = await client.query(sql, [provider, providerAccountId]);
      return result.rowCount !== 0 ? result.rows[0] : null;
    },
    async updateUser(user) {
      const fetchSql = 'select * from auth_users where id = $1';
      const query1 = await client.query(fetchSql, [user.id]);
      const oldUser = query1.rows[0];
      const newUser = {
        ...oldUser,
        ...user
      };
      const {
        id,
        name,
        email,
        emailVerified,
        image
      } = newUser;
      const updateSql = `
        UPDATE auth_users set
        name = $2, email = $3, "emailVerified" = $4, image = $5
        where id = $1
        RETURNING name, id, email, "emailVerified", image
      `;
      const query2 = await client.query(updateSql, [id, name, email, emailVerified, image]);
      return query2.rows[0];
    },
    async linkAccount(account) {
      const sql = `
      insert into auth_accounts
      (
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
        password
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning
        id,
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
        password
      `;
      const params = [account.userId, account.provider, account.type, account.providerAccountId, account.access_token, account.expires_at, account.refresh_token, account.id_token, account.scope, account.session_state, account.token_type, account.extraData?.password];
      const result = await client.query(sql, params);
      return result.rows[0];
    },
    async createSession({
      sessionToken,
      userId,
      expires
    }) {
      if (userId === undefined) {
        throw Error('userId is undef in createSession');
      }
      const sql = `insert into auth_sessions ("userId", expires, "sessionToken")
      values ($1, $2, $3)
      RETURNING id, "sessionToken", "userId", expires`;
      const result = await client.query(sql, [userId, expires, sessionToken]);
      return result.rows[0];
    },
    async getSessionAndUser(sessionToken) {
      if (sessionToken === undefined) {
        return null;
      }
      const result1 = await client.query(`select * from auth_sessions where "sessionToken" = $1`, [sessionToken]);
      if (result1.rowCount === 0) {
        return null;
      }
      const session = result1.rows[0];
      const result2 = await client.query('select * from auth_users where id = $1', [session.userId]);
      if (result2.rowCount === 0) {
        return null;
      }
      const user = result2.rows[0];
      return {
        session,
        user
      };
    },
    async updateSession(session) {
      const {
        sessionToken
      } = session;
      const result1 = await client.query(`select * from auth_sessions where "sessionToken" = $1`, [sessionToken]);
      if (result1.rowCount === 0) {
        return null;
      }
      const originalSession = result1.rows[0];
      const newSession = {
        ...originalSession,
        ...session
      };
      const sql = `
        UPDATE auth_sessions set
        expires = $2
        where "sessionToken" = $1
        `;
      const result = await client.query(sql, [newSession.sessionToken, newSession.expires]);
      return result.rows[0];
    },
    async deleteSession(sessionToken) {
      const sql = `delete from auth_sessions where "sessionToken" = $1`;
      await client.query(sql, [sessionToken]);
    },
    async unlinkAccount(partialAccount) {
      const {
        provider,
        providerAccountId
      } = partialAccount;
      const sql = `delete from auth_accounts where "providerAccountId" = $1 and provider = $2`;
      await client.query(sql, [providerAccountId, provider]);
    },
    async deleteUser(userId) {
      await client.query('delete from auth_users where id = $1', [userId]);
      await client.query('delete from auth_sessions where "userId" = $1', [userId]);
      await client.query('delete from auth_accounts where "userId" = $1', [userId]);
    }
  };
}
const pool$1 = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter$1 = Adapter(pool$1);
const {
  auth
} = CreateAuth({
  providers: [Credentials({
    id: 'credentials-signin',
    name: 'Credentials Sign in',
    credentials: {
      email: {
        label: 'Email',
        type: 'email'
      },
      password: {
        label: 'Password',
        type: 'password'
      }
    },
    authorize: async credentials => {
      const {
        email,
        password
      } = credentials;
      if (!email || !password) {
        return null;
      }
      if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
      }

      // logic to verify if user exists
      const user = await adapter$1.getUserByEmail(email);
      if (!user) {
        const error = new CredentialsSignin();
        error.code = 'no-account';
        throw error;
      }
      const matchingAccount = user.accounts.find(account => account.provider === 'credentials');
      const accountPassword = matchingAccount?.password;
      if (!accountPassword) {
        throw new CredentialsSignin();
      }
      const isValid = await compare(accountPassword, password);
      if (!isValid) {
        throw new CredentialsSignin();
      }

      // return user object with the their profile data
      return user;
    }
  }), Credentials({
    id: 'credentials-signup',
    name: 'Credentials Sign up',
    credentials: {
      email: {
        label: 'Email',
        type: 'email'
      },
      password: {
        label: 'Password',
        type: 'password'
      },
      name: {
        label: 'Name',
        type: 'text',
        required: false
      },
      image: {
        label: 'Image',
        type: 'text',
        required: false
      }
    },
    authorize: async credentials => {
      const {
        email,
        password
      } = credentials;
      if (!email || !password) {
        return null;
      }
      if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
      }

      // logic to verify if user exists
      const user = await adapter$1.getUserByEmail(email);
      if (!user) {
        const newUser = await adapter$1.createUser({
          emailVerified: null,
          email,
          name: typeof credentials.name === 'string' && credentials.name.trim().length > 0 ? credentials.name : undefined,
          image: typeof credentials.image === 'string' ? credentials.image : undefined
        });
        await adapter$1.linkAccount({
          extraData: {
            password: await hash(password)
          },
          type: 'credentials',
          userId: newUser.id,
          providerAccountId: newUser.id,
          provider: 'credentials'
        });
        return newUser;
      }
      return null;
    }
  })]});

async function GET$d(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const rows = await sql`
      SELECT c.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja,
        a.nama_lengkap as atasan_nama
      FROM cuti_izin c 
      JOIN pegawai p ON c.pegawai_id = p.id
      LEFT JOIN pegawai a ON c.atasan_id = a.id
      WHERE c.id = ${id} LIMIT 1
    `;
    if (!rows.length) return Response.json({
      error: "Data tidak ditemukan"
    }, {
      status: 404
    });
    return Response.json({
      cuti: rows[0]
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function PATCH$5(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const {
      status,
      catatan_atasan
    } = await request.json();

    // Get pegawai for role check
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Unauthorized"
    }, {
      status: 403
    });
    const pegawai = pegawaiRows[0];
    if (pegawai.role === 'pegawai') {
      return Response.json({
        error: "Tidak memiliki akses untuk approve/tolak cuti"
      }, {
        status: 403
      });
    }
    const rows = await sql`
      UPDATE cuti_izin SET
        status = ${status},
        catatan_atasan = ${catatan_atasan || null},
        disetujui_oleh = ${pegawai.id},
        tanggal_disetujui = NOW(),
        updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    if (!rows.length) return Response.json({
      error: "Data tidak ditemukan"
    }, {
      status: 404
    });

    // Kurangi saldo jika disetujui
    if (status === 'disetujui' && rows[0].jenis_cuti === 'cuti_tahunan') {
      await sql`
        UPDATE saldo_cuti SET 
          saldo_tahunan = saldo_tahunan - ${rows[0].jumlah_hari},
          updated_at = NOW()
        WHERE pegawai_id = ${rows[0].pegawai_id}
      `.catch(() => {});
    }
    return Response.json({
      cuti: rows[0]
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$d,
  PATCH: PATCH$5
}, Symbol.toStringTag, { value: 'Module' }));

async function POST$5(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawaiId = pegawaiRows[0].id;
    const {
      jenis_cuti,
      tanggal_mulai,
      tanggal_selesai,
      alasan,
      atasan_id,
      alamat_selama_cuti,
      telepon_selama_cuti
    } = await request.json();
    if (!jenis_cuti || !tanggal_mulai || !tanggal_selesai || !alasan) {
      return Response.json({
        error: "Semua field wajib diisi"
      }, {
        status: 400
      });
    }

    // Hitung jumlah hari
    const start = new Date(tanggal_mulai);
    const end = new Date(tanggal_selesai);
    const jumlah_hari = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (jumlah_hari <= 0) {
      return Response.json({
        error: "Tanggal selesai harus setelah tanggal mulai"
      }, {
        status: 400
      });
    }

    // Validasi saldo cuti tahunan
    if (jenis_cuti === "cuti_tahunan") {
      const saldoRows = await sql`SELECT saldo_tahunan FROM saldo_cuti WHERE pegawai_id = ${pegawaiId} LIMIT 1`;
      if (saldoRows.length && saldoRows[0].saldo_tahunan < jumlah_hari) {
        return Response.json({
          error: `Saldo cuti tahunan tidak mencukupi (tersisa ${saldoRows[0].saldo_tahunan} hari)`
        }, {
          status: 400
        });
      }
    }
    const rows = await sql`
      INSERT INTO cuti_izin 
        (pegawai_id, jenis_cuti, tanggal_mulai, tanggal_selesai, jumlah_hari, alasan, atasan_id, alamat_selama_cuti, telepon_selama_cuti, status, created_at, updated_at)
      VALUES 
        (${pegawaiId}, ${jenis_cuti}, ${tanggal_mulai}, ${tanggal_selesai}, ${jumlah_hari}, ${alasan}, ${atasan_id || null}, ${alamat_selama_cuti || null}, ${telepon_selama_cuti || null}, 'menunggu', NOW(), NOW())
      RETURNING *
    `;
    return Response.json({
      cuti: rows[0]
    }, {
      status: 201
    });
  } catch (err) {
    console.error("POST /api/cuti/create error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST: POST$5
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$c(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      searchParams
    } = new URL(request.url);
    const status = searchParams.get("status");
    const jenis = searchParams.get("jenis");
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawai = pegawaiRows[0];
    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT c.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja
        FROM cuti_izin c JOIN pegawai p ON c.pegawai_id = p.id
        ${status ? sql`WHERE c.status = ${status}` : sql``}
        ORDER BY c.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT c.*, p.nama_lengkap FROM cuti_izin c
        JOIN pegawai p ON c.pegawai_id = p.id
        WHERE c.pegawai_id = ${pegawai.id}
        ${status ? sql`AND c.status = ${status}` : sql``}
        ${jenis ? sql`AND c.jenis_cuti = ${jenis}` : sql``}
        ORDER BY c.created_at DESC
      `;
    }

    // Get saldo cuti
    const saldoRows = await sql`
      SELECT * FROM saldo_cuti WHERE pegawai_id = ${pegawai.id} LIMIT 1
    `;
    return Response.json({
      cuti: rows,
      saldo: saldoRows[0] || null,
      total: rows.length
    });
  } catch (err) {
    console.error("GET /api/cuti/list error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$c
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$b() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    // Get pegawai profile to check role
    const pegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;
    if (pegawaiRows.length === 0) {
      return Response.json({
        error: "Profil pegawai belum terhubung"
      }, {
        status: 404
      });
    }
    const role = pegawaiRows[0].role;

    // Total Pegawai
    const totalPegawaiRows = await sql`
      SELECT COUNT(*) as count FROM pegawai WHERE is_active = true
    `;
    const totalPegawai = parseInt(totalPegawaiRows[0].count);

    // KGB Bulan Ini (TMT KGB yang jatuh di bulan ini)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const kgbBulanIniRows = await sql`
      SELECT COUNT(*) as count FROM kgb 
      WHERE EXTRACT(MONTH FROM tmt_kgb_baru) = ${currentMonth}
      AND EXTRACT(YEAR FROM tmt_kgb_baru) = ${currentYear}
      AND status = 'pending'
    `;
    const kgbBulanIni = parseInt(kgbBulanIniRows[0].count);

    // Usulan Kenaikan Pangkat (status usulan atau di_bkd)
    const usulanKPRows = await sql`
      SELECT COUNT(*) as count FROM kenaikan_pangkat 
      WHERE status IN ('usulan', 'di_bkd')
    `;
    const usulanKP = parseInt(usulanKPRows[0].count);

    // SKP Belum Submit (tahun ini, status draft)
    const skpBelumSubmitRows = await sql`
      SELECT COUNT(*) as count FROM skp 
      WHERE tahun = ${currentYear}
      AND status = 'draft'
    `;
    const skpBelumSubmit = parseInt(skpBelumSubmitRows[0].count);
    return Response.json({
      totalPegawai,
      kgbBulanIni,
      usulanKP,
      skpBelumSubmit
    });
  } catch (err) {
    console.error("GET /api/dashboard/stats error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$b
}, Symbol.toStringTag, { value: 'Module' }));

async function DELETE$2(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Unauthorized"
    }, {
      status: 403
    });
    const pegawai = pegawaiRows[0];
    const {
      id
    } = params;
    // Only owner or admin can delete
    if (pegawai.role === "admin") {
      await sql`DELETE FROM dossier WHERE id = ${id}`;
    } else {
      await sql`DELETE FROM dossier WHERE id = ${id} AND pegawai_id = ${pegawai.id}`;
    }
    return Response.json({
      success: true
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function PATCH$4(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length || pegawaiRows[0].role !== 'admin') {
      return Response.json({
        error: "Hanya admin yang dapat memverifikasi dokumen"
      }, {
        status: 403
      });
    }
    const {
      id
    } = params;
    const {
      status,
      catatan
    } = await request.json();
    const rows = await sql`
      UPDATE dossier SET status = ${status}, catatan = ${catatan || null}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return Response.json({
      dokumen: rows[0]
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE: DELETE$2,
  PATCH: PATCH$4
}, Symbol.toStringTag, { value: 'Module' }));

async function POST$4(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawaiId = pegawaiRows[0].id;
    const {
      kategori,
      jenis_dokumen,
      deskripsi,
      file_url,
      masa_berlaku
    } = await request.json();
    if (!kategori || !jenis_dokumen || !file_url) {
      return Response.json({
        error: "Kategori, jenis dokumen, dan file wajib diisi"
      }, {
        status: 400
      });
    }
    const rows = await sql`
      INSERT INTO dossier (pegawai_id, kategori, jenis_dokumen, deskripsi, file_url, masa_berlaku, status, created_at, updated_at)
      VALUES (${pegawaiId}, ${kategori}, ${jenis_dokumen}, ${deskripsi || null}, ${file_url}, ${masa_berlaku || null}, 'pending', NOW(), NOW())
      RETURNING *
    `;
    return Response.json({
      dokumen: rows[0]
    }, {
      status: 201
    });
  } catch (err) {
    console.error("POST /api/dossier/create error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST: POST$4
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$a(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawai = pegawaiRows[0];
    const {
      searchParams
    } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    let rows;
    if (pegawai.role === "admin") {
      rows = await sql`
        SELECT d.*, p.nama_lengkap, p.nip FROM dossier d
        JOIN pegawai p ON d.pegawai_id = p.id
        ${kategori ? sql`WHERE d.kategori = ${kategori}` : sql``}
        ORDER BY d.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT * FROM dossier WHERE pegawai_id = ${pegawai.id}
        ${kategori ? sql`AND kategori = ${kategori}` : sql``}
        ORDER BY created_at DESC
      `;
    }
    return Response.json({
      dokumen: rows,
      total: rows.length
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$a
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$9(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const rows = await sql`
      SELECT kp.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan, p.pangkat, p.status_pegawai
      FROM kenaikan_pangkat kp JOIN pegawai p ON kp.pegawai_id = p.id
      WHERE kp.id = ${id} LIMIT 1
    `;
    if (!rows.length) return Response.json({
      error: "Data tidak ditemukan"
    }, {
      status: 404
    });
    return Response.json({
      kenaikan_pangkat: rows[0]
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function PATCH$3(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const {
      status,
      nomor_sk,
      tanggal_sk,
      catatan,
      dokumen_urls
    } = await request.json();
    const rows = await sql`
      UPDATE kenaikan_pangkat SET
        status = COALESCE(${status}, status),
        nomor_sk = COALESCE(${nomor_sk}, nomor_sk),
        tanggal_sk = COALESCE(${tanggal_sk}, tanggal_sk),
        catatan = COALESCE(${catatan}, catatan),
        dokumen_urls = COALESCE(${dokumen_urls ? JSON.stringify(dokumen_urls) : null}::jsonb, dokumen_urls),
        updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    if (!rows.length) return Response.json({
      error: "Data tidak ditemukan"
    }, {
      status: 404
    });
    return Response.json({
      kenaikan_pangkat: rows[0]
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$9,
  PATCH: PATCH$3
}, Symbol.toStringTag, { value: 'Module' }));

async function POST$3(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id, golongan, pangkat FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const p = pegawaiRows[0];
    const {
      jenis_kenaikan,
      golongan_baru,
      pangkat_baru,
      tmt_usulan,
      periode_usulan,
      catatan,
      dokumen_urls
    } = await request.json();
    if (!jenis_kenaikan || !tmt_usulan) {
      return Response.json({
        error: "Jenis kenaikan dan TMT wajib diisi"
      }, {
        status: 400
      });
    }
    const rows = await sql`
      INSERT INTO kenaikan_pangkat 
        (pegawai_id, jenis_kenaikan, golongan_lama, pangkat_lama, golongan_baru, pangkat_baru, tmt_usulan, periode_usulan, catatan, dokumen_urls, status, created_at, updated_at)
      VALUES 
        (${p.id}, ${jenis_kenaikan}, ${p.golongan}, ${p.pangkat}, ${golongan_baru || null}, ${pangkat_baru || null}, ${tmt_usulan}, ${periode_usulan || null}, ${catatan || null}, ${JSON.stringify(dokumen_urls || [])}, 'usulan', NOW(), NOW())
      RETURNING *
    `;

    // Buat notifikasi
    await sql`
      INSERT INTO notifikasi (pegawai_id, jenis, judul, pesan, created_at)
      VALUES (${p.id}, 'kenaikan_pangkat', 'Usulan Kenaikan Pangkat Diajukan', 
        ${'Usulan kenaikan pangkat ' + jenis_kenaikan + ' Anda berhasil diajukan dan sedang diproses.'}, NOW())
    `.catch(() => {}); // non-blocking

    return Response.json({
      kenaikan_pangkat: rows[0]
    }, {
      status: 201
    });
  } catch (err) {
    console.error("POST /api/kenaikan-pangkat/create error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST: POST$3
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$8(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      searchParams
    } = new URL(request.url);
    const status = searchParams.get("status");
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawai = pegawaiRows[0];
    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT kp.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan, p.pangkat
        FROM kenaikan_pangkat kp JOIN pegawai p ON kp.pegawai_id = p.id
        ${status ? sql`WHERE kp.status = ${status}` : sql``}
        ORDER BY kp.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT kp.*, p.nama_lengkap, p.nip FROM kenaikan_pangkat kp
        JOIN pegawai p ON kp.pegawai_id = p.id
        WHERE kp.pegawai_id = ${pegawai.id}
        ${status ? sql`AND kp.status = ${status}` : sql``}
        ORDER BY kp.created_at DESC
      `;
    }
    return Response.json({
      kenaikan_pangkat: rows,
      total: rows.length
    });
  } catch (err) {
    console.error("GET /api/kenaikan-pangkat/list error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$8
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$7(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const rows = await sql`
      SELECT k.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan, p.status_pegawai
      FROM kgb k JOIN pegawai p ON k.pegawai_id = p.id
      WHERE k.id = ${id} LIMIT 1
    `;
    if (!rows.length) return Response.json({
      error: "Data KGB tidak ditemukan"
    }, {
      status: 404
    });
    return Response.json({
      kgb: rows[0]
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function PATCH$2(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const {
      status,
      nomor_sk,
      tanggal_sk,
      gaji_baru,
      catatan
    } = await request.json();
    const rows = await sql`
      UPDATE kgb SET
        status = COALESCE(${status}, status),
        nomor_sk = COALESCE(${nomor_sk}, nomor_sk),
        tanggal_sk = COALESCE(${tanggal_sk}, tanggal_sk),
        gaji_baru = COALESCE(${gaji_baru}, gaji_baru),
        catatan = COALESCE(${catatan}, catatan),
        updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    if (!rows.length) return Response.json({
      error: "Data tidak ditemukan"
    }, {
      status: 404
    });
    return Response.json({
      kgb: rows[0]
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$7,
  PATCH: PATCH$2
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$6(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawai = pegawaiRows[0];
    const today = new Date();
    const threeMonthsLater = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT k.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan
        FROM kgb k JOIN pegawai p ON k.pegawai_id = p.id
        ORDER BY k.tmt_kgb_baru ASC
      `;
    } else {
      rows = await sql`
        SELECT k.*, p.nama_lengkap, p.nip FROM kgb k
        JOIN pegawai p ON k.pegawai_id = p.id
        WHERE k.pegawai_id = ${pegawai.id}
        ORDER BY k.tmt_kgb_baru DESC
      `;
    }

    // Flag yang akan segera KGB dalam 3 bulan
    const enriched = rows.map(k => ({
      ...k,
      is_upcoming: k.tmt_kgb_baru && new Date(k.tmt_kgb_baru) <= threeMonthsLater && new Date(k.tmt_kgb_baru) >= today,
      is_overdue: k.tmt_kgb_baru && new Date(k.tmt_kgb_baru) < today && k.status === 'pending'
    }));
    const upcoming = enriched.filter(k => k.is_upcoming || k.is_overdue);
    return Response.json({
      kgb: enriched,
      upcoming,
      total: enriched.length
    });
  } catch (err) {
    console.error("GET /api/kgb/list error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$6
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$5(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    // Get pegawai profile
    const pegawaiRows = await sql`
      SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;
    if (pegawaiRows.length === 0) {
      return Response.json({
        error: "Profil pegawai belum terhubung"
      }, {
        status: 404
      });
    }
    const pegawaiId = pegawaiRows[0].id;

    // Get URL params for pagination
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    // Get notifikasi
    const notifikasi = await sql`
      SELECT * FROM notifikasi 
      WHERE pegawai_id = ${pegawaiId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count
    const countRows = await sql`
      SELECT COUNT(*) as count FROM notifikasi 
      WHERE pegawai_id = ${pegawaiId}
    `;
    const total = parseInt(countRows[0].count);

    // Get unread count
    const unreadRows = await sql`
      SELECT COUNT(*) as count FROM notifikasi 
      WHERE pegawai_id = ${pegawaiId} AND is_read = false
    `;
    const unread = parseInt(unreadRows[0].count);
    return Response.json({
      notifikasi,
      total,
      unread
    });
  } catch (err) {
    console.error("GET /api/notifikasi/list error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$5
}, Symbol.toStringTag, { value: 'Module' }));

async function PATCH$1(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawaiId = pegawaiRows[0].id;
    const {
      id,
      all
    } = await request.json();
    if (all) {
      await sql`UPDATE notifikasi SET is_read = true WHERE pegawai_id = ${pegawaiId}`;
    } else if (id) {
      await sql`UPDATE notifikasi SET is_read = true WHERE id = ${id} AND pegawai_id = ${pegawaiId}`;
    }
    return Response.json({
      success: true
    });
  } catch (err) {
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PATCH: PATCH$1
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$4(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }
    const {
      id
    } = params;
    const pegawaiRows = await sql`
      SELECT * FROM pegawai WHERE id = ${id} LIMIT 1
    `;
    if (pegawaiRows.length === 0) {
      return Response.json({
        error: "Pegawai tidak ditemukan"
      }, {
        status: 404
      });
    }
    return Response.json({
      pegawai: pegawaiRows[0]
    });
  } catch (err) {
    console.error("GET /api/pegawai/[id] error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function PUT(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }
    const {
      id
    } = params;
    const body = await request.json();

    // Check if pegawai exists
    const existingRows = await sql`
      SELECT * FROM pegawai WHERE id = ${id} LIMIT 1
    `;
    if (existingRows.length === 0) {
      return Response.json({
        error: "Pegawai tidak ditemukan"
      }, {
        status: 404
      });
    }

    // Build update query dynamically
    const setClauses = [];
    const values = [];
    let paramIndex = 1;
    const updatableFields = ["nama_lengkap", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "agama", "status_pernikahan", "alamat", "no_telepon", "email", "foto_url", "status_pegawai", "golongan", "pangkat", "jabatan", "unit_kerja", "pendidikan_terakhir", "jurusan", "nama_institusi", "tahun_lulus", "tmt_cpns", "tmt_pns", "tmt_pangkat_terakhir", "tmt_jabatan", "role", "is_active"];
    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }
    if (setClauses.length === 0) {
      return Response.json({
        error: "Tidak ada data untuk diupdate"
      }, {
        status: 400
      });
    }

    // Add updated_at
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    // Build and execute query
    const updateQuery = `
      UPDATE pegawai 
      SET ${setClauses.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    values.push(id);
    const result = await sql(updateQuery, values);
    return Response.json({
      success: true,
      pegawai: result[0]
    });
  } catch (err) {
    console.error("PUT /api/pegawai/[id] error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function DELETE$1(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }
    const {
      id
    } = params;

    // Check role - only admin can delete
    const userPegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;
    if (userPegawaiRows.length === 0 || userPegawaiRows[0].role !== "admin") {
      return Response.json({
        error: "Forbidden: Hanya admin yang dapat menghapus pegawai"
      }, {
        status: 403
      });
    }

    // Soft delete (set is_active to false)
    const result = await sql`
      UPDATE pegawai 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      return Response.json({
        error: "Pegawai tidak ditemukan"
      }, {
        status: 404
      });
    }
    return Response.json({
      success: true,
      message: "Pegawai berhasil dinonaktifkan"
    });
  } catch (err) {
    console.error("DELETE /api/pegawai/[id] error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE: DELETE$1,
  GET: GET$4,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

async function POST$2(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    // Check role - only admin can create
    const userPegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;
    if (userPegawaiRows.length === 0 || userPegawaiRows[0].role !== "admin") {
      return Response.json({
        error: "Forbidden: Hanya admin yang dapat menambah pegawai"
      }, {
        status: 403
      });
    }
    const body = await request.json();
    const {
      nip,
      nama_lengkap
    } = body;

    // Validate required fields
    if (!nip || !nama_lengkap) {
      return Response.json({
        error: "NIP dan Nama Lengkap wajib diisi"
      }, {
        status: 400
      });
    }
    if (nip.length !== 18) {
      return Response.json({
        error: "NIP harus 18 digit"
      }, {
        status: 400
      });
    }

    // Check if NIP already exists
    const existingRows = await sql`
      SELECT id FROM pegawai WHERE nip = ${nip} LIMIT 1
    `;
    if (existingRows.length > 0) {
      return Response.json({
        error: "NIP sudah terdaftar"
      }, {
        status: 409
      });
    }

    // Prepare insert data
    const insertData = {
      nip,
      nama_lengkap,
      tempat_lahir: body.tempat_lahir || null,
      tanggal_lahir: body.tanggal_lahir || null,
      jenis_kelamin: body.jenis_kelamin || null,
      agama: body.agama || null,
      status_pernikahan: body.status_pernikahan || null,
      alamat: body.alamat || null,
      no_telepon: body.no_telepon || null,
      email: body.email || null,
      foto_url: body.foto_url || null,
      status_pegawai: body.status_pegawai || "PNS",
      golongan: body.golongan || null,
      pangkat: body.pangkat || null,
      jabatan: body.jabatan || null,
      unit_kerja: body.unit_kerja || null,
      pendidikan_terakhir: body.pendidikan_terakhir || null,
      jurusan: body.jurusan || null,
      nama_institusi: body.nama_institusi || null,
      tahun_lulus: body.tahun_lulus || null,
      tmt_cpns: body.tmt_cpns || null,
      tmt_pns: body.tmt_pns || null,
      tmt_pangkat_terakhir: body.tmt_pangkat_terakhir || null,
      tmt_jabatan: body.tmt_jabatan || null,
      role: body.role || "pegawai",
      is_active: body.is_active !== undefined ? body.is_active : true
    };

    // Insert pegawai
    const result = await sql`
      INSERT INTO pegawai (
        nip, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
        agama, status_pernikahan, alamat, no_telepon, email, foto_url,
        status_pegawai, golongan, pangkat, jabatan, unit_kerja,
        pendidikan_terakhir, jurusan, nama_institusi, tahun_lulus,
        tmt_cpns, tmt_pns, tmt_pangkat_terakhir, tmt_jabatan,
        role, is_active
      ) VALUES (
        ${insertData.nip}, ${insertData.nama_lengkap}, ${insertData.tempat_lahir}, 
        ${insertData.tanggal_lahir}, ${insertData.jenis_kelamin}, ${insertData.agama}, 
        ${insertData.status_pernikahan}, ${insertData.alamat}, ${insertData.no_telepon}, 
        ${insertData.email}, ${insertData.foto_url}, ${insertData.status_pegawai}, 
        ${insertData.golongan}, ${insertData.pangkat}, ${insertData.jabatan}, 
        ${insertData.unit_kerja}, ${insertData.pendidikan_terakhir}, ${insertData.jurusan}, 
        ${insertData.nama_institusi}, ${insertData.tahun_lulus}, ${insertData.tmt_cpns}, 
        ${insertData.tmt_pns}, ${insertData.tmt_pangkat_terakhir}, ${insertData.tmt_jabatan},
        ${insertData.role}, ${insertData.is_active}
      )
      RETURNING *
    `;

    // Create initial saldo cuti for current year
    const currentYear = new Date().getFullYear();
    await sql`
      INSERT INTO saldo_cuti (pegawai_id, tahun, jatah_cuti, cuti_terpakai, sisa_cuti)
      VALUES (${result[0].id}, ${currentYear}, 12, 0, 12)
    `;
    return Response.json({
      success: true,
      pegawai: result[0],
      message: "Pegawai berhasil ditambahkan"
    });
  } catch (err) {
    console.error("POST /api/pegawai/create error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST: POST$2
}, Symbol.toStringTag, { value: 'Module' }));

async function POST$1(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }
    const body = await request.json();
    const {
      nip
    } = body;
    if (!nip || nip.length !== 18) {
      return Response.json({
        error: "NIP harus terdiri dari 18 digit"
      }, {
        status: 400
      });
    }
    const userId = session.user.id;

    // Check if pegawai exists with this NIP
    const pegawaiRows = await sql`
      SELECT * FROM pegawai WHERE nip = ${nip} LIMIT 1
    `;
    if (pegawaiRows.length === 0) {
      return Response.json({
        error: "NIP tidak ditemukan dalam database"
      }, {
        status: 404
      });
    }
    const pegawai = pegawaiRows[0];

    // Check if this NIP is already linked to another account
    if (pegawai.user_id && pegawai.user_id !== userId) {
      return Response.json({
        error: "NIP sudah terhubung dengan akun lain"
      }, {
        status: 409
      });
    }

    // Link the user_id to pegawai
    await sql`
      UPDATE pegawai 
      SET user_id = ${userId}, updated_at = CURRENT_TIMESTAMP
      WHERE nip = ${nip}
    `;

    // Also update the email if it's different
    if (session.user.email && pegawai.email !== session.user.email) {
      await sql`
        UPDATE pegawai 
        SET email = ${session.user.email}
        WHERE nip = ${nip}
      `;
    }
    return Response.json({
      success: true,
      message: "Akun berhasil dihubungkan",
      pegawai: {
        nip: pegawai.nip,
        nama_lengkap: pegawai.nama_lengkap,
        role: pegawai.role
      }
    });
  } catch (err) {
    console.error("POST /api/pegawai/link-account error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST: POST$1
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$3(request) {
  try {
    const session = await auth(request);
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    // Get pegawai profile to check role
    const pegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;
    if (pegawaiRows.length === 0) {
      return Response.json({
        error: "Profil pegawai belum terhubung"
      }, {
        status: 404
      });
    }
    const role = pegawaiRows[0].role;

    // Get URL params
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const unitKerja = url.searchParams.get("unit_kerja") || "";
    const limit = parseInt(url.searchParams.get("limit")) || 50;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    // Build query
    let queryParts = ["SELECT * FROM pegawai WHERE 1=1"];
    let countQueryParts = ["SELECT COUNT(*) as count FROM pegawai WHERE 1=1"];
    const values = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      const searchPattern = `%${search}%`;
      queryParts.push(`AND (LOWER(nama_lengkap) LIKE LOWER($${paramIndex}) OR nip LIKE $${paramIndex})`);
      countQueryParts.push(`AND (LOWER(nama_lengkap) LIKE LOWER($${paramIndex}) OR nip LIKE $${paramIndex})`);
      values.push(searchPattern);
      paramIndex++;
    }

    // Status filter
    if (status) {
      queryParts.push(`AND status_pegawai = $${paramIndex}`);
      countQueryParts.push(`AND status_pegawai = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    // Unit kerja filter
    if (unitKerja) {
      queryParts.push(`AND LOWER(unit_kerja) LIKE LOWER($${paramIndex})`);
      countQueryParts.push(`AND LOWER(unit_kerja) LIKE LOWER($${paramIndex})`);
      values.push(`%${unitKerja}%`);
      paramIndex++;
    }

    // Add ordering and pagination
    queryParts.push(`ORDER BY nama_lengkap ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`);
    values.push(limit, offset);

    // Execute queries
    const finalQuery = queryParts.join(" ");
    const finalCountQuery = countQueryParts.join(" ");
    const pegawaiList = await sql(finalQuery, values.slice(0, -2));
    const countResult = await sql(finalCountQuery, values.slice(0, -2));
    const total = parseInt(countResult[0].count);
    return Response.json({
      pegawai: pegawaiList,
      total,
      limit,
      offset
    });
  } catch (err) {
    console.error("GET /api/pegawai/list error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_21 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$3
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$2() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }
    const userId = session.user.id;

    // Get pegawai data linked to this user
    const rows = await sql`
      SELECT * FROM pegawai WHERE user_id = ${userId} LIMIT 1
    `;
    if (rows.length === 0) {
      return Response.json({
        error: "Profil pegawai belum terhubung"
      }, {
        status: 404
      });
    }
    const pegawai = rows[0];
    return Response.json({
      pegawai: {
        id: pegawai.id,
        nip: pegawai.nip,
        nama_lengkap: pegawai.nama_lengkap,
        email: pegawai.email,
        foto_url: pegawai.foto_url,
        golongan: pegawai.golongan,
        pangkat: pegawai.pangkat,
        jabatan: pegawai.jabatan,
        unit_kerja: pegawai.unit_kerja,
        role: pegawai.role,
        status_pegawai: pegawai.status_pegawai
      }
    });
  } catch (err) {
    console.error("GET /api/pegawai/profile error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_22 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET: GET$2
}, Symbol.toStringTag, { value: 'Module' }));

async function GET$1(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const rows = await sql`
      SELECT s.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan
      FROM skp s JOIN pegawai p ON s.pegawai_id = p.id
      WHERE s.id = ${id} LIMIT 1
    `;
    if (!rows.length) return Response.json({
      error: "SKP tidak ditemukan"
    }, {
      status: 404
    });
    return Response.json({
      skp: rows[0]
    });
  } catch (err) {
    console.error("GET /api/skp/[id] error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function PATCH(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    const body = await request.json();
    const {
      status,
      nilai_akhir,
      catatan_penilai,
      dokumen_url
    } = body;
    const rows = await sql`
      UPDATE skp SET
        status = COALESCE(${status}, status),
        nilai_akhir = COALESCE(${nilai_akhir}, nilai_akhir),
        catatan_penilai = COALESCE(${catatan_penilai}, catatan_penilai),
        dokumen_url = COALESCE(${dokumen_url}, dokumen_url),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows.length) return Response.json({
      error: "SKP tidak ditemukan"
    }, {
      status: 404
    });
    return Response.json({
      skp: rows[0]
    });
  } catch (err) {
    console.error("PATCH /api/skp/[id] error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}
async function DELETE(request, {
  params
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      id
    } = params;
    await sql`DELETE FROM skp WHERE id = ${id}`;
    return Response.json({
      success: true
    });
  } catch (err) {
    console.error("DELETE /api/skp/[id] error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_23 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET: GET$1,
  PATCH
}, Symbol.toStringTag, { value: 'Module' }));

async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawaiId = pegawaiRows[0].id;
    const body = await request.json();
    const {
      tahun,
      periode,
      dokumen_url,
      catatan,
      target_nilai
    } = body;
    if (!tahun || !periode) {
      return Response.json({
        error: "Tahun dan periode wajib diisi"
      }, {
        status: 400
      });
    }

    // Check if SKP for this period already exists
    const existing = await sql`
      SELECT id FROM skp WHERE pegawai_id = ${pegawaiId} AND tahun = ${tahun} AND periode = ${periode} LIMIT 1
    `;
    if (existing.length > 0) {
      return Response.json({
        error: `SKP ${periode} ${tahun} sudah ada`
      }, {
        status: 409
      });
    }
    const rows = await sql`
      INSERT INTO skp (pegawai_id, tahun, periode, dokumen_url, catatan, target_nilai, status, created_at, updated_at)
      VALUES (${pegawaiId}, ${tahun}, ${periode}, ${dokumen_url || null}, ${catatan || null}, ${target_nilai || null}, 'draft', NOW(), NOW())
      RETURNING *
    `;
    return Response.json({
      skp: rows[0]
    }, {
      status: 201
    });
  } catch (err) {
    console.error("POST /api/skp/create error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_24 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
    const {
      searchParams
    } = new URL(request.url);
    const tahun = searchParams.get("tahun") || new Date().getFullYear();
    const status = searchParams.get("status");
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({
      error: "Profil tidak ditemukan"
    }, {
      status: 404
    });
    const pegawai = pegawaiRows[0];
    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT s.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja 
        FROM skp s 
        JOIN pegawai p ON s.pegawai_id = p.id
        WHERE s.tahun = ${tahun}
        ${status ? sql`AND s.status = ${status}` : sql``}
        ORDER BY s.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT s.*, p.nama_lengkap, p.nip FROM skp s
        JOIN pegawai p ON s.pegawai_id = p.id
        WHERE s.pegawai_id = ${pegawai.id} AND s.tahun = ${tahun}
        ${status ? sql`AND s.status = ${status}` : sql``}
        ORDER BY s.created_at DESC
      `;
    }
    return Response.json({
      skp: rows,
      total: rows.length
    });
  } catch (err) {
    console.error("GET /api/skp/list error", err);
    return Response.json({
      error: "Internal Server Error"
    }, {
      status: 500
    });
  }
}

const __vite_glob_0_25 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const originalFetch = fetch;
const isBackend = () => typeof window === "undefined";
const safeStringify = (value) => JSON.stringify(value, (_k, v) => {
  if (v instanceof Date) return { __t: "Date", v: v.toISOString() };
  if (v instanceof Error)
    return { __t: "Error", v: { name: v.name, message: v.message, stack: v.stack } };
  return v;
});
const postToParent = (level, text, extra) => {
  try {
    if (isBackend() || !window.parent || window.parent === window) {
      ("level" in console ? console[level] : console.log)(text, extra);
      return;
    }
    window.parent.postMessage(
      {
        type: "sandbox:web:console-write",
        __viteConsole: true,
        level,
        text,
        args: [safeStringify(extra)]
      },
      "*"
    );
  } catch {
  }
};
const getUrlFromArgs = (...args) => {
  const [input] = args;
  if (typeof input === "string") return input;
  if (input instanceof Request) return input.url;
  return `${input.protocol}//${input.host}${input.pathname}`;
};
const isFirstPartyURL = (url) => {
  return url.startsWith("/integrations") || url.startsWith("/_create");
};
const isSecondPartyUrl = (url) => {
  return process.env.NEXT_PUBLIC_CREATE_API_BASE_URL && url.startsWith(process.env.NEXT_PUBLIC_CREATE_API_BASE_URL) || process.env.NEXT_PUBLIC_CREATE_BASE_URL && url.startsWith(process.env.NEXT_PUBLIC_CREATE_BASE_URL) || url.startsWith("https://www.create.xyz") || url.startsWith("https://api.create.xyz/") || url.startsWith("https://www.createanything.com") || url.startsWith("https://api.createanything.com");
};
const fetchWithHeaders = async (input, init) => {
  const url = getUrlFromArgs(input, init);
  const additionalHeaders = {
    "x-createxyz-project-group-id": process.env.NEXT_PUBLIC_PROJECT_GROUP_ID
  };
  const isExternalFetch = !isFirstPartyURL(url) && !isSecondPartyUrl(url);
  if (isExternalFetch || url.startsWith("/api")) {
    return originalFetch(input, init);
  }
  let finalInit;
  if (input instanceof Request) {
    const hasBody = !!input.body;
    finalInit = {
      method: input.method,
      headers: new Headers(input.headers),
      body: input.body,
      mode: input.mode,
      credentials: input.credentials,
      cache: input.cache,
      redirect: input.redirect,
      referrer: input.referrer,
      referrerPolicy: input.referrerPolicy,
      integrity: input.integrity,
      keepalive: input.keepalive,
      signal: input.signal,
      ...hasBody ? { duplex: "half" } : {},
      ...init
    };
  } else {
    finalInit = { ...init, headers: new Headers(init?.headers ?? {}) };
  }
  const finalHeaders = new Headers(finalInit.headers);
  for (const [key, value] of Object.entries(additionalHeaders)) {
    if (value) finalHeaders.set(key, value);
  }
  finalInit.headers = finalHeaders;
  const prefix = !isSecondPartyUrl(url) ? isBackend() ? process.env.NEXT_PUBLIC_CREATE_BASE_URL ?? "https://www.create.xyz" : "" : "";
  try {
    const result = await originalFetch(`${prefix}${url}`, finalInit);
    if (!result.ok) {
      postToParent(
        "error",
        `Failed to load resource: the server responded with a status of ${result.status} (${result.statusText ?? ""})`,
        {
          url,
          status: result.status,
          statusText: result.statusText
        }
      );
    }
    return result;
  } catch (error) {
    postToParent("error", "Fetch error", {
      url,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error
    });
    throw error;
  }
};

const API_BASENAME = "/api";
const api = new Hono();
if (globalThis.fetch) {
  globalThis.fetch = fetchWithHeaders;
}
function getHonoPath(relativePath) {
  const parts = relativePath.split("/").filter(Boolean);
  const apiIndex = parts.indexOf("api");
  if (apiIndex === -1) return "/";
  const routeParts = parts.slice(apiIndex + 1, -1);
  if (routeParts.length === 0) {
    return "/";
  }
  const transformedPath = routeParts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === "..." ? `:${param}{.+}` : `:${param}`;
    }
    return segment;
  }).join("/");
  return `/${transformedPath}`;
}
const routeModules = /* #__PURE__ */ Object.assign({"../src/app/api/__create/check-social-secrets/route.js": __vite_glob_0_0,"../src/app/api/__create/ssr-test/route.js": __vite_glob_0_1,"../src/app/api/auth/expo-web-success/route.js": __vite_glob_0_2,"../src/app/api/auth/token/route.js": __vite_glob_0_3,"../src/app/api/cuti/[id]/route.js": __vite_glob_0_4,"../src/app/api/cuti/create/route.js": __vite_glob_0_5,"../src/app/api/cuti/list/route.js": __vite_glob_0_6,"../src/app/api/dashboard/stats/route.js": __vite_glob_0_7,"../src/app/api/dossier/[id]/route.js": __vite_glob_0_8,"../src/app/api/dossier/create/route.js": __vite_glob_0_9,"../src/app/api/dossier/list/route.js": __vite_glob_0_10,"../src/app/api/kenaikan-pangkat/[id]/route.js": __vite_glob_0_11,"../src/app/api/kenaikan-pangkat/create/route.js": __vite_glob_0_12,"../src/app/api/kenaikan-pangkat/list/route.js": __vite_glob_0_13,"../src/app/api/kgb/[id]/route.js": __vite_glob_0_14,"../src/app/api/kgb/list/route.js": __vite_glob_0_15,"../src/app/api/notifikasi/list/route.js": __vite_glob_0_16,"../src/app/api/notifikasi/read/route.js": __vite_glob_0_17,"../src/app/api/pegawai/[id]/route.js": __vite_glob_0_18,"../src/app/api/pegawai/create/route.js": __vite_glob_0_19,"../src/app/api/pegawai/link-account/route.js": __vite_glob_0_20,"../src/app/api/pegawai/list/route.js": __vite_glob_0_21,"../src/app/api/pegawai/profile/route.js": __vite_glob_0_22,"../src/app/api/skp/[id]/route.js": __vite_glob_0_23,"../src/app/api/skp/create/route.js": __vite_glob_0_24,"../src/app/api/skp/list/route.js": __vite_glob_0_25

});
function registerRoutes() {
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const sortedEntries = Object.entries(routeModules).sort(([pathA], [pathB]) => {
    const isParamA = pathA.includes("[");
    const isParamB = pathB.includes("[");
    if (isParamA && !isParamB) return 1;
    if (!isParamA && isParamB) return -1;
    return pathA.localeCompare(pathB);
  });
  for (const [path, module] of sortedEntries) {
    const route = module;
    const honoPath = getHonoPath(path);
    for (const method of methods) {
      if (route[method]) {
        const handler = async (c) => {
          const params = c.req.param();
          return await route[method](c.req.raw, { params });
        };
        const methodLowercase = method.toLowerCase();
        if (typeof api[methodLowercase] === "function") {
          api[methodLowercase](honoPath, handler);
        }
      }
    }
  }
}
registerRoutes();

neonConfig.poolQueryViaFetch = true;
const als = new AsyncLocalStorage();
for (const method of ["log", "info", "warn", "error", "debug"]) {
  const original = nodeConsole[method].bind(console);
  console[method] = (...args) => {
    const id = als.getStore()?.requestId;
    if (id) {
      original(`[traceId:${id}]`, ...args);
    } else {
      original(...args);
    }
  };
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = NeonAdapter(pool);
const app = new Hono();
app.use("*", requestId());
app.use("*", (c, next) => {
  const id = c.get("requestId");
  return als.run({ requestId: id }, () => next());
});
app.use(contextStorage());
app.onError((err, c) => {
  if (c.req.method !== "GET") {
    return c.json(
      {
        error: "An error occurred in your app",
        details: serializeError(err)
      },
      500
    );
  }
  return c.html(getHTMLForErrorPage(err), 200);
});
if (process.env.CORS_ORIGINS) {
  app.use(
    "/*",
    cors({
      origin: process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    })
  );
}
for (const method of ["post", "put", "patch"]) {
  app[method](
    "*",
    bodyLimit({
      maxSize: 4.5 * 1024 * 1024,
      onError: (c) => {
        return c.json({ error: "Body size limit exceeded" }, 413);
      }
    })
  );
}
console.log("AUTH_SECRET is:", process.env.AUTH_SECRET ? "defined" : "undefined");
if (process.env.AUTH_SECRET) {
  app.use(
    "*",
    initAuthConfig((c) => ({
      secret: process.env.AUTH_SECRET,
      trustHost: true,
      basePath: "/api/auth",
      pages: {
        signIn: "/account/signin",
        signOut: "/account/logout"
      },
      skipCSRFCheck,
      session: {
        strategy: "jwt"
      },
      callbacks: {
        session({ session, token }) {
          if (token.sub) {
            session.user.id = token.sub;
          }
          return session;
        }
      },
      cookies: {
        csrfToken: { options: { secure: true, sameSite: "none" } },
        sessionToken: { options: { secure: true, sameSite: "none" } },
        callbackUrl: { options: { secure: true, sameSite: "none" } }
      },
      providers: [
        ...process.env.NEXT_PUBLIC_CREATE_ENV === "DEVELOPMENT" ? [
          Credentials({
            id: "dev-social",
            name: "Development Social Sign-in",
            credentials: {
              email: { label: "Email", type: "email" },
              name: { label: "Name", type: "text" },
              provider: { label: "Provider", type: "text" }
            },
            authorize: async (credentials) => {
              const { email, name, provider } = credentials;
              if (!email || typeof email !== "string") return null;
              const existing = await adapter.getUserByEmail(email);
              if (existing) return existing;
              const allowedProviders = /* @__PURE__ */ new Set(["google", "facebook", "twitter", "apple"]);
              const providerName = typeof provider === "string" && allowedProviders.has(provider.toLowerCase()) ? provider.toLowerCase() : "google";
              const newUser = await adapter.createUser({
                emailVerified: null,
                email,
                name: typeof name === "string" && name.length > 0 ? name : void 0
              });
              await adapter.linkAccount({
                type: "oauth",
                userId: newUser.id,
                provider: providerName,
                providerAccountId: `dev-${newUser.id}`
              });
              return newUser;
            }
          })
        ] : [],
        Credentials({
          id: "credentials-signin",
          name: "Credentials Sign in",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
          },
          authorize: async (credentials) => {
            const { email, password } = credentials;
            if (!email || !password) return null;
            if (typeof email !== "string" || typeof password !== "string") return null;
            const user = await adapter.getUserByEmail(email);
            if (!user) return null;
            const matchingAccount = user.accounts.find(
              (account) => account.provider === "credentials"
            );
            const accountPassword = matchingAccount?.password;
            if (!accountPassword) return null;
            const { compare: verify } = await import('bcryptjs');
            const isValid = await verify(password, accountPassword);
            if (!isValid) return null;
            return user;
          }
        }),
        Credentials({
          id: "credentials-signup",
          name: "Credentials Sign up",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
            name: { label: "Name", type: "text" },
            image: { label: "Image", type: "text", required: false }
          },
          authorize: async (credentials) => {
            console.log("Credentials signup authorize called:", credentials);
            const { email, password, name, image } = credentials;
            if (!email || !password) {
              console.log("Missing email or password");
              return null;
            }
            if (typeof email !== "string" || typeof password !== "string") {
              console.log("Invalid email or password type");
              return null;
            }
            const user = await adapter.getUserByEmail(email);
            if (!user) {
              const newUser = await adapter.createUser({
                emailVerified: null,
                email,
                name: typeof name === "string" && name.length > 0 ? name : void 0,
                image: typeof image === "string" && image.length > 0 ? image : void 0
              });
              const { hash } = await import('bcryptjs');
              await adapter.linkAccount({
                extraData: { password: await hash(password, 10) },
                type: "credentials",
                userId: newUser.id,
                providerAccountId: newUser.id,
                provider: "credentials"
              });
              return newUser;
            }
            return null;
          }
        })
      ]
    }))
  );
}
app.all("/integrations/:path{.+}", async (c) => {
  const queryParams = c.req.query();
  const url = `${process.env.NEXT_PUBLIC_CREATE_BASE_URL ?? "https://www.create.xyz"}/integrations/${c.req.param("path")}${Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : ""}`;
  return proxy(url, {
    method: c.req.method,
    body: c.req.raw.body ?? null,
    // @ts-expect-error -- duplex is accepted by the runtime
    duplex: "half",
    redirect: "manual",
    headers: {
      ...c.req.header(),
      "X-Forwarded-For": process.env.NEXT_PUBLIC_CREATE_HOST,
      "x-createxyz-host": process.env.NEXT_PUBLIC_CREATE_HOST,
      Host: process.env.NEXT_PUBLIC_CREATE_HOST,
      "x-createxyz-project-group-id": process.env.NEXT_PUBLIC_PROJECT_GROUP_ID
    }
  });
});
app.use("/api/auth/*", authHandler());
app.route(API_BASENAME, api);

const server = await createHonoServer({
  app,
  defaultLogger: false
});

export { fetchWithHeaders as f, server as s };
