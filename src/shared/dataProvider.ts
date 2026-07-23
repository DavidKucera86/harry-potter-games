import { GAME_CONFIG } from './config.js';
import type { Character } from './types.js';

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
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

function cacheStorageKey(storageKey: string): string {
  return `${storageKey}-v${GAME_CONFIG.CACHE_VERSION}`;
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < GAME_CONFIG.API_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), getFetchTimeoutMs());

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
      await delay(GAME_CONFIG.API_RETRY_DELAY_MS * (attempt + 1));
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

async function fetchCached(
  url: string,
  storageKey: string,
  fallbackUrl?: string,
): Promise<unknown> {
  const versionedKey = cacheStorageKey(storageKey);

  try {
    const cachedRaw = sessionStorage.getItem(versionedKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { data: unknown; timestamp: number };
      if (Date.now() - cached.timestamp < GAME_CONFIG.CACHE_TTL_MS) {
        return cached.data;
      }
    }
  } catch (error) {
    console.warn('Cache read failed, fetching fresh data:', error);
  }

  let apiError: unknown;
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();

    try {
      sessionStorage.setItem(versionedKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn('Cache write failed:', error);
    }

    return data;
  } catch (error) {
    apiError = error;
    console.warn('API fetch failed, trying fallback:', error);
  }

  if (fallbackUrl) {
    try {
      const data = await loadFallback(fallbackUrl);
      try {
        sessionStorage.setItem(versionedKey, JSON.stringify({
          data,
          timestamp: Date.now(),
        }));
      } catch (error) {
        console.warn('Cache write failed:', error);
      }
      return data;
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
    GAME_CONFIG.FALLBACK.CHARACTERS,
  ) as Promise<Character[]>;
}

export async function getSpells(): Promise<{ name: string }[]> {
  return fetchCached(
    GAME_CONFIG.API.SPELLS,
    GAME_CONFIG.CACHE_KEYS.SPELLS,
    GAME_CONFIG.FALLBACK.SPELLS,
  ) as Promise<{ name: string }[]>;
}
