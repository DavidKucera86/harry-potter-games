import { HangmanGame } from '../shared/HangmanGame.js';
import { getSpells } from '../shared/dataProvider.js';
import { getStrings } from '../shared/i18n/index.js';
import { GAME_CONFIG } from '../shared/config.js';
import { prepareHangmanWords } from '../shared/wordUtils.js';
import type { Spell } from '../shared/types.js';

const strings = getStrings();

new HangmanGame({
  fetchFn: getSpells,
  transform: data => prepareHangmanWords(
    (data as Spell[]).map(spell => spell.name?.trim()).filter((name): name is string => Boolean(name)),
    GAME_CONFIG.MIN_WORD_LENGTH,
  ),
  loadingText: strings.loading.spells,
  loadError: strings.errors.loadSpells,
  fetchTimeoutError: strings.errors.fetchTimeoutSpells,
  emptyError: strings.errors.emptySpells,
  logLabel: 'kouzel',
  strings: {
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
    wrongLettersLabel: strings.hangman.wrongLettersLabel,
  },
});
