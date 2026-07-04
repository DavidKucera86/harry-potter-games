import { cs } from "./locales/cs.js";
import { en } from "./locales/en.js";
const LOCALE_CHANGE_EVENT = "hp-localechange";
const locales = { cs, en };
const STORAGE_KEY = "hp-games-locale";
let currentLocale = "cs";
function isDynamicI18nElement(el) {
  if (el.id === "message") {
    return true;
  }
  return Boolean(el.closest("#loadingOverlay"));
}
function resolveLocale() {
  if (typeof window === "undefined") {
    return "cs";
  }
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get("lang");
  if (paramLang === "en" || paramLang === "cs") {
    return paramLang;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "cs") {
      return stored;
    }
  } catch {
  }
  return "cs";
}
function getLocale() {
  return currentLocale;
}
function getStrings() {
  return locales[currentLocale];
}
function getPageText(key) {
  return locales[currentLocale].pages[key];
}
function applyPageTranslations() {
  if (typeof document === "undefined") {
    return;
  }
  const strings = getStrings();
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    if (isDynamicI18nElement(el)) {
      return;
    }
    const key = el.dataset.i18nKey;
    if (!key) {
      return;
    }
    const text = strings.pages[key];
    if (text !== void 0) {
      el.textContent = text;
    }
  });
  document.querySelectorAll("[data-i18n-ui]").forEach((el) => {
    if (isDynamicI18nElement(el)) {
      return;
    }
    const key = el.dataset.i18nUi;
    if (!key) {
      return;
    }
    const text = strings.ui[key];
    if (text !== void 0) {
      el.textContent = text;
    }
  });
  document.querySelectorAll("[data-i18n-option]").forEach((el) => {
    const key = el.dataset.i18nOption;
    if (!key) {
      return;
    }
    const text = strings.ui[key];
    if (text !== void 0) {
      el.textContent = text;
    }
  });
  document.querySelectorAll("[data-i18n-ui-placeholder]").forEach((el) => {
    const key = el.dataset.i18nUiPlaceholder;
    if (!key) {
      return;
    }
    const text = strings.ui[key];
    if (text !== void 0) {
      el.placeholder = text;
    }
  });
  document.querySelectorAll("[data-i18n-a11y-label]").forEach((el) => {
    const key = el.dataset.i18nA11yLabel;
    if (!key) {
      return;
    }
    const text = strings.a11y[key];
    if (text !== void 0) {
      el.setAttribute("aria-label", text);
    }
  });
  document.querySelectorAll("[data-i18n-ui-aria-label]").forEach((el) => {
    const key = el.dataset.i18nUiAriaLabel;
    if (!key) {
      return;
    }
    const text = strings.ui[key];
    if (text !== void 0) {
      el.setAttribute("aria-label", text);
    }
  });
}
function setLocale(locale) {
  currentLocale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
  }
  document.documentElement.lang = locale;
  applyPageTranslations();
  const select = document.getElementById("localeSelect");
  if (select instanceof HTMLSelectElement) {
    select.value = locale;
  }
  document.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: { locale } }));
}
function initLocale() {
  currentLocale = resolveLocale();
  document.documentElement.lang = currentLocale;
  applyPageTranslations();
  const select = document.getElementById("localeSelect");
  if (select instanceof HTMLSelectElement) {
    select.value = currentLocale;
    select.addEventListener("change", () => {
      const value = select.value;
      if (value === "cs" || value === "en") {
        setLocale(value);
      }
    });
  }
}
export {
  LOCALE_CHANGE_EVENT,
  applyPageTranslations,
  cs,
  en,
  getLocale,
  getPageText,
  getStrings,
  initLocale,
  setLocale
};
