import { cs, type LocaleStrings } from './locales/cs.js';
import { en } from './locales/en.js';

export type Locale = 'cs' | 'en';

const locales: Record<Locale, LocaleStrings> = { cs, en };
const STORAGE_KEY = 'hp-games-locale';

type PageKey = keyof LocaleStrings['pages'];

let currentLocale: Locale = 'cs';

function resolveLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'cs';
  }

  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  if (paramLang === 'en' || paramLang === 'cs') {
    return paramLang;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'cs') {
      return stored;
    }
  } catch {
    // ignore storage errors
  }

  return 'cs';
}

export function getLocale(): Locale {
  return currentLocale;
}

export function getStrings(): LocaleStrings {
  return locales[currentLocale];
}

export function getPageText(key: PageKey): string {
  return locales[currentLocale].pages[key];
}

export function applyPageTranslations(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const strings = getStrings();

  document.querySelectorAll<HTMLElement>('[data-i18n-key]').forEach((el) => {
    const key = el.dataset.i18nKey as PageKey | undefined;
    if (!key) {
      return;
    }

    const text = strings.pages[key];
    if (text !== undefined) {
      el.textContent = text;
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-ui]').forEach((el) => {
    const key = el.dataset.i18nUi as keyof LocaleStrings['ui'] | undefined;
    if (!key) {
      return;
    }

    const text = strings.ui[key];
    if (text !== undefined) {
      el.textContent = text;
    }
  });

  document.querySelectorAll<HTMLOptionElement>('[data-i18n-option]').forEach((el) => {
    const key = el.dataset.i18nOption as keyof LocaleStrings['ui'] | undefined;
    if (!key) {
      return;
    }

    const text = strings.ui[key];
    if (text !== undefined) {
      el.textContent = text;
    }
  });
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;

  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore storage errors
  }

  document.documentElement.lang = locale;
  applyPageTranslations();

  const select = document.getElementById('localeSelect');
  if (select instanceof HTMLSelectElement) {
    select.value = locale;
  }
}

export function initLocale(): void {
  currentLocale = resolveLocale();
  document.documentElement.lang = currentLocale;
  applyPageTranslations();

  const select = document.getElementById('localeSelect');
  if (select instanceof HTMLSelectElement) {
    select.value = currentLocale;
    select.addEventListener('change', () => {
      const value = select.value;
      if (value === 'cs' || value === 'en') {
        setLocale(value);
      }
    });
  }
}

export { cs, en };
export type { LocaleStrings };
