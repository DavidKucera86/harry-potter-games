import { describe, expect, it } from 'vitest';
import {
  getAutoRevealedLetters,
  getWordLetters,
  isGuessableLetter,
  normalizeLetter,
} from '../../src/shared/hangmanUtils.ts';

// Expected values are the base Latin letters as a reader of the alphabet knows them,
// written out by hand on purpose. Deriving them by running the same normalisation the
// implementation uses would assert nothing.
const CZECH_DIACRITICS: [string, string][] = [
  ['á', 'a'], ['č', 'c'], ['ď', 'd'], ['é', 'e'], ['ě', 'e'],
  ['í', 'i'], ['ň', 'n'], ['ó', 'o'], ['ř', 'r'], ['š', 's'],
  ['ť', 't'], ['ú', 'u'], ['ů', 'u'], ['ý', 'y'], ['ž', 'z'],
];

// The words come from the HP API, which is English with French-flavoured names —
// a Czech-only table left these silently un-guessable and revealed them for free.
const FOREIGN_DIACRITICS: [string, string][] = [
  ['ë', 'e'], ['ï', 'i'], ['â', 'a'], ['ô', 'o'], ['à', 'a'],
  ['è', 'e'], ['ü', 'u'], ['ñ', 'n'], ['å', 'a'], ['ç', 'c'],
];

describe('normalizeLetter', () => {
  it.each(CZECH_DIACRITICS)('maps the Czech %s onto %s', (letter, base) => {
    expect(normalizeLetter(letter)).toBe(base);
    expect(normalizeLetter(letter.toUpperCase())).toBe(base);
  });

  it.each(FOREIGN_DIACRITICS)('maps the non-Czech %s onto %s', (letter, base) => {
    expect(normalizeLetter(letter)).toBe(base);
  });

  it('lowercases ASCII letters', () => {
    expect(normalizeLetter('A')).toBe('a');
  });

  // Not every accented letter reduces to an ASCII one. These stay as they are and get
  // auto-revealed instead — a deliberate boundary, so record it rather than discover it.
  it.each(['ß', 'ł', 'æ', 'ø', 'đ'])('leaves %s alone, it has no ASCII base', (letter) => {
    expect(normalizeLetter(letter)).toBe(letter);
    expect(isGuessableLetter(letter)).toBe(false);
  });
});

describe('the Czech alphabet is playable from an ASCII keyboard', () => {
  it.each(CZECH_DIACRITICS.map(([letter]) => letter))('%s can be guessed', (letter) => {
    expect(isGuessableLetter(letter)).toBe(true);
  });

  it('never auto-reveals a letter a player could type', () => {
    const word = CZECH_DIACRITICS.map(([letter]) => letter).join('');
    expect([...getAutoRevealedLetters(word)]).toEqual([]);
  });
});

describe('getWordLetters', () => {
  it('removes spaces but keeps special characters', () => {
    expect(getWordLetters("O'Brien")).toEqual(["O", "'", 'B', 'r', 'i', 'e', 'n']);
    expect(getWordLetters('Harry Potter')).toEqual(['H', 'a', 'r', 'r', 'y', 'P', 'o', 't', 't', 'e', 'r']);
  });
});

describe('isGuessableLetter', () => {
  // The anchors in the rule are what make this a *letter* check rather than a
  // contains-a-letter check. Without them a pasted word counts as a guess.
  it.each(['ab', 'ea', 'a ', ' a', 'abc'])('rejects %o — more than one letter is not a letter', (input) => {
    expect(isGuessableLetter(input)).toBe(false);
  });

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
