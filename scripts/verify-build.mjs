import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const generatedPaths = [
  'shared',
  'guess-character-name',
  'guess-spell',
  'guess-house',
  'who-is-on-photo',
  'rock-paper-scissors',
  'chat-with-character',
  'index.html',
  'robots.txt',
  'sitemap.xml',
];

execSync('npm run build', { cwd: root, stdio: 'inherit' });

try {
  execSync(`git diff --quiet -- ${generatedPaths.join(' ')}`, { cwd: root });
  console.log('Build output matches committed artifacts.');
} catch {
  console.error('\nBuild produced uncommitted changes in generated files.');
  console.error('Run `npm run build` and commit the updated artifacts.\n');
  execSync(`git diff --stat -- ${generatedPaths.join(' ')}`, { cwd: root, stdio: 'inherit' });
  process.exit(1);
}
