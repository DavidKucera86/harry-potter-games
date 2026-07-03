const GAME_CONFIG = {
  MAX_LIVES: 10,
  API: {
    CHARACTERS: 'https://hp-api.onrender.com/api/characters',
    SPELLS: 'https://hp-api.onrender.com/api/spells'
  },
  CACHE_TTL_MS: 60 * 60 * 1000,
  CACHE_KEYS: {
    CHARACTERS: 'hp-games-characters',
    SPELLS: 'hp-games-spells'
  }
};
