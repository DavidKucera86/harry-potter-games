export const VERSION = '1.3.0';

const defaultFetchTimeoutMs = 15_000;

export const GAME_CONFIG = {
  VERSION,
  MAX_LIVES: 10,
  ROUND_DELAY_MS: 1200,
  get FETCH_TIMEOUT_MS() {
    if (typeof window !== 'undefined' && window.__HP_FETCH_TIMEOUT_MS != null) {
      return window.__HP_FETCH_TIMEOUT_MS;
    }
    return defaultFetchTimeoutMs;
  },
  MAX_CONSECUTIVE_IMAGE_ERRORS: 10,
  MIN_PHOTO_CHARACTERS: 4,
  API: {
    CHARACTERS: 'https://hp-api.onrender.com/api/characters',
    SPELLS: 'https://hp-api.onrender.com/api/spells',
  },
  CACHE_TTL_MS: 60 * 60 * 1000,
  CACHE_KEYS: {
    CHARACTERS: 'hp-games-characters',
    SPELLS: 'hp-games-spells',
  },
};
