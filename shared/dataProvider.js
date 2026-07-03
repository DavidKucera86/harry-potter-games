import { GAME_CONFIG } from './config.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cacheStorageKey(storageKey) {
  return `${storageKey}-v${GAME_CONFIG.CACHE_VERSION}`;
}

async function fetchWithRetry(url) {
  let lastError;

  for (let attempt = 0; attempt < GAME_CONFIG.API_RETRIES; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
      if (response.status < 500) {
        throw lastError;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < GAME_CONFIG.API_RETRIES - 1) {
      await delay(GAME_CONFIG.API_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError ?? new Error('Fetch failed');
}

async function fetchCached(url, storageKey) {
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
}

export async function getCharacters() {
  return fetchCached(GAME_CONFIG.API.CHARACTERS, GAME_CONFIG.CACHE_KEYS.CHARACTERS);
}

export async function getSpells() {
  return fetchCached(GAME_CONFIG.API.SPELLS, GAME_CONFIG.CACHE_KEYS.SPELLS);
}
