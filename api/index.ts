import { handle } from 'hono/vercel';
import { app } from '../__create/app';

if (process.env.NODE_ENV === 'production') {
  let requestHandlerPromise;

  app.all('*', async (c) => {
    try {
      if (!requestHandlerPromise) {
        requestHandlerPromise = (async () => {
          const reactRouter = await import('react-router');
          const build = await import('../build/server/index.js');
          return reactRouter.createRequestHandler(build, 'production');
        })();
      }
      const requestHandler = await requestHandlerPromise;
      return await requestHandler(c.req.raw);
    } catch (e) {
      console.error('React Router handler error:', e);
      return c.html(`
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #ef4444;">SSR Error</h1>
          <p>${e.message}</p>
          <pre>${e.stack}</pre>
        </div>
      `, 500);
    }
  });
}

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);

