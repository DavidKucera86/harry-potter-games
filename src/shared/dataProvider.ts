import { GAME_CONFIG } from './config.js';
import type { Character, Spell } from './types.js';

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/**
 * The HP API is public, third-party and outside our control, so its responses —
 * and anything we cached from them earlier — are untrusted input. Every payload
 * is checked entry by entry before the games see it; malformed entries are
 * dropped and a payload with nothing usable left throws, which puts us on the
 * existing fixture-fallback path instead of rendering garbage.
 */
type Parse<T> = (data: unknown) => T[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}

function parseList<T>(
  data: unknown,
  isValid: (item: Record<string, unknown>) => boolean,
  label: string,
): T[] {
  if (!Array.isArray(data)) {
    throw new Error(`Malformed ${label} payload: expected an array`);
  }

  const items = data.filter(item => isRecord(item) && isValid(item)) as T[];
  if (items.length === 0) {
    throw new Error(`Malformed ${label} payload: no usable entries`);
  }

  return items;
}

export function parseCharacters(data: unknown): Character[] {
  return parseList<Character>(
    data,
    item => isNonEmptyString(item.id)
      && isNonEmptyString(item.name)
      && isOptionalString(item.house)
      && isOptionalString(item.image),
    'characters',
  );
}

export function parseSpells(data: unknown): Spell[] {
  return parseList<Spell>(data, item => isNonEmptyString(item.name), 'spells');
}

export class FetchTimeoutError extends Error {
  constructor() {
    super('Fetch timeout');
    this.name = 'FetchTimeoutError';
  }
}

function getFetchTimeoutMs(): number {
  if (typeof window !== 'undefined' && window.__HP_FETCH_TIMEOUT_MS) {
    return window.__HP_FETCH_TIMEOUT_MS;
  }
  return GAME_CONFIG.FETCH_TIMEOUT_MS;
}

function getApiBudgetMs(): number {
  if (typeof window !== 'undefined' && window.__HP_API_BUDGET_MS) {
    return window.__HP_API_BUDGET_MS;
  }
  return GAME_CONFIG.API_TOTAL_BUDGET_MS;
}

function cacheStorageKey(storageKey: string): string {
  return `${storageKey}-v${GAME_CONFIG.CACHE_VERSION}`;
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: Error | undefined;

  const startedAt = Date.now();
  const budgetMs = getApiBudgetMs();
  const remainingBudget = () => budgetMs - (Date.now() - startedAt);

  for (let attempt = 0; attempt < GAME_CONFIG.API_RETRIES; attempt++) {
    const controller = new AbortController();
    // Never let one attempt outlive the budget: a hang would otherwise spend a full
    // timeout here and leave the player waiting past the point of giving up.
    const attemptTimeout = Math.min(getFetchTimeoutMs(), Math.max(remainingBudget(), 1));
    const timeoutId = setTimeout(() => controller.abort(), attemptTimeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}`);
      if (response.status < 500) {
        // Client error (4xx) — retrying won't help, stop and fall back.
        break;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new FetchTimeoutError();
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    if (attempt < GAME_CONFIG.API_RETRIES - 1) {
      if (remainingBudget() <= 0) {
        break;
      }
      await delay(GAME_CONFIG.API_RETRY_DELAY_MS * (attempt + 1));
      if (remainingBudget() <= 0) {
        break;
      }
    }
  }

  throw lastError ?? new Error('Fetch failed');
}

async function loadFallback(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fallback HTTP ${response.status}`);
  }
  return response.json();
}

async function fetchCached<T>(
  url: string,
  storageKey: string,
  parse: Parse<T>,
  fallbackUrl?: string,
): Promise<T[]> {
  const versionedKey = cacheStorageKey(storageKey);

  function writeCache(data: unknown) {
    try {
      sessionStorage.setItem(versionedKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn('Cache write failed:', error);
    }
  }

  try {
    const cachedRaw = sessionStorage.getItem(versionedKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { data: unknown; timestamp: number };
      if (Date.now() - cached.timestamp < GAME_CONFIG.CACHE_TTL_MS) {
        // Cached data is only as trustworthy as the response that produced it.
        return parse(cached.data);
      }
    }
  } catch (error) {
    console.warn('Cache read failed, fetching fresh data:', error);
  }

  let apiError: unknown;
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    const items = parse(data);
    writeCache(data);
    return items;
  } catch (error) {
    apiError = error;
    console.warn('API fetch failed, trying fallback:', error);
  }

  if (fallbackUrl) {
    try {
      const data = await loadFallback(fallbackUrl);
      const items = parse(data);
      writeCache(data);
      return items;
    } catch (fallbackError) {
      if (apiError instanceof FetchTimeoutError) {
        throw apiError;
      }
      throw fallbackError;
    }
  }

  throw apiError ?? new Error('Data unavailable');
}

export async function getCharacters(): Promise<Character[]> {
  return fetchCached(
    GAME_CONFIG.API.CHARACTERS,
    GAME_CONFIG.CACHE_KEYS.CHARACTERS,
    parseCharacters,
    GAME_CONFIG.FALLBACK.CHARACTERS,
  );
}

export async function getSpells(): Promise<Spell[]> {
  return fetchCached(
    GAME_CONFIG.API.SPELLS,
    GAME_CONFIG.CACHE_KEYS.SPELLS,
    parseSpells,
    GAME_CONFIG.FALLBACK.SPELLS,
  );
}
