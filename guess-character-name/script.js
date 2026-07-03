import HangmanGame from '../shared/HangmanGame.js';
import { getCharacters } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';

new HangmanGame({
  fetchFn: getCharacters,
  transform: (data) => data
    .map((character) => character.name?.trim())
    .filter(Boolean),
  minCount: 1,
  emptyError: STRINGS.errors.emptyCharacters,
  logLabel: 'postav',
  loadingText: STRINGS.loading.characters,
  loadError: STRINGS.errors.loadCharacters,
  strings: {
    guess: STRINGS.hangman.guessCharacter,
    winTitle: STRINGS.hangman.winTitle,
    loseTitle: STRINGS.hangman.loseTitle,
    winLabel: STRINGS.hangman.winCharacter,
    loseLabel: STRINGS.hangman.loseCharacter,
    invalidLetter: STRINGS.hangman.invalidLetter,
    letterAlreadyGuessed: STRINGS.hangman.letterAlreadyGuessed,
    correct: STRINGS.hangman.correctInName,
    wrong: STRINGS.hangman.wrongInName,
    noWrongLetters: STRINGS.hangman.noWrongLetters,
  },
});
