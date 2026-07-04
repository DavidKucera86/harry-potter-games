import { HangmanGame } from "../shared/HangmanGame.js";
import { getCharacters } from "../shared/dataProvider.js";
import { getStrings } from "../shared/i18n/index.js";
import { GAME_CONFIG } from "../shared/config.js";
import { prepareHangmanWords } from "../shared/wordUtils.js";
const strings = getStrings();
new HangmanGame({
  fetchFn: getCharacters,
  transform: (data) => prepareHangmanWords(
    data.map((character) => character.name?.trim()).filter((name) => Boolean(name)),
    GAME_CONFIG.MIN_WORD_LENGTH
  ),
  loadingText: strings.loading.characters,
  loadError: strings.errors.loadCharacters,
  fetchTimeoutError: strings.errors.fetchTimeoutCharacters,
  emptyError: strings.errors.emptyCharacters,
  logLabel: "postav",
  strings: {
    guessPrompt: strings.hangman.guessCharacter,
    invalidLetter: strings.hangman.invalidLetter,
    letterAlreadyGuessed: strings.hangman.letterAlreadyGuessed,
    correct: strings.hangman.correctInName,
    wrong: strings.hangman.wrongInName,
    winTitle: strings.hangman.winTitle,
    loseTitle: strings.hangman.loseTitle,
    winLabel: strings.hangman.winCharacter,
    loseLabel: strings.hangman.loseCharacter,
    scoreLabel: strings.quiz.scoreLabel,
    noWrongLetters: strings.hangman.noWrongLetters,
    wrongLettersLabel: strings.hangman.wrongLettersLabel
  }
});
//# sourceMappingURL=script.js.map
