import { QuizGame } from '../shared/QuizGame.js';
import { getCharacters } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';

const HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
const HOUSE_CLASSES = {
  Gryffindor: 'house-gryffindor',
  Slytherin: 'house-slytherin',
  Ravenclaw: 'house-ravenclaw',
  Hufflepuff: 'house-hufflepuff',
};

new QuizGame({
  fetchFn: getCharacters,
  transform: data => data.filter(c => c.name && HOUSES.includes(c.house)),
  minCount: 4,
  emptyError: STRINGS.errors.notEnoughCharacters,
  loadError: STRINGS.errors.loadCharacters,
  fetchTimeoutError: STRINGS.errors.fetchTimeout,
  loadingText: STRINGS.loading.characters,
  logLabel: 'postav',
  promptMessage: STRINGS.quiz.housePrompt,
  loseTitle: STRINGS.quiz.loseTitle,
  choiceCorrect: STRINGS.quiz.choiceCorrect,
  choiceWrong: STRINGS.quiz.choiceWrong,

  renderRound() {
    this.currentItem = this.pickFromDeck();
    const characterNameEl = document.getElementById('characterName');
    if (characterNameEl) {
      characterNameEl.textContent = this.currentItem.name;
    }

    const wrongHouses = HOUSES.filter(house => house !== this.currentItem.house);
    const options = this.shuffle([
      this.currentItem.house,
      ...this.shuffle(wrongHouses).slice(0, 3),
    ]);

    this.choicesEl.replaceChildren();
    for (const house of options) {
      const btn = document.createElement('button');
      btn.className = `choice-btn ${HOUSE_CLASSES[house]}`;
      btn.textContent = house;
      btn.addEventListener('click', () => this.handleGuess(house, btn));
      this.choicesEl.appendChild(btn);
    }
  },

  isCorrect: (house, item) => house === item.house,
  getChoiceLabel: house => house,
  getCorrectMessage: (item, house) => STRINGS.quiz.houseCorrect(item.name, house),
  getWrongMessage: item => STRINGS.quiz.houseWrong(item.name, item.house),
  buildLastAnswer: item => ({ name: item.name, house: item.house }),
  buildModalLines: (lastAnswer, score) => [
    { label: STRINGS.quiz.scoreLabel, value: score },
    { label: STRINGS.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true },
    { label: STRINGS.quiz.correctHouseLabel, value: lastAnswer.house },
  ],
});
