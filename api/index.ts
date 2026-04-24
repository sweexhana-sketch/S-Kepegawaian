/**
 * api/index.ts - Vercel Serverless Function Entry
 *
 * Uses a STATIC import for the React Router SSR build so that
 * Vercel's static file tracer (@vercel/nft) can automatically detect
 * and bundle ALL dependencies (including @hono/node-server).
 *
 * Dynamic imports break Vercel's file tracer, causing ERR_MODULE_NOT_FOUND.
 */
import { handle } from 'hono/vercel';
import { createRequestHandler } from 'react-router';

// STATIC import — Vercel can trace all transitive dependencies from here
// This is intentional: dynamic import() breaks @vercel/nft static analysis
import * as build from '../build/server/index.js';

import { app } from '../__create/app';

// Create the React Router SSR request handler once at module level
const reactRouterHandler = createRequestHandler(build, 'production');

// Mount React Router SSR as catch-all for non-API routes
app.all('*', async (c) => {
  const pathname = new URL(c.req.url).pathname;

  // API routes are already handled by the mounted routes on `app`
  if (pathname.startsWith('/api/')) {
    return c.notFound();
  }

  try {
    return await reactRouterHandler(c.req.raw);
  } catch (err: any) {
    console.error('[SSR Error]', err?.message, err?.stack);
    return c.html(
      `<html><body style="font-family:sans-serif;padding:40px;max-width:800px;margin:auto">
        <h2 style="color:#dc2626">SSR Error — ${err?.message}</h2>
        <pre style="background:#f1f5f9;padding:16px;border-radius:8px;overflow:auto;font-size:13px">${err?.stack}</pre>
        <hr/><p style="color:#64748b">Check Vercel logs for more details.</p>
       </body></html>`,
      500,
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
