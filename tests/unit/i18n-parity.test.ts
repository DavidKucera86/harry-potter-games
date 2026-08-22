import { describe, expect, it } from 'vitest';
import { cs } from '../../src/shared/i18n/locales/cs.ts';
import { en } from '../../src/shared/i18n/locales/en.ts';

/**
 * Product oracle (HICCUPPS — see docs/ORACLES.md).
 *
 * Two locale files are two copies of the same structure, and copies drift. A key added
 * to cs.ts and forgotten in en.ts does not fail the build — it surfaces as `undefined`
 * in the UI for English players only, which nobody on a Czech machine ever sees.
 *
 * tests/helpers/i18nConsistency.ts checks the other axis (does the rendered DOM follow
 * the active locale). This checks that the two files are the same shape in the first
 * place.
 */

/** Every leaf path in an object, with the kind of value sitting at it. */
function leaves(value: unknown, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (child !== null && typeof child === 'object') {
        for (const [nested, kind] of leaves(child, path)) {
          out.set(nested, kind);
        }
      } else {
        out.set(path, typeof child);
      }
    }
  }
  return out;
}

const csLeaves = leaves(cs);
const enLeaves = leaves(en);

/**
 * Strings that are legitimately identical in both locales: proper nouns, and UI text
 * that is the same word in Czech and English. Anything not listed here that matches
 * across locales is far more likely to be a forgotten translation.
 */
const IDENTICAL_BY_DESIGN = new Set<string>([
  'hangman.noWrongLetters', // an em dash placeholder — no language owns it
  'ui.buyMeCoffee', // brand name of the service being linked
  'pages.menuTitle', // the product's own name, not a translatable phrase
]);

describe('locale files are the same shape', () => {
  it('has no key that exists in only one locale', () => {
    const onlyCs = [...csLeaves.keys()].filter(k => !enLeaves.has(k));
    const onlyEn = [...enLeaves.keys()].filter(k => !csLeaves.has(k));

    expect(onlyCs, 'keys present in cs but missing from en').toEqual([]);
    expect(onlyEn, 'keys present in en but missing from cs').toEqual([]);
  });

  it('uses the same kind of value at every key', () => {
    // A plain string on one side and a function on the other means one locale
    // interpolates and the other silently drops the argument.
    for (const [path, kind] of csLeaves) {
      expect(enLeaves.get(path), `type mismatch at "${path}"`).toBe(kind);
    }
  });

  it('has no empty string anywhere', () => {
    for (const [locale, entries] of [
      ['cs', csLeaves],
      ['en', enLeaves],
    ] as const) {
      for (const [path, kind] of entries) {
        if (kind === 'string') {
          const value = path
            .split('.')
            .reduce<Record<string, unknown>>(
              (node, key) => node[key] as Record<string, unknown>,
              (locale === 'cs' ? cs : en) as unknown as Record<string, unknown>,
            ) as unknown as string;
          expect(value.trim(), `${locale}.${path} is blank`).not.toBe('');
        }
      }
    }
  });

  it('has no untranslated string left sitting in the English file', () => {
    const suspects: string[] = [];

    for (const [path, kind] of csLeaves) {
      if (kind !== 'string' || IDENTICAL_BY_DESIGN.has(path)) {
        continue;
      }
      const read = (source: unknown) =>
        path
          .split('.')
          .reduce<Record<string, unknown>>(
            (node, key) => node[key] as Record<string, unknown>,
            source as Record<string, unknown>,
          ) as unknown as string;

      if (read(cs) === read(en)) {
        suspects.push(path);
      }
    }

    // If a match here is deliberate — a proper noun, or a word spelled the same in both
    // languages — add the path to IDENTICAL_BY_DESIGN rather than deleting this test.
    expect(suspects, 'cs and en are identical at these keys').toEqual([]);
  });
});
