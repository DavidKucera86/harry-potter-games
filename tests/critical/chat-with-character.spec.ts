import { test, expect } from '@playwright/test';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { waitForChatReady, startChat, sendMessage } from '../helpers/chat';

test.describe('Chat with a character @critical', () => {
  test('Q06.01: entering a nickname and picking Dumbledore opens the chat with a greeting', { tag: '@critical' }, async ({ page }) => {
    await given('hra Chat s postavou je načtená', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
    });

    await when('hráč zadá přezdívku a vybere Brumbála', async () => {
      await startChat(page, 'Harry');
    });

    await then('otevře se chat s Brumbálem a uvítací hláškou obsahující přezdívku', async () => {
      await expect(page.locator(selectors.chatSetup)).toBeHidden();
      await expect(page.locator(selectors.partnerName)).toHaveText('Albus Brumbál');
      await expect(page.locator(selectors.chatCharacterText).first()).toContainText('Harry');
    });
  });

  test('Q06.02: a message with a known keyword gets a themed reply', { tag: '@critical' }, async ({ page }) => {
    await given('hráč je v chatu s Brumbálem', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
    });

    await when('hráč napíše zprávu o smrti', async () => {
      await sendMessage(page, 'Řekni mi něco o smrti');
    });

    await then('jeho zpráva i odpověď Brumbála se objeví v konverzaci', async () => {
      await expect(page.locator(selectors.chatUserText)).toHaveText('Řekni mi něco o smrti');
      // greeting + reply = two character messages
      await expect(page.locator(selectors.chatCharacterText)).toHaveCount(2);
      await expect(page.locator(selectors.messageInput)).toHaveValue('');
    });
  });
});
