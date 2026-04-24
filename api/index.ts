import { handle } from 'hono/vercel';
import { app } from '../__create/app';

// Lazy-load the React Router request handler (SSR)
let _handler: ((req: Request) => Promise<Response>) | null = null;

async function getRequestHandler() {
  if (!_handler) {
    const [{ createRequestHandler }, build] = await Promise.all([
      import('react-router'),
      import('../build/server/index.js'),
    ]);
    _handler = createRequestHandler(build, 'production');
  }
  return _handler;
}

// Catch-all: serve everything through React Router SSR
app.all('*', async (c) => {
  // Skip internal API routes — they are already mounted on `app` via route-builder
  const path = new URL(c.req.url).pathname;
  if (path.startsWith('/api/')) {
    // Let the existing Hono routes on `app` handle it
    return c.notFound();
  }

  try {
    const handler = await getRequestHandler();
    return await handler(c.req.raw);
  } catch (err: any) {
    console.error('[SSR Error]', err);
    return c.html(
      `<html><body style="font-family:sans-serif;padding:40px">
        <h2 style="color:#dc2626">Server Rendering Error</h2>
        <p><strong>${err?.message}</strong></p>
        <pre style="background:#f1f5f9;padding:16px;border-radius:8px;overflow:auto">${err?.stack}</pre>
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
