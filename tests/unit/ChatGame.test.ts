import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ChatGame } from '../../src/chat-with-character/ChatGame.ts';
import { setLocale } from '../../src/shared/i18n/index.ts';
import { setupChatDom } from './helpers/domFixture.ts';

function newGame(): ChatGame {
  setupChatDom();
  return new ChatGame();
}

function suggestions(game: ChatGame): HTMLButtonElement[] {
  return [...game.suggestionsEl!.querySelectorAll('button')];
}

function startChatAs(game: ChatGame, nickname: string): void {
  game.nicknameInput!.value = nickname;
  game.characterSelect!.value = 'albus-dumbledore';
  game.setupForm!.requestSubmit();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ChatGame setup', () => {
  it('is ready and lists Dumbledore in the character picker', () => {
    const game = newGame();
    expect(game.isReady).toBe(true);
    const options = game.characterSelect!.querySelectorAll('option');
    expect(options).toHaveLength(1);
    expect(options[0].value).toBe('albus-dumbledore');
    expect(options[0].textContent).toBe('Albus Brumbál');
  });

  it('starts on the setup screen with the chat room hidden', () => {
    const game = newGame();
    expect(game.setupSection!.hidden).toBe(false);
    expect(game.chatSection!.hidden).toBe(true);
  });

  it('rejects an empty nickname and stays on the setup screen', () => {
    const game = newGame();
    startChatAs(game, '   ');
    expect(game.setupError!.hidden).toBe(false);
    expect(game.setupError!.textContent).not.toBe('');
    expect(game.chatSection!.hidden).toBe(true);
  });

  it('enters the chat room with a greeting that includes the nickname', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    expect(game.setupSection!.hidden).toBe(true);
    expect(game.chatSection!.hidden).toBe(false);
    expect(game.partnerNameEl!.textContent).toBe('Albus Brumbál');

    const messages = game.chatLog!.querySelectorAll('.chat-message--character');
    expect(messages).toHaveLength(1);
    expect(messages[0].querySelector('.chat-message-text')!.textContent).toContain('Harry');
  });
});

describe('ChatGame conversation', () => {
  beforeEach(() => {
    // deterministic reply selection
  });

  it('appends the player message and a character reply on send', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    game.messageInput!.value = 'Řekni mi něco o smrti';
    game.chatForm!.requestSubmit();

    const userMessages = game.chatLog!.querySelectorAll('.chat-message--user');
    expect(userMessages).toHaveLength(1);
    expect(userMessages[0].querySelector('.chat-message-text')!.textContent).toBe('Řekni mi něco o smrti');

    // greeting + reply
    const characterMessages = game.chatLog!.querySelectorAll('.chat-message--character');
    expect(characterMessages).toHaveLength(2);
    expect(game.messageInput!.value).toBe('');
  });

  it('ignores an empty or whitespace-only message', () => {
    const game = newGame();
    startChatAs(game, 'Harry');
    const before = game.chatLog!.children.length;

    game.messageInput!.value = '   ';
    game.chatForm!.requestSubmit();

    expect(game.chatLog!.children.length).toBe(before);
  });

  it('renders untrusted input as literal text, never as markup (Zero Trust)', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    const payload = '<img src=x onerror="alert(1)">';
    game.messageInput!.value = payload;
    game.chatForm!.requestSubmit();

    const userText = game.chatLog!.querySelector('.chat-message--user .chat-message-text')!;
    expect(userText.textContent).toBe(payload);
    // No element was injected from the payload.
    expect(userText.querySelector('img')).toBeNull();
  });

  it('renders a nickname containing HTML as literal text', () => {
    const game = newGame();
    startChatAs(game, '<b>x</b>');

    const author = game.chatLog!.querySelector('.chat-message--character .chat-message-author')!;
    // The greeting author is the character; the nickname appears in the greeting text.
    const greeting = game.chatLog!.querySelector('.chat-message--character .chat-message-text')!;
    expect(greeting.textContent).toContain('<b>x</b>');
    expect(greeting.querySelector('b')).toBeNull();
    expect(author.textContent).toBe('Albus Brumbál');
  });

  it('returns to the setup screen from the chat room', () => {
    const game = newGame();
    startChatAs(game, 'Harry');
    game.backBtn!.click();
    expect(game.setupSection!.hidden).toBe(false);
    expect(game.chatSection!.hidden).toBe(true);
  });
});

describe('ChatGame follow-up suggestions', () => {
  afterEach(() => {
    setLocale('cs');
  });

  it('offers three questions to open the conversation', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    const chips = suggestions(game);
    expect(chips).toHaveLength(3);
    expect(game.suggestionsEl!.hidden).toBe(false);
    chips.forEach(chip => {
      expect(chip.type).toBe('button');
      expect(chip.textContent).not.toBe('');
    });
  });

  it('offers a fresh set of three after every reply', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    game.messageInput!.value = 'Co je viteál?';
    game.chatForm!.requestSubmit();

    expect(suggestions(game)).toHaveLength(3);
  });

  it('asks the clicked question as if the player had typed it', () => {
    const game = newGame();
    startChatAs(game, 'Harry');
    const question = suggestions(game)[0].textContent;

    suggestions(game)[0].click();

    const userMessages = game.chatLog!.querySelectorAll('.chat-message--user');
    expect(userMessages).toHaveLength(1);
    expect(userMessages[0].querySelector('.chat-message-text')!.textContent).toBe(question);
    // greeting + the reply to the clicked question
    expect(game.chatLog!.querySelectorAll('.chat-message--character')).toHaveLength(2);
  });

  it('moves focus to the message input after a click, since the chip is gone', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    suggestions(game)[0].click();

    expect(document.activeElement).toBe(game.messageInput);
  });

  it('never offers a question the player already asked', () => {
    const game = newGame();
    startChatAs(game, 'Harry');
    const asked = suggestions(game)[0].textContent;

    suggestions(game)[0].click();

    expect(suggestions(game).map(chip => chip.textContent)).not.toContain(asked);
  });

  it('does not offer a question the player typed by hand', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    game.messageInput!.value = 'CO JE VITEAL?';
    game.chatForm!.requestSubmit();

    expect(suggestions(game).map(chip => chip.textContent)).not.toContain('Co je viteál?');
  });

  it('builds chips as plain text nodes, never as parsed markup (Zero Trust)', () => {
    const game = newGame();
    startChatAs(game, 'Harry');

    suggestions(game).forEach(chip => expect(chip.children).toHaveLength(0));
  });

  it('hides the empty suggestion row after returning to the setup screen', () => {
    const game = newGame();
    startChatAs(game, 'Harry');
    game.backBtn!.click();

    expect(suggestions(game)).toHaveLength(0);
    expect(game.suggestionsEl!.hidden).toBe(true);
  });

  it('re-renders the suggestions in the new language', () => {
    const game = newGame();
    startChatAs(game, 'Harry');
    const before = suggestions(game).map(chip => chip.textContent);

    setLocale('en');

    const after = suggestions(game).map(chip => chip.textContent);
    expect(after).toHaveLength(3);
    expect(after).not.toEqual(before);
  });
});
