import { Hono } from 'hono';

const app = new Hono();

app.all('*', (c) => {
  return c.json({
    message: 'Hello from CUSTOM adapter!',
    url: c.req.url,
  });
});

import { getRequestListener } from '@hono/node-server';

export default getRequestListener(app.fetch);
