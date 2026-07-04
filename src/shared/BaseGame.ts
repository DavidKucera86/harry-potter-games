import { GAME_CONFIG } from './config.js';
import { pickFromRemaining, shuffle } from './deckUtils.js';
import { getStrings, LOCALE_CHANGE_EVENT } from './i18n/index.js';
import type { LoadGameDataOptions, MessageType, ModalLine } from './types.js';

export class BaseGame {
  isReady = false;
  lives = GAME_CONFIG.MAX_LIVES;
  gameOver = false;
  score = 0;
  remainingItems: unknown[] = [];
  deckSource: unknown[] = [];
  roundTimeoutId: ReturnType<typeof setTimeout> | null = null;
  _loadError?: string;

  heartsEl: HTMLElement | null = null;
  messageEl: HTMLElement | null = null;
  newGameBtn: HTMLButtonElement | null = null;
  overlay: HTMLElement | null = null;
  modalDialog: HTMLElement | null = null;
  modalIcon: HTMLElement | null = null;
  modalTitle: HTMLElement | null = null;
  modalText: HTMLElement | null = null;
  modalBtn: HTMLButtonElement | null = null;
  scoreEl: HTMLElement | null = null;
  loadingOverlay: HTMLElement | null = null;
  gameContainer: HTMLElement | null = null;

  _modalKeydownHandler: (event: KeyboardEvent) => void;
  _localeChangeHandler: () => void;
  _previousFocus: HTMLElement | null = null;
  _onNewGame?: () => void;

  constructor() {
    this._modalKeydownHandler = this._handleModalKeydown.bind(this);
    this._localeChangeHandler = this._handleLocaleChange.bind(this);
    this.bindCommonElements();
    if (typeof document !== 'undefined') {
      document.addEventListener(LOCALE_CHANGE_EVENT, this._localeChangeHandler);
    }
  }

  _handleLocaleChange() {
    this.renderHearts();
    this.onLocaleChange();
  }

  onLocaleChange(): void {
    // override in subclasses
  }

  isModalOpen() {
    return this.overlay?.classList.contains('visible') ?? false;
  }

  getMessageType(): MessageType | null {
    if (!this.messageEl) return null;
    const match = this.messageEl.className.match(/\b(info|success|error)\b/);
    return match ? match[1] as MessageType : null;
  }

  bindCommonElements() {
    this.heartsEl = document.getElementById('hearts');
    this.messageEl = document.getElementById('message');
    this.newGameBtn = document.getElementById('newGameBtn') as HTMLButtonElement | null;
    this.overlay = document.getElementById('overlay');
    this.modalDialog = document.getElementById('modal');
    this.modalIcon = document.getElementById('modalIcon');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalText = document.getElementById('modalText');
    this.modalBtn = document.getElementById('modalBtn') as HTMLButtonElement | null;
    this.scoreEl = document.getElementById('score');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.gameContainer = document.querySelector('.game-container');
  }

  bindCommonEvents(onNewGame: () => void) {
    this._onNewGame = onNewGame;
    if (this.newGameBtn) {
      this.newGameBtn.addEventListener('click', onNewGame);
    }
    if (this.modalBtn) {
      this.modalBtn.addEventListener('click', onNewGame);
    }
  }

  clearRoundTimeout() {
    if (this.roundTimeoutId !== null) {
      clearTimeout(this.roundTimeoutId);
      this.roundTimeoutId = null;
    }
  }

  scheduleRoundTimeout(callback: () => void, delayMs = GAME_CONFIG.ROUND_DELAY_MS) {
    this.clearRoundTimeout();
    this.roundTimeoutId = setTimeout(callback, delayMs);
  }

  createHeartSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    );
    svg.appendChild(path);
    return svg;
  }

  renderHearts() {
    if (!this.heartsEl) return;

    this.heartsEl.replaceChildren();
    this.heartsEl.setAttribute('aria-label', `${getStrings().a11y.livesLabel}: ${this.lives}`);

    for (let i = 0; i < GAME_CONFIG.MAX_LIVES; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart' + (i >= this.lives ? ' lost' : '');
      heart.setAttribute('aria-hidden', 'true');
      heart.appendChild(this.createHeartSvg());
      this.heartsEl.appendChild(heart);
    }
  }

  renderScore() {
    if (this.scoreEl) {
      this.scoreEl.textContent = String(this.score);
    }
  }

  setMessage(text: string, type: MessageType) {
    if (!this.messageEl) return;

    this.messageEl.textContent = text;
    this.messageEl.className = 'message ' + type;
  }

  showLoading(show: boolean, text?: string) {
    if (!this.loadingOverlay) return;

    this.loadingOverlay.hidden = !show;
    if (this.gameContainer) {
      this.gameContainer.setAttribute('aria-busy', show ? 'true' : 'false');
    }
    if (text) {
      const label = this.loadingOverlay.querySelector('p');
      if (label) label.textContent = text;
    }
  }

  openModal() {
    if (!this.overlay) return;

    this._previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    this.overlay.removeAttribute('inert');
    this.overlay.classList.add('visible');
    this.overlay.setAttribute('aria-hidden', 'false');
    this.modalDialog?.setAttribute('aria-hidden', 'false');
    this.gameContainer?.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this._modalKeydownHandler);
    requestAnimationFrame(() => {
      this.modalBtn?.focus();
    });
  }

  closeModal() {
    if (!this.overlay) return;

    this.overlay.classList.remove('visible');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('inert', '');
    this.modalDialog?.setAttribute('aria-hidden', 'true');
    this.gameContainer?.setAttribute('aria-hidden', 'false');
    document.removeEventListener('keydown', this._modalKeydownHandler);

    this._previousFocus?.focus();
  }

  _getModalFocusables() {
    if (!this.modalDialog) return [];

    return [...this.modalDialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.hasAttribute('disabled'));
  }

  _handleModalKeydown(event: KeyboardEvent) {
    if (!this.overlay?.classList.contains('visible')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this._onNewGame?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusables = this._getModalFocusables();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  fillModalLines(lines: ModalLine[]) {
    if (!this.modalText) return;

    this.modalText.replaceChildren();

    lines.forEach((line, index) => {
      if (index > 0) {
        this.modalText!.appendChild(document.createElement('br'));
        if (line.gap) {
          this.modalText!.appendChild(document.createElement('br'));
        }
      }

      if (line.label !== undefined) {
        this.modalText!.appendChild(document.createTextNode(line.label + ' '));
        const highlight = document.createElement('span');
        highlight.className = 'highlight';
        highlight.textContent = String(line.value);
        this.modalText!.appendChild(highlight);
      } else if (line.text) {
        this.modalText!.appendChild(document.createTextNode(line.text));
      }
    });
  }

  shuffle<T>(array: T[]) {
    return shuffle(array);
  }

  resetDeck<T>(items: T[]) {
    this.deckSource = items;
    this.remainingItems = shuffle([...items]);
  }

  pickFromDeck<T>(filterFn?: (item: T) => boolean): T | null {
    if (this.remainingItems.length === 0) {
      this.resetDeck(this.deckSource as T[]);
    }

    const { item, index } = pickFromRemaining(this.remainingItems as T[], filterFn);
    if (!item || index === -1) {
      return null;
    }

    this.remainingItems.splice(index, 1);
    return item;
  }

  returnToDeck<T>(item: T) {
    this.remainingItems.push(item);
  }

  removeFromDeck<T>(item: T, compareFn: (a: T, b: T) => boolean = (a, b) => a === b) {
    this.deckSource = this.deckSource.filter(entry => !compareFn(entry as T, item));
    this.remainingItems = this.remainingItems.filter(entry => !compareFn(entry as T, item));
  }

  async loadGameData<T, R>({
    fetchFn,
    transform,
    minCount = 1,
    emptyError,
    logLabel,
    assign,
    onError,
  }: LoadGameDataOptions<T, R>) {
    try {
      const data = await fetchFn();
      const items = transform(data);

      if (items.length < minCount) {
        throw new Error(emptyError);
      }

      assign(items);
      this.isReady = true;
      return true;
    } catch (error) {
      console.error(`Chyba při načítání ${logLabel}:`, error);
      this.isReady = false;
      onError?.(error);
      return false;
    }
  }
}
