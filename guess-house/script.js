// src/guess-house/script.ts
import { getStrings } from "../shared/i18n/index.js";
import { QuizGame } from "../shared/QuizGame.js";
var GuessHouseGame = class _GuessHouseGame extends QuizGame {
  static HOUSES = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];
  static HOUSE_CLASSES = {
    Gryffindor: "house-gryffindor",
    Slytherin: "house-slytherin",
    Ravenclaw: "house-ravenclaw",
    Hufflepuff: "house-hufflepuff"
  };
  characterNameEl = null;
  constructor() {
    super({
      transform: (data) => data.filter(
        (c) => c.name && _GuessHouseGame.HOUSES.includes(c.house)
      ),
      resolveEmptyError: () => getStrings().errors.notEnoughCharacters,
      resolvePrompt: () => getStrings().quiz.housePrompt,
      buildLastAnswer: (character) => ({
        name: character.name,
        house: character.house
      }),
      getCorrectMessage: (character) => getStrings().quiz.houseCorrect(character.name, character.house),
      getWrongMessage: (character) => getStrings().quiz.houseWrong(character.name, character.house),
      buildModalLines: (lastAnswer, score) => {
        const strings = getStrings();
        return [
          { label: strings.quiz.scoreLabel, value: score },
          { label: strings.quiz.lastCharacterLabel, value: lastAnswer.name, gap: true },
          { label: strings.quiz.correctHouseLabel, value: lastAnswer.house }
        ];
      }
    });
    this.characterNameEl = document.getElementById("characterName");
  }
  renderRound() {
    this.currentCharacter = this.pickFromDeck();
    if (!this.currentCharacter) {
      this.choicesEl?.replaceChildren();
      this.setMessage(getStrings().errors.notEnoughCharacters, "error");
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }
    if (!this.characterNameEl) return;
    this.characterNameEl.textContent = this.currentCharacter.name;
    const wrongHouses = _GuessHouseGame.HOUSES.filter(
      (house) => house !== this.currentCharacter.house
    );
    const options = this.shuffle([
      this.currentCharacter.house,
      ...this.shuffle([...wrongHouses]).slice(0, 3)
    ]);
    if (!this.choicesEl) return;
    this.choicesEl.replaceChildren();
    for (const house of options) {
      const btn = document.createElement("button");
      btn.className = `choice-btn ${_GuessHouseGame.HOUSE_CLASSES[house]}`;
      btn.textContent = house;
      btn.addEventListener("click", () => {
        this.handleChoice(house === this.currentCharacter.house, btn);
      });
      this.choicesEl.appendChild(btn);
    }
  }
};
new GuessHouseGame();
export {
  GuessHouseGame
};
//# sourceMappingURL=script.js.map
