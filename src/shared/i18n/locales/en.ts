import type { LocaleStrings } from './cs.js';

export const en = {
  loading: {
    characters: 'Loading characters…',
    spells: 'Loading spells…',
    default: 'Loading data…',
  },
  errors: {
    loadCharacters: 'Failed to load characters. Try again with New Game.',
    loadSpells: 'Failed to load spells. Try again with New Game.',
    fetchTimeoutCharacters: 'Loading characters is taking too long. Try again with New Game.',
    fetchTimeoutSpells: 'Loading spells is taking too long. Try again with New Game.',
    emptyCharacters: 'Empty character list',
    emptySpells: 'Empty spell list',
    notEnoughCharacters: 'Not enough characters',
    notEnoughPhotoCharacters: 'Not enough characters with photos',
    allPhotosBroken: 'Failed to load character photos. Try again with New Game.',
  },
  a11y: {
    livesLabel: 'Remaining lives',
    photoAlt: 'Character photo — guess the name',
    loadingBusy: 'Loading game data',
    wordDisplayLabel: 'Word to guess',
  },
  hangman: {
    guessCharacter: 'Guess a letter in the character name…',
    guessSpell: 'Guess a letter in the spell…',
    invalidLetter: 'Please enter a valid letter (A–Z).',
    letterAlreadyGuessed(letter: string) {
      return `You already guessed "${letter.toUpperCase()}".`;
    },
    correctInName(letter: string) {
      return `Correct! The letter "${letter.toUpperCase()}" is in the name.`;
    },
    wrongInName(letter: string) {
      return `Wrong! The letter "${letter.toUpperCase()}" is not in the name.`;
    },
    correctInSpell(letter: string) {
      return `Correct! The letter "${letter.toUpperCase()}" is in the spell.`;
    },
    wrongInSpell(letter: string) {
      return `Wrong! The letter "${letter.toUpperCase()}" is not in the spell.`;
    },
    winTitle: 'Congratulations!',
    loseTitle: 'Out of lives!',
    winCharacter: 'You guessed the character:',
    loseCharacter: 'The correct character was:',
    winSpell: 'You guessed the spell:',
    loseSpell: 'The correct spell was:',
    noWrongLetters: '—',
    wrongLettersLabel: 'Wrong letters:',
  },
  quiz: {
    housePrompt: 'Pick the house this character belongs to…',
    photoPrompt: 'Who is in the photo?',
    houseCorrect(name: string, house: string) {
      return `Correct! ${name} belongs to ${house}.`;
    },
    houseWrong(name: string, house: string) {
      return `Wrong! ${name} belongs to ${house}.`;
    },
    photoCorrect(name: string) {
      return `Correct! It is ${name}.`;
    },
    photoWrong(name: string) {
      return `Wrong! The photo shows ${name}.`;
    },
    loseTitle: 'Out of lives!',
    scoreLabel: 'Your score:',
    lastCharacterLabel: 'Last character:',
    correctHouseLabel: 'Correct house:',
  },
  rps: {
    prompt: 'Pick your move — rock, paper, or scissors?',
    moves: {
      rock: '🪨 Rock',
      paper: '📄 Paper',
      scissors: '✂️ Scissors',
    },
    roundWin(playerLabel: string, opponentLabel: string) {
      return `You won the round! ${playerLabel} beats ${opponentLabel}.`;
    },
    roundLose(playerLabel: string, opponentLabel: string) {
      return `You lost the round! ${opponentLabel} beats ${playerLabel}.`;
    },
    roundTie(moveLabel: string) {
      return `Tie! You both played ${moveLabel}.`;
    },
    matchWinTitle: 'You won the match!',
    matchLoseTitle: 'You lost the match!',
    yourWinsLabel: 'Your wins:',
    opponentWinsLabel: 'Opponent wins:',
    lastOpponentLabel: 'Last opponent:',
    opponentAlt: 'Opponent photo',
    noHouse: 'No house',
  },
  ui: {
    newGame: 'New game',
    guessLetter: 'Guess',
    playAgain: 'Play again',
    backToMenu: '← Back to menu',
    localeLabel: 'Language',
    footerText: 'Enjoying the games? Buy the author a butterbeer',
    buyMeCoffee: '☕ Buy Me a Coffee',
    loadingDefault: 'Loading data…',
    livesLabel: 'Lives',
    scoreLabel: 'Score',
    letterPlaceholder: 'Enter a letter',
    keyboardHint: 'Tip: you can type directly on the keyboard and press Enter',
    skipToContent: 'Skip to content',
    swUpdateMessage: 'A new version of the app is available.',
    swUpdateReload: 'Reload',
    rpsYou: 'You',
    rpsOpponent: 'Opponent',
  },
  pages: {
    menuTitle: 'Harry Potter Games',
    menuSubtitle: 'Pick a game from the wizarding world. Data from the HP API.',
    menuCharacterTitle: 'Guess the character name',
    menuCharacterDesc: 'Hangman style — guess the character name letter by letter. You have 10 lives.',
    menuHouseTitle: 'Guess the character house',
    menuHouseDesc: 'Show your Hogwarts knowledge — pick the correct house for each character.',
    menuSpellTitle: 'Guess the spell',
    menuSpellDesc: 'Guess the spell letter by letter. You have 10 lives.',
    menuPhotoTitle: 'Who is in the photo?',
    menuPhotoDesc: 'Look at the photo and pick the correct name from four choices.',
    menuRpsTitle: 'Rock, paper, scissors',
    menuRpsDesc: 'Duel Hogwarts characters at rock–paper–scissors. First to five wins takes the match.',
    menuPlay: 'Play →',
    hangmanCharacterTitle: 'Guess the Harry Potter character',
    hangmanCharacterDesc: 'Guess the character name letter by letter. You have 10 lives.',
    hangmanCharacterInitial: 'Guess a letter in the character name…',
    hangmanSpellTitle: 'Guess the spell',
    hangmanSpellDesc: 'Guess the spell letter by letter. You have 10 lives.',
    hangmanSpellInitial: 'Guess a letter in the spell…',
    hangmanWrongLetters: 'Wrong letters:',
    hangmanWrongLettersEmpty: 'None yet',
    quizHouseTitle: 'Guess the character house',
    quizHouseDesc: 'Pick the correct Hogwarts house for the character name.',
    quizHouseInitial: 'Pick the house this character belongs to…',
    quizPhotoTitle: 'Who is in the photo?',
    quizPhotoDesc: 'Look at the photo and pick the correct character name.',
    quizPhotoInitial: 'Who is in the photo?',
    rpsTitle: 'Rock, paper, scissors',
    rpsDesc: 'Duel Hogwarts characters at rock–paper–scissors. First to five wins takes the match.',
    rpsInitial: 'Pick your move — rock, paper, or scissors?',
  },
} as unknown as LocaleStrings;
