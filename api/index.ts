import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { api, API_BASENAME } from '../__create/route-builder';

const app = new Hono();

// 1. Handle API Routes
app.route(API_BASENAME, api);

// 2. Handle Frontend / SSR
// Untuk Vercel, kita akan membiarkan Vercel melayani file statis dari build/client.
// Jika rute tidak ditemukan di API, kita akan mengembalikan rute ke handler utama.
app.all('*', (c) => {
  // Jika ini bukan API, biarkan sistem routing frontend yang menangani.
  // Di Vercel, kita bisa mengembalikan respons kosong atau 404 yang akan ditangkap oleh rewrites vercel.json
  return c.notFound();
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
