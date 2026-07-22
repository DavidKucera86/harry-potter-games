/*
 * Regenerates klodo-metr.png — the shareable "kartička" (share card) from the
 * community Klódo-Metr (https://github.com/vibecoding-akademie/klodo-metr).
 *
 * Only the aggregate "Souboj klódů" sections are published — the hero (length in
 * cm, tier, progress to next level), the level ladder, the real-world conversions
 * and the badges. The per-project battleground (which names projects) and the
 * explicit spend tiles are dropped, so *no* project names or itemised spend ever
 * leave this machine. The footer links to the PNG.
 *
 * Pipeline: download the official generator -> run it (it reads the LOCAL
 * ~/.claude transcripts via ccusage and writes ~/klodo-metr.html) -> curate that
 * page down to the shareable sections and screenshot it headlessly with
 * Playwright -> save klodo-metr.png.
 *
 * Zero Trust / fail-soft: the generator needs the network (ccusage) and local
 * usage data, either of which can be missing. On ANY failure this keeps the
 * already-committed klodo-metr.png and exits 0 so it never blocks a commit.
 */
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SCRIPT_URL =
  'https://raw.githubusercontent.com/vibecoding-akademie/klodo-metr/main/klodo-metr.js';
const OUT = join(root, 'klodo-metr.png');

function log(msg) {
  process.stderr.write(`[klodo-card] ${msg}\n`);
}

/**
 * The upstream generator auto-opens the result in a browser (open/xdg-open/start).
 * On a real desktop that would pop a tab on every commit — shadow those launchers
 * with no-op stubs on PATH so the run stays headless.
 */
function silentBrowserEnv(workDir) {
  const isWin = process.platform === 'win32';
  for (const name of ['xdg-open', 'open', 'start']) {
    const stub = join(workDir, isWin ? `${name}.cmd` : name);
    writeFileSync(stub, isWin ? '@echo off\r\n' : '#!/bin/sh\nexit 0\n');
    if (!isWin) chmodSync(stub, 0o755);
  }
  return { ...process.env, PATH: `${workDir}${isWin ? ';' : ':'}${process.env.PATH}` };
}

async function renderCardPng(htmlPath) {
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 900, height: 1400 },
      deviceScaleFactor: 2,
    });
    await page.goto(pathToFileURL(htmlPath).href);

    // The page opens on the "Souboj klódů" view (renderFlex populates the hero,
    // ladder, conversions and badges on load). Curate it down to those sections:
    // drop the interactive buttons, the confetti overlay, the explicit spend
    // tiles, and — crucially — the per-project podium, which would leak project
    // names.
    await page.evaluate(() => {
      const hide = (el) => {
        if (el instanceof HTMLElement) el.style.display = 'none';
      };
      const panelOf = (id) => document.getElementById(id)?.closest('.panel') ?? null;
      hide(document.getElementById('confetti'));
      hide(document.getElementById('viewDash'));
      hide(document.querySelector('.viewtabs'));
      hide(document.querySelector('#viewFlex .sharepanel'));
      hide(document.querySelector('#viewFlex .flexgrid'));
      hide(panelOf('podium')); // "Tvoje bojiště" — names projects
      hide(panelOf('copyFlex')); // "Naparuj se před komunitou" button
      hide(panelOf('copyKeepPrompt')); // "Historie chatů navždy" button
    });

    // Let the count-up numbers and the progress-meter transition settle.
    await page.waitForTimeout(1600);

    return await page.locator('.wrap').screenshot();
  } finally {
    await browser.close();
  }
}

async function main() {
  const work = mkdtempSync(join(tmpdir(), 'klodo-'));
  const scriptPath = join(work, 'klodo-metr.js');

  execFileSync('curl', ['-fsSL', SCRIPT_URL, '-o', scriptPath], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });

  execFileSync(process.execPath, [scriptPath], {
    stdio: ['ignore', 'ignore', 'inherit'],
    env: silentBrowserEnv(work),
  });

  const htmlPath = join(homedir(), 'klodo-metr.html');
  if (!existsSync(htmlPath)) {
    throw new Error('klodo-metr.html was not produced by the generator');
  }

  const png = await renderCardPng(htmlPath);
  writeFileSync(OUT, png);
  log(`updated ${OUT} (${png.length} bytes)`);
}

main().catch((err) => {
  log(`regeneration skipped — keeping existing card: ${err.message}`);
  process.exit(0);
});
