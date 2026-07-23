const en = {
  loading: {
    characters: "Loading characters\u2026",
    spells: "Loading spells\u2026",
    default: "Loading data\u2026"
  },
  errors: {
    loadCharacters: "Failed to load characters. Try again with New Game.",
    loadSpells: "Failed to load spells. Try again with New Game.",
    fetchTimeoutCharacters: "Loading characters is taking too long. Try again with New Game.",
    fetchTimeoutSpells: "Loading spells is taking too long. Try again with New Game.",
    emptyCharacters: "Empty character list",
    emptySpells: "Empty spell list",
    notEnoughCharacters: "Not enough characters",
    notEnoughPhotoCharacters: "Not enough characters with photos",
    allPhotosBroken: "Failed to load character photos. Try again with New Game."
  },
  a11y: {
    livesLabel: "Remaining lives",
    photoAlt: "Character photo \u2014 guess the name",
    loadingBusy: "Loading game data",
    wordDisplayLabel: "Word to guess"
  },
  hangman: {
    guessCharacter: "Guess a letter in the character name\u2026",
    guessSpell: "Guess a letter in the spell\u2026",
    invalidLetter: "Please enter a valid letter (A\u2013Z).",
    letterAlreadyGuessed(letter) {
      return `You already guessed "${letter.toUpperCase()}".`;
    },
    correctInName(letter) {
      return `Correct! The letter "${letter.toUpperCase()}" is in the name.`;
    },
    wrongInName(letter) {
      return `Wrong! The letter "${letter.toUpperCase()}" is not in the name.`;
    },
    correctInSpell(letter) {
      return `Correct! The letter "${letter.toUpperCase()}" is in the spell.`;
    },
    wrongInSpell(letter) {
      return `Wrong! The letter "${letter.toUpperCase()}" is not in the spell.`;
    },
    winTitle: "Congratulations!",
    loseTitle: "Out of lives!",
    winCharacter: "You guessed the character:",
    loseCharacter: "The correct character was:",
    winSpell: "You guessed the spell:",
    loseSpell: "The correct spell was:",
    noWrongLetters: "\u2014",
    wrongLettersLabel: "Wrong letters:"
  },
  quiz: {
    housePrompt: "Pick the house this character belongs to\u2026",
    photoPrompt: "Who is in the photo?",
    houseCorrect(name, house) {
      return `Correct! ${name} belongs to ${house}.`;
    },
    houseWrong(name, house) {
      return `Wrong! ${name} belongs to ${house}.`;
    },
    photoCorrect(name) {
      return `Correct! It is ${name}.`;
    },
    photoWrong(name) {
      return `Wrong! The photo shows ${name}.`;
    },
    loseTitle: "Out of lives!",
    scoreLabel: "Your score:",
    lastCharacterLabel: "Last character:",
    correctHouseLabel: "Correct house:"
  },
  rps: {
    prompt: "Pick your move \u2014 rock, paper, or scissors?",
    moves: {
      rock: "\u{1FAA8} Rock",
      paper: "\u{1F4C4} Paper",
      scissors: "\u2702\uFE0F Scissors"
    },
    roundWin(playerLabel, opponentLabel) {
      return `You won the round! ${playerLabel} beats ${opponentLabel}.`;
    },
    roundLose(playerLabel, opponentLabel) {
      return `You lost the round! ${opponentLabel} beats ${playerLabel}.`;
    },
    roundTie(moveLabel) {
      return `Tie! You both played ${moveLabel}.`;
    },
    matchWinTitle: "You won the match!",
    matchLoseTitle: "You lost the match!",
    yourWinsLabel: "Your wins:",
    opponentWinsLabel: "Opponent wins:",
    lastOpponentLabel: "Last opponent:",
    opponentAlt: "Opponent photo",
    noHouse: "No house"
  },
  chat: {
    greeting(nickname) {
      return `Welcome, ${nickname}. Do sit down and have a sherbet lemon. Ask me anything \u2014 I speak most gladly of love, death, wisdom, and the secrets of Hogwarts.`;
    },
    errorEmptyNickname: "Please enter your nickname.",
    errorTooLongNickname: "The nickname may be at most 32 characters long.",
    errorNoCharacter: "Please choose a character to chat with."
  },
  ui: {
    newGame: "New game",
    guessLetter: "Guess",
    playAgain: "Play again",
    backToMenu: "\u2190 Back to menu",
    localeLabel: "Language",
    footerText: "Enjoying the games? Buy the author a butterbeer",
    buyMeCoffee: "\u2615 Buy Me a Coffee",
    loadingDefault: "Loading data\u2026",
    livesLabel: "Lives",
    scoreLabel: "Score",
    letterPlaceholder: "Enter a letter",
    keyboardHint: "Tip: you can type directly on the keyboard and press Enter",
    skipToContent: "Skip to content",
    swUpdateMessage: "A new version of the app is available.",
    swUpdateReload: "Reload",
    rpsYou: "You",
    rpsOpponent: "Opponent",
    chatStart: "Start chat",
    chatSend: "Send",
    chatBack: "\u2190 Change character",
    chatYou: "You",
    chatNicknamePlaceholder: "Enter a nickname (max. 32 characters)",
    chatMessagePlaceholder: "Type a message\u2026",
    chatLogLabel: "Conversation log"
  },
  pages: {
    menuTitle: "Harry Potter Games",
    menuSubtitle: "Pick a game from the wizarding world. Data from the HP API.",
    menuCharacterTitle: "Guess the character name",
    menuCharacterDesc: "Hangman style \u2014 guess the character name letter by letter. You have 10 lives.",
    menuHouseTitle: "Guess the character house",
    menuHouseDesc: "Show your Hogwarts knowledge \u2014 pick the correct house for each character.",
    menuSpellTitle: "Guess the spell",
    menuSpellDesc: "Guess the spell letter by letter. You have 10 lives.",
    menuPhotoTitle: "Who is in the photo?",
    menuPhotoDesc: "Look at the photo and pick the correct name from four choices.",
    menuRpsTitle: "Rock, paper, scissors",
    menuRpsDesc: "Duel Hogwarts characters at rock\u2013paper\u2013scissors. First to five wins takes the match.",
    menuChatTitle: "Chat with a character",
    menuChatDesc: "Pick a character from the wizarding world and strike up a conversation. For now you can chat with Dumbledore.",
    menuPlay: "Play \u2192",
    hangmanCharacterTitle: "Guess the Harry Potter character",
    hangmanCharacterDesc: "Guess the character name letter by letter. You have 10 lives.",
    hangmanCharacterInitial: "Guess a letter in the character name\u2026",
    hangmanSpellTitle: "Guess the spell",
    hangmanSpellDesc: "Guess the spell letter by letter. You have 10 lives.",
    hangmanSpellInitial: "Guess a letter in the spell\u2026",
    hangmanWrongLetters: "Wrong letters:",
    hangmanWrongLettersEmpty: "None yet",
    quizHouseTitle: "Guess the character house",
    quizHouseDesc: "Pick the correct Hogwarts house for the character name.",
    quizHouseInitial: "Pick the house this character belongs to\u2026",
    quizPhotoTitle: "Who is in the photo?",
    quizPhotoDesc: "Look at the photo and pick the correct character name.",
    quizPhotoInitial: "Who is in the photo?",
    rpsTitle: "Rock, paper, scissors",
    rpsDesc: "Duel Hogwarts characters at rock\u2013paper\u2013scissors. First to five wins takes the match.",
    rpsInitial: "Pick your move \u2014 rock, paper, or scissors?",
    chatTitle: "Chat with a Harry Potter character",
    chatDesc: "Pick a character and strike up a conversation. They reply with canned lines based on what you write.",
    chatSetupHeading: "Before we begin",
    chatNicknameLabel: "Your nickname",
    chatCharacterLabel: "Who would you like to talk to?"
  }
};
export {
  en
};
