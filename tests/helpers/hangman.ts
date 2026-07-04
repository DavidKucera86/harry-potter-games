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

  const photo = page.locator(selectors.characterPhoto);
  if (await photo.count()) {
    await page.waitForFunction(() => {
      const img = document.getElementById('characterPhoto');
      return img instanceof HTMLImageElement && img.naturalWidth > 0;
    });
  }
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

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
  );
  expect(overflow).toBe(true);
}

export async function expectFullyInViewport(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox();
  const viewport = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
}

export async function expectLetterSlotsInViewport(page: Page) {
  const viewportWidth = page.viewportSize()!.width;
  const overflow = await page.evaluate((width) => {
    const slots = Array.from(document.querySelectorAll('#wordDisplay .letter-slot:not(.space)'));
    return slots.every((slot) => slot.getBoundingClientRect().right <= width + 1);
  }, viewportWidth);
  expect(overflow).toBe(true);
}
