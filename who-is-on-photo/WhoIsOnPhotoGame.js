import { GAME_CONFIG } from "../shared/config.js";
import { getStrings } from "../shared/i18n/index.js";
import { QuizGame } from "../shared/QuizGame.js";
class WhoIsOnPhotoGame extends QuizGame {
  failedImageIds = /* @__PURE__ */ new Set();
  imageErrorCount = 0;
  photoLoadTimeoutId = null;
  photoEl = null;
  _photoRoundId = null;
  constructor() {
    const strings = getStrings();
    super({
      transform: (data) => data.filter((c) => c.name && c.image),
      emptyError: strings.errors.notEnoughPhotoCharacters,
      prompt: strings.quiz.photoPrompt,
      buildLastAnswer: (character) => ({ name: character.name }),
      getCorrectMessage: (character) => strings.quiz.photoCorrect(character.name),
      getWrongMessage: (character) => strings.quiz.photoWrong(character.name),
      buildModalLines: (lastAnswer, score) => [
        { label: strings.quiz.scoreLabel, value: score },
        { label: strings.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true }
      ],
      bindExtraEvents() {
        this.failedImageIds = /* @__PURE__ */ new Set();
        this.imageErrorCount = 0;
        this.photoLoadTimeoutId = null;
        this.photoEl = document.getElementById("characterPhoto");
        if (this.photoEl) {
          this.photoEl.addEventListener("error", () => this.handleImageError());
          this.photoEl.addEventListener("load", () => this.clearPhotoLoadTimeout());
        }
      },
      onBeforeStartNewGame() {
        this.clearPhotoLoadTimeout();
        this.failedImageIds.clear();
        this.imageErrorCount = 0;
      }
    });
  }
  clearPhotoLoadTimeout() {
    if (this.photoLoadTimeoutId !== null) {
      clearTimeout(this.photoLoadTimeoutId);
      this.photoLoadTimeoutId = null;
    }
  }
  getAvailableCharacters() {
    return this.characters.filter((c) => !this.failedImageIds.has(c.id));
  }
  renderRound() {
    const strings = getStrings();
    const photoPool = this.getAvailableCharacters();
    if (photoPool.length === 0) {
      this.choicesEl?.replaceChildren();
      this.setMessage(strings.errors.allPhotosBroken, "error");
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }
    this.currentCharacter = this.pickFromDeck(
      (item) => !this.failedImageIds.has(item.id)
    );
    this.photoEl = document.getElementById("characterPhoto");
    if (!this.currentCharacter || !this.photoEl || !this.choicesEl) {
      this.choicesEl?.replaceChildren();
      this.setMessage(strings.errors.allPhotosBroken, "error");
      this.setControlsEnabled(false);
      return;
    }
    this.clearPhotoLoadTimeout();
    this._photoRoundId = this.currentCharacter.id;
    const others = this.shuffle(
      this.characters.filter((c) => c.id !== this.currentCharacter.id)
    ).slice(0, 3);
    if (others.length < 3) {
      this.choicesEl.replaceChildren();
      this.setMessage(strings.errors.notEnoughPhotoCharacters, "error");
      this.setControlsEnabled(false);
      return;
    }
    const options = this.shuffle([this.currentCharacter, ...others]);
    this.choicesEl.replaceChildren();
    for (const character of options) {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = character.name;
      btn.addEventListener("click", () => {
        this.handleChoice(character.id === this.currentCharacter.id, btn);
      });
      this.choicesEl.appendChild(btn);
    }
    this.photoEl.src = this.currentCharacter.image;
    this.photoEl.alt = strings.a11y.photoAlt;
    this.photoLoadTimeoutId = setTimeout(() => {
      if (this.currentCharacter?.id !== this._photoRoundId) {
        return;
      }
      if (this.photoEl.complete && this.photoEl.naturalWidth > 0) {
        return;
      }
      this.handleImageError();
    }, GAME_CONFIG.PHOTO_LOAD_TIMEOUT_MS);
  }
  handleImageError() {
    if (this.gameOver || !this.isReady) return;
    this.clearPhotoLoadTimeout();
    if (this.currentCharacter) {
      this.failedImageIds.add(this.currentCharacter.id);
    }
    this.imageErrorCount++;
    if (this.imageErrorCount >= GAME_CONFIG.MAX_IMAGE_ERRORS) {
      this.choicesEl?.replaceChildren();
      this.setMessage(getStrings().errors.allPhotosBroken, "error");
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }
    this.renderRound();
    if (this.getAvailableCharacters().length > 0) {
      this.setMessage(getStrings().quiz.photoPrompt, "info");
    }
  }
}
export {
  WhoIsOnPhotoGame
};
//# sourceMappingURL=WhoIsOnPhotoGame.js.map
