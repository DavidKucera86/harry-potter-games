import { build } from 'esbuild';
import { readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcRoot = join(root, 'src');
const sharedRoot = join(srcRoot, 'shared');

function collectTsFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      collectTsFiles(fullPath, files);
    } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const sharedExternalPlugin = {
  name: 'external-shared',
  setup(build) {
    build.onResolve({ filter: /^\.\.\/shared\// }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

const gameEntries = [
  join(srcRoot, 'guess-character-name/script.ts'),
  join(srcRoot, 'guess-spell/script.ts'),
  join(srcRoot, 'guess-house/script.ts'),
  join(srcRoot, 'who-is-on-photo/script.ts'),
  join(srcRoot, 'rock-paper-scissors/script.ts'),
  join(srcRoot, 'chat-with-character/script.ts'),
];

const sharedEntries = collectTsFiles(sharedRoot);
const sourcemap = process.env.SOURCEMAP === '1';

await build({
  entryPoints: sharedEntries,
  outbase: srcRoot,
  outdir: root,
  bundle: false,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  sourcemap,
  logLevel: 'info',
});

for (const entry of gameEntries) {
  const relDir = dirname(relative(srcRoot, entry));
  await build({
    entryPoints: [entry],
    outfile: join(root, relDir, 'script.js'),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    sourcemap,
    logLevel: 'info',
    plugins: [sharedExternalPlugin],
  });
}

console.log(`Built ${sharedEntries.length} shared modules and ${gameEntries.length} bundled game entries`);
