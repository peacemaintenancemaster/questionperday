import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const qpdwebDir = path.resolve(__dirname, '..', 'qpdweb');

console.log('Installing dependencies in qpdweb...');
execSync('npm install', { cwd: qpdwebDir, stdio: 'inherit' });
console.log('Done installing qpdweb dependencies.');
