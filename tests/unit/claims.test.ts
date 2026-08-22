import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FOLLOW_UP_COUNT } from '../../src/shared/chatEngine.ts';
import { GAME_CONFIG } from '../../src/shared/config.ts';
import { dumbledore } from '../../src/chat-with-character/data/dumbledore.ts';
import { TOPICS } from '../../src/chat-with-character/data/topics.ts';

/**
 * Claims oracle (HICCUPPS — see docs/ORACLES.md).
 *
 * The README makes measurable promises about the product: how many chat topics there
 * are, how many replies each one has, how many follow-ups come back, how many wins take
 * a match. Those numbers also live in the code — and until this file existed, nothing
 * connected the two. Either could drift and the other would keep claiming otherwise.
 *
 * This binds them. If a number here fails, decide which side is wrong before changing
 * anything: the README may be stale, or the code may have quietly changed behaviour.
 */
// Same file-reading pattern as tests/unit/security-headers.test.ts — happy-dom does
// not give import.meta.url a file: scheme.
const README = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

/** Pulls a Czech numeral out of the README so the prose is the assertion's source. */
function readmeClaims(pattern: RegExp): string {
  const match = README.match(pattern);
  expect(match, `README no longer contains the claim matching ${pattern}`).not.toBeNull();
  return match![1];
}

describe('README claims match the code', () => {
  it('claims the number of chat topics the registry actually holds', () => {
    const claimed = Number(readmeClaims(/\((\d+) témat/));
    expect(Object.keys(TOPICS)).toHaveLength(claimed);
  });

  it('claims a minimum number of reply variants that every topic really meets', () => {
    // "každé nejméně čtyři varianty odpovědi"
    expect(README).toContain('nejméně čtyři varianty odpovědi');
    const minimum = 4;

    for (const topic of Object.keys(TOPICS)) {
      for (const locale of ['cs', 'en'] as const) {
        const quotes = dumbledore.quotes[topic]?.[locale] ?? [];
        expect(
          quotes.length,
          `topic "${topic}" (${locale}) has ${quotes.length} replies, README promises ${minimum}`,
        ).toBeGreaterThanOrEqual(minimum);
      }
    }
  });

  it('claims the number of follow-up questions the engine offers', () => {
    expect(README).toContain('nabídne tři navazující otázky');
    expect(FOLLOW_UP_COUNT).toBe(3);
  });

  it('claims the number of wins that takes a rock-paper-scissors match', () => {
    expect(README).toContain('kdo první získá pět výher, bere zápas');
    expect(GAME_CONFIG.WINS_TO_MATCH).toBe(5);
  });

  it('lists exactly the games that exist', () => {
    // Every game row in the README table links to its directory; the sitemap is
    // generated from the same set of routes, so the two must agree.
    const linked = [...README.matchAll(/^\| \[[^\]]+\]\(([a-z-]+)\/\)/gm)].map(m => m[1]);
    expect(new Set(linked).size).toBe(linked.length);
    expect(linked).toEqual(
      expect.arrayContaining([
        'guess-character-name',
        'guess-house',
        'guess-spell',
        'who-is-on-photo',
        'rock-paper-scissors',
        'chat-with-character',
      ]),
    );
    expect(linked).toHaveLength(6);
  });

  it('keeps the documented life count in one place', () => {
    expect(GAME_CONFIG.MAX_LIVES).toBeGreaterThan(0);
  });
});
