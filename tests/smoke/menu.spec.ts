import { test, expect } from '@playwright/test';
import { selectors } from '../helpers/selectors';

test.describe('Menu @smoke', () => {
  test('S1: menu page loads with game cards and footer', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
    await expect(page.locator(selectors.gameCard)).toHaveCount(4);
    await expect(page.locator('.bmc-link')).toHaveAttribute(
      'href',
      'https://buymeacoffee.com/dvdkcrb'
    );
    await expect(page.getByRole('heading', { name: 'Harry Potter Games' })).toBeVisible();
  });

  test('S2: navigation from menu to each game', { tag: '@smoke' }, async ({ page }) => {
    const games = [
      { href: 'guess-character-name/', title: /Hádej postavu/ },
      { href: 'guess-house/', title: /Hádej kolej/ },
      { href: 'guess-spell/', title: /Hádej zaklínadlo/ },
      { href: 'who-is-on-photo/', title: /Kdo je na fotce/ },
    ];

    for (const game of games) {
      await page.goto('/');
      await page.locator(`a.game-card[href="${game.href}"]`).click();
      await expect(page).toHaveURL(new RegExp(game.href));
      await expect(page.locator('h1')).toBeVisible();
      await expect(page).toHaveTitle(game.title);
    }
  });
});
