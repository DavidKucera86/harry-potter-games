import { describe, expect, it } from 'vitest';
import {
  dedupeWords,
  filterMinLength,
  prepareHangmanWords,
} from '../../src/shared/wordUtils.ts';

describe('dedupeWords', () => {
  it('removes case-insensitive duplicates', () => {
    expect(dedupeWords(['Harry Potter', 'harry potter', 'Ron'])).toEqual([
      'Harry Potter',
      'Ron',
    ]);
  });

  // Survived a Stryker mutant (`word.length > existing.length` -> `false`) until this
  // existed: the "keep the longer spelling" branch looks unreachable, because two ASCII
  // strings sharing a lowercase key always have the same length. Unicode breaks that —
  // 'İ'.toLowerCase() is two code units ('i' + combining dot above), so both spellings
  // map to one key at different lengths and the branch decides which one survives.
  it('keeps the longer spelling when two words share a case-insensitive key', () => {
    const dotted = 'İ';
    const decomposed = dotted.toLowerCase();
    expect(decomposed.length).toBeGreaterThan(dotted.length);

    expect(dedupeWords([dotted, decomposed])).toEqual([decomposed]);
    expect(dedupeWords([decomposed, dotted])).toEqual([decomposed]);
  });

  // Survived a mutant swapping toLowerCase() for toUpperCase(). The two are not
  // interchangeable: uppercasing folds 'ß' onto 'SS', so a German name and its
  // transliteration would collapse into one entry and one of them would vanish
  // from the deck.
  it('does not fold ß onto SS', () => {
    expect(dedupeWords(['Straße', 'STRASSE'])).toEqual(['Straße', 'STRASSE']);
  });
});

describe('filterMinLength', () => {
  it('filters out words shorter than minLength', () => {
    expect(filterMinLength(['Al', 'Tom', 'Harry Potter'], 3)).toEqual([
      'Tom',
      'Harry Potter',
    ]);
  });

  it('keeps a word whose length is exactly minLength', () => {
    expect(filterMinLength(['Tom'], 3)).toEqual(['Tom']);
  });

  it('returns an empty list when nothing clears the bar', () => {
    expect(filterMinLength(['Al', 'Bo'], 3)).toEqual([]);
    expect(filterMinLength([], 3)).toEqual([]);
  });
});

describe('prepareHangmanWords', () => {
  it('dedupes and filters in one pass', () => {
    expect(prepareHangmanWords(['Al', 'Tom', 'tom', 'Harry Potter'], 3)).toEqual([
      'Tom',
      'Harry Potter',
    ]);
  });
});
