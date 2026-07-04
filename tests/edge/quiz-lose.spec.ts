import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady, expectModalOpen } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { quizCharacters } from '../helpers/quiz';
import { selectors } from '../helpers/selectors';

test.describe('Quiz lose @edge', () => {
  test('E07.01: guess-house shows defeat modal after 10 wrong answers', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej kolej je načtená', async () => {
      await setupGameMocks(page, { characters: quizCharacters, random: 0 });
      await page.goto('/guess-house/');
      await waitForQuizReady(page);
    });

    await when('uživatel desetkrát odpoví špatně', async () => {
      for (let i = 0; i < 10; i++) {
        const name = await page.locator(selectors.characterName).textContent();
        const correctHouse = quizCharacters.find((c) => c.name === name)?.house;
        const wrongHouse = correctHouse === 'Gryffindor' ? 'Slytherin' : 'Gryffindor';
        await page.locator(selectors.choices).filter({ hasText: wrongHouse }).click();
        if (i < 9) {
          await expect(page.locator(selectors.choices).first()).toBeEnabled({ timeout: 2000 });
        }
      }
    });

    await then('zobrazí se proherní modal se správnou kolejí', async () => {
      await expectModalOpen(page, 'Došly životy!');
      await expect(page.locator(selectors.modalText)).toContainText('Správná kolej:');
    });
  });

  test('E08.01: who-is-on-photo shows defeat modal after 10 wrong answers', { tag: '@edge' }, async ({ page }) => {
    await given('hra Kdo je na fotce je načtená', async () => {
      await setupGameMocks(page, {
        characters: [
          { id: '3', name: 'Harry Potter', house: 'Gryffindor', image: 'https://hp-api.local/harry.png' },
          { id: '5', name: 'Ron Weasley', house: 'Gryffindor', image: 'https://hp-api.local/ron.png' },
          { id: '6', name: 'Hermione Granger', house: 'Gryffindor', image: 'https://hp-api.local/hermione.png' },
          { id: '7', name: 'Draco Malfoy', house: 'Slytherin', image: 'https://hp-api.local/draco.png' },
        ],
        random: 0,
      });
      await page.goto('/who-is-on-photo/');
      await waitForQuizReady(page);
    });

    await when('uživatel desetkrát odpoví špatně', async () => {
      for (let i = 0; i < 10; i++) {
        const buttons = page.locator(selectors.choices);
        const count = await buttons.count();
        let clicked = false;
        for (let j = 0; j < count; j++) {
          const text = await buttons.nth(j).textContent();
          if (text && text !== 'Harry Potter') {
            await buttons.nth(j).click();
            clicked = true;
            break;
          }
        }
        expect(clicked).toBe(true);
        if (i < 9) {
          await expect(page.locator(selectors.choices).first()).toBeEnabled({ timeout: 2000 });
        }
      }
    });

    await then('zobrazí se proherní modal s poslední postavou', async () => {
      await expectModalOpen(page, 'Došly životy!');
      await expect(page.locator(selectors.modalText)).toContainText('Poslední postava:');
    });
  });

  test('E09.01: quiz always shows four choices including correct answer', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej kolej je načtená', async () => {
      await setupGameMocks(page, { characters: quizCharacters, random: 0 });
      await page.goto('/guess-house/');
      await waitForQuizReady(page);
    });

    await then('kvíz zobrazí čtyři možnosti včetně správné odpovědi', async () => {
      await expect(page.locator(selectors.choices)).toHaveCount(4);
      const name = await page.locator(selectors.characterName).textContent();
      const house = quizCharacters.find((c) => c.name === name)?.house;
      await expect(
        page.locator(selectors.choices).filter({ hasText: house! })
      ).toHaveCount(1);
    });
  });
});
