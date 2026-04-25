import { Hono } from 'hono';

const app = new Hono();

app.all('*', (c) => {
  return c.json({
    message: 'Hello from CUSTOM adapter!',
    url: c.req.url,
  });
});

export default async function handler(req, res) {
  try {
    // Reconstruct the URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const url = new URL(req.url, `${protocol}://${host}`);

    // Create standard headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          headers.append(key, v);
        }
      }
    }

    // Create standard Request
    const init = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // For Vercel, req is an IncomingMessage. We can read its body.
      // But Vercel might have already parsed req.body!
      if (req.body) {
         init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }
    }

    const request = new Request(url, init);

    // Fetch response from Hono
    const response = await app.fetch(request);

    // Send back to Vercel
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const bodyText = await response.text();
    res.send(bodyText);

  } catch (err) {
    console.error('Custom handler error:', err);
    res.status(500).json({ error: String(err) });
  }
}
