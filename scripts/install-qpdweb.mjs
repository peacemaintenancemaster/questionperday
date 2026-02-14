import { execSync } from 'child_process';

console.log('Installing qpdweb dependencies...');
execSync('cd /vercel/share/v0-project/qpdweb && npm install', { stdio: 'inherit' });
console.log('Done installing qpdweb dependencies.');
