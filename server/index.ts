/**
 * server/index.ts - Professional Native Entry Point for Vercel Node 20
 * 
 * Strategi:
 * 1. Jalur API (Hono) dan Jalur SSR (React Router) dipisahkan total.
 * 2. Menggunakan Native Node.js handler (req, res) untuk meminimalkan overhead.
 * 3. Implementasi Circuit Breaker 10 detik untuk mencegah 504 Gateway Timeout.
 */
import { getRequestListener } from '@hono/node-server';
import { createRequestHandler } from 'react-router';
import * as build from '../build/server/index.js';
import { app as apiApp } from '../__create/app';

// Inisialisasi Handler di level modul (Cold Start)
const reactRouterHandler = createRequestHandler(build, 'production');
const apiRequestHandler = getRequestListener(apiApp.fetch);

/**
 * Helper: Konversi Node.js req ke Web Standard Request
 */
function createWebRequest(req: any): Request {
  const host = req.headers.host || 'localhost';
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v);
      } else {
        headers.set(key, value as string);
      }
    }
  }

  return new Request(url.href, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    // @ts-ignore
    duplex: 'half',
  });
}

/**
 * Vercel Serverless Function Handler
 */
export default async function(req: any, res: any) {
  const host = req.headers.host || 'localhost';
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const url = new URL(req.url, `${protocol}://${host}`);
  const pathname = url.pathname;

  // --- JALUR 1: API ROUTES (/api/*) ---
  if (pathname.startsWith('/api/')) {
    try {
      return apiRequestHandler(req, res);
    } catch (err: any) {
      console.error('[API ERROR]', err);
      res.status(500).end('Internal API Error');
      return;
    }
  }

  // --- FILTER: STATIC ASSETS (Jika terlewat dari filesystem) ---
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|map|json|txt|woff2?)$/i)) {
     console.log(`[PRO-SSR] Skipping static asset: ${pathname}`);
     res.status(404).end('Not Found');
     return;
  }

  // --- JALUR 2: SSR ROUTES (Halaman Utama / Frontend) ---
  console.log(`[PRO-SSR] Executing render for: ${pathname}`);
  const startTime = Date.now();

  try {
    // CIRCUIT BREAKER: Maksimal 10 detik untuk render
    const timeout = setTimeout(() => {
       if (!res.writableEnded) {
         console.error(`[CRITICAL] SSR Timeout at ${pathname} after 10s`);
         res.status(504).end('SSR Timeout - Server taking too long to render');
       }
    }, 10000);

    // Konversi ke Web Request
    const webRequest = createWebRequest(req);

    // Jalankan React Router Handler
    const result = await reactRouterHandler(webRequest);
    
    clearTimeout(timeout);

    if (res.writableEnded) return;

    // Transfer Status & Headers
    res.status(result.status);
    result.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Transfer Body (Streaming support)
    if (result.body) {
      const reader = result.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.end();
    }

    console.log(`[PRO-SSR] Success: ${pathname} (${Date.now() - startTime}ms)`);

  } catch (err: any) {
    console.error(`[PRO-SSR ERROR] at ${pathname}:`, err);
    if (!res.writableEnded) {
      res.status(500).end(`SSR Execution Failed: ${err?.message || 'Unknown Error'}`);
    }
  }
}
