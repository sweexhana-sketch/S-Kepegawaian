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

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We will use dynamic import so if it fails, we can catch it and print diagnostics
let reactRouterHandler: any = null;

async function getRequestHandler() {
  if (!reactRouterHandler) {
    try {
      // Try to import from the _ssr directory we copied post-build
      const buildPath = resolve(__dirname, '_ssr/index.js');
      const build = await import(buildPath);
      reactRouterHandler = createRequestHandler(build, 'production');
    } catch (err) {
      throw err;
    }
  }
  return reactRouterHandler;
}

import { app } from '../__create/app';

// Mount React Router SSR as catch-all for non-API routes
app.all('*', async (c) => {
  const pathname = new URL(c.req.url).pathname;

  // API routes are already handled by the mounted routes on `app`
  if (pathname.startsWith('/api/')) {
    return c.notFound();
  }

  try {
    const handler = await getRequestHandler();
    return await handler(c.req.raw);
  } catch (err: any) {
    console.error('[SSR Error]', err?.message, err?.stack);

    // Diagnostics: Read the filesystem
    let dirContents = '';
    try {
      const apiDir = readdirSync(__dirname).join('\n');
      const ssrDir = existsSync(resolve(__dirname, '_ssr')) 
        ? readdirSync(resolve(__dirname, '_ssr')).join('\n') 
        : 'DOES NOT EXIST';
      const rootDir = readdirSync(resolve(__dirname, '..')).join('\n');
      
      dirContents = `
        <h3>__dirname (${__dirname})</h3><pre>${apiDir}</pre>
        <h3>__dirname/_ssr</h3><pre>${ssrDir}</pre>
        <h3>__dirname/..</h3><pre>${rootDir}</pre>
      `;
    } catch (e: any) {
      dirContents = `<p>Failed to read dirs: ${e.message}</p>`;
    }

    return c.html(
      `<html><body style="font-family:sans-serif;padding:40px;max-width:800px;margin:auto">
        <h2 style="color:#dc2626">SSR Error — ${err?.message}</h2>
        <pre style="background:#f1f5f9;padding:16px;border-radius:8px;overflow:auto;font-size:13px">${err?.stack}</pre>
        <hr/>
        <h2>Vercel Filesystem Diagnostics</h2>
        ${dirContents}
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
