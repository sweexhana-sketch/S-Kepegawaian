import { handle } from 'hono/vercel';
import { app } from '../__create/app';

// In production, we need to manually attach the React Router request handler
// because we bypass createHonoServer() (which calls serve() and hangs Vercel).
if (process.env.NODE_ENV === 'production') {
  try {
    const { createRequestHandler } = require('react-router');
    const build = require('../build/server/index.js');
    const requestHandler = createRequestHandler(build, 'production');
    
    // Catch-all route for React Router
    app.all('*', async (c) => {
      // Create a web Request from the Hono Context
      return requestHandler(c.req.raw);
    });
  } catch (e) {
    console.error('Failed to load React Router build:', e);
  }
}

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);

