import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono();

app.all('*', (c) => {
  return c.html(`
    <html>
      <body style="padding: 50px; font-family: sans-serif; text-align: center;">
        <h1 style="color: #2563eb;">Vercel Isolation Test: SUCCESS</h1>
        <p>If you see this, the Vercel function is running correctly without project imports.</p>
        <p>URL: ${c.req.url}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);

