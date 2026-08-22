#!/usr/bin/env node
/**
 * Comparable-products oracle (HICCUPPS — see docs/ORACLES.md).
 *
 * shared/fixtures/*.json is a frozen copy of the HP API, used both as the offline
 * fallback and as the default payload for E2E mocks. A frozen copy is exactly what the
 * code learns to pass, so it needs an independent check that upstream still looks the
 * way we remember.
 *
 * This reports; it never gates. An external service must not be able to turn a PR red.
 * Exit code 2 means drift (the scheduled workflow turns that into a notification),
 * exit code 0 means agreement, and an unreachable API is exit 0 with a note — the API
 * being down is not a finding about our code.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'https://hp-api.onrender.com/api';
const TIMEOUT_MS = 30_000;
const root = process.cwd();

const readFixture = name =>
  JSON.parse(readFileSync(join(root, 'shared', 'fixtures', name), 'utf8'));

/** The set of keys the fixture entries actually use — that is our recorded shape. */
const shapeOf = entries =>
  new Set(entries.flatMap(entry => Object.keys(entry ?? {})));

async function fetchJson(path) {
  const response = await fetch(`${API}${path}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`${path} responded ${response.status}`);
  }
  return response.json();
}

/**
 * Breaking drift is upstream taking something away that the fixtures — and therefore
 * dataProvider — rely on. Upstream *adding* fields is normal and constant; reporting it
 * as a failure would turn this job red every week, and a job that is always red is a job
 * nobody reads.
 */
function compare(label, live, fixture, requiredKeys) {
  const breaking = [];
  const informational = [];
  const liveShape = shapeOf(live);

  for (const key of requiredKeys) {
    if (!liveShape.has(key)) {
      breaking.push(
        `${label}: fixtures rely on "${key}", which no live entry provides any more`,
      );
    }
  }

  if (live.length === 0) {
    breaking.push(`${label}: upstream returned an empty list`);
  }

  const added = [...liveShape].filter(key => !shapeOf(fixture).has(key));
  if (added.length > 0) {
    informational.push(`${label}: upstream also returns ${added.join(', ')}`);
  }

  return { breaking, informational };
}

try {
  const [liveCharacters, liveSpells] = await Promise.all([
    fetchJson('/characters'),
    fetchJson('/spells'),
  ]);

  const results = [
    // The keys dataProvider.parseCharacters / parseSpells actually depend on.
    compare('characters', liveCharacters, readFixture('characters.json'), [
      'id',
      'name',
      'house',
      'image',
    ]),
    compare('spells', liveSpells, readFixture('spells.json'), ['name']),
  ];

  const breaking = results.flatMap(r => r.breaking);
  const informational = results.flatMap(r => r.informational);

  if (informational.length > 0) {
    console.log('Upstream has grown since the fixtures were taken:\n');
    for (const note of informational) {
      console.log(`  - ${note}`);
    }
    console.log('\nNot a failure. Worth folding in at the next quarterly refresh.\n');
  }

  if (breaking.length === 0) {
    console.log('HP API still provides everything the fixtures and dataProvider rely on.');
    process.exit(0);
  }

  console.log('Breaking HP API drift:\n');
  for (const finding of breaking) {
    console.log(`  - ${finding}`);
  }
  console.log('\nRefresh shared/fixtures/*.json and review the diff in a PR.');
  process.exit(2);
} catch (error) {
  // Upstream being slow or down says nothing about our code. Do not fail on it.
  console.log(`HP API unreachable, skipping drift check: ${error.message}`);
  process.exit(0);
}
