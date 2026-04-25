import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono();

app.all('*', (c) => {
  console.log('Incoming request:', c.req.method, c.req.url);
  return c.json({
    message: 'Hello from isolated Hono endpoint!',
    url: c.req.url,
    status: 'success'
  });
});

export default handle(app);
