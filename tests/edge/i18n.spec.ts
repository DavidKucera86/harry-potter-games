import { test, expect, type Page } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
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
        await given(`stránka ${path} je načtená s mockovanými daty`, async () => {
          await setupGameMocks(page);
          await page.goto(path);
          if (ready) {
            await ready(page);
          }
        });

        await when(`uživatel přepne jazyk na ${locale}`, async () => {
          await page.selectOption('#localeSelect', locale);
        });

        await then('všechny statické texty odpovídají zvolenému jazyku', async () => {
          await expect(page.locator('html')).toHaveAttribute('lang', locale);
          await assertPageLocaleConsistency(page, locale);

          if (messageKey) {
            await expect(page.locator('#message')).toHaveText(getLocaleString(locale, messageKey));
          }
        });
      });
    }
  }

  test('E50: ?lang=en loads page directly in English', { tag: '@edge' }, async ({ page }) => {
    await given('uživatel otevře hru s parametrem ?lang=en', async () => {
      await setupGameMocks(page);
      await page.goto('/guess-character-name/?lang=en');
      await waitForHangmanReady(page);
    });

    await then('stránka je v angličtině a texty jsou konzistentní', async () => {
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await assertPageLocaleConsistency(page, 'en');
      await expect(page.locator('#message')).toHaveText(getLocaleString('en', 'hangman.guessCharacter'));
    });
  });

  test('E51: hangman feedback message updates after locale switch', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená a uživatel uhodne špatné písmeno', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
      await page.locator('#letterInput').fill('z');
      await page.locator('#guessBtn').click();
      await expect(page.locator('#message')).toHaveClass(/error/);
    });

    await when('uživatel přepne jazyk na angličtinu', async () => {
      await page.selectOption('#localeSelect', 'en');
    });

    await then('feedback zpráva se přepne do angličtiny', async () => {
      await expect(page.locator('#message')).toContainText('Wrong!');
      await expect(page.locator('#message')).toContainText('Z');
    });
  });

  test('E52: lose modal title updates after locale switch', { tag: '@edge' }, async ({ page }) => {
    await given('uživatel prohraje hangman hru', async () => {
      await setupGameMocks(page, {
        characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/a.png' }],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);

      const wrongLetters = ['c', 'd', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p'];
      for (const letter of wrongLetters) {
        await page.locator('#letterInput').fill(letter);
        await page.locator('#guessBtn').click();
      }
      await expect(page.locator('#modalTitle')).toHaveText('Došly životy!');
    });

    await when('uživatel přepne jazyk na angličtinu', async () => {
      await page.selectOption('#localeSelect', 'en');
    });

    await then('titulek modalu se přepne do angličtiny', async () => {
      await expect(page.locator('#modalTitle')).toHaveText('Out of lives!');
    });
  });
});
