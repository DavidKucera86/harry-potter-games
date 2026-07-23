import { test, expect } from '@playwright/test';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { waitForChatReady, startChat, sendMessage } from '../helpers/chat';

test.describe('Chat setup and safety @edge', () => {
  test('E54.04: the error field is hidden until validation fails', { tag: '@edge' }, async ({ page }) => {
    await given('hra Chat s postavou je načtená', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
    });

    await then('chybové pole není na úvodní obrazovce vidět', async () => {
      await expect(page.locator(selectors.setupError)).toBeHidden();
    });
  });

  test('E54.01: an empty nickname shows an error and stays on setup', { tag: '@edge' }, async ({ page }) => {
    await given('hra Chat s postavou je načtená', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
    });

    await when('hráč klikne na Začít chat bez přezdívky', async () => {
      await page.locator(selectors.startChatBtn).click();
    });

    await then('zobrazí se chybová hláška a hráč zůstane na úvodní obrazovce', async () => {
      await expect(page.locator(selectors.setupError)).toBeVisible();
      await expect(page.locator(selectors.setupError)).not.toBeEmpty();
      await expect(page.locator(selectors.chatRoom)).toBeHidden();
    });
  });

  test('E54.02: the nickname input is capped at 32 characters', { tag: '@edge' }, async ({ page }) => {
    await given('hra Chat s postavou je načtená', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
    });

    await then('input nedovolí zadat víc než 32 znaků', async () => {
      await expect(page.locator(selectors.nickname)).toHaveAttribute('maxlength', '32');
      await page.fill(selectors.nickname, 'x'.repeat(50));
      await expect(page.locator(selectors.nickname)).toHaveValue('x'.repeat(32));
    });
  });

  test('E54.03: an HTML payload in a message is rendered as literal text, not executed', { tag: '@edge' }, async ({ page }) => {
    let dialogShown = false;
    page.on('dialog', () => {
      dialogShown = true;
    });

    await given('hráč je v chatu s Brumbálem', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
    });

    const payload = '<img src=x onerror="alert(1)">';
    await when('hráč pošle zprávu s XSS payloadem', async () => {
      await sendMessage(page, payload);
    });

    await then('payload je vykreslen jako text a nespustí se žádný skript', async () => {
      await expect(page.locator(selectors.chatUserText)).toHaveText(payload);
      await expect(page.locator(`${selectors.chatUserText} img`)).toHaveCount(0);
      expect(dialogShown).toBe(false);
    });
  });
});
