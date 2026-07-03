import { GAME_CONFIG } from '../shared/config.js';
import { STRINGS } from '../shared/strings.js';
import { getCharacters } from '../shared/dataProvider.js';
import { BaseGame } from '../shared/BaseGame.js';

export class WhoIsOnPhotoGame extends BaseGame {
  constructor() {
    super();
    this.characters = [];
    this.currentCharacter = null;
    this.lastAnswer = null;
    this.failedImageIds = new Set();
    this.imageErrorCount = 0;
    this.photoLoadTimeoutId = null;

    this.photoEl = document.getElementById('characterPhoto');
    this.choicesEl = document.getElementById('choices');

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());
    if (this.photoEl) {
      this.photoEl.addEventListener('error', () => this.handleImageError());
      this.photoEl.addEventListener('load', () => this.clearPhotoLoadTimeout());
    }
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
      transform: data => data.filter(c => c.name && c.image),
      minCount: 4,
      emptyError: STRINGS.errors.notEnoughPhotoCharacters,
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

  clearPhotoLoadTimeout() {
    if (this.photoLoadTimeoutId !== null) {
      clearTimeout(this.photoLoadTimeoutId);
      this.photoLoadTimeoutId = null;
    }
  }

  getAvailableCharacters() {
    return this.characters.filter(c => !this.failedImageIds.has(c.id));
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

  renderRound() {
    const photoPool = this.characters.filter(c => !this.failedImageIds.has(c.id));

    if (photoPool.length === 0) {
      if (this.choicesEl) {
        this.choicesEl.replaceChildren();
      }
      this.setMessage(STRINGS.errors.allPhotosBroken, 'error');
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }

    this.currentCharacter = this.pickFromDeck(
      item => !this.failedImageIds.has(item.id)
    );

    if (!this.currentCharacter || !this.photoEl || !this.choicesEl) {
      if (this.choicesEl) {
        this.choicesEl.replaceChildren();
      }
      this.setMessage(STRINGS.errors.allPhotosBroken, 'error');
      this.setControlsEnabled(false);
      return;
    }

    this.clearPhotoLoadTimeout();
    const expectedSrc = this.currentCharacter.image;
    this.photoEl.src = expectedSrc;
    this.photoEl.alt = STRINGS.a11y.photoAlt;

    this.photoLoadTimeoutId = setTimeout(() => {
      if (this.photoEl.src === expectedSrc && this.photoEl.naturalWidth === 0) {
        this.handleImageError();
      }
    }, 2000);

    const others = this.shuffle(
      this.characters.filter(c => c.id !== this.currentCharacter.id)
    ).slice(0, 3);

    if (others.length < 3) {
      if (this.choicesEl) {
        this.choicesEl.replaceChildren();
      }
      this.setMessage(STRINGS.errors.notEnoughPhotoCharacters, 'error');
      this.setControlsEnabled(false);
      return;
    }

    const options = this.shuffle([this.currentCharacter, ...others]);

    this.choicesEl.replaceChildren();
    for (const character of options) {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = character.name;
      btn.addEventListener('click', () => this.guessName(character, btn));
      this.choicesEl.appendChild(btn);
    }
  }

  handleImageError() {
    if (this.gameOver || !this.isReady) return;

    this.clearPhotoLoadTimeout();

    if (this.currentCharacter) {
      this.failedImageIds.add(this.currentCharacter.id);
    }

    this.imageErrorCount++;
    if (this.imageErrorCount >= GAME_CONFIG.MAX_IMAGE_ERRORS) {
      if (this.choicesEl) {
        this.choicesEl.replaceChildren();
      }
      this.setMessage(STRINGS.errors.allPhotosBroken, 'error');
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }

    this.renderRound();

    if (this.getAvailableCharacters().length > 0) {
      this.setMessage(STRINGS.quiz.photoPrompt, 'info');
    }
  }

  guessName(character, btn) {
    if (this.gameOver || !this.isReady || !this.currentCharacter) return;

    this.setControlsEnabled(false);
    const correct = character.id === this.currentCharacter.id;
    this.lastAnswer = {
      name: this.currentCharacter.name,
    };

    if (correct) {
      btn.classList.add('correct');
      this.score++;
      this.renderScore();
      this.setMessage(STRINGS.quiz.photoCorrect(this.currentCharacter.name), 'success');
      this.scheduleRoundTimeout(() => this.nextRound());
    } else {
      btn.classList.add('wrong');
      this.lives--;
      this.renderHearts();
      this.setMessage(STRINGS.quiz.photoWrong(this.currentCharacter.name), 'error');

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
    this.setMessage(STRINGS.quiz.photoPrompt, 'info');
  }

  showModal() {
    if (!this.modalIcon || !this.modalTitle || !this.lastAnswer) return;

    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = STRINGS.quiz.loseTitle;
    this.fillModalLines([
      { label: STRINGS.quiz.scoreLabel, value: this.score },
      { label: STRINGS.quiz.lastCharacterLabel, value: this.lastAnswer.name, gap: true },
    ]);
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
    this.clearPhotoLoadTimeout();
    this.failedImageIds.clear();
    this.imageErrorCount = 0;

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
    this.setMessage(STRINGS.quiz.photoPrompt, 'info');
    this.closeModal();
  }
}

new WhoIsOnPhotoGame();
