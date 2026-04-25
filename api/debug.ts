import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  let output = {};
  
  function safeReadDir(dir) {
    try {
      if (fs.existsSync(dir)) {
        return fs.readdirSync(dir);
      } else {
        return ['DOES_NOT_EXIST'];
      }
    } catch (e) {
      return [`ERROR: ${e.message}`];
    }
  }

  output['__dirname'] = __dirname;
  output['process.cwd'] = process.cwd();
  
  output['/var/task'] = safeReadDir('/var/task');
  output['/var/task/apps'] = safeReadDir('/var/task/apps');
  output['/var/task/apps/web'] = safeReadDir('/var/task/apps/web');
  output['/var/task/apps/web/api'] = safeReadDir('/var/task/apps/web/api');
  output['/var/task/apps/web/api/_ssr'] = safeReadDir('/var/task/apps/web/api/_ssr');
  output['/var/task/apps/web/build'] = safeReadDir('/var/task/apps/web/build');
  output['/var/task/apps/web/build/server'] = safeReadDir('/var/task/apps/web/build/server');
  
  // check if neon serverless is installed
  output['neon_serverless_installed'] = fs.existsSync('/var/task/apps/web/node_modules/@neondatabase/serverless');

  res.status(200).json(output);
}
