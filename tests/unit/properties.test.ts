import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { normalizeText } from '../../src/shared/chatEngine.ts';
import { pickFromRemaining, shuffle } from '../../src/shared/deckUtils.ts';
import { isGuessableLetter, normalizeLetter } from '../../src/shared/hangmanUtils.ts';
import { isSafeImageUrl } from '../../src/shared/urlUtils.ts';
import { dedupeWords, filterMinLength } from '../../src/shared/wordUtils.ts';

/**
 * Property-based counterpart to the example-based unit suite.
 *
 * The example tests next door encode the inputs whoever wrote the code happened to
 * think of, so code and tests share their blind spots — that is the pesticide paradox
 * in its purest form. These assert invariants over generated inputs instead, so the
 * cases are re-drawn on every run rather than frozen in the file.
 *
 * Rule when one of these fails: add the shrunk counterexample as an ordinary
 * example-based regression test *next to* the property. The property stops the class
 * of bug; the example documents the one that actually bit us.
 *
 * Deliberately absent: `resolveRps`. Its domain is nine combinations, so the
 * exhaustive table in rpsUtils.test.ts is the better tool — property-based testing is
 * for large or unbounded domains, not for everything.
 */
fc.configureGlobal({ numRuns: process.env.CI ? 50 : 200 });

describe('shuffle (property)', () => {
  it('returns a permutation of the input', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), input => {
        const result = shuffle(input);
        expect(result).toHaveLength(input.length);
        expect([...result].sort()).toEqual([...input].sort());
      }),
    );
  });

  it('never mutates the array it was given', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), input => {
        const before = [...input];
        shuffle(input);
        expect(input).toEqual(before);
      }),
    );
  });

  it('is the identity for zero or one element', () => {
    fc.assert(
      fc.property(fc.array(fc.string(), { maxLength: 1 }), input => {
        expect(shuffle(input)).toEqual(input);
      }),
    );
  });
});

describe('pickFromRemaining (property)', () => {
  it('returns an item that is really at the reported index, or nothing at all', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), items => {
        const { item, index } = pickFromRemaining(items);
        if (items.length === 0) {
          expect(item).toBeNull();
          expect(index).toBe(-1);
        } else {
          expect(items[index]).toBe(item);
        }
      }),
    );
  });

  it('never returns an item the filter rejects', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), items => {
        const isEven = (n: number) => n % 2 === 0;
        const { item, index } = pickFromRemaining(items, isEven);
        if (item === null) {
          expect(index).toBe(-1);
          expect(items.some(isEven)).toBe(false);
        } else {
          expect(isEven(item)).toBe(true);
        }
      }),
    );
  });
});

describe('dedupeWords (property)', () => {
  it('is idempotent', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), words => {
        const once = dedupeWords(words);
        expect(dedupeWords(once)).toEqual(once);
      }),
    );
  });

  it('yields case-insensitively unique words, all drawn from the input', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), words => {
        const result = dedupeWords(words);
        expect(result.length).toBeLessThanOrEqual(words.length);

        const keys = result.map(w => w.toLowerCase());
        expect(new Set(keys).size).toBe(keys.length);

        for (const word of result) {
          expect(words).toContain(word);
        }
      }),
    );
  });
});

describe('filterMinLength (property)', () => {
  it('keeps a subsequence whose every word clears the bar', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), fc.nat({ max: 20 }), (words, minLength) => {
        const result = filterMinLength(words, minLength);
        for (const word of result) {
          expect(word.length).toBeGreaterThanOrEqual(minLength);
        }
        // Subsequence: the kept words appear in the original relative order.
        expect(result).toEqual(words.filter(w => result.includes(w)));
      }),
    );
  });

  it('keeps everything when minLength is zero', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), words => {
        expect(filterMinLength(words, 0)).toEqual(words);
      }),
    );
  });
});

describe('normalizeLetter (property)', () => {
  it('is idempotent', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 1 }), char => {
        const once = normalizeLetter(char);
        expect(normalizeLetter(once)).toBe(once);
      }),
    );
  });

  it('maps every guessable character onto a single a-z letter', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 1 }), char => {
        if (isGuessableLetter(char)) {
          expect(normalizeLetter(char)).toMatch(/^[a-z]$/);
        }
      }),
    );
  });
});

describe('isSafeImageUrl (property)', () => {
  it('is total — it answers with a boolean for any value at all, never throws', () => {
    fc.assert(
      fc.property(fc.anything(), value => {
        expect(typeof isSafeImageUrl(value)).toBe('boolean');
      }),
    );
  });

  it('rejects javascript: and data: whatever the casing or surrounding whitespace', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('javascript', 'JavaScript', 'JAVASCRIPT', 'data', 'DATA', 'DaTa'),
        fc.stringMatching(/^[ \t\n\r]{0,4}$/),
        fc.stringMatching(/^[ \t\n\r]{0,4}$/),
        fc.string(),
        (scheme, before, after, payload) => {
          expect(isSafeImageUrl(`${before}${scheme}:${payload}${after}`)).toBe(false);
        },
      ),
    );
  });

  it('never accepts a protocol-relative URL', () => {
    fc.assert(
      fc.property(fc.webUrl(), url => {
        expect(isSafeImageUrl(url.replace(/^https?:/, ''))).toBe(false);
      }),
    );
  });

  // The URL parser drops ASCII tab/LF/CR from anywhere in the string before parsing,
  // so `/<TAB>/host/x` reaches the network as the protocol-relative `//host/x`. No
  // character the parser ignores may turn a rejected URL into an accepted one.
  it('cannot be talked into a cross-origin URL by characters the URL parser ignores', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.stringMatching(/^[\t\n\r]{1,4}$/),
        fc.stringMatching(/^[\t\n\r]{0,4}$/),
        (url, inserted, trailing) => {
          const { host } = new URL(url);
          expect(isSafeImageUrl(`/${inserted}/${host}/photo.png`)).toBe(false);
          expect(isSafeImageUrl(`${inserted}//${host}/photo.png${trailing}`)).toBe(false);
          expect(isSafeImageUrl(`http${inserted}://${host}/photo.png`)).toBe(false);
        },
      ),
    );
  });
});

describe('normalizeText (property)', () => {
  it('is idempotent', () => {
    fc.assert(
      fc.property(fc.string(), text => {
        const once = normalizeText(text);
        expect(normalizeText(once)).toBe(once);
      }),
    );
  });

  it('never throws, whatever unicode the player types', () => {
    fc.assert(
      // 'binary' draws from the whole code-point range, lone surrogates included —
      // the chat box is a text input and players paste anything into it.
      fc.property(fc.string({ unit: 'binary' }), text => {
        expect(typeof normalizeText(text)).toBe('string');
      }),
    );
  });
});
