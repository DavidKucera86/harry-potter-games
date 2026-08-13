import { GAME_CONFIG } from "./config.js";
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}
function isOptionalString(value) {
  return value === void 0 || typeof value === "string";
}
function parseList(data, isValid, label) {
  if (!Array.isArray(data)) {
    throw new Error(`Malformed ${label} payload: expected an array`);
  }
  const items = data.filter((item) => isRecord(item) && isValid(item));
  if (items.length === 0) {
    throw new Error(`Malformed ${label} payload: no usable entries`);
  }
  return items;
}
function parseCharacters(data) {
  return parseList(
    data,
    (item) => isNonEmptyString(item.id) && isNonEmptyString(item.name) && isOptionalString(item.house) && isOptionalString(item.image),
    "characters"
  );
}
function parseSpells(data) {
  return parseList(data, (item) => isNonEmptyString(item.name), "spells");
}
class FetchTimeoutError extends Error {
  constructor() {
    super("Fetch timeout");
    this.name = "FetchTimeoutError";
  }
}
function getFetchTimeoutMs() {
  if (typeof window !== "undefined" && window.__HP_FETCH_TIMEOUT_MS) {
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
        break;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new FetchTimeoutError();
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    if (attempt < GAME_CONFIG.API_RETRIES - 1) {
      await delay(GAME_CONFIG.API_RETRY_DELAY_MS * (attempt + 1));
    }
  }
  throw lastError ?? new Error("Fetch failed");
}
async function loadFallback(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fallback HTTP ${response.status}`);
  }
  return response.json();
}
async function fetchCached(url, storageKey, parse, fallbackUrl) {
  const versionedKey = cacheStorageKey(storageKey);
  function writeCache(data) {
    try {
      sessionStorage.setItem(versionedKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn("Cache write failed:", error);
    }
  }
  try {
    const cachedRaw = sessionStorage.getItem(versionedKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.timestamp < GAME_CONFIG.CACHE_TTL_MS) {
        return parse(cached.data);
      }
    }
  } catch (error) {
    console.warn("Cache read failed, fetching fresh data:", error);
  }
  let apiError;
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    const items = parse(data);
    writeCache(data);
    return items;
  } catch (error) {
    apiError = error;
    console.warn("API fetch failed, trying fallback:", error);
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
  throw apiError ?? new Error("Data unavailable");
}
async function getCharacters() {
  return fetchCached(
    GAME_CONFIG.API.CHARACTERS,
    GAME_CONFIG.CACHE_KEYS.CHARACTERS,
    parseCharacters,
    GAME_CONFIG.FALLBACK.CHARACTERS
  );
}
async function getSpells() {
  return fetchCached(
    GAME_CONFIG.API.SPELLS,
    GAME_CONFIG.CACHE_KEYS.SPELLS,
    parseSpells,
    GAME_CONFIG.FALLBACK.SPELLS
  );
}
export {
  FetchTimeoutError,
  getCharacters,
  getSpells,
  parseCharacters,
  parseSpells
};
