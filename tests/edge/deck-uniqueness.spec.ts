import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  waitForQuizReady,
  guessLetter,
  clickNewGame,
  expectModalOpen,
} from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
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
  test('E15.01: no duplicate characters within a deck cycle', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej kolej je načtená s náhodným balíčkem postav', async () => {
      await setupGameMocks(page, { characters: quizCharacters, random: 0.1 });
      await page.goto('/guess-house/');
      await waitForQuizReady(page);
    });

    await when('uživatel odehraje tři kola', async () => {
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

    await then('v každém kole se objeví jiná postava', async () => {});
  });

  test('E16.01: no duplicate hangman character names within a deck cycle', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej postavu je načtená s třemi unikátními jmény', async () => {
      await setupGameMocks(page, { characters: deckCharacters, random: 0.1 });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await when('uživatel vyhraje tři kola hangmanu', async () => {
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

    await then('v každém kole se objeví jiné jméno', async () => {});
  });

  test('E17.01: no duplicate hangman spells within a deck cycle', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej zaklínadlo je načtená se třemi unikátními zaklínadly', async () => {
      await setupGameMocks(page, { spells: deckSpells, random: 0.1 });
      await page.goto('/guess-spell/');
      await waitForHangmanReady(page);
    });

    await when('uživatel vyhraje tři kola hangmanu', async () => {
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

    await then('v každém kole se objeví jiné zaklínadlo', async () => {});
  });
});
