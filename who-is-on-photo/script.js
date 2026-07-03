import QuizGame from '../shared/QuizGame.js';
import { STRINGS } from '../shared/strings.js';

new QuizGame({
  transform: (data) => data.filter((c) => c.name && c.image),
  minCount: 4,
  emptyError: STRINGS.errors.notEnoughPhotoCharacters,
  loadingText: STRINGS.loading.characters,
  loadError: STRINGS.errors.loadCharacters,
  photoEl: document.getElementById('characterPhoto'),
  renderPrompt(game) {
    game.photoEl.src = game.currentCharacter.image;
    game.photoEl.alt = '';
  },
  buildOptions(current, all, game) {
    const others = game.shuffle(
      all.filter((c) => c.id !== current.id),
    ).slice(0, 3);
    const characters = game.shuffle([current, ...others]);
    return characters.map((character) => ({
      value: character.name,
      label: character.name,
    }));
  },
  isCorrect: (selected, current) => selected === current.name,
  buildLastAnswer: (current) => ({ name: current.name }),
  onImageError(game) {
    if (game.currentCharacter) {
      game.returnToDeck(game.currentCharacter);
    }
    game.renderRound();
    game.setMessage(STRINGS.quiz.photoPrompt, 'info');
  },
  strings: {
    prompt: STRINGS.quiz.photoPrompt,
    correct: (current) => STRINGS.quiz.photoCorrect(current.name),
    wrong: (current) => STRINGS.quiz.photoWrong(current.name),
  },
  getModalLines: (score, lastAnswer) => [
    { label: STRINGS.quiz.scoreLabel, value: score },
    { label: STRINGS.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true },
  ],
});
