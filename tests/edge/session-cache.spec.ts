import { test, expect } from '@playwright/test';
import { clearSessionStorage, mockCharacters, mockImages, charactersFixture } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';

test.describe('Session cache @edge', () => {
  test('E12: second game reuses cached characters without new API request', { tag: '@edge' }, async ({ page }) => {
    let apiCalls = 0;

    await clearSessionStorage(page);
    await mockCharacters(page, charactersFixture);
    await mockImages(page);
    await page.route('**/api/characters', (route) => {
      apiCalls++;
      route.fulfill({ json: charactersFixture });
    });

    await page.goto('/guess-house/');
    await waitForQuizReady(page);
    expect(apiCalls).toBe(1);

    await page.goto('/who-is-on-photo/');
    await waitForQuizReady(page);
    expect(apiCalls).toBe(1);
  });
});
