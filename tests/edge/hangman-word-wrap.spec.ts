import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady } from '../helpers/hangman';

test.describe('Hangman word wrap @edge', () => {
  test('E3: words wrap as whole units with preserved spaces', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        {
          id: '2',
          name: 'Nearly Headless Nick',
          house: 'Gryffindor',
          image: 'https://hp-api.local/nick.png',
        },
      ],
      random: 0,
    });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    const layout = await page.evaluate(() => {
      const groups = Array.from(document.querySelectorAll('#wordDisplay .word-group'));
      return groups.map((group, index) => {
        const slots = Array.from(group.querySelectorAll('.letter-slot'));
        const tops = slots.map((slot) => slot.getBoundingClientRect().top);
        const hasSpace = group.querySelector('.letter-slot.space') !== null;
        return {
          index,
          slotCount: slots.filter((slot) => !slot.classList.contains('space')).length,
          sameRow: tops.length === 0 || tops.every((top) => Math.abs(top - tops[0]) < 1),
          hasSpace,
        };
      });
    });

    expect(layout.length).toBe(3);
    layout.forEach((group) => {
      expect(group.sameRow).toBe(true);
    });
    expect(layout[0].hasSpace).toBe(true);
    expect(layout[1].hasSpace).toBe(true);
    expect(layout[2].hasSpace).toBe(false);
  });
});
