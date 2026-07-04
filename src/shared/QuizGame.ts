import { GAME_CONFIG } from './config.js';
import { getCharacters } from './dataProvider.js';
import { getStrings } from './i18n/index.js';
import { BaseGame } from './BaseGame.js';
import type { Character, QuizConfig } from './types.js';

export class QuizGame extends BaseGame {
  config: QuizConfig<this>;
  characters: Character[] = [];
  currentCharacter: Character | null = null;
  lastAnswer: Record<string, string> | null = null;
  choicesEl: HTMLElement | null = null;
  _lastFeedback: { correct: boolean } | null = null;

  constructor(config: QuizConfig<this>) {
    super();
    this.config = config;
    this.choicesEl = document.getElementById('choices');

    this.bindCommonEvents(() => this.startNewGame());
    config.bindExtraEvents?.call(this);
    this.init();
  }

  async init() {
    const strings = getStrings();
    this.setControlsEnabled(false);
    this.showLoading(true, strings.loading.characters);

    const loaded = await this.loadCharacters();
    this.showLoading(false);

    if (loaded) {
      this.startNewGame();
    } else {
      this.setMessage(this._loadError ?? strings.errors.loadCharacters, 'error');
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
    }
  }

  loadCharacters() {
    const strings = getStrings();
    return this.loadGameData({
      fetchFn: getCharacters,
      transform: this.config.transform,
      minCount: this.config.minCount ?? 4,
      emptyError: this.config.resolveEmptyError(),
      logLabel: 'postav',
      assign: items => { this.characters = items; },
      onError: (error) => {
        this.characters = [];
        this._loadError = error instanceof Error && error.name === 'FetchTimeoutError'
          ? strings.errors.fetchTimeoutCharacters
          : strings.errors.loadCharacters;
      },
    });
  }

  setControlsEnabled(enabled: boolean) {
    if (this.newGameBtn) {
      this.newGameBtn.disabled = !enabled;
    }
    if (this.choicesEl) {
      this.choicesEl.querySelectorAll('button').forEach(btn => {
        (btn as HTMLButtonElement).disabled = !enabled;
      });
    }
  }

  handleChoice(isCorrect: boolean, btn: HTMLButtonElement) {
    if (this.gameOver || !this.isReady || !this.currentCharacter) return;

    this.setControlsEnabled(false);
    this.lastAnswer = this.config.buildLastAnswer(this.currentCharacter);
    this._lastFeedback = { correct: isCorrect };

    if (isCorrect) {
      btn.classList.add('correct');
      this.score++;
      this.renderScore();
      this.setMessage(this.config.getCorrectMessage(this.currentCharacter), 'success');
      this.scheduleRoundTimeout(() => this.nextRound());
    } else {
      btn.classList.add('wrong');
      this.lives--;
      this.renderHearts();
      this.setMessage(this.config.getWrongMessage(this.currentCharacter), 'error');

      if (this.lives <= 0) {
        this.scheduleRoundTimeout(() => this.endGame());
      } else {
        this.scheduleRoundTimeout(() => this.nextRound());
      }
    }
  }

  renderRound() {
    throw new Error('renderRound must be implemented by subclass');
  }

  nextRound() {
    if (this.gameOver) return;
    this._lastFeedback = null;
    this.renderRound();
    this.setControlsEnabled(true);
    this.setMessage(this.config.resolvePrompt(), 'info');
  }

  showModal() {
    if (!this.modalIcon || !this.modalTitle || !this.lastAnswer) return;

    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = getStrings().quiz.loseTitle;
    this.fillModalLines(this.config.buildModalLines(this.lastAnswer, this.score));
    this.openModal();
  }

  endGame() {
    this.gameOver = true;
    this.clearRoundTimeout();
    this.setControlsEnabled(false);
    this.showModal();
  }

  async startNewGame() {
    const strings = getStrings();
    this.clearRoundTimeout();
    this.config.onBeforeStartNewGame?.call(this);

    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, strings.loading.characters);

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(this._loadError ?? strings.errors.loadCharacters, 'error');
        if (this.newGameBtn) {
          this.newGameBtn.disabled = false;
        }
        return;
      }
    }

    this.lives = GAME_CONFIG.MAX_LIVES;
    this.score = 0;
    this.gameOver = false;
    this._lastFeedback = null;
    this.resetDeck(this.characters);
    this.renderHearts();
    this.renderScore();
    this.renderRound();
    const choiceCount = this.choicesEl?.querySelectorAll('button').length ?? 0;
    if (choiceCount === 0) {
      return;
    }
    this.setControlsEnabled(true);
    this.setMessage(this.config.resolvePrompt(), 'info');
    this.closeModal();
  }

  onLocaleChange() {
    if (this.isModalOpen()) {
      this.showModal();
      return;
    }

    if (this.gameOver || !this.currentCharacter) {
      return;
    }

    const messageType = this.getMessageType();
    if (messageType === 'info') {
      this.setMessage(this.config.resolvePrompt(), 'info');
      return;
    }

    if (this._lastFeedback && (messageType === 'success' || messageType === 'error')) {
      const message = this._lastFeedback.correct
        ? this.config.getCorrectMessage(this.currentCharacter)
        : this.config.getWrongMessage(this.currentCharacter);
      this.setMessage(message, messageType);
    }
  }
}
