// src/guess-spell/script.ts
import { HangmanGame } from "../shared/HangmanGame.js";
import { getSpells } from "../shared/dataProvider.js";
import { getStrings } from "../shared/i18n/index.js";
import { GAME_CONFIG } from "../shared/config.js";
import { prepareHangmanWords } from "../shared/wordUtils.js";
new HangmanGame({
  fetchFn: getSpells,
  transform: (data) => prepareHangmanWords(
    data.map((spell) => spell.name?.trim()).filter((name) => Boolean(name)),
    GAME_CONFIG.MIN_WORD_LENGTH
  ),
  resolveLoadingText: () => getStrings().loading.spells,
  resolveLoadError: () => getStrings().errors.loadSpells,
  resolveFetchTimeoutError: () => getStrings().errors.fetchTimeoutSpells,
  resolveEmptyError: () => getStrings().errors.emptySpells,
  logLabel: "kouzel",
  resolveStrings: () => {
    const strings = getStrings();
    return {
      guessPrompt: strings.hangman.guessSpell,
      invalidLetter: strings.hangman.invalidLetter,
      letterAlreadyGuessed: strings.hangman.letterAlreadyGuessed,
      correct: strings.hangman.correctInSpell,
      wrong: strings.hangman.wrongInSpell,
      winTitle: strings.hangman.winTitle,
      loseTitle: strings.hangman.loseTitle,
      winLabel: strings.hangman.winSpell,
      loseLabel: strings.hangman.loseSpell,
      scoreLabel: strings.quiz.scoreLabel,
      noWrongLetters: strings.hangman.noWrongLetters,
      wrongLettersLabel: strings.hangman.wrongLettersLabel
    };
  }
});
//# sourceMappingURL=script.js.map
