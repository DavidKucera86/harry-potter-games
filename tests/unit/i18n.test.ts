import { describe, expect, it } from 'vitest';
import { getLocale, getStrings, setLocale } from '../../src/shared/i18n/index.ts';

describe('i18n', () => {
  it('defaults to Czech strings', () => {
    expect(getLocale()).toBe('cs');
    expect(getStrings().quiz.loseTitle).toBe('Došly životy!');
  });

  it('switches to English strings', () => {
    setLocale('en');
    expect(getStrings().quiz.loseTitle).toBe('Out of lives!');
    setLocale('cs');
  });
});
