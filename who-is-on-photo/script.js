import { GAME_CONFIG } from '../shared/config.js';
import { STRINGS } from '../shared/strings.js';
import { QuizGame } from '../shared/QuizGame.js';

export class WhoIsOnPhotoGame extends QuizGame {
  constructor() {
    super({
      transform: data => data.filter(c => c.name && c.image),
      emptyError: STRINGS.errors.notEnoughPhotoCharacters,
      prompt: STRINGS.quiz.photoPrompt,
      buildLastAnswer: character => ({ name: character.name }),
      getCorrectMessage: (character) => STRINGS.quiz.photoCorrect(character.name),
      getWrongMessage: (character) => STRINGS.quiz.photoWrong(character.name),
      buildModalLines: (lastAnswer, score) => [
        { label: STRINGS.quiz.scoreLabel, value: score },
        { label: STRINGS.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true },
      ],
      bindExtraEvents() {
        this.failedImageIds = new Set();
        this.imageErrorCount = 0;
        this.photoLoadTimeoutId = null;
        this.photoEl = document.getElementById('characterPhoto');
        if (this.photoEl) {
          this.photoEl.addEventListener('error', () => this.handleImageError());
          this.photoEl.addEventListener('load', () => this.clearPhotoLoadTimeout());
        }
      },
      onBeforeStartNewGame() {
        this.clearPhotoLoadTimeout();
        this.failedImageIds.clear();
        this.imageErrorCount = 0;
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

  renderRound() {
    const photoPool = this.getAvailableCharacters();

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
    }, GAME_CONFIG.PHOTO_LOAD_TIMEOUT_MS);

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
      btn.addEventListener('click', () => {
        this.handleChoice(character.id === this.currentCharacter.id, btn);
      });
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
}

new WhoIsOnPhotoGame();
