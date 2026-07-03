import { HangmanGame } from '../shared/HangmanGame.js';
import { getSpells } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';

new HangmanGame({
  fetchFn: getSpells,
  transform: data => data
    .map(spell => spell.name?.trim())
    .filter(name => name),
  minCount: 1,
  emptyError: STRINGS.errors.emptySpells,
  loadError: STRINGS.errors.loadSpells,
  fetchTimeoutError: STRINGS.errors.fetchTimeout,
  loadingText: STRINGS.loading.spells,
  logLabel: 'kouzel',
  guessPrompt: STRINGS.hangman.guessSpell,
  invalidLetter: STRINGS.hangman.invalidLetter,
  letterAlreadyGuessed: STRINGS.hangman.letterAlreadyGuessed,
  correctMessage: STRINGS.hangman.correctInSpell,
  wrongMessage: STRINGS.hangman.wrongInSpell,
  winTitle: STRINGS.hangman.winTitle,
  loseTitle: STRINGS.hangman.loseTitle,
  winLabel: STRINGS.hangman.winSpell,
  loseLabel: STRINGS.hangman.loseSpell,
  noWrongLetters: STRINGS.hangman.noWrongLetters,
});
