// server/index.ts
import { Hono as Hono3 } from "hono";
import { getRequestListener } from "@hono/node-server";
import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

// __create/app.ts
import { AsyncLocalStorage } from "node:async_hooks";
import nodeConsole from "node:console";
import { skipCSRFCheck } from "@auth/core";
import Credentials from "@auth/core/providers/credentials";
import { authHandler, initAuthConfig } from "@hono/auth-js";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { Hono as Hono2 } from "hono";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { proxy } from "hono/proxy";
import { bodyLimit } from "hono/body-limit";
import { requestId } from "hono/request-id";
import { serializeError as serializeError2 } from "serialize-error";

// __create/adapter.ts
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

// __create/get-html-for-error-page.ts
import { serializeError } from "serialize-error";
var getHTMLForErrorPage = (err) => {
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
    </script>
  </head>
  <body></body>
</html>
    `;
};

// __create/route-builder.ts
import { Hono } from "hono";

// src/__create/fetch.ts
var originalFetch = fetch;
var isBackend = () => typeof window === "undefined";
var safeStringify = (value) => JSON.stringify(value, (_k, v) => {
  if (v instanceof Date) return { __t: "Date", v: v.toISOString() };
  if (v instanceof Error)
    return { __t: "Error", v: { name: v.name, message: v.message, stack: v.stack } };
  return v;
});
var postToParent = (level, text, extra) => {
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
var getUrlFromArgs = (...args) => {
  const [input] = args;
  if (typeof input === "string") return input;
  if (input instanceof Request) return input.url;
  return `${input.protocol}//${input.host}${input.pathname}`;
};
var isFirstPartyURL = (url) => {
  return url.startsWith("/integrations") || url.startsWith("/_create");
};
var isSecondPartyUrl = (url) => {
  return process.env.NEXT_PUBLIC_CREATE_API_BASE_URL && url.startsWith(process.env.NEXT_PUBLIC_CREATE_API_BASE_URL) || process.env.NEXT_PUBLIC_CREATE_BASE_URL && url.startsWith(process.env.NEXT_PUBLIC_CREATE_BASE_URL) || url.startsWith("https://www.create.xyz") || url.startsWith("https://api.create.xyz/") || url.startsWith("https://www.createanything.com") || url.startsWith("https://api.createanything.com");
};
var fetchWithHeaders = async (input, init) => {
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
var fetch_default = fetchWithHeaders;

// __create/route-builder.ts
var API_BASENAME = "/api";
var api = new Hono();
if (globalThis.fetch) {
  globalThis.fetch = fetch_default;
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
var routeModules = import.meta.glob("../src/app/api/**/route.{js,ts}", {
  eager: true
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

// __create/app.ts
neonConfig.poolQueryViaFetch = true;
var als = new AsyncLocalStorage();
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
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var adapter = NeonAdapter(pool);
var app = new Hono2();
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
        details: serializeError2(err)
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
            const { compare: verify } = await import("bcryptjs");
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
              const { hash } = await import("bcryptjs");
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

// server/index.ts
var app2 = new Hono3();
app2.route("/", app);
var reactRouterHandler = createRequestHandler(build, "production");
app2.all("*", async (c) => {
  const url = new URL(c.req.url);
  const pathname = url.pathname;
  console.log(`[SSR ENTRY] Handling: ${c.req.method} ${pathname}`);
  if (pathname.startsWith("/api/")) {
    return c.notFound();
  }
  console.log(`[SSR ENTRY] Invoking React Router for ${pathname}...`);
  const startTime = Date.now();
  try {
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("SSR Timeout (15s reached)")), 15e3)
    );
    const result = await Promise.race([
      reactRouterHandler(c.req.raw),
      timeoutPromise
    ]);
    console.log(`[SSR ENTRY] Finished in ${Date.now() - startTime}ms`);
    return result;
  } catch (err) {
    console.error(`[SSR ENTRY ERROR]:`, err?.message);
    return c.html(
      `<html><body style="font-family:sans-serif;padding:40px;max-width:800px;margin:auto">
        <h2 style="color:#dc2626">SSR Execution Error \u2014 ${err?.message}</h2>
        <pre style="background:#f1f5f9;padding:16px;border-radius:8px;overflow:auto;font-size:13px">${err?.stack}</pre>
       </body></html>`,
      500
    );
  }
});
console.log("Server initialization complete. DATABASE_URL is", process.env.DATABASE_URL ? "PRESENT" : "MISSING");
var index_default = getRequestListener(app2.fetch);
export {
  index_default as default
};
