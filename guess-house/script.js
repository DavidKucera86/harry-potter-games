import QuizGame from '../shared/QuizGame.js';
import { HOUSES, HOUSE_CLASSES } from '../shared/config.js';
import { STRINGS } from '../shared/strings.js';

new QuizGame({
  transform: (data) => data.filter(
    (c) => c.name && HOUSES.includes(c.house),
  ),
  minCount: 4,
  emptyError: STRINGS.errors.notEnoughCharacters,
  loadingText: STRINGS.loading.characters,
  loadError: STRINGS.errors.loadCharacters,
  promptEl: document.getElementById('characterName'),
  renderPrompt(game) {
    game.promptEl.textContent = game.currentCharacter.name;
  },
  buildOptions(current, _all, game) {
    const wrongHouses = HOUSES.filter((house) => house !== current.house);
    const houses = game.shuffle([
      current.house,
      ...game.shuffle(wrongHouses).slice(0, 3),
    ]);
    return houses.map((house) => ({
      value: house,
      label: house,
      className: `choice-btn ${HOUSE_CLASSES[house]}`,
    }));
  },
  isCorrect: (selected, current) => selected === current.house,
  buildLastAnswer: (current) => ({
    name: current.name,
    house: current.house,
  }),
  strings: {
    prompt: STRINGS.quiz.housePrompt,
    correct: (current, selected) => STRINGS.quiz.houseCorrect(current.name, selected),
    wrong: (current) => STRINGS.quiz.houseWrong(current.name, current.house),
  },
  getModalLines: (score, lastAnswer) => [
    { label: STRINGS.quiz.scoreLabel, value: score },
    { label: STRINGS.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true },
    { label: STRINGS.quiz.correctHouseLabel, value: lastAnswer.house },
  ],
});
