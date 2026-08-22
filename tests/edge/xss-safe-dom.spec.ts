import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetters, expectModalOpen, waitForQuizReady } from '../helpers/hangman';
import { quizCharacters } from '../helpers/quiz';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('XSS safe DOM @edge', () => {
  test('E25.01: malicious character name is rendered as text in modal', { tag: '@edge' }, async ({ page }) => {
    let dialogShown = false;
    page.on('dialog', () => {
      dialogShown = true;
    });

    await given('hra je načtená s postavou obsahující XSS payload v názvu', async () => {
      await setupGameMocks(page, {
        characters: [
          {
            id: '99',
            name: '<script>alert(1)</script>',
            house: 'Gryffindor',
            image: 'https://hp-api.local/xss.png',
          },
        ],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await when('uživatel prohraje hru', async () => {
      await guessLetters(page, ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'o']);
    });

    await then('payload je v modalu zobrazen jako text a nespustí se alert', async () => {
      await expectModalOpen(page, 'Došly životy!');
      await expect(page.locator(selectors.modalHighlight).first()).toHaveText('<script>alert(1)</script>');
      expect(dialogShown).toBe(false);
    });
  });

  // The URL guard is shared by every game that puts an API image on screen, so this
  // proves the class, not the one instance: a payload the guard used to wave through
  // (`/<TAB>/host/…` resolves to a protocol-relative URL) must not reach the network.
  test('E25.02: image URL smuggling a protocol-relative host past the guard never reaches the network', { tag: '@edge' }, async ({ page }) => {
    const requestedHosts: string[] = [];
    page.on('request', (request) => {
      requestedHosts.push(new URL(request.url()).host);
    });

    await given('API vrátí postavu s fotkou schovávající cizí origin za tabulátor', async () => {
      await setupGameMocks(page, {
        characters: [
          ...quizCharacters,
          {
            id: '99',
            name: 'Smuggled Snape',
            house: 'Slytherin',
            image: '/\t/evil.example/pwn.png',
          },
        ],
      });
      await page.goto('/who-is-on-photo/');
      await waitForQuizReady(page);
    });

    // Walk the whole deck. Checking only the first photo would let the test pass
    // because the shuffle happened to deal the poisoned character last, not because
    // the guard did its job.
    await when('hráč projde celý balíček', async () => {
      for (let round = 0; round < quizCharacters.length + 1; round += 1) {
        if (await page.locator(selectors.overlayVisible).count()) {
          break;
        }
        await page.locator(selectors.choices).first().click();
        await page.waitForTimeout(300);
      }
    });

    await then('otrávená postava je zahozena a na evil.example nejde žádný request', async () => {
      await expect(page.locator(selectors.choices).filter({ hasText: 'Smuggled Snape' })).toHaveCount(0);
      expect(requestedHosts).not.toContain('evil.example');
    });
  });
});
