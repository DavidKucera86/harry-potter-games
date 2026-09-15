import { test, expect } from '@playwright/test';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { clickSuggestion, sendMessage, startChat, suggestions, waitForChatReady } from '../helpers/chat';

test.describe('Chat mobile viewport @edge', () => {
  test('E58.03: the message field stays unfocused while reading character replies', { tag: '@edge' }, async ({ page }) => {
    await given('hráč vstoupí do chatu na mobilu', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
    });

    await then('úvodní zprávu může číst bez fokusu v poli', async () => {
      await expect(page.locator(selectors.messageInput)).not.toBeFocused();
    });

    await when('hráč sám napíše a odešle otázku', async () => {
      await page.locator(selectors.messageInput).click();
      await expect(page.locator(selectors.messageInput)).toBeFocused();
      await sendMessage(page, 'Co je viteál?');
    });

    await then('odpověď postavy opět čte bez fokusu v poli', async () => {
      await expect(page.locator(selectors.chatCharacterText)).toHaveCount(2);
      await expect(page.locator(selectors.messageInput)).not.toBeFocused();
    });

    await when('hráč vybere navrženou otázku', async () => {
      await clickSuggestion(page);
    });

    await then('i po navržené otázce zůstane pole bez fokusu', async () => {
      await expect(page.locator(selectors.chatCharacterText)).toHaveCount(3);
      await expect(page.locator(selectors.messageInput)).not.toBeFocused();
    });
  });

  test('E58.01: suggestion chips are tappable on a phone viewport', { tag: '@edge' }, async ({ page }) => {
    let question = '';

    await given('hráč je v chatu s Brumbálem na mobilním viewportu', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
    });

    await then('každý návrh má dostatečně velkou dotykovou plochu', async () => {
      const chips = suggestions(page);
      await expect(chips).toHaveCount(3);
      for (let index = 0; index < 3; index += 1) {
        const box = await chips.nth(index).boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    });

    await when('hráč na návrh klepne', async () => {
      question = await clickSuggestion(page);
    });

    await then('otázka se odešle', async () => {
      await expect(page.locator(selectors.chatUserText)).toHaveText(question);
    });
  });

  test('E58.02: the chat does not scroll horizontally on a narrow screen', { tag: '@edge' }, async ({ page }) => {
    await given('hráč je v chatu s Brumbálem na úzkém viewportu', async () => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
      await expect(suggestions(page)).toHaveCount(3);
    });

    await then('stránka se nedá posouvat do stran', async () => {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  });
});
