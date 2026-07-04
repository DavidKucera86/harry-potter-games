import { expect, type Page } from '@playwright/test';
import { cs } from '../../src/shared/i18n/locales/cs.ts';
import { en } from '../../src/shared/i18n/locales/en.ts';

export type Locale = 'cs' | 'en';

const locales = { cs, en };

type BindingKind = 'pages-text' | 'ui-text' | 'ui-placeholder' | 'a11y-aria-label' | 'ui-aria-label';

interface PageBinding {
  kind: BindingKind;
  key: string;
  actual: string;
  selector: string;
}

interface LocaleMismatch extends PageBinding {
  expected: string;
}

export function getLocaleString(locale: Locale, path: string): string {
  const parts = path.split('.');
  let value: unknown = locales[locale];

  for (const part of parts) {
    value = (value as Record<string, unknown>)[part];
  }

  if (typeof value !== 'string') {
    throw new Error(`Locale path "${path}" is not a string`);
  }

  return value;
}

function getExpectedString(locale: Locale, kind: BindingKind, key: string): string | undefined {
  const strings = locales[locale];

  switch (kind) {
    case 'pages-text':
      return strings.pages[key as keyof typeof strings.pages];
    case 'ui-text':
    case 'ui-placeholder':
    case 'ui-aria-label':
      return strings.ui[key as keyof typeof strings.ui];
    case 'a11y-aria-label':
      return strings.a11y[key as keyof typeof strings.a11y];
  }
}

export async function assertPageLocaleConsistency(page: Page, locale: Locale): Promise<void> {
  const bindings = await page.evaluate(() => {
    const results: PageBinding[] = [];

    function describe(el: Element): string {
      const parts: string[] = [];
      if (el.id) {
        parts.push(`#${el.id}`);
      }
      if (el.className && typeof el.className === 'string') {
        parts.push(`.${el.className.split(' ')[0]}`);
      }
      return parts.join('') || el.tagName.toLowerCase();
    }

    function isDynamicI18nElement(el: Element): boolean {
      if (el.id === 'message') {
        return true;
      }

      return Boolean(el.closest('#loadingOverlay'));
    }

    document.querySelectorAll('[data-i18n-key]').forEach((el) => {
      if (isDynamicI18nElement(el)) {
        return;
      }

      results.push({
        kind: 'pages-text',
        key: (el as HTMLElement).dataset.i18nKey ?? '',
        actual: (el.textContent ?? '').trim(),
        selector: describe(el),
      });
    });

    document.querySelectorAll('[data-i18n-ui]').forEach((el) => {
      if (isDynamicI18nElement(el)) {
        return;
      }

      results.push({
        kind: 'ui-text',
        key: (el as HTMLElement).dataset.i18nUi ?? '',
        actual: (el.textContent ?? '').trim(),
        selector: describe(el),
      });
    });

    document.querySelectorAll('[data-i18n-ui-placeholder]').forEach((el) => {
      if (isDynamicI18nElement(el)) {
        return;
      }

      results.push({
        kind: 'ui-placeholder',
        key: (el as HTMLInputElement).dataset.i18nUiPlaceholder ?? '',
        actual: (el as HTMLInputElement).placeholder,
        selector: describe(el),
      });
    });

    document.querySelectorAll('[data-i18n-a11y-label]').forEach((el) => {
      if (isDynamicI18nElement(el)) {
        return;
      }

      results.push({
        kind: 'a11y-aria-label',
        key: (el as HTMLElement).dataset.i18nA11yLabel ?? '',
        actual: el.getAttribute('aria-label') ?? '',
        selector: describe(el),
      });
    });

    document.querySelectorAll('[data-i18n-ui-aria-label]').forEach((el) => {
      if (isDynamicI18nElement(el)) {
        return;
      }

      results.push({
        kind: 'ui-aria-label',
        key: (el as HTMLElement).dataset.i18nUiAriaLabel ?? '',
        actual: el.getAttribute('aria-label') ?? '',
        selector: describe(el),
      });
    });

    return results;
  });

  const mismatches: LocaleMismatch[] = bindings.flatMap((binding) => {
    const expected = getExpectedString(locale, binding.kind, binding.key);

    if (expected === undefined) {
      return [{ ...binding, expected: '<missing key>' }];
    }

    if (binding.actual !== expected) {
      return [{ ...binding, expected }];
    }

    return [];
  });

  expect(
    mismatches,
    mismatches.map(
      mismatch => `${mismatch.selector} [${mismatch.kind}:${mismatch.key}] expected "${mismatch.expected}", got "${mismatch.actual}"`,
    ).join('\n'),
  ).toEqual([]);
}
