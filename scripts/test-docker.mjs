// Runs the full Playwright E2E suite against the actual Docker image (nginx),
// not the serve-based dev server. This catches packaging/serving bugs that
// `npm test` cannot — e.g. a game dir missing from the Dockerfile COPY list,
// or nginx routing/header differences from `npx serve`.
//
// Note: @visual snapshots are intentionally skipped in production mode
// (see tests/visual/screenshots.spec.ts). Keep running `npm test` for those.

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'http://127.0.0.1:4173';
const READY_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 2_000;

const run = (cmd, opts = {}) =>
  execSync(cmd, { cwd: root, stdio: 'inherit', ...opts });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer() {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE_URL, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await delay(POLL_INTERVAL_MS);
  }
  throw new Error(`Container did not become ready at ${BASE_URL} within ${READY_TIMEOUT_MS} ms`);
}

async function main() {
  console.log('▶ Building and starting the Docker image…');
  run('docker compose up --build -d');

  try {
    console.log('▶ Waiting for the container to serve…');
    await waitForServer();

    console.log('▶ Running E2E against the Docker image…');
    run('npx playwright test', {
      env: {
        ...process.env,
        PLAYWRIGHT_TARGET: 'production',
        PLAYWRIGHT_BASE_URL: BASE_URL,
      },
    });
  } finally {
    console.log('▶ Stopping the Docker image…');
    run('docker compose down');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
