import { GAME_CONFIG } from './config.js';

export class FetchTimeoutError extends Error {
  constructor() {
    super('Fetch timeout');
    this.name = 'FetchTimeoutError';
  }
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    GAME_CONFIG.FETCH_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new FetchTimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchCached(url, storageKey) {
  try {
    const cachedRaw = sessionStorage.getItem(storageKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.timestamp < GAME_CONFIG.CACHE_TTL_MS) {
        return cached.data;
      }
    }
  } catch (error) {
    console.warn('Cache read failed, fetching fresh data:', error);
  }

  const data = await fetchWithTimeout(url);

  try {
    sessionStorage.setItem(storageKey, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.warn('Cache write failed:', error);
  }

  return data;
}

export async function getCharacters() {
  return fetchCached(GAME_CONFIG.API.CHARACTERS, GAME_CONFIG.CACHE_KEYS.CHARACTERS);
}

export async function getSpells() {
  return fetchCached(GAME_CONFIG.API.SPELLS, GAME_CONFIG.CACHE_KEYS.SPELLS);
}
