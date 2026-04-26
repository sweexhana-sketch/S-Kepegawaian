import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  let output = {
    results: {},
    errors: {}
  };
  
  try {
    output['db_url_set'] = !!process.env.DATABASE_URL;
    output['db_url_length'] = process.env.DATABASE_URL?.length || 0;
    output['env_keys'] = Object.keys(process.env).filter(k => !k.includes('TOKEN') && !k.includes('SECRET'));
    
    const pkgPath = path.resolve(__dirname, '../package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = Object.keys(pkg.dependencies || {});
      
      output['total_deps'] = deps.length;
      
      for (const dep of deps) {
        try {
          // Attempt to import the module
          await import(dep);
          output.results[dep] = 'OK';
        } catch (err) {
          output.results[dep] = 'FAIL';
          output.errors[dep] = err.message;
        }
      }
    } else {
      output['pkg_error'] = 'package.json not found at ' + pkgPath;
      // also just list /var/task
      output['/var/task'] = fs.readdirSync('/var/task');
      output['/var/task/node_modules'] = fs.existsSync('/var/task/node_modules') ? fs.readdirSync('/var/task/node_modules') : 'MISSING';
    }
  } catch (e) {
    output['fatal_error'] = e.message;
  }

  res.status(200).json(output);
}
