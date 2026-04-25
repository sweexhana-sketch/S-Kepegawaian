import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bundleServer() {
  console.log('Bundling server entry with esbuild...');
  
  // Make sure api directory exists
  const apiDir = resolve(__dirname, '../api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }

  await build({
    entryPoints: [resolve(__dirname, '../server/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    minify: true,
    treeShaking: true,
    banner: {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
    },
    outfile: resolve(__dirname, '../api/index.js'),
    external: [
      'hono',
      'hono/*',
      'react-router',
      '@hono/*',
      '@neondatabase/serverless',
      'bcryptjs',
      '@auth/core',
      'serialize-error',
      'node:*'
    ],
  });
  
  console.log('Server bundled successfully to api/index.js');
}

bundleServer().catch(err => {
  console.error(err);
  process.exit(1);
});
