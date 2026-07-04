import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { given, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Photo image error @edge', () => {
  test('E14.01: broken image does not crash the game', { tag: '@edge' }, async ({ page }) => {
    await given('kvíz Kdo je na fotce je načtený s jednou rozbitou fotkou', async () => {
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
    });

    await then('hra zůstane hratelná se čtyřmi možnostmi', async () => {
      await expect(page.locator(selectors.choices)).toHaveCount(4);
      await expect(page.locator('#message')).toContainText('Kdo je na fotce');
    });
  });
});
