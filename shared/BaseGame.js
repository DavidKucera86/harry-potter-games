import { GAME_CONFIG } from './config.js';

export class BaseGame {
  constructor() {
    this.isReady = false;
    this.lives = GAME_CONFIG.MAX_LIVES;
    this.gameOver = false;
    this.score = 0;
    this.remainingItems = [];
    this.deckSource = [];
    this._modalKeydownHandler = this._handleModalKeydown.bind(this);
    this._previousFocus = null;
    this.bindCommonElements();
  }

  bindCommonElements() {
    this.heartsEl = document.getElementById('hearts');
    this.messageEl = document.getElementById('message');
    this.newGameBtn = document.getElementById('newGameBtn');
    this.overlay = document.getElementById('overlay');
    this.modalDialog = document.getElementById('modal');
    this.modalIcon = document.getElementById('modalIcon');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalText = document.getElementById('modalText');
    this.modalBtn = document.getElementById('modalBtn');
    this.scoreEl = document.getElementById('score');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.gameContainer = document.querySelector('.game-container');
  }

  bindCommonEvents(onNewGame) {
    this._onNewGame = onNewGame;
    this.newGameBtn?.addEventListener('click', onNewGame);
    this.modalBtn?.addEventListener('click', onNewGame);
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
    for (let i = 0; i < GAME_CONFIG.MAX_LIVES; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart' + (i >= this.lives ? ' lost' : '');
      heart.appendChild(this.createHeartSvg());
      this.heartsEl.appendChild(heart);
    }
  }

  renderScore() {
    if (this.scoreEl) {
      this.scoreEl.textContent = String(this.score);
    }
  }

  setMessage(text, type) {
    if (!this.messageEl) return;

    this.messageEl.textContent = text;
    this.messageEl.className = 'message ' + type;
  }

  showLoading(show, text) {
    if (!this.loadingOverlay) return;

    this.loadingOverlay.hidden = !show;
    if (text) {
      const label = this.loadingOverlay.querySelector('p');
      if (label) label.textContent = text;
    }
  }

  openModal() {
    if (!this.overlay) return;

    this._previousFocus = document.activeElement;
    this.overlay.classList.add('visible');
    this.modalDialog?.setAttribute('aria-hidden', 'false');
    this.gameContainer?.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this._modalKeydownHandler);
    this.modalBtn?.focus();
  }

  closeModal() {
    if (!this.overlay) return;

    this.overlay.classList.remove('visible');
    this.modalDialog?.setAttribute('aria-hidden', 'true');
    this.gameContainer?.setAttribute('aria-hidden', 'false');
    document.removeEventListener('keydown', this._modalKeydownHandler);

    if (this._previousFocus?.focus) {
      this._previousFocus.focus();
    }
  }

  _getModalFocusables() {
    if (!this.modalDialog) return [];

    return [...this.modalDialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.hasAttribute('disabled'));
  }

  _handleModalKeydown(event) {
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

  fillModalLines(lines) {
    if (!this.modalText) return;

    this.modalText.replaceChildren();

    lines.forEach((line, index) => {
      if (index > 0) {
        this.modalText.appendChild(document.createElement('br'));
        if (line.gap) {
          this.modalText.appendChild(document.createElement('br'));
        }
      }

      if (line.label !== undefined) {
        this.modalText.appendChild(document.createTextNode(line.label + ' '));
        const highlight = document.createElement('span');
        highlight.className = 'highlight';
        highlight.textContent = String(line.value);
        this.modalText.appendChild(highlight);
      } else if (line.text) {
        this.modalText.appendChild(document.createTextNode(line.text));
      }
    });
  }

  shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  resetDeck(items) {
    this.deckSource = items;
    this.remainingItems = this.shuffle([...items]);
  }

  pickFromDeck() {
    if (this.remainingItems.length === 0) {
      this.resetDeck(this.deckSource);
    }

    const index = Math.floor(Math.random() * this.remainingItems.length);
    return this.remainingItems.splice(index, 1)[0];
  }

  returnToDeck(item) {
    this.remainingItems.push(item);
  }

  removeFromDeck(item, compareFn = (a, b) => a === b) {
    this.deckSource = this.deckSource.filter(entry => !compareFn(entry, item));
    this.remainingItems = this.remainingItems.filter(entry => !compareFn(entry, item));
  }

  async loadGameData({ fetchFn, transform, minCount = 1, emptyError, logLabel, assign, onError }) {
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
      if (onError) {
        onError(error);
      }
      return false;
    }
  }
}
