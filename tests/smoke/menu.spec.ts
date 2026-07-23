import { test, expect } from '@playwright/test';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Menu @smoke', () => {
  test('S01.01: menu page loads with game cards and footer', { tag: '@smoke' }, async ({ page }) => {
    await given('uživatel otevře hlavní menu', async () => {
      await page.goto('/');
    });

    await then('stránka je v češtině a zobrazí šest herních karet', async () => {
      await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
      await expect(page.locator(selectors.gameCard)).toHaveCount(6);
    });

    await then('footer obsahuje odkaz Buy Me a Coffee a nadpis stránky', async () => {
      await expect(page.locator('.bmc-link')).toHaveAttribute(
        'href',
        'https://buymeacoffee.com/dvdkcrb'
      );
      await expect(page.getByRole('heading', { name: 'Harry Potter Games' })).toBeVisible();
    });
  });

  test('S02.01: navigation from menu to each game', { tag: '@smoke' }, async ({ page }) => {
    const games = [
      { href: 'guess-character-name/', title: /Hádej postavu/ },
      { href: 'guess-house/', title: /Hádej kolej/ },
      { href: 'guess-spell/', title: /Hádej zaklínadlo/ },
      { href: 'who-is-on-photo/', title: /Kdo je na fotce/ },
      { href: 'rock-paper-scissors/', title: /Kámen, nůžky, papír/ },
      { href: 'chat-with-character/', title: /Chat s postavou/ },
    ];

    for (const game of games) {
      await given('uživatel je na hlavním menu', async () => {
        await page.goto('/');
      });

      await when(`uživatel klikne na kartu hry ${game.href}`, async () => {
        await page.locator(`a.game-card[href="${game.href}"]`).click();
      });

      await then('otevře se správná hra s viditelným nadpisem', async () => {
        await expect(page).toHaveURL(new RegExp(game.href));
        await expect(page.locator('h1')).toBeVisible();
        await expect(page).toHaveTitle(game.title);
      });
    }
  });
});
