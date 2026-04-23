import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// Helper function to transform file path to Hono route path
function getHonoPath(relativePath: string): string {
  // relativePath looks like "../src/app/api/pegawai/list/route.js"
  const parts = relativePath.split('/').filter(Boolean);
  // Find the index of 'api' to start the route from there
  const apiIndex = parts.indexOf('api');
  if (apiIndex === -1) return '/';
  
  const routeParts = parts.slice(apiIndex + 1, -1); // Get parts between 'api' and 'route.js'
  
  if (routeParts.length === 0) {
    return '/';
  }
  
  const transformedPath = routeParts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === '...'
        ? `:${param}{.+}`
        : `:${param}`;
    }
    return segment;
  }).join('/');

  return `/${transformedPath}`;
}

// Use import.meta.glob to find and bundle all route files
const routeModules = import.meta.glob('../src/app/api/**/route.{js,ts}', {
  eager: true,
});

function registerRoutes() {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  
  for (const [path, module] of Object.entries(routeModules)) {
    const route = module as any;
    const honoPath = getHonoPath(path);
    
    for (const method of methods) {
      if (route[method]) {
        const handler: Handler = async (c) => {
          const params = c.req.param();
          return await route[method](c.req.raw, { params });
        };
        
        const methodLowercase = method.toLowerCase() as any;
        if (typeof api[methodLowercase] === 'function') {
          api[methodLowercase](honoPath, handler);
        }
      }
    }
  }
}

// Initial route registration
registerRoutes();

export { api, API_BASENAME };
