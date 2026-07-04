import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Photo image error @edge', () => {
  test('E14: broken image does not crash the game', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        { id: '4', name: 'Broken Photo', house: 'Slytherin', image: 'https://invalid.local/broken.jpg' },
        { id: '3', name: 'Harry Potter', house: 'Gryffindor', image: 'https://hp-api.local/harry.png' },
        { id: '5', name: 'Ron Weasley', house: 'Gryffindor', image: 'https://hp-api.local/ron.png' },
        { id: '6', name: 'Hermione Granger', house: 'Gryffindor', image: 'https://hp-api.local/hermione.png' },
      ],
      random: 0,
    });
    await page.goto('/who-is-on-photo/');
    await waitForQuizReady(page);

    await expect(page.locator(selectors.choices)).toHaveCount(4);
    await expect(page.locator('#message')).toContainText('Kdo je na fotce');
  });
});
