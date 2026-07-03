import HangmanGame from '../shared/HangmanGame.js';
import { getSpells } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';

new HangmanGame({
  fetchFn: getSpells,
  transform: (data) => data
    .map((spell) => spell.name?.trim())
    .filter(Boolean),
  minCount: 1,
  emptyError: STRINGS.errors.emptySpells,
  logLabel: 'kouzel',
  loadingText: STRINGS.loading.spells,
  loadError: STRINGS.errors.loadSpells,
  strings: {
    guess: STRINGS.hangman.guessSpell,
    winTitle: STRINGS.hangman.winTitle,
    loseTitle: STRINGS.hangman.loseTitle,
    winLabel: STRINGS.hangman.winSpell,
    loseLabel: STRINGS.hangman.loseSpell,
    invalidLetter: STRINGS.hangman.invalidLetter,
    letterAlreadyGuessed: STRINGS.hangman.letterAlreadyGuessed,
    correct: STRINGS.hangman.correctInSpell,
    wrong: STRINGS.hangman.wrongInSpell,
    noWrongLetters: STRINGS.hangman.noWrongLetters,
  },
});
