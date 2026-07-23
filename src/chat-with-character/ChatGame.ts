import { BaseGame } from '../shared/BaseGame.js';
import { getLocale, getStrings } from '../shared/i18n/index.js';
import { resolveReply, validateNickname, type ChatCharacter } from '../shared/chatEngine.js';
import { CHAT_CHARACTERS, getChatCharacter, TOPICS } from './data/index.js';

type MessageRole = 'user' | 'character';

/** How many recent character replies to avoid repeating. */
const RECENT_REPLY_MEMORY = 4;

/**
 * Rule-based chat: the player picks a character and a nickname, then exchanges
 * messages. Replies are canned, chosen by keyword match — there is no LLM and no
 * network call. Every rendered string goes through textContent, never innerHTML,
 * so untrusted input can never inject markup.
 */
export class ChatGame extends BaseGame {
  setupSection: HTMLElement | null = null;
  chatSection: HTMLElement | null = null;
  setupForm: HTMLFormElement | null = null;
  nicknameInput: HTMLInputElement | null = null;
  characterSelect: HTMLSelectElement | null = null;
  setupError: HTMLElement | null = null;
  chatForm: HTMLFormElement | null = null;
  messageInput: HTMLInputElement | null = null;
  chatLog: HTMLElement | null = null;
  partnerNameEl: HTMLElement | null = null;
  partnerTitleEl: HTMLElement | null = null;
  backBtn: HTMLButtonElement | null = null;

  nickname = '';
  character: ChatCharacter | null = null;
  recentReplies: string[] = [];

  constructor() {
    super();

    this.setupSection = document.getElementById('chatSetup');
    this.chatSection = document.getElementById('chatRoom');
    this.setupForm = document.getElementById('setupForm') as HTMLFormElement | null;
    this.nicknameInput = document.getElementById('nickname') as HTMLInputElement | null;
    this.characterSelect = document.getElementById('characterSelect') as HTMLSelectElement | null;
    this.setupError = document.getElementById('setupError');
    this.chatForm = document.getElementById('chatForm') as HTMLFormElement | null;
    this.messageInput = document.getElementById('messageInput') as HTMLInputElement | null;
    this.chatLog = document.getElementById('chatLog');
    this.partnerNameEl = document.getElementById('partnerName');
    this.partnerTitleEl = document.getElementById('partnerTitle');
    this.backBtn = document.getElementById('backToSetupBtn') as HTMLButtonElement | null;

    this.populateCharacterOptions();

    this.setupForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.startChat();
    });
    this.chatForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.sendMessage();
    });
    this.backBtn?.addEventListener('click', () => this.backToSetup());

    this.isReady = true;
  }

  onLocaleChange(): void {
    this.populateCharacterOptions();
    if (this.character) {
      this.renderPartner(this.character);
    }
  }

  populateCharacterOptions(): void {
    if (!this.characterSelect) return;

    const previous = this.characterSelect.value;
    const locale = getLocale();

    this.characterSelect.replaceChildren();
    for (const character of CHAT_CHARACTERS) {
      const option = document.createElement('option');
      option.value = character.id;
      option.textContent = character.name[locale];
      this.characterSelect.appendChild(option);
    }

    if (previous) {
      this.characterSelect.value = previous;
    }
  }

  startChat(): void {
    const strings = getStrings();

    const nickname = validateNickname(this.nicknameInput?.value ?? '');
    if (!nickname.ok) {
      this.showSetupError(
        nickname.reason === 'empty'
          ? strings.chat.errorEmptyNickname
          : strings.chat.errorTooLongNickname,
      );
      this.nicknameInput?.focus();
      return;
    }

    const character = getChatCharacter(this.characterSelect?.value ?? '');
    if (!character) {
      this.showSetupError(strings.chat.errorNoCharacter);
      return;
    }

    this.clearSetupError();
    this.nickname = nickname.value;
    this.character = character;
    this.recentReplies = [];

    this.renderPartner(character);
    this.chatLog?.replaceChildren();
    this.showChatScreen(true);
    this.appendMessage('character', character.name[getLocale()], strings.chat.greeting(this.nickname));
    this.messageInput?.focus();
  }

  sendMessage(): void {
    if (!this.character || !this.messageInput) return;

    const text = this.messageInput.value.trim();
    if (text.length === 0) return;

    const locale = getLocale();
    this.appendMessage('user', this.nickname, text);

    const reply = resolveReply(text, this.character, CHAT_CHARACTERS, TOPICS, locale, {
      exclude: this.recentReplies,
    });
    this.rememberReply(reply);
    this.appendMessage('character', this.character.name[locale], reply);

    this.messageInput.value = '';
    this.messageInput.focus();
  }

  backToSetup(): void {
    this.showChatScreen(false);
    this.nicknameInput?.focus();
  }

  /** Records a reply and keeps only the most recent ones, to avoid repeats. */
  rememberReply(reply: string): void {
    this.recentReplies.push(reply);
    if (this.recentReplies.length > RECENT_REPLY_MEMORY) {
      this.recentReplies.shift();
    }
  }

  renderPartner(character: ChatCharacter): void {
    const locale = getLocale();
    if (this.partnerNameEl) this.partnerNameEl.textContent = character.name[locale];
    if (this.partnerTitleEl) this.partnerTitleEl.textContent = character.title[locale];
  }

  showChatScreen(show: boolean): void {
    if (this.setupSection) this.setupSection.hidden = show;
    if (this.chatSection) this.chatSection.hidden = !show;
  }

  showSetupError(text: string): void {
    if (!this.setupError) return;
    this.setupError.textContent = text;
    this.setupError.hidden = false;
  }

  clearSetupError(): void {
    if (!this.setupError) return;
    this.setupError.textContent = '';
    this.setupError.hidden = true;
  }

  /** Appends one message. Author and text are set via textContent only. */
  appendMessage(role: MessageRole, author: string, text: string): void {
    if (!this.chatLog) return;

    const message = document.createElement('div');
    message.className = `chat-message chat-message--${role}`;

    const authorEl = document.createElement('span');
    authorEl.className = 'chat-message-author';
    authorEl.textContent = author;

    const textEl = document.createElement('p');
    textEl.className = 'chat-message-text';
    textEl.textContent = text;

    message.append(authorEl, textEl);
    this.chatLog.appendChild(message);
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
  }
}
