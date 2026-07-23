import { expect, Page } from '@playwright/test';
import { selectors } from './selectors';

export async function waitForRpsReady(page: Page) {
  await expect(page.locator(selectors.newGameBtn)).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(selectors.loadingOverlay)).toBeHidden();
  await expect(page.locator(selectors.moves)).toHaveCount(3);
  await expect(page.locator(selectors.moves).first()).toBeEnabled();
}

/** Plays the move that beats the opponent's fixed move (needs random === 0 → opponent throws rock). */
export async function playMove(page: Page, move: 'rock' | 'paper' | 'scissors') {
  await page.locator(`#moves button[data-move="${move}"]`).click();
}
