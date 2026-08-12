import { test, expect } from '@playwright/test';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { clickSuggestion, sendMessage, startChat, suggestions, waitForChatReady } from '../helpers/chat';

test.describe('Chat follow-up suggestions @edge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat-with-character/');
    await waitForChatReady(page);
  });

  test('E57.01: the suggestion row is hidden until the chat starts', { tag: '@edge' }, async ({ page }) => {
    await then('na úvodní obrazovce nejsou žádné návrhy', async () => {
      await expect(page.locator(selectors.chatSuggestions)).toBeHidden();
    });

    await when('hráč vstoupí do chatu', async () => {
      await startChat(page, 'Harry');
    });

    await then('nabídnou se přesně tři otázky', async () => {
      await expect(page.locator(selectors.chatSuggestions)).toBeVisible();
      await expect(suggestions(page)).toHaveCount(3);
    });
  });

  test('E57.02: a question the player typed is not suggested back', { tag: '@edge' }, async ({ page }) => {
    await given('hráč je v chatu s Brumbálem', async () => {
      await startChat(page, 'Harry');
    });

    await when('hráč sám napíše otázku z nabídky', async () => {
      await sendMessage(page, 'Co je viteál?');
    });

    await then('tato otázka se mezi návrhy neobjeví', async () => {
      await expect(suggestions(page)).toHaveCount(3);
      await expect(suggestions(page).filter({ hasText: 'Co je viteál?' })).toHaveCount(0);
    });
  });

  test('E57.03: a suggestion can be reached and asked with the keyboard', { tag: '@edge' }, async ({ page }) => {
    let question = '';

    await given('hráč je v chatu s Brumbálem', async () => {
      await startChat(page, 'Harry');
    });

    await when('hráč se klávesnicí přesune na první návrh a stiskne Enter', async () => {
      const chip = suggestions(page).first();
      question = (await chip.textContent()) ?? '';
      await chip.focus();
      await expect(chip).toBeFocused();
      await page.keyboard.press('Enter');
    });

    await then('otázka se odešle a fokus se vrátí do pole zprávy', async () => {
      await expect(page.locator(selectors.chatUserText)).toHaveText(question);
      await expect(page.locator(selectors.messageInput)).toBeFocused();
    });
  });

  test('E57.04: returning to the setup screen clears the suggestions', { tag: '@edge' }, async ({ page }) => {
    await given('hráč je v chatu a klikl na návrh', async () => {
      await startChat(page, 'Harry');
      await clickSuggestion(page);
    });

    await when('hráč se vrátí na výběr postavy', async () => {
      await page.locator(selectors.backToSetupBtn).click();
    });

    await then('řádek s návrhy je prázdný a skrytý', async () => {
      await expect(page.locator(selectors.chatSuggestions)).toBeHidden();
      await expect(suggestions(page)).toHaveCount(0);
    });
  });
});
