import { describe, expect, it, vi } from 'vitest';
import {
  getAutoRevealedLetters,
  getWordLetters,
  isGuessableLetter,
  normalizeLetter,
} from '../../src/shared/hangmanUtils.ts';

describe('normalizeLetter', () => {
  it('normalizes Czech diacritics', () => {
    expect(normalizeLetter('É')).toBe('e');
    expect(normalizeLetter('ř')).toBe('r');
  });

  it('lowercases ASCII letters', () => {
    expect(normalizeLetter('A')).toBe('a');
  });
});

describe('getWordLetters', () => {
  it('removes spaces but keeps special characters', () => {
    expect(getWordLetters("O'Brien")).toEqual(["O", "'", 'B', 'r', 'i', 'e', 'n']);
    expect(getWordLetters('Harry Potter')).toEqual(['H', 'a', 'r', 'r', 'y', 'P', 'o', 't', 't', 'e', 'r']);
  });
});

describe('isGuessableLetter', () => {
  it('returns true for letters and false for punctuation', () => {
    expect(isGuessableLetter('a')).toBe(true);
    expect(isGuessableLetter('é')).toBe(true);
    expect(isGuessableLetter("'")).toBe(false);
    expect(isGuessableLetter('-')).toBe(false);
  });
});

describe('getAutoRevealedLetters', () => {
  it('reveals non-guessable characters', () => {
    const revealed = getAutoRevealedLetters("O'Brien-Smith");
    expect(revealed.has("'")).toBe(true);
    expect(revealed.has('-')).toBe(true);
    expect(revealed.has('o')).toBe(false);
  });
});
