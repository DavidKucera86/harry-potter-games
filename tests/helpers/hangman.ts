import { expect, Page } from '@playwright/test';
import { selectors } from './selectors';

export async function waitForHangmanReady(page: Page) {
  await expect(page.locator(selectors.loadingOverlay)).toBeHidden();
  await expect(page.locator(selectors.guessBtn)).toBeEnabled();
}

export async function waitForQuizReady(page: Page) {
  await expect(page.locator(selectors.loadingOverlay)).toBeHidden();
  await expect(page.locator(selectors.newGameBtn)).toBeEnabled();
  await expect(page.locator(selectors.choices)).toHaveCount(4);
}

export async function guessLetter(page: Page, letter: string) {
  await page.locator(selectors.letterInput).fill(letter);
  await page.locator(selectors.guessBtn).click();
}

export async function guessLetters(page: Page, letters: string[]) {
  for (const letter of letters) {
    await guessLetter(page, letter);
  }
}

export async function expectHeartCount(page: Page, count: number) {
  await expect(page.locator(selectors.hearts)).toHaveCount(10);
  const lostHearts = page.locator('#hearts .heart.lost');
  await expect(lostHearts).toHaveCount(10 - count);
}

export async function clickNewGame(page: Page) {
  const overlay = page.locator(selectors.overlay);
  if (await overlay.evaluate((el) => el.classList.contains('visible'))) {
    await page.locator(selectors.modalBtn).click();
  } else {
    await page.locator(selectors.newGameBtn).click();
  }
}

export async function expectModalClosed(page: Page) {
  await expect(page.locator(selectors.overlay)).not.toHaveClass(/visible/);
}

export async function expectModalOpen(page: Page, title: string) {
  await expect(page.locator(selectors.overlay)).toHaveClass(/visible/);
  await expect(page.locator(selectors.modalTitle)).toHaveText(title);
}
