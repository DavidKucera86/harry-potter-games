import { QuizGame } from '../shared/QuizGame.js';
import { getCharacters } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';
import { GAME_CONFIG } from '../shared/config.js';

class WhoIsOnPhotoGame extends QuizGame {
  constructor() {
    super({
      fetchFn: getCharacters,
      transform: data => data.filter(c => c.name && c.image),
      minCount: GAME_CONFIG.MIN_PHOTO_CHARACTERS,
      emptyError: STRINGS.errors.notEnoughPhotoCharacters,
      loadError: STRINGS.errors.loadCharacters,
      fetchTimeoutError: STRINGS.errors.fetchTimeout,
      loadingText: STRINGS.loading.characters,
      logLabel: 'postav',
      promptMessage: STRINGS.quiz.photoPrompt,
      loseTitle: STRINGS.quiz.loseTitle,
      choiceCorrect: STRINGS.quiz.choiceCorrect,
      choiceWrong: STRINGS.quiz.choiceWrong,
      onNewGame: WhoIsOnPhotoGame.prototype.resetImageErrors,

      renderRound: WhoIsOnPhotoGame.prototype.renderRound,
      isCorrect: (character, item) => character.id === item.id,
      getChoiceLabel: character => character.name,
      getCorrectMessage: item => STRINGS.quiz.photoCorrect(item.name),
      getWrongMessage: item => STRINGS.quiz.photoWrong(item.name),
      buildLastAnswer: item => ({ name: item.name }),
      buildModalLines: (lastAnswer, score) => [
        { label: STRINGS.quiz.scoreLabel, value: score },
        { label: STRINGS.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true },
      ],
    });

    this.photoEl = document.getElementById('characterPhoto');
    this.consecutiveImageErrors = 0;
    this.photoEl?.addEventListener('error', () => this.handleImageError());
  }

  resetImageErrors() {
    this.consecutiveImageErrors = 0;
  }

  renderRound() {
    this.currentItem = this.pickFromDeck();
    if (this.photoEl) {
      this.photoEl.src = this.currentItem.image;
      this.photoEl.alt = STRINGS.quiz.photoAlt;
    }

    const others = this.shuffle(
      this.items.filter(c => c.id !== this.currentItem.id)
    ).slice(0, 3);

    const options = this.shuffle([this.currentItem, ...others]);

    this.choicesEl.replaceChildren();
    for (const character of options) {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = character.name;
      btn.addEventListener('click', () => this.handleGuess(character, btn));
      this.choicesEl.appendChild(btn);
    }
  }

  removeCharacterFromPool(character) {
    this.removeFromDeck(character, (entry, target) => entry.id === target.id);
    this.items = this.items.filter(entry => entry.id !== character.id);
  }

  handleImageError() {
    if (this.gameOver || !this.isReady) return;

    if (this.currentItem) {
      this.removeCharacterFromPool(this.currentItem);
      this.consecutiveImageErrors++;
    }

    if (
      this.items.length < GAME_CONFIG.MIN_PHOTO_CHARACTERS ||
      this.consecutiveImageErrors >= GAME_CONFIG.MAX_CONSECUTIVE_IMAGE_ERRORS
    ) {
      this.setMessage(STRINGS.errors.imageErrorsExhausted, 'error');
      this.setControlsEnabled(false);
      return;
    }

    this.renderRound();
    this.setMessage(STRINGS.quiz.photoPrompt, 'info');
  }
}

new WhoIsOnPhotoGame();
