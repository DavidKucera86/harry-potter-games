export const GAME_CONFIG = {
  MAX_LIVES: 10,
  API: {
    CHARACTERS: 'https://hp-api.onrender.com/api/characters',
    SPELLS: 'https://hp-api.onrender.com/api/spells',
  },
  FALLBACK: {
    CHARACTERS: '/shared/fixtures/characters.json',
    SPELLS: '/shared/fixtures/spells.json',
  },
  CACHE_TTL_MS: 60 * 60 * 1000,
  CACHE_KEYS: {
    CHARACTERS: 'hp-games-characters',
    SPELLS: 'hp-games-spells',
  },
};

export const HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

export const HOUSE_CLASSES = {
  Gryffindor: 'house-gryffindor',
  Slytherin: 'house-slytherin',
  Ravenclaw: 'house-ravenclaw',
  Hufflepuff: 'house-hufflepuff',
};
