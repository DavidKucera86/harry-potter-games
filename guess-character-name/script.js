import { HangmanGame } from '../shared/HangmanGame.js';
import { getCharacters } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';

new HangmanGame({
  fetchFn: getCharacters,
  transform: data => data
    .map(character => character.name?.trim())
    .filter(name => name),
  loadingText: STRINGS.loading.characters,
  loadError: STRINGS.errors.loadCharacters,
  fetchTimeoutError: STRINGS.errors.fetchTimeoutCharacters,
  emptyError: STRINGS.errors.emptyCharacters,
  logLabel: 'postav',
  strings: {
    guessPrompt: STRINGS.hangman.guessCharacter,
    invalidLetter: STRINGS.hangman.invalidLetter,
    letterAlreadyGuessed: STRINGS.hangman.letterAlreadyGuessed,
    correct: STRINGS.hangman.correctInName,
    wrong: STRINGS.hangman.wrongInName,
    winTitle: STRINGS.hangman.winTitle,
    loseTitle: STRINGS.hangman.loseTitle,
    winLabel: STRINGS.hangman.winCharacter,
    loseLabel: STRINGS.hangman.loseCharacter,
    scoreLabel: STRINGS.quiz.scoreLabel,
    noWrongLetters: STRINGS.hangman.noWrongLetters,
  },
});
