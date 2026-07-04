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

  it('keeps one entry per case-insensitive match', () => {
    expect(dedupeWords(['Harry Potter', 'harry potter', 'Ron'])).toEqual([
      'Harry Potter',
      'Ron',
    ]);
  });
});

describe('filterMinLength', () => {
  it('filters out words shorter than minLength', () => {
    expect(filterMinLength(['Al', 'Tom', 'Harry Potter'], 3)).toEqual([
      'Tom',
      'Harry Potter',
    ]);
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
