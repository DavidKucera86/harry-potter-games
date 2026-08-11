import { test, expect } from '@playwright/test';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { clickSuggestion, sendMessage, startChat, suggestions, waitForChatReady } from '../helpers/chat';
import { dumbledore } from '../../src/chat-with-character/data/dumbledore';

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

  test('Q06.03: clicking a suggested question asks it and offers three new ones', { tag: '@critical' }, async ({ page }) => {
    let question = '';

    await given('hráč je v chatu s Brumbálem a vidí tři návrhy otázek', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
      await expect(suggestions(page)).toHaveCount(3);
    });

    await when('hráč klikne na první návrh', async () => {
      question = await clickSuggestion(page);
    });

    await then('otázka se odešle jako zpráva hráče a nabídnou se tři nové návrhy', async () => {
      await expect(page.locator(selectors.chatUserText)).toHaveText(question);
      await expect(page.locator(selectors.chatCharacterText)).toHaveCount(2);
      await expect(suggestions(page)).toHaveCount(3);
      await expect(suggestions(page).filter({ hasText: question })).toHaveCount(0);
    });
  });

  test('Q06.04: a greeting with a real question is answered on the question', { tag: '@critical' }, async ({ page }) => {
    await given('hráč je v chatu s Brumbálem', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
    });

    await when('hráč pozdraví a zeptá se, v čem Brumbál programuje', async () => {
      await sendMessage(page, 'Čau Bumbále, v čem programuješ?');
    });

    await then('Brumbál odpoví o technologii, nikoli pozdravem', async () => {
      const reply = page.locator(selectors.chatCharacterText).last();
      await expect(reply).not.toBeEmpty();
      expect(dumbledore.quotes.technologie.cs).toContain((await reply.textContent())?.trim());
    });
  });
});
