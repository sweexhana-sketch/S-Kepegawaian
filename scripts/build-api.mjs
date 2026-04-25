import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bundleApi() {
  await build({
    entryPoints: [resolve(__dirname, '../api/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    outfile: resolve(__dirname, '../api/index.bundled.js'),
    external: [
      '@neondatabase/serverless',
      'bcryptjs',
      '@hono/auth-js',
      '@auth/core',
      'hono'
    ], // don't bundle node_modules if possible, but actually bundling them is safer!
  });
}

bundleApi().catch(err => {
  console.error(err);
  process.exit(1);
});
