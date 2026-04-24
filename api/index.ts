import { handle } from 'hono/vercel';
import { app } from '../__create/app';

// Catch-all diagnostic
app.all('*', async (c) => {
  const url = c.req.url;
  console.log(`Request received: ${url}`);
  
  if (url.includes('/api/')) {
    // Let it pass to API routes if needed
    return;
  }

  // Diagnostic message
  return c.html(`
    <html>
      <body style="padding: 40px; font-family: sans-serif; line-height: 1.6;">
        <h1>SIMPEG DIGITAL - Server is Alive</h1>
        <p>If you see this page, the Vercel Serverless Function is working.</p>
        <hr/>
        <ul>
          <li><strong>URL:</strong> ${url}</li>
          <li><strong>Method:</strong> ${c.req.method}</li>
          <li><strong>NODE_ENV:</strong> ${process.env.NODE_ENV}</li>
        </ul>
        <p>Attempting to load React Router... (Wait 5 seconds)</p>
        <script>
          setTimeout(() => {
            console.log('Redirecting to check SSR...');
            // In a real fix, we would attach the SSR here
          }, 5000);
        </script>
      </body>
    </html>
  `);
});

export default handle(app);

