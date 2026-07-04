import { test, expect, type Page } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import {
  assertPageLocaleConsistency,
  getLocaleString,
  type Locale,
} from '../helpers/i18nConsistency';

const pages: Array<{
  path: string;
  ready: ((page: Page) => Promise<void>) | null;
  messageKey?: string;
}> = [
  { path: '/', ready: null },
  { path: '/guess-character-name/', ready: waitForHangmanReady, messageKey: 'hangman.guessCharacter' },
  { path: '/guess-spell/', ready: waitForHangmanReady, messageKey: 'hangman.guessSpell' },
  { path: '/guess-house/', ready: waitForQuizReady, messageKey: 'quiz.housePrompt' },
  { path: '/who-is-on-photo/', ready: waitForQuizReady, messageKey: 'quiz.photoPrompt' },
];

test.describe('Internationalization @edge', () => {
  for (const locale of ['cs', 'en'] as const satisfies Locale[]) {
    for (const { path, ready, messageKey } of pages) {
      test(`E43: ${path} — po přepnutí na ${locale} jsou všechny statické texty konzistentní`, { tag: '@edge' }, async ({ page }) => {
        await setupGameMocks(page);
        await page.goto(path);
        if (ready) {
          await ready(page);
        }

        await page.selectOption('#localeSelect', locale);
        await expect(page.locator('html')).toHaveAttribute('lang', locale);

        await assertPageLocaleConsistency(page, locale);

        if (messageKey) {
          await expect(page.locator('#message')).toHaveText(getLocaleString(locale, messageKey));
        }
      });
    }
  }

  test('E44: ?lang=en loads page directly in English', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page);
    await page.goto('/guess-character-name/?lang=en');
    await waitForHangmanReady(page);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await assertPageLocaleConsistency(page, 'en');
    await expect(page.locator('#message')).toHaveText(getLocaleString('en', 'hangman.guessCharacter'));
  });
});
