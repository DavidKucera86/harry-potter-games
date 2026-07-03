import { test, expect } from '@playwright/test';
import { clearSessionStorage, mockApiFailure, mockImages } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Offline fallback @edge', () => {
  test('E20: game loads from local fixture when API fails', { tag: '@edge' }, async ({ page }) => {
    await clearSessionStorage(page);
    await mockApiFailure(page, 'characters');
    await mockImages(page);
    await page.goto('/guess-house/');
    await waitForQuizReady(page);

    await expect(page.locator(selectors.loadingOverlay)).toBeHidden();
    await expect(page.locator(selectors.characterName)).not.toBeEmpty();
    await expect(page.locator(selectors.choices)).toHaveCount(4);
  });
});
