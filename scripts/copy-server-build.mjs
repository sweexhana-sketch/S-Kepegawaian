/**
 * scripts/copy-server-build.mjs
 *
 * Post-build script: copies build/server into api/_ssr/ so that
 * Vercel includes all SSR files in the serverless function bundle.
 *
 * Files inside api/ are ALWAYS included by Vercel - no special config needed.
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const src = resolve(projectRoot, 'build/server');
const dest = resolve(projectRoot, 'api/_ssr');

if (!existsSync(src)) {
  console.error(`ERROR: Source directory does not exist: ${src}`);
  process.exit(1);
}

// Clean the destination first to avoid stale files
if (existsSync(dest)) {
  console.log(`Cleaning existing ${dest}...`);
  rmSync(dest, { recursive: true, force: true });
}

console.log(`Copying ${src} → ${dest}`);
cpSync(src, dest, { recursive: true });
console.log('✅ Server build copied into api/_ssr/');
