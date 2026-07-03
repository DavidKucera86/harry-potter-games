import { BaseGame } from './BaseGame.js';
import { GAME_CONFIG } from './config.js';
import { getWordLetters, normalizeLetter } from './hangmanUtils.js';

export class HangmanGame extends BaseGame {
  constructor(options) {
    super();
    this.options = options;
    this.items = [];
    this.currentWord = '';
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();

    this.wordDisplayEl = document.getElementById('wordDisplay');
    this.wrongLettersEl = document.getElementById('wrongLetters');
    this.letterInput = document.getElementById('letterInput');
    this.guessBtn = document.getElementById('guessBtn');

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());

    this.guessBtn?.addEventListener('click', () => {
      this.guessLetter(this.letterInput.value);
    });

    this.letterInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.guessLetter(this.letterInput.value);
      }
    });

    this.letterInput?.addEventListener('input', () => {
      this.letterInput.value = this.letterInput.value.slice(-1);
    });
  }

  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, this.options.loadingText);
    this.wordDisplayEl?.replaceChildren();

    const loaded = await this.loadItems();
    this.showLoading(false);

    if (loaded) {
      this.resetDeck(this.items);
      this.startNewGame();
    } else {
      this.setMessage(this._loadError ?? this.options.loadError, 'error');
      if (this.newGameBtn) this.newGameBtn.disabled = false;
    }
  }

  resolveLoadError(error) {
    return error?.name === 'FetchTimeoutError'
      ? this.options.fetchTimeoutError ?? this.options.loadError
      : this.options.loadError;
  }

  loadItems() {
    return this.loadGameData({
      fetchFn: this.options.fetchFn,
      transform: this.options.transform,
      minCount: this.options.minCount ?? 1,
      emptyError: this.options.emptyError,
      logLabel: this.options.logLabel,
      assign: items => { this.items = items; },
      onError: (error) => {
        this.items = [];
        this._loadError = this.resolveLoadError(error);
      },
    });
  }

  setControlsEnabled(enabled) {
    if (this.guessBtn) this.guessBtn.disabled = !enabled;
    if (this.letterInput) this.letterInput.disabled = !enabled;
    if (this.newGameBtn) this.newGameBtn.disabled = !enabled;
  }

  isLetterInWord(letter) {
    return getWordLetters(this.currentWord).some(
      ch => normalizeLetter(ch) === letter
    );
  }

  isWordComplete() {
    return getWordLetters(this.currentWord).every(
      ch => this.guessedLetters.has(normalizeLetter(ch))
    );
  }

  renderWord() {
    if (!this.wordDisplayEl) return;

    this.wordDisplayEl.replaceChildren();
    let group = null;

    for (const ch of this.currentWord) {
      if (ch === ' ') {
        if (group) {
          const space = document.createElement('div');
          space.className = 'letter-slot space';
          space.setAttribute('aria-hidden', 'true');
          group.appendChild(space);
        }
        group = null;
        continue;
      }

      if (!group) {
        group = document.createElement('div');
        group.className = 'word-group';
        this.wordDisplayEl.appendChild(group);
      }

      const normalized = normalizeLetter(ch);
      const isRevealed = this.guessedLetters.has(normalized);
      const slot = document.createElement('div');
      slot.className = 'letter-slot' + (isRevealed ? ' revealed' : '');
      slot.textContent = isRevealed ? ch.toUpperCase() : '';
      group.appendChild(slot);
    }
  }

  renderWrongLetters() {
    if (!this.wrongLettersEl) return;

    if (this.wrongLetters.size === 0) {
      this.wrongLettersEl.textContent = this.options.noWrongLetters;
    } else {
      this.wrongLettersEl.textContent = [...this.wrongLetters].join(' ').toUpperCase();
    }
  }

  showModal(won) {
    if (won) {
      this.modalIcon.textContent = '🎉';
      this.modalTitle.textContent = this.options.winTitle;
      this.fillModalLines([
        { label: this.options.winLabel, value: this.currentWord },
      ]);
    } else {
      this.modalIcon.textContent = '💀';
      this.modalTitle.textContent = this.options.loseTitle;
      this.fillModalLines([
        { label: this.options.loseLabel, value: this.currentWord },
      ]);
    }
    this.openModal();
  }

  endGame(won) {
    this.gameOver = true;
    this.guessedLetters = new Set(
      getWordLetters(this.currentWord).map(ch => normalizeLetter(ch))
    );
    this.renderWord();
    if (this.guessBtn) this.guessBtn.disabled = true;
    if (this.letterInput) this.letterInput.disabled = true;
    this.showModal(won);
  }

  async startNewGame() {
    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, this.options.loadingText);
      this.wordDisplayEl?.replaceChildren();

      const loaded = await this.loadItems();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(this._loadError ?? this.options.loadError, 'error');
        if (this.newGameBtn) this.newGameBtn.disabled = false;
        return;
      }

      this.resetDeck(this.items);
    }

    this.currentWord = this.pickFromDeck();
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();
    this.lives = GAME_CONFIG.MAX_LIVES;
    this.gameOver = false;

    this.renderHearts();
    this.renderWord();
    this.renderWrongLetters();
    this.setMessage(this.options.guessPrompt, 'info');

    this.setControlsEnabled(true);
    if (this.letterInput) {
      this.letterInput.value = '';
      this.letterInput.focus();
    }
    this.closeModal();
  }

  guessLetter(rawLetter) {
    if (this.gameOver || !this.isReady) return;

    const letter = normalizeLetter(rawLetter);
    if (!letter || !/^[a-z]$/.test(letter)) {
      this.setMessage(this.options.invalidLetter, 'error');
      return;
    }

    if (this.guessedLetters.has(letter) || this.wrongLetters.has(letter)) {
      this.setMessage(this.options.letterAlreadyGuessed(letter), 'error');
      if (this.letterInput) this.letterInput.value = '';
      return;
    }

    if (this.letterInput) this.letterInput.value = '';

    if (this.isLetterInWord(letter)) {
      this.guessedLetters.add(letter);
      this.renderWord();
      this.setMessage(this.options.correctMessage(letter), 'success');

      if (this.isWordComplete()) {
        this.endGame(true);
      }
    } else {
      this.wrongLetters.add(letter);
      this.lives--;
      this.renderHearts();
      this.renderWrongLetters();
      this.setMessage(this.options.wrongMessage(letter), 'error');

      if (this.lives <= 0) {
        this.endGame(false);
      }
    }
  }
}
