import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, expectNoHorizontalOverflow, expectLetterSlotSizes, expectUniformLetterSlotSizes } from '../helpers/hangman';

test.describe('Hangman word wrap @edge', () => {
  test('E5: words wrap as whole units with preserved spaces', { tag: '@edge' }, async ({ page }) => {
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
    await expectNoHorizontalOverflow(page);
    await expectLetterSlotSizes(page, { min: 24 });
    await expectUniformLetterSlotSizes(page);

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

  test('E28: letter slots have uniform width across word groups', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      spells: [{ name: 'Expecto Patronum' }],
      random: 0,
    });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/guess-spell/');
    await waitForHangmanReady(page);

    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(2);
    await expectNoHorizontalOverflow(page);
    await expectUniformLetterSlotSizes(page);
  });
});
