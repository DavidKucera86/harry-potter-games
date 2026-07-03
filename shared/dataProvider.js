import { GAME_CONFIG } from './config.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class FetchTimeoutError extends Error {
  constructor() {
    super('Fetch timeout');
    this.name = 'FetchTimeoutError';
  }
}

function getFetchTimeoutMs() {
  if (typeof window !== 'undefined' && window.__HP_FETCH_TIMEOUT_MS) {
    return window.__HP_FETCH_TIMEOUT_MS;
  }
  return GAME_CONFIG.FETCH_TIMEOUT_MS;
}

function cacheStorageKey(storageKey) {
  return `${storageKey}-v${GAME_CONFIG.CACHE_VERSION}`;
}

async function fetchWithRetry(url) {
  let lastError;

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
        throw lastError;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new FetchTimeoutError();
        throw lastError;
      }

      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < GAME_CONFIG.API_RETRIES - 1) {
      await delay(GAME_CONFIG.API_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError ?? new Error('Fetch failed');
}

async function loadFallback(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fallback HTTP ${response.status}`);
  }
  return response.json();
}

async function fetchCached(url, storageKey, fallbackUrl) {
  const versionedKey = cacheStorageKey(storageKey);

  try {
    const cachedRaw = sessionStorage.getItem(versionedKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.timestamp < GAME_CONFIG.CACHE_TTL_MS) {
        return cached.data;
      }
    }
  } catch (error) {
    console.warn('Cache read failed, fetching fresh data:', error);
  }

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
    if (error instanceof FetchTimeoutError) {
      throw error;
    }
    console.warn('API fetch failed, trying fallback:', error);
  }

  if (fallbackUrl) {
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
  }

  throw new Error('Data unavailable');
}

export async function getCharacters() {
  return fetchCached(
    GAME_CONFIG.API.CHARACTERS,
    GAME_CONFIG.CACHE_KEYS.CHARACTERS,
    GAME_CONFIG.FALLBACK.CHARACTERS,
  );
}

export async function getSpells() {
  return fetchCached(
    GAME_CONFIG.API.SPELLS,
    GAME_CONFIG.CACHE_KEYS.SPELLS,
    GAME_CONFIG.FALLBACK.SPELLS,
  );
}
