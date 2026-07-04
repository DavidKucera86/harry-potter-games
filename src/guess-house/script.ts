import { getStrings } from '../shared/i18n/index.js';
import { QuizGame } from '../shared/QuizGame.js';
import type { Character } from '../shared/types.js';

export class GuessHouseGame extends QuizGame {
  static HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'] as const;
  static HOUSE_CLASSES: Record<string, string> = {
    Gryffindor: 'house-gryffindor',
    Slytherin: 'house-slytherin',
    Ravenclaw: 'house-ravenclaw',
    Hufflepuff: 'house-hufflepuff',
  };

  characterNameEl: HTMLElement | null = null;

  constructor() {
    const strings = getStrings();
    super({
      transform: data => data.filter(
        c => c.name && (GuessHouseGame.HOUSES as readonly string[]).includes(c.house)
      ),
      emptyError: strings.errors.notEnoughCharacters,
      prompt: strings.quiz.housePrompt,
      buildLastAnswer: character => ({
        name: character.name,
        house: character.house,
      }),
      getCorrectMessage: (character) =>
        strings.quiz.houseCorrect(character.name, character.house),
      getWrongMessage: (character) =>
        strings.quiz.houseWrong(character.name, character.house),
      buildModalLines: (lastAnswer, score) => [
        { label: strings.quiz.scoreLabel, value: score },
        { label: strings.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true },
        { label: strings.quiz.correctHouseLabel, value: lastAnswer.house },
      ],
    });

    this.characterNameEl = document.getElementById('characterName');
  }

  renderRound() {
    this.currentCharacter = this.pickFromDeck<Character>();
    if (!this.currentCharacter) {
      this.choicesEl?.replaceChildren();
      this.setMessage(getStrings().errors.notEnoughCharacters, 'error');
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }
    if (!this.characterNameEl) return;

    this.characterNameEl.textContent = this.currentCharacter.name;

    const wrongHouses = GuessHouseGame.HOUSES.filter(
      house => house !== this.currentCharacter!.house
    );
    const options = this.shuffle([
      this.currentCharacter.house,
      ...this.shuffle([...wrongHouses]).slice(0, 3),
    ]);

    if (!this.choicesEl) return;

    this.choicesEl.replaceChildren();
    for (const house of options) {
      const btn = document.createElement('button');
      btn.className = `choice-btn ${GuessHouseGame.HOUSE_CLASSES[house]}`;
      btn.textContent = house;
      btn.addEventListener('click', () => {
        this.handleChoice(house === this.currentCharacter!.house, btn);
      });
      this.choicesEl.appendChild(btn);
    }
  }
}

new GuessHouseGame();
