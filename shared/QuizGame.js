import BaseGame from './BaseGame.js';
import { GAME_CONFIG } from './config.js';
import { getCharacters } from './dataProvider.js';
import { STRINGS } from './strings.js';

export default class QuizGame extends BaseGame {
  constructor(config) {
    super();
    this.config = config;
    this.characters = [];
    this.currentCharacter = null;
    this.lastAnswer = null;

    this.choicesEl = document.getElementById('choices');
    if (config.promptEl) {
      this.promptEl = config.promptEl;
    }
    if (config.photoEl) {
      this.photoEl = config.photoEl;
      this.photoEl.addEventListener('error', () => this.handleImageError());
    }

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());
  }

  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, this.config.loadingText);

    const loaded = await this.loadCharacters();
    this.showLoading(false);

    if (loaded) {
      this.startNewGame();
    } else {
      this.setMessage(this.config.loadError, 'error');
      this.newGameBtn.disabled = false;
    }
  }

  loadCharacters() {
    return this.loadGameData({
      fetchFn: this.config.fetchFn || getCharacters,
      transform: this.config.transform,
      minCount: this.config.minCount,
      emptyError: this.config.emptyError,
      logLabel: 'postav',
      assign: (items) => { this.characters = items; },
      onError: () => { this.characters = []; },
    });
  }

  setControlsEnabled(enabled) {
    this.newGameBtn.disabled = !enabled;
    this.choicesEl.querySelectorAll('button').forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  renderRound() {
    this.currentCharacter = this.pickFromDeck();
    this.config.renderPrompt(this);

    const options = this.config.buildOptions(this.currentCharacter, this.characters, this);
    this.choicesEl.replaceChildren();

    for (const option of options) {
      const btn = document.createElement('button');
      btn.className = option.className || 'choice-btn';
      btn.textContent = option.label;
      btn.addEventListener('click', () => this.submitAnswer(option.value, btn));
      this.choicesEl.appendChild(btn);
    }
  }

  handleImageError() {
    if (this.gameOver || !this.isReady) return;

    if (this.config.onImageError) {
      this.config.onImageError(this);
    }
  }

  submitAnswer(value, btn) {
    if (this.gameOver || !this.isReady) return;

    this.setControlsEnabled(false);
    const correct = this.config.isCorrect(value, this.currentCharacter);
    this.lastAnswer = this.config.buildLastAnswer(this.currentCharacter);

    if (correct) {
      btn.classList.add('correct');
      this.score++;
      this.renderScore();
      this.setMessage(
        this.config.strings.correct(this.currentCharacter, value),
        'success',
      );
      setTimeout(() => this.nextRound(), 1200);
    } else {
      btn.classList.add('wrong');
      this.lives--;
      this.renderHearts();
      this.setMessage(
        this.config.strings.wrong(this.currentCharacter),
        'error',
      );

      if (this.lives <= 0) {
        setTimeout(() => this.endGame(), 1200);
      } else {
        setTimeout(() => this.nextRound(), 1200);
      }
    }
  }

  nextRound() {
    if (this.gameOver) return;
    this.renderRound();
    this.setControlsEnabled(true);
    this.setMessage(this.config.strings.prompt, 'info');
  }

  showModal() {
    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = STRINGS.quiz.loseTitle;
    this.fillModalLines(this.config.getModalLines(this.score, this.lastAnswer));
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
      this.showLoading(true, this.config.loadingText);

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(this.config.loadError, 'error');
        this.newGameBtn.disabled = false;
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
    this.setMessage(this.config.strings.prompt, 'info');
    this.closeModal();
  }
}
