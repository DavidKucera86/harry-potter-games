import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForRpsReady, playMove } from '../helpers/duel';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { GAME_CONFIG } from '../../src/shared/config';

// random === 0 makes the opponent always throw rock, so paper wins and scissors lose.
test.describe('Rock paper scissors @critical', () => {
  test('Q03.01: winning a round increases the player score', { tag: '@critical' }, async ({ page }) => {
    await given('hra Kámen–nůžky–papír je načtená a soupeř hází kámen', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/rock-paper-scissors/');
      await waitForRpsReady(page);
    });

    await when('hráč zahraje papír', async () => {
      await playMove(page, 'paper');
    });

    await then('skóre hráče se zvýší na 1 a odhalí se souboj', async () => {
      await expect(page.locator(selectors.message)).toHaveClass(/success/);
      await expect(page.locator(selectors.playerScore)).toHaveText('1');
      await expect(page.locator(selectors.opponentScore)).toHaveText('0');
      await expect(page.locator(selectors.duelReveal)).toBeVisible();
      await expect(page.locator(selectors.opponentName)).not.toBeEmpty();
    });
  });

  test('Q03.02: losing a round increases the opponent score', { tag: '@critical' }, async ({ page }) => {
    await given('hra Kámen–nůžky–papír je načtená a soupeř hází kámen', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/rock-paper-scissors/');
      await waitForRpsReady(page);
    });

    await when('hráč zahraje nůžky', async () => {
      await playMove(page, 'scissors');
    });

    await then('skóre soupeře se zvýší na 1', async () => {
      await expect(page.locator(selectors.message)).toHaveClass(/error/);
      await expect(page.locator(selectors.opponentScore)).toHaveText('1');
      await expect(page.locator(selectors.playerScore)).toHaveText('0');
    });
  });

  test('Q03.04: the same opponent stays until the match is decided', { tag: '@critical' }, async ({ page }) => {
    await given('hra Kámen–nůžky–papír je načtená a soupeř hází kámen', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/rock-paper-scissors/');
      await waitForRpsReady(page);
    });

    let firstPhoto: string | null = null;
    let firstName: string | null = null;
    await when('hráč odehraje první kolo', async () => {
      firstPhoto = await page.locator(selectors.opponentPhoto).getAttribute('src');
      await playMove(page, 'paper');
      await expect(page.locator(selectors.playerScore)).toHaveText('1');
      firstName = await page.locator(selectors.opponentName).textContent();
      await expect(page.locator(selectors.moves).first()).toBeEnabled();
    });

    await then('druhé kolo má stále stejného soupeře i fotku', async () => {
      await playMove(page, 'paper');
      await expect(page.locator(selectors.playerScore)).toHaveText('2');
      await expect(page.locator(selectors.opponentPhoto)).toHaveAttribute('src', firstPhoto!);
      await expect(page.locator(selectors.opponentName)).toHaveText(firstName!);
    });
  });

  test('Q03.03: first to the win target wins the match', { tag: '@critical' }, async ({ page }) => {
    await given('hra Kámen–nůžky–papír je načtená a soupeř hází kámen', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/rock-paper-scissors/');
      await waitForRpsReady(page);
    });

    await when('hráč vyhraje potřebný počet kol', async () => {
      for (let round = 1; round <= GAME_CONFIG.WINS_TO_MATCH; round++) {
        await playMove(page, 'paper');
        await expect(page.locator(selectors.playerScore)).toHaveText(String(round));
        if (round < GAME_CONFIG.WINS_TO_MATCH) {
          await expect(page.locator(selectors.moves).first()).toBeEnabled();
        }
      }
    });

    await then('otevře se vítězný modal zápasu odkotvený nad dolní polovinou fotky', async () => {
      await expect(page.locator(selectors.overlayVisible)).toBeVisible();
      await expect(page.locator(selectors.modalTitle)).toHaveText('Vyhráls zápas!');
      await expect(page.locator(selectors.overlay)).toHaveClass(/duel-overlay/);

      // Modal top edge is anchored to the photo's vertical midpoint (not screen-centred).
      const photo = await page.locator(selectors.opponentPhoto).boundingBox();
      const modal = await page.locator(selectors.modalDialog).boundingBox();
      const photoMid = photo!.y + photo!.height / 2;
      expect(Math.abs(modal!.y - photoMid)).toBeLessThan(30);
    });
  });

  test('Q03.05: the scoreboard stays on a single row on a narrow viewport', { tag: '@critical' }, async ({ page }) => {
    await given('hra je načtená na úzkém mobilním viewportu', async () => {
      await page.setViewportSize({ width: 320, height: 720 });
      await setupGameMocks(page, { random: 0 });
      await page.goto('/rock-paper-scissors/');
      await waitForRpsReady(page);
    });

    await then('obě strany skóre jsou na stejném řádku', async () => {
      const you = await page.locator('.duel-side').first().boundingBox();
      const opponent = await page.locator('.duel-side').last().boundingBox();
      expect(you).not.toBeNull();
      expect(opponent).not.toBeNull();
      // Same row => their vertical centres line up.
      const youMid = you!.y + you!.height / 2;
      const opponentMid = opponent!.y + opponent!.height / 2;
      expect(Math.abs(youMid - opponentMid)).toBeLessThan(8);
    });
  });
});
