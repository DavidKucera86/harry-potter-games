const APP_VERSION = "9";
const GAME_CONFIG = {
  MAX_LIVES: 10,
  ROUND_DELAY_MS: 1200,
  RPS_ROUND_DELAY_MS: 2800,
  FETCH_TIMEOUT_MS: 15e3,
  API: {
    CHARACTERS: "https://hp-api.onrender.com/api/characters",
    SPELLS: "https://hp-api.onrender.com/api/spells"
  },
  FALLBACK: {
    CHARACTERS: "/shared/fixtures/characters.json",
    SPELLS: "/shared/fixtures/spells.json"
  },
  CACHE_TTL_MS: 60 * 60 * 1e3,
  CACHE_VERSION: APP_VERSION,
  SW_CACHE_NAME: `hp-games-v${APP_VERSION}`,
  API_RETRIES: 3,
  /**
   * Ceiling on the *whole* load, retries included. Without it a connection that hangs
   * rather than fails costs one full FETCH_TIMEOUT_MS per attempt — measured at 48 s
   * against the Docker build, with the local fixtures sitting there unused the whole
   * time (exploratory charter #1, docs/EXPLORATORY-CHARTERS.md). A flaky connection
   * fails fast and still gets every retry; only a hanging one is cut short.
   */
  API_TOTAL_BUDGET_MS: 15e3,
  /**
   * The fixtures are same-origin static files, so they answer in milliseconds — unless
   * the network hangs on a first visit before the service worker has precached them.
   * Without a bound of its own the fallback would hang forever and undo the budget above.
   */
  FIXTURE_TIMEOUT_MS: 5e3,
  API_RETRY_DELAY_MS: 1e3,
  /** Min gap between data-load attempts, so hammering "New game" can't flood the API. */
  NEW_GAME_COOLDOWN_MS: 1e3,
  MIN_WORD_LENGTH: 3,
  WINS_TO_MATCH: 5,
  PHOTO_LOAD_TIMEOUT_MS: 2e3,
  MAX_IMAGE_ERRORS: 10,
  CACHE_KEYS: {
    CHARACTERS: "hp-games-characters",
    SPELLS: "hp-games-spells"
  }
};
export {
  APP_VERSION,
  GAME_CONFIG
};
