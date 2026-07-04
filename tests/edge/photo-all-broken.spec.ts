import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { given, then } from '../helpers/gwt';

test.describe('Photo all broken images @edge', () => {
  test('E27.01: all broken images show error instead of looping', { tag: '@edge' }, async ({ page }) => {
    await given('všechny fotky v kvízu jsou neplatné', async () => {
      await setupGameMocks(page, {
        characters: [
          { id: '1', name: 'A', house: 'Gryffindor', image: 'https://invalid.local/a.jpg' },
          { id: '2', name: 'B', house: 'Slytherin', image: 'https://invalid.local/b.jpg' },
          { id: '3', name: 'C', house: 'Ravenclaw', image: 'https://invalid.local/c.jpg' },
          { id: '4', name: 'D', house: 'Hufflepuff', image: 'https://invalid.local/d.jpg' },
        ],
        mockImages: false,
        random: 0,
      });

      await page.route('https://invalid.local/**', route => route.abort('failed'));
      await page.goto('/who-is-on-photo/');
    });

    await then('zobrazí se chybová hláška místo nekonečné smyčky', async () => {
      await expect(page.locator('#loadingOverlay')).toBeHidden();
      await expect(page.locator('#message')).toContainText('fotky', { timeout: 15000 });
      await expect(page.locator('#newGameBtn')).toBeEnabled();
      await expect(page.locator('#choices button')).toHaveCount(0);
    });
  });
});
