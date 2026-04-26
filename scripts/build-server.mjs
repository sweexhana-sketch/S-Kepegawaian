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
        build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
          let contents = await fs.promises.readFile(args.path, 'utf8');
          if (contents.includes('import.meta.glob')) {
            console.log('[PLUGIN] Patching glob in:', args.path);
            
            const importStatements = [];
            
            contents = contents.replace(/import\.meta\.glob\(['"](.+?)['"](?:,\s*\{([\s\S]*?)\})?\)/g, (fullMatch, pattern, optionsStr) => {
              const options = optionsStr || '';
              const isEager = options.includes('eager: true');
              
              const baseDir = dirname(args.path);
              const files = fg.sync(pattern, { cwd: baseDir });
              console.log(`[PLUGIN] Found ${files.length} files for pattern "${pattern}" in ${baseDir}`);
              
              let replacement = '{';
              
              files.forEach((file, index) => {
                const moduleName = `__glob_${Math.random().toString(36).slice(2)}_${index}`;
                const relativePath = file.startsWith('.') ? file : `./${file}`;
                
                if (isEager) {
                  importStatements.push(`import * as ${moduleName} from '${relativePath}';`);
                  replacement += `'${file}': ${moduleName},`;
                } else {
                  replacement += `'${file}': () => import('${relativePath}'),`;
                }
              });
              
              replacement += '}';
              console.log(`[PLUGIN] Replacement: ${replacement.slice(0, 100)}...`);
              return `(${replacement})`;
            });

            contents = importStatements.join('\n') + '\n' + contents;
          }
          
          let loader = 'js';
          if (args.path.endsWith('.tsx')) loader = 'tsx';
          else if (args.path.endsWith('.ts')) loader = 'ts';
          else if (args.path.endsWith('.jsx')) loader = 'jsx';
          
          return { contents, loader };
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
