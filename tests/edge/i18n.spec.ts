import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady } from '../helpers/hangman';

test.describe('Internationalization @edge', () => {
  test('E43: switching to English updates page language and menu strings', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');

    await page.selectOption('#localeSelect', 'en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-i18n-key="menuSubtitle"]')).toContainText('Pick a game');

    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
    await page.selectOption('#localeSelect', 'en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-i18n-ui="newGame"]')).toHaveText('New game');
  });
});
