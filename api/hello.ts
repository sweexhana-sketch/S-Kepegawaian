import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono();

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from isolated Hono endpoint!',
    status: 'success'
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
