import { expect, Page } from '@playwright/test';
import { selectors } from './selectors';

export async function waitForChatReady(page: Page) {
  await expect(page.locator(selectors.chatSetup)).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(`${selectors.characterSelect} option`)).toHaveCount(1);
}

export async function startChat(
  page: Page,
  nickname: string,
  characterId = 'albus-dumbledore',
) {
  await page.fill(selectors.nickname, nickname);
  await page.selectOption(selectors.characterSelect, characterId);
  await page.locator(selectors.startChatBtn).click();
  await expect(page.locator(selectors.chatRoom)).toBeVisible();
}

export async function sendMessage(page: Page, text: string) {
  await page.fill(selectors.messageInput, text);
  await page.locator(selectors.sendBtn).click();
}
