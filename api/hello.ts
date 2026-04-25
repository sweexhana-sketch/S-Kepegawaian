import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono();

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from isolated Hono endpoint!',
    status: 'success'
  });
});

export default handle(app);
