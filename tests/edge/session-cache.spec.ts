import { test, expect } from '@playwright/test';
import { mockImages, charactersFixture } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';

test.describe('Session cache @edge', () => {
  test('E12: second game reuses cached characters without new API request', { tag: '@edge' }, async ({ page }) => {
    let apiCalls = 0;

    await given('API postav je mockované a první hra načte data', async () => {
      await mockImages(page);
      await page.route('**/api/characters', (route) => {
        apiCalls++;
        route.fulfill({ json: charactersFixture });
      });

      await page.goto('/guess-house/');
      await waitForQuizReady(page);
    });

    await then('proběhne právě jeden API request', async () => {
      expect(apiCalls).toBe(1);
    });

    await when('uživatel přejde do druhé hry ve stejné session', async () => {
      await page.goto('/who-is-on-photo/');
      await waitForQuizReady(page);
    });

    await then('data se načtou z cache bez dalšího API requestu', async () => {
      expect(apiCalls).toBe(1);
    });
  });
});
