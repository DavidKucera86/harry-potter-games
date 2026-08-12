import { test, expect } from '@playwright/test';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { clickSuggestion, startChat, suggestions, waitForChatReady } from '../helpers/chat';

test.describe('Chat mobile viewport @edge', () => {
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
