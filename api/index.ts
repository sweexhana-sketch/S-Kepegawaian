import { handle } from 'hono/vercel';
import { app } from '../__create/app';

if (process.env.NODE_ENV === 'production') {
  let requestHandlerPromise;

  app.all('*', async (c) => {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('React Router handler timed out after 10s')), 10000)
    );

    try {
      if (!requestHandlerPromise) {
        requestHandlerPromise = (async () => {
          console.log('Loading React Router build...');
          const reactRouter = await import('react-router');
          const build = await import('../build/server/index.js');
          console.log('Build loaded successfully');
          return reactRouter.createRequestHandler(build, 'production');
        })();
      }

      const requestHandler = await requestHandlerPromise;
      
      // Race the handler against a timeout
      const response = await Promise.race([
        requestHandler(c.req.raw),
        timeoutPromise
      ]);
      
      return response;
    } catch (e) {
      console.error('Vercel Handler Error:', e);
      return c.html(`
        <html>
          <body style="padding: 20px; font-family: sans-serif; background: #f8fafc;">
            <div style="max-width: 800px; margin: 0 auto; background: white; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
              <h1 style="color: #ef4444; margin-top: 0;">Deployment Diagnostic</h1>
              <p><strong>Status:</strong> Error detected in server-side rendering.</p>
              <p><strong>Message:</strong> ${e.message}</p>
              <div style="background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto;">
                <pre style="margin: 0; font-size: 13px;">${e.stack}</pre>
              </div>
              <div style="margin-top: 24px; font-size: 14px; color: #64748b;">
                <p>Possible causes:</p>
                <ul>
                  <li>Database connection (DATABASE_URL) timing out.</li>
                  <li>Infinite loop in a React component or loader.</li>
                  <li>Missing environment variables.</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
      `, 500);
    }
  });
}

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);

