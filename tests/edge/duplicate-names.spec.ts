import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Duplicate character names @edge', () => {
  test('E21.01: photo quiz matches by id not name', { tag: '@edge' }, async ({ page }) => {
    await given('kvíz je načtený se dvěma postavami Tom Riddle s různými ID', async () => {
      await setupGameMocks(page, {
        characters: [
          { id: '1', name: 'Tom Riddle', house: 'Slytherin', image: 'https://hp-api.local/tom1.png' },
          { id: '2', name: 'Tom Riddle', house: 'Slytherin', image: 'https://hp-api.local/tom2.png' },
          { id: '3', name: 'Harry Potter', house: 'Gryffindor', image: 'https://hp-api.local/harry.png' },
          { id: '4', name: 'Ron Weasley', house: 'Gryffindor', image: 'https://hp-api.local/ron.png' },
        ],
        random: 0,
      });
      await page.goto('/who-is-on-photo/');
      await waitForQuizReady(page);
    });

    await when('uživatel vybere špatného Toma Riddle podle jména', async () => {
      const photoSrc = await page.locator(selectors.characterPhoto).getAttribute('src');
      const tomButtons = page.locator(selectors.choices).filter({ hasText: 'Tom Riddle' });
      await expect(tomButtons).toHaveCount(2);
      const wrongIndex = photoSrc?.includes('tom1.png') ? 1 : 0;
      await tomButtons.nth(wrongIndex).click();
    });

    await then('odpověď je vyhodnocena jako chybná', async () => {
      await expect(page.locator('#message')).toHaveClass(/error/);
      await expect(page.locator('#message')).toContainText('Tom Riddle');
    });
  });
});
