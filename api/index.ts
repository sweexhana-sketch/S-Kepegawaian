import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { api, API_BASENAME } from '../__create/route-builder';

const app = new Hono();

// 1. Handle API Routes
// Initialize the API routes
await registerRoutes(app);

// Handle everything else as a potential frontend route
// In a serverless environment, we want Hono to handle the routing
// that React Router would normally handle.
app.all('*', (c) => {
  // If it's not an API route, we want to let the frontend handle it.
  // But on Vercel SSR, we need to render it.
  // For now, let's just make sure it doesn't 404.
  return c.text('App is loading...', 200);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
