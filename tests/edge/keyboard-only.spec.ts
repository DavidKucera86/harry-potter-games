import { test, expect, Page } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, expectModalOpen, expectModalClosed } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

/**
 * Presses Tab until `selector` holds focus, and reports how many presses it took.
 * Throws rather than returning a flag: a control the keyboard cannot reach is the
 * finding, and it should read as one in the failure message.
 */
async function tabTo(
  page: Page,
  selector: string,
  { backwards = false, maxPresses = 25 } = {},
): Promise<number> {
  const key = backwards ? 'Shift+Tab' : 'Tab';
  for (let presses = 1; presses <= maxPresses; presses += 1) {
    await page.keyboard.press(key);
    const focused = await page.locator(selector).evaluate(
      el => el === document.activeElement,
    ).catch(() => false);
    if (focused) return presses;
  }
  throw new Error(`${selector} is not reachable with ${key} within ${maxPresses} presses`);
}

/** True when the focused element paints something a sighted keyboard user can see. */
async function focusIsVisible(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const style = getComputedStyle(el);
    const ring = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
    return ring || style.boxShadow !== 'none';
  });
}

test.describe('Keyboard only @edge', () => {
  // axe cannot answer this one: it reads the DOM, it does not operate the page. Nothing
  // else in the suite plays a game without a mouse, so "is it playable with a keyboard"
  // — WCAG 2.1.1, the most basic operability requirement — had no oracle at all.
  test('E61.01: a whole round is playable from the menu with the keyboard alone', { tag: '@edge' }, async ({ page }) => {
    await given('menu je načtené a myš se nepoužije', async () => {
      await setupGameMocks(page, {
        characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
        random: 0,
      });
      await page.goto('/');
      await expect(page.locator(selectors.gameCard).first()).toBeVisible();
    });

    await when('hráč dojde tabem na kartu hry a otevře ji Enterem', async () => {
      await tabTo(page, 'a.game-card[href="guess-character-name/"]');
      expect(await focusIsVisible(page)).toBe(true);
      await page.keyboard.press('Enter');
      await waitForHangmanReady(page);
    });

    await then('hra sama položí fokus na pole pro písmeno', async () => {
      // Not a convenience the test leans on — it is the behaviour. On a pointer device
      // the round starts with the caret already where the player types, so nobody has
      // to tab there first. Asserted with a retrying matcher, because the focus lands a
      // beat after the controls are enabled.
      await expect(page.locator(selectors.letterInput)).toBeFocused();
      expect(await focusIsVisible(page)).toBe(true);
    });

    await when('hráč uhádne celé jméno bez sáhnutí na myš', async () => {
      for (const letter of ['a', 'l', 'b', 'u', 's']) {
        await page.keyboard.type(letter);
        await page.keyboard.press('Enter');
      }
    });

    await then('otevře se výherní modal s fokusem na svém tlačítku', async () => {
      await expectModalOpen(page, 'Gratulujeme!');
      await expect(page.locator(selectors.modalBtn)).toBeFocused();
      expect(await focusIsVisible(page)).toBe(true);
    });

    await when('hráč potvrdí modal Enterem a vrátí se tabem na odkaz zpět', async () => {
      await page.keyboard.press('Enter');
      await expectModalClosed(page);
      await waitForHangmanReady(page);
      await expect(page.locator(selectors.letterInput)).toBeFocused();
      // The back link sits above the input in the document, so the way back is Shift+Tab.
      await tabTo(page, selectors.backLink, { backwards: true });
      expect(await focusIsVisible(page)).toBe(true);
      await page.keyboard.press('Enter');
    });

    await then('hráč je zpátky v menu, aniž by se jednou dotkl myši', async () => {
      await expect(page.locator(selectors.gameCard).first()).toBeVisible();
      expect(new URL(page.url()).pathname.replace(/index\.html$/, '')).toBe('/');
    });
  });
});
