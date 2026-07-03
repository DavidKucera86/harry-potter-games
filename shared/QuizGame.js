import { BaseGame } from './BaseGame.js';
import { GAME_CONFIG } from './config.js';

export class QuizGame extends BaseGame {
  constructor(options) {
    super();
    this.options = options;
    this.items = [];
    this.currentItem = null;
    this.lastAnswer = null;
    this.choicesEl = document.getElementById('choices');

    this.bindCommonEvents(() => this.startNewGame());
    this.init();
  }

  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, this.options.loadingText);

    const loaded = await this.loadItems();
    this.showLoading(false);

    if (loaded) {
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
      minCount: this.options.minCount ?? 4,
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
    if (this.newGameBtn) this.newGameBtn.disabled = !enabled;
    this.choicesEl?.querySelectorAll('button').forEach(btn => {
      btn.disabled = !enabled;
    });
  }

  markChoice(btn, correct, label) {
    btn.classList.add(correct ? 'correct' : 'wrong');
    btn.setAttribute('aria-pressed', String(correct));
    btn.setAttribute(
      'aria-label',
      correct ? this.options.choiceCorrect(label) : this.options.choiceWrong(label)
    );
  }

  handleGuess(selected, btn) {
    if (this.gameOver || !this.isReady) return;

    this.setControlsEnabled(false);
    const correct = this.options.isCorrect(selected, this.currentItem);
    this.lastAnswer = this.options.buildLastAnswer(this.currentItem);
    const label = this.options.getChoiceLabel(selected);

    this.markChoice(btn, correct, label);

    if (correct) {
      this.score++;
      this.renderScore();
      this.setMessage(this.options.getCorrectMessage(this.currentItem, selected), 'success');
      setTimeout(() => this.nextRound(), GAME_CONFIG.ROUND_DELAY_MS);
    } else {
      this.lives--;
      this.renderHearts();
      this.setMessage(this.options.getWrongMessage(this.currentItem, selected), 'error');

      if (this.lives <= 0) {
        setTimeout(() => this.endGame(), GAME_CONFIG.ROUND_DELAY_MS);
      } else {
        setTimeout(() => this.nextRound(), GAME_CONFIG.ROUND_DELAY_MS);
      }
    }
  }

  nextRound() {
    if (this.gameOver) return;
    this.options.renderRound.call(this);
    this.setControlsEnabled(true);
    this.setMessage(this.options.promptMessage, 'info');
  }

  showModal() {
    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = this.options.loseTitle;
    this.fillModalLines(this.options.buildModalLines(this.lastAnswer, this.score));
    this.openModal();
  }

  endGame() {
    this.gameOver = true;
    this.setControlsEnabled(false);
    this.showModal();
  }

  async startNewGame() {
    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, this.options.loadingText);

      const loaded = await this.loadItems();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(this._loadError ?? this.options.loadError, 'error');
        if (this.newGameBtn) this.newGameBtn.disabled = false;
        return;
      }
    }

    this.lives = GAME_CONFIG.MAX_LIVES;
    this.score = 0;
    this.gameOver = false;
    this.options.onNewGame?.call(this);
    this.resetDeck(this.items);
    this.renderHearts();
    this.renderScore();
    this.options.renderRound.call(this);
    this.setControlsEnabled(true);
    this.setMessage(this.options.promptMessage, 'info');
    this.closeModal();
  }
}
