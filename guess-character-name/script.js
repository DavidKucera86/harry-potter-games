// src/guess-character-name/script.ts
import { HangmanGame } from "../shared/HangmanGame.js";
import { getCharacters } from "../shared/dataProvider.js";
import { getStrings } from "../shared/i18n/index.js";
import { GAME_CONFIG } from "../shared/config.js";
import { prepareHangmanWords } from "../shared/wordUtils.js";
new HangmanGame({
  fetchFn: getCharacters,
  transform: (data) => prepareHangmanWords(
    data.map((character) => character.name?.trim()).filter((name) => Boolean(name)),
    GAME_CONFIG.MIN_WORD_LENGTH
  ),
  resolveLoadingText: () => getStrings().loading.characters,
  resolveLoadError: () => getStrings().errors.loadCharacters,
  resolveFetchTimeoutError: () => getStrings().errors.fetchTimeoutCharacters,
  resolveEmptyError: () => getStrings().errors.emptyCharacters,
  logLabel: "postav",
  resolveStrings: () => {
    const strings = getStrings();
    return {
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
    };
  }
});
