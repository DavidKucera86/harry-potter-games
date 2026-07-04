import { HangmanGame } from '../shared/HangmanGame.js';
import { getSpells } from '../shared/dataProvider.js';
import { STRINGS } from '../shared/strings.js';
import { GAME_CONFIG } from '../shared/config.js';
import { prepareHangmanWords } from '../shared/wordUtils.js';

new HangmanGame({
  fetchFn: getSpells,
  transform: data => prepareHangmanWords(
    data.map(spell => spell.name?.trim()).filter(name => name),
    GAME_CONFIG.MIN_WORD_LENGTH,
  ),
  loadingText: STRINGS.loading.spells,
  loadError: STRINGS.errors.loadSpells,
  fetchTimeoutError: STRINGS.errors.fetchTimeoutSpells,
  emptyError: STRINGS.errors.emptySpells,
  logLabel: 'kouzel',
  strings: {
    guessPrompt: STRINGS.hangman.guessSpell,
    invalidLetter: STRINGS.hangman.invalidLetter,
    letterAlreadyGuessed: STRINGS.hangman.letterAlreadyGuessed,
    correct: STRINGS.hangman.correctInSpell,
    wrong: STRINGS.hangman.wrongInSpell,
    winTitle: STRINGS.hangman.winTitle,
    loseTitle: STRINGS.hangman.loseTitle,
    winLabel: STRINGS.hangman.winSpell,
    loseLabel: STRINGS.hangman.loseSpell,
    scoreLabel: STRINGS.quiz.scoreLabel,
    noWrongLetters: STRINGS.hangman.noWrongLetters,
    wrongLettersLabel: STRINGS.hangman.wrongLettersLabel,
  },
});
