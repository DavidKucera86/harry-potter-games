import { GAME_CONFIG } from './config.js';
import { getCharacters } from './dataProvider.js';
import { STRINGS } from './strings.js';
import { BaseGame } from './BaseGame.js';

export class QuizGame extends BaseGame {
  constructor(config) {
    super();
    this.config = config;
    this.characters = [];
    this.currentCharacter = null;
    this.lastAnswer = null;
    this.choicesEl = document.getElementById('choices');

    this.bindCommonEvents(() => this.startNewGame());
    if (config.bindExtraEvents) {
      config.bindExtraEvents.call(this);
    }
    this.init();
  }

  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, STRINGS.loading.characters);

    const loaded = await this.loadCharacters();
    this.showLoading(false);

    if (loaded) {
      this.startNewGame();
    } else {
      this.setMessage(this._loadError ?? STRINGS.errors.loadCharacters, 'error');
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
    }
  }

  loadCharacters() {
    return this.loadGameData({
      fetchFn: getCharacters,
      transform: this.config.transform,
      minCount: this.config.minCount ?? 4,
      emptyError: this.config.emptyError,
      logLabel: 'postav',
      assign: items => { this.characters = items; },
      onError: (error) => {
        this.characters = [];
        this._loadError = error?.name === 'FetchTimeoutError'
          ? STRINGS.errors.fetchTimeoutCharacters
          : STRINGS.errors.loadCharacters;
      },
    });
  }

  setControlsEnabled(enabled) {
    if (this.newGameBtn) {
      this.newGameBtn.disabled = !enabled;
    }
    if (this.choicesEl) {
      this.choicesEl.querySelectorAll('button').forEach(btn => {
        btn.disabled = !enabled;
      });
    }
  }

  handleChoice(isCorrect, btn) {
    if (this.gameOver || !this.isReady || !this.currentCharacter) return;

    this.setControlsEnabled(false);
    this.lastAnswer = this.config.buildLastAnswer(this.currentCharacter);

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

  nextRound() {
    if (this.gameOver) return;
    this.renderRound();
    this.setControlsEnabled(true);
    this.setMessage(this.config.prompt, 'info');
  }

  showModal() {
    if (!this.modalIcon || !this.modalTitle || !this.lastAnswer) return;

    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = STRINGS.quiz.loseTitle;
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
    this.clearRoundTimeout();
    if (this.config.onBeforeStartNewGame) {
      this.config.onBeforeStartNewGame.call(this);
    }

    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, STRINGS.loading.characters);

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(this._loadError ?? STRINGS.errors.loadCharacters, 'error');
        if (this.newGameBtn) {
          this.newGameBtn.disabled = false;
        }
        return;
      }
    }

    this.lives = GAME_CONFIG.MAX_LIVES;
    this.score = 0;
    this.gameOver = false;
    this.resetDeck(this.characters);
    this.renderHearts();
    this.renderScore();
    this.renderRound();
    this.setControlsEnabled(true);
    this.setMessage(this.config.prompt, 'info');
    this.closeModal();
  }
}
