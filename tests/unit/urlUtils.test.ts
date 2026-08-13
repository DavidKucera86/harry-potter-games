import { describe, expect, it } from 'vitest';
import { isSafeImageUrl } from '../../src/shared/urlUtils.ts';

describe('isSafeImageUrl', () => {
  it.each([
    'https://static.wikia.nocookie.net/harrypotter/images/harry.png',
    'https://hp-api.local/albus.png',
    '/shared/fixtures/characters.json',
    '/shared/icons/icon.svg',
  ])('accepts %s', (url) => {
    expect(isSafeImageUrl(url)).toBe(true);
  });

  it.each([
    ['javascript: URL', 'javascript:alert(1)'],
    ['javascript: URL in mixed case', 'JavaScript:alert(1)'],
    ['javascript: URL with leading whitespace', '  javascript:alert(1)'],
    ['data: URL', 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='],
    ['plain http URL', 'http://example.com/harry.png'],
    ['protocol-relative URL', '//evil.example/harry.png'],
    ['relative path', 'shared/fixtures/harry.png'],
    ['empty string', ''],
    ['whitespace only', '   '],
  ])('rejects a %s', (_label, url) => {
    expect(isSafeImageUrl(url)).toBe(false);
  });

  it.each([[null], [undefined], [42], [{}], [['https://hp-api.local/a.png']]])(
    'rejects the non-string value %s',
    (value) => {
      expect(isSafeImageUrl(value)).toBe(false);
    },
  );
});
