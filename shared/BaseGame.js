import { GAME_CONFIG } from './config.js';
import { pickFromRemaining, shuffle } from './deckUtils.js';
import { STRINGS } from './strings.js';

export class BaseGame {
  constructor() {
    this.isReady = false;
    this.lives = GAME_CONFIG.MAX_LIVES;
    this.gameOver = false;
    this.score = 0;
    this.remainingItems = [];
    this.deckSource = [];
    this.roundTimeoutId = null;
    this.bindCommonElements();
  }

  bindCommonElements() {
    this.heartsEl = document.getElementById('hearts');
    this.messageEl = document.getElementById('message');
    this.newGameBtn = document.getElementById('newGameBtn');
    this.overlay = document.getElementById('overlay');
    this.modalIcon = document.getElementById('modalIcon');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalText = document.getElementById('modalText');
    this.modalBtn = document.getElementById('modalBtn');
    this.scoreEl = document.getElementById('score');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.gameContainer = document.querySelector('.game-container');
  }

  bindCommonEvents(onNewGame) {
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

  scheduleRoundTimeout(callback, delayMs = 1200) {
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
    this.heartsEl.setAttribute('aria-label', `${STRINGS.a11y.livesLabel}: ${this.lives}`);

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

  setMessage(text, type) {
    if (!this.messageEl) return;

    this.messageEl.textContent = text;
    this.messageEl.className = 'message ' + type;
  }

  showLoading(show, text) {
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

    this.overlay.removeAttribute('inert');
    this.overlay.classList.add('visible');
    this.overlay.setAttribute('aria-hidden', 'false');
    if (this.modalBtn) {
      this.modalBtn.focus();
    }
  }

  closeModal() {
    if (!this.overlay) return;

    this.overlay.classList.remove('visible');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('inert', '');
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
    return shuffle(array);
  }

  resetDeck(items) {
    this.deckSource = items;
    this.remainingItems = shuffle([...items]);
  }

  pickFromDeck(filterFn) {
    if (this.remainingItems.length === 0) {
      this.resetDeck(this.deckSource);
    }

    const { item, index } = pickFromRemaining(this.remainingItems, filterFn);
    if (!item || index === -1) {
      return null;
    }

    this.remainingItems.splice(index, 1);
    return item;
  }

  returnToDeck(item) {
    this.remainingItems.push(item);
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
        onError();
      }
      return false;
    }
  }
}
