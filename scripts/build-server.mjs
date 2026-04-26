import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bundleServer() {
  console.log('Bundling server entry with esbuild...');
  
  // Failsafe: Patch React Router build to remove development references
  const rrBuildPath = resolve(__dirname, '../build/server/index.js');
  if (fs.existsSync(rrBuildPath)) {
    console.log('Patching React Router build for production...');
    let content = fs.readFileSync(rrBuildPath, 'utf8');
    content = content.replace(/\/development\//g, '/production/');
    fs.writeFileSync(rrBuildPath, content);
  }

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
    conditions: ['production', 'node', 'import'],
    alias: {
      '@auth/create/react': '@hono/auth-js/react',
      '@auth/create': resolve(__dirname, '../src/__create/@auth/create'),
      '@': resolve(__dirname, '../src'),
      'stripe': resolve(__dirname, '../src/__create/stripe'),
      'npm:stripe': 'stripe',
      'lodash': 'lodash-es',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      'import.meta.env.DEV': 'false',
      'import.meta.env.PROD': 'true',
    },
    plugins: [{
      name: 'force-production',
      setup(build) {
        // Universal filter to catch any remaining development paths
        build.onResolve({ filter: /.*react-router.*development.*/ }, args => {
          const newPath = args.path.replace('/development/', '/production/');
          console.log(`[PATCH] Redirecting ${args.path} -> ${newPath}`);
          return { path: require.resolve(newPath) }
        })
      },
    },
    {
      name: 'import-meta-glob',
      setup(build) {
        build.onLoad({ filter: /route-builder\.ts$/ }, async (args) => {
          console.log('[PLUGIN] Intercepted:', args.path);
          let contents = await fs.promises.readFile(args.path, 'utf8');
          if (contents.includes('import.meta.glob')) {
            const apiDir = resolve(__dirname, '../src/app/api');
            const files = fg.sync('**/route.{js,ts}', { cwd: apiDir });
            
            let importCode = '';
            let objectEntries = [];
            
            files.forEach((file, index) => {
              const moduleName = `__route_${index}`;
              const filePath = `../src/app/api/${file}`;
              importCode += `import * as ${moduleName} from '${filePath}';\n`;
              objectEntries.push(`'../src/app/api/${file}': ${moduleName}`);
            });

            const globReplacement = `{${objectEntries.join(', ')}}`;
            contents = importCode + '\n' + contents.replace(
              /import\.meta\.glob\([\s\S]+?\)/g, 
              globReplacement
            );
          }
          return { contents, loader: 'ts' };
        });
      }
    }],
    banner: {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
    },
    outfile: resolve(__dirname, '../api/index.js'),
    external: [
      'node:*',
      '@neondatabase/serverless',
      'bcryptjs',
    ],
  });
  
  console.log('Server bundled successfully to api/index.js');
}

bundleServer().catch(err => {
  console.error(err);
  process.exit(1);
});
