import { HangmanGame } from '../shared/HangmanGame.js';
import { getCharacters } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';
import { GAME_CONFIG } from '../shared/config.js';
import { prepareHangmanWords } from '../shared/wordUtils.js';

new HangmanGame({
  fetchFn: getCharacters,
  transform: data => prepareHangmanWords(
    data.map(character => character.name?.trim()).filter(name => name),
    GAME_CONFIG.MIN_WORD_LENGTH,
  ),
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
    wrongLettersLabel: STRINGS.hangman.wrongLettersLabel,
  },
});
