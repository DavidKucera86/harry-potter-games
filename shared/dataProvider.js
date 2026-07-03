async function fetchCached(url, storageKey) {
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

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Cache write failed:', error);
  }

  return data;
}

async function getCharacters() {
  return fetchCached(GAME_CONFIG.API.CHARACTERS, GAME_CONFIG.CACHE_KEYS.CHARACTERS);
}

async function getSpells() {
  return fetchCached(GAME_CONFIG.API.SPELLS, GAME_CONFIG.CACHE_KEYS.SPELLS);
}
