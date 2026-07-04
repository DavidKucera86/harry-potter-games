import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  waitForQuizReady,
  guessLetter,
  clickNewGame,
  expectModalOpen,
} from '../helpers/hangman';
import { houseByName, quizCharacters } from '../helpers/quiz';
import { selectors } from '../helpers/selectors';

const deckCharacters = [
  { id: '1', name: 'Ann', house: 'Gryffindor', image: 'https://hp-api.local/a.png' },
  { id: '2', name: 'Bob', house: 'Slytherin', image: 'https://hp-api.local/b.png' },
  { id: '3', name: 'Cyd', house: 'Ravenclaw', image: 'https://hp-api.local/c.png' },
];

const deckSpells = [
  { name: 'XYZ' },
  { name: 'ABC' },
  { name: 'DEF' },
];

async function winHangmanRound(page: import('@playwright/test').Page, letters: string) {
  for (const letter of letters) {
    const visible = await page.locator(selectors.overlay).evaluate(
      el => el.classList.contains('visible')
    );
    if (visible) break;
    await guessLetter(page, letter);
  }

  await expectModalOpen(page, 'Gratulujeme!');
  return page.locator(selectors.modalHighlight).first().textContent();
}

test.describe('Deck uniqueness @edge', () => {
  test('E14: no duplicate characters within a deck cycle', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, { characters: quizCharacters, random: 0.1 });
    await page.goto('/guess-house/');
    await waitForQuizReady(page);

    const seen = new Set<string>();

    for (let round = 0; round < 3; round++) {
      const name = await page.locator(selectors.characterName).textContent();
      expect(name).toBeTruthy();
      expect(seen.has(name!)).toBe(false);
      seen.add(name!);

      await page.locator(selectors.choices).filter({ hasText: houseByName[name!] }).click();
      if (round < 2) {
        await expect(page.locator(selectors.choices).first()).toBeEnabled({ timeout: 2000 });
      }
    }
  });

  test('E15: no duplicate hangman character names within a deck cycle', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, { characters: deckCharacters, random: 0.1 });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    const seen = new Set<string>();

    for (let round = 0; round < 3; round++) {
      const word = await winHangmanRound(page, 'annbobcyd');
      expect(word).toBeTruthy();
      expect(seen.has(word!)).toBe(false);
      seen.add(word!);

      if (round < 2) {
        await clickNewGame(page);
        await waitForHangmanReady(page);
      }
    }
  });

  test('E16: no duplicate hangman spells within a deck cycle', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, { spells: deckSpells, random: 0.1 });
    await page.goto('/guess-spell/');
    await waitForHangmanReady(page);

    const seen = new Set<string>();

    for (let round = 0; round < 3; round++) {
      const word = await winHangmanRound(page, 'xyzabcdef');
      expect(word).toBeTruthy();
      expect(seen.has(word!)).toBe(false);
      seen.add(word!);

      if (round < 2) {
        await clickNewGame(page);
        await waitForHangmanReady(page);
      }
    }
  });
});
