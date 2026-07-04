import { GAME_CONFIG } from './config.js';
import { BaseGame } from './BaseGame.js';
import { getAutoRevealedLetters, getWordLetters, normalizeLetter } from './hangmanUtils.js';
import type { HangmanConfig } from './types.js';

export class HangmanGame extends BaseGame {
  config: HangmanConfig;
  words: string[] = [];
  currentWord = '';
  guessedLetters = new Set<string>();
  wrongLetters = new Set<string>();

  wordDisplayEl: HTMLElement | null = null;
  wrongLettersEl: HTMLElement | null = null;
  letterInput: HTMLInputElement | null = null;
  guessBtn: HTMLButtonElement | null = null;

  constructor(config: HangmanConfig) {
    super();
    this.config = config;

    this.wordDisplayEl = document.getElementById('wordDisplay');
    this.wrongLettersEl = document.getElementById('wrongLetters');
    this.letterInput = document.getElementById('letterInput') as HTMLInputElement | null;
    this.guessBtn = document.getElementById('guessBtn') as HTMLButtonElement | null;

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());

    if (this.guessBtn) {
      this.guessBtn.addEventListener('click', () => {
        this.guessLetter(this.letterInput?.value ?? '');
      });
    }

    if (this.letterInput) {
      this.letterInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.guessLetter(this.letterInput!.value);
        }
      });

      this.letterInput.addEventListener('input', () => {
        this.letterInput!.value = this.letterInput!.value.slice(-1);
      });

      this.letterInput.addEventListener('focus', () => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          this.letterInput!.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }
  }

  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, this.config.loadingText);
    this.wordDisplayEl?.replaceChildren();

    const loaded = await this.loadWords();
    this.showLoading(false);

    if (loaded) {
      this.resetDeck(this.words);
      this.startNewGame();
    } else {
      this.setMessage(this._loadError ?? this.config.loadError, 'error');
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
    }
  }

  resolveLoadError(error: unknown) {
    return error instanceof Error && error.name === 'FetchTimeoutError'
      ? this.config.fetchTimeoutError ?? this.config.loadError
      : this.config.loadError;
  }

  loadWords() {
    return this.loadGameData({
      fetchFn: this.config.fetchFn,
      transform: this.config.transform,
      minCount: 1,
      emptyError: this.config.emptyError,
      logLabel: this.config.logLabel,
      assign: items => { this.words = items; },
      onError: (error) => {
        this.words = [];
        this._loadError = this.resolveLoadError(error);
      },
    });
  }

  setControlsEnabled(enabled: boolean) {
    if (this.guessBtn) this.guessBtn.disabled = !enabled;
    if (this.letterInput) this.letterInput.disabled = !enabled;
    if (this.newGameBtn) this.newGameBtn.disabled = !enabled;
  }

  isLetterInWord(letter: string) {
    return getWordLetters(this.currentWord).some(
      ch => normalizeLetter(ch) === letter
    );
  }

  isWordComplete() {
    return getWordLetters(this.currentWord).every(
      ch => this.guessedLetters.has(normalizeLetter(ch))
    );
  }

  applyAutoRevealedLetters() {
    for (const letter of getAutoRevealedLetters(this.currentWord)) {
      this.guessedLetters.add(letter);
    }
  }

  renderWord() {
    if (!this.wordDisplayEl) return;

    this.wordDisplayEl.replaceChildren();
    let group: HTMLDivElement | null = null;
    let letterCount = 0;
    let maxLetterCount = 0;

    const finalizeGroup = () => {
      if (letterCount > 0) {
        maxLetterCount = Math.max(maxLetterCount, letterCount);
      }
      letterCount = 0;
    };

    for (const ch of this.currentWord) {
      if (ch === ' ') {
        if (group) {
          const space = document.createElement('div');
          space.className = 'letter-slot space';
          space.setAttribute('aria-hidden', 'true');
          group.appendChild(space);
        }
        finalizeGroup();
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
      letterCount++;
    }

    finalizeGroup();

    if (maxLetterCount > 0) {
      this.wordDisplayEl.style.setProperty('--slot-count', String(maxLetterCount));
    }
  }

  formatWrongLetters() {
    if (this.wrongLetters.size === 0) {
      return this.config.strings.noWrongLetters;
    }
    return [...this.wrongLetters].join(' ').toUpperCase();
  }

  renderWrongLetters() {
    if (!this.wrongLettersEl) return;
    this.wrongLettersEl.textContent = this.formatWrongLetters();
  }

  showModal(won: boolean) {
    if (!this.modalIcon || !this.modalTitle) return;

    if (won) {
      this.modalIcon.textContent = '🎉';
      this.modalTitle.textContent = this.config.strings.winTitle;
      this.fillModalLines([
        { label: this.config.strings.winLabel, value: this.currentWord },
        { label: this.config.strings.scoreLabel, value: this.score, gap: true },
      ]);
    } else {
      this.modalIcon.textContent = '💀';
      this.modalTitle.textContent = this.config.strings.loseTitle;
      this.fillModalLines([
        { label: this.config.strings.loseLabel, value: this.currentWord },
        { label: this.config.strings.scoreLabel, value: this.score, gap: true },
        { label: this.config.strings.wrongLettersLabel, value: this.formatWrongLetters(), gap: true },
      ]);
    }
    this.openModal();
  }

  endGame(won: boolean) {
    this.gameOver = true;
    if (won) {
      this.score++;
      this.renderScore();
    }
    this.guessedLetters = new Set(
      getWordLetters(this.currentWord).map(ch => normalizeLetter(ch))
    );
    this.renderWord();
    if (this.guessBtn) this.guessBtn.disabled = true;
    if (this.letterInput) this.letterInput.disabled = true;
    this.showModal(won);
  }

  async startNewGame() {
    this.clearRoundTimeout();

    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, this.config.loadingText);
      this.wordDisplayEl?.replaceChildren();

      const loaded = await this.loadWords();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(this._loadError ?? this.config.loadError, 'error');
        if (this.newGameBtn) {
          this.newGameBtn.disabled = false;
        }
        return;
      }

      this.resetDeck(this.words);
    }

    this.currentWord = this.pickFromDeck<string>() ?? '';
    if (!this.currentWord) {
      this.setMessage(this.config.emptyError, 'error');
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();
    this.applyAutoRevealedLetters();
    this.lives = GAME_CONFIG.MAX_LIVES;
    this.gameOver = false;

    this.renderHearts();
    this.renderWord();
    this.renderWrongLetters();
    this.setMessage(this.config.strings.guessPrompt, 'info');

    this.setControlsEnabled(true);
    if (this.letterInput) {
      this.letterInput.value = '';
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        this.letterInput.focus({ preventScroll: true });
      }
    }
    this.closeModal();
  }

  guessLetter(rawLetter: string) {
    if (this.gameOver || !this.isReady) return;

    const letter = normalizeLetter(rawLetter);
    if (!letter || !/^[a-z]$/.test(letter)) {
      this.setMessage(this.config.strings.invalidLetter, 'error');
      return;
    }

    if (this.guessedLetters.has(letter) || this.wrongLetters.has(letter)) {
      this.setMessage(this.config.strings.letterAlreadyGuessed(letter), 'error');
      if (this.letterInput) {
        this.letterInput.value = '';
      }
      return;
    }

    if (this.letterInput) {
      this.letterInput.value = '';
    }

    if (this.isLetterInWord(letter)) {
      this.guessedLetters.add(letter);
      this.renderWord();
      this.setMessage(this.config.strings.correct(letter), 'success');

      if (this.isWordComplete()) {
        this.endGame(true);
      }
    } else {
      this.wrongLetters.add(letter);
      this.lives--;
      this.renderHearts();
      this.renderWrongLetters();
      this.setMessage(this.config.strings.wrong(letter), 'error');

      if (this.lives <= 0) {
        this.endGame(false);
      }
    }
  }
}
