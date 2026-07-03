import { GAME_CONFIG } from './config.js';

async function loadFallback(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fallback HTTP ${response.status}`);
  }
  return response.json();
}

function readCache(storageKey) {
  try {
    const cachedRaw = sessionStorage.getItem(storageKey);
    if (!cachedRaw) return null;

    const cached = JSON.parse(cachedRaw);
    if (Date.now() - cached.timestamp < GAME_CONFIG.CACHE_TTL_MS) {
      return cached.data;
    }
  } catch (error) {
    console.warn('Cache read failed:', error);
  }
  return null;
}

function writeCache(storageKey, data) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.warn('Cache write failed:', error);
  }
}

async function fetchCached(url, storageKey, fallbackUrl) {
  const cached = readCache(storageKey);
  if (cached) return cached;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    writeCache(storageKey, data);
    return data;
  } catch (error) {
    console.warn('API fetch failed, trying fallback:', error);
  }

  if (fallbackUrl) {
    const data = await loadFallback(fallbackUrl);
    writeCache(storageKey, data);
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
