import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { Window } from 'happy-dom';
import { getLocale, getStrings, setLocale, applyPageTranslations } from '../../src/shared/i18n/index.ts';

describe('i18n', () => {
  let window: Window;
  let originalDocument: Document;
  let originalWindow: Window & typeof globalThis;

  beforeEach(() => {
    window = new Window();
    originalDocument = globalThis.document;
    originalWindow = globalThis.window;
    globalThis.document = window.document as unknown as Document;
    globalThis.window = window as unknown as Window & typeof globalThis;
    setLocale('cs');
  });

  afterEach(() => {
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
    window.close();
    setLocale('cs');
  });

  it('defaults to Czech strings', () => {
    expect(getLocale()).toBe('cs');
    expect(getStrings().quiz.loseTitle).toBe('Došly životy!');
  });

  it('switches to English strings', () => {
    setLocale('en');
    expect(getStrings().quiz.loseTitle).toBe('Out of lives!');
    setLocale('cs');
  });

  it('applies placeholder and aria-label translations', () => {
    document.body.innerHTML = `
      <input id="letterInput" data-i18n-ui-placeholder="letterPlaceholder" data-i18n-ui-aria-label="letterPlaceholder">
      <div id="wordDisplay" data-i18n-a11y-label="wordDisplayLabel"></div>
    `;

    setLocale('en');
    applyPageTranslations();

    const input = document.getElementById('letterInput') as HTMLInputElement;
    const wordDisplay = document.getElementById('wordDisplay');

    expect(input.placeholder).toBe('Enter a letter');
    expect(input.getAttribute('aria-label')).toBe('Enter a letter');
    expect(wordDisplay?.getAttribute('aria-label')).toBe('Word to guess');
  });
});
