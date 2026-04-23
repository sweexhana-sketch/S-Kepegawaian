import { handle } from 'hono/vercel';
import { app } from '../__create/app';

// Export the Hono app as Vercel serverless handlers.
// Importing from __create/app.ts (NOT __create/index.ts) avoids
// calling createHonoServer() which calls serve() and hangs Vercel.
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
