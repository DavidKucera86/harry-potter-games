export const GAME_CONFIG = {
  MAX_LIVES: 10,
  ROUND_DELAY_MS: 1200,
  FETCH_TIMEOUT_MS: 15_000,
  API: {
    CHARACTERS: 'https://hp-api.onrender.com/api/characters',
    SPELLS: 'https://hp-api.onrender.com/api/spells',
  },
  FALLBACK: {
    CHARACTERS: '/shared/fixtures/characters.json',
    SPELLS: '/shared/fixtures/spells.json',
  },
  CACHE_TTL_MS: 60 * 60 * 1000,
  CACHE_VERSION: '2',
  API_RETRIES: 3,
  API_RETRY_DELAY_MS: 1000,
  MAX_IMAGE_ERRORS: 10,
  CACHE_KEYS: {
    CHARACTERS: 'hp-games-characters',
    SPELLS: 'hp-games-spells',
  },
};
