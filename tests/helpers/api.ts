import { Page } from '@playwright/test';
import charactersFixture from '../../shared/fixtures/characters.json' with { type: 'json' };
import spellsFixture from '../../shared/fixtures/spells.json' with { type: 'json' };

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

export type Character = {
  id: string;
  name: string;
  house: string;
  image: string;
};

export type Spell = {
  name: string;
};

export async function clearSessionStorage(page: Page) {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
}

export async function mockCharacters(page: Page, data: Character[] = charactersFixture) {
  await page.route('**/api/characters', (route) => {
    route.fulfill({ json: data });
  });
}

export async function mockSpells(page: Page, data: Spell[] = spellsFixture) {
  await page.route('**/api/spells', (route) => {
    route.fulfill({ json: data });
  });
}

export async function mockImages(page: Page) {
  await page.route(/\.(png|jpe?g|webp)(\?.*)?$/i, (route) => {
    route.fulfill({
      contentType: 'image/png',
      body: PNG_1X1,
    });
  });
}

export async function mockFallbackFailure(page: Page, endpoint: 'characters' | 'spells') {
  await page.route(`**/shared/fixtures/${endpoint}.json`, (route) => {
    route.fulfill({ status: 500, body: 'Fallback unavailable' });
  });
}

export async function mockApiFailure(page: Page, endpoint: 'characters' | 'spells') {
  await page.route(`**/api/${endpoint}`, (route) => {
    route.fulfill({ status: 500, body: 'Internal Server Error' });
  });
}

export async function seedRandom(page: Page, value = 0) {
  await page.addInitScript((randomValue) => {
    Math.random = () => randomValue;
  }, value);
}

export async function setFetchTimeout(page: Page, timeoutMs: number) {
  await page.addInitScript((timeout) => {
    window.__HP_FETCH_TIMEOUT_MS = timeout;
  }, timeoutMs);
}

export async function mockFetchHang(page: Page, endpoint: 'characters' | 'spells') {
  await page.route(`**/api/${endpoint}`, async () => {
    await new Promise(() => {});
  });
}

export async function setupGameMocks(page: Page, options: {
  characters?: Character[];
  spells?: Spell[];
  mockImages?: boolean;
  random?: number;
} = {}) {
  await clearSessionStorage(page);
  if (options.characters) {
    await mockCharacters(page, options.characters);
  } else {
    await mockCharacters(page);
  }
  if (options.spells) {
    await mockSpells(page, options.spells);
  }
  if (options.mockImages !== false) {
    await mockImages(page);
  }
  if (options.random !== undefined) {
    await seedRandom(page, options.random);
  }
}

export { charactersFixture, spellsFixture };
