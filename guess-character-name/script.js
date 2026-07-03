import { HangmanGame } from '../shared/HangmanGame.js';
import { getCharacters } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';

new HangmanGame({
  fetchFn: getCharacters,
  transform: data => data
    .map(character => character.name?.trim())
    .filter(name => name),
  minCount: 1,
  emptyError: STRINGS.errors.emptyCharacters,
  loadError: STRINGS.errors.loadCharacters,
  fetchTimeoutError: STRINGS.errors.fetchTimeout,
  loadingText: STRINGS.loading.characters,
  logLabel: 'postav',
  guessPrompt: STRINGS.hangman.guessCharacter,
  invalidLetter: STRINGS.hangman.invalidLetter,
  letterAlreadyGuessed: STRINGS.hangman.letterAlreadyGuessed,
  correctMessage: STRINGS.hangman.correctInName,
  wrongMessage: STRINGS.hangman.wrongInName,
  winTitle: STRINGS.hangman.winTitle,
  loseTitle: STRINGS.hangman.loseTitle,
  winLabel: STRINGS.hangman.winCharacter,
  loseLabel: STRINGS.hangman.loseCharacter,
  noWrongLetters: STRINGS.hangman.noWrongLetters,
});
