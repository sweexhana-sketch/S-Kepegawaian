import { Hono } from 'hono';
import { handle } from 'hono/vercel';
// Import your app logic from the create folder
import { api, API_BASENAME } from '../__create/route-builder';

const app = new Hono();

// Re-use your API routes
app.route(API_BASENAME, api);

// Fallback for React Router pages (if needed)
// On Vercel, static pages in build/client will be served first.
// If not found, it hits this function.

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
