const cs = {
  loading: {
    characters: "Na\u010D\xEDt\xE1m postavy\u2026",
    spells: "Na\u010D\xEDt\xE1m kouzla\u2026",
    default: "Na\u010D\xEDt\xE1m data\u2026"
  },
  errors: {
    loadCharacters: "Nepoda\u0159ilo se na\u010D\xEDst postavy. Zkus to znovu tla\u010D\xEDtkem Nov\xE1 hra.",
    loadSpells: "Nepoda\u0159ilo se na\u010D\xEDst kouzla. Zkus to znovu tla\u010D\xEDtkem Nov\xE1 hra.",
    fetchTimeoutCharacters: "Na\u010D\xEDt\xE1n\xED postav trv\xE1 p\u0159\xEDli\u0161 dlouho. Zkus to znovu tla\u010D\xEDtkem Nov\xE1 hra.",
    fetchTimeoutSpells: "Na\u010D\xEDt\xE1n\xED kouzel trv\xE1 p\u0159\xEDli\u0161 dlouho. Zkus to znovu tla\u010D\xEDtkem Nov\xE1 hra.",
    emptyCharacters: "Pr\xE1zdn\xFD seznam postav",
    emptySpells: "Pr\xE1zdn\xFD seznam kouzel",
    notEnoughCharacters: "Nedostatek postav",
    notEnoughPhotoCharacters: "Nedostatek postav s fotkou",
    allPhotosBroken: "Nepoda\u0159ilo se na\u010D\xEDst fotky postav. Zkus to znovu tla\u010D\xEDtkem Nov\xE1 hra."
  },
  a11y: {
    livesLabel: "Zb\xFDvaj\xEDc\xED \u017Eivoty",
    photoAlt: "Fotografie postavy \u2014 h\xE1dej jm\xE9no",
    loadingBusy: "Na\u010D\xEDt\xE1m data hry",
    wordDisplayLabel: "H\xE1dan\xE9 slovo"
  },
  hangman: {
    guessCharacter: "H\xE1dej p\xEDsmeno ve jm\xE9nu postavy\u2026",
    guessSpell: "H\xE1dej p\xEDsmeno v zakl\xEDnadle\u2026",
    invalidLetter: "Zadej pros\xEDm platn\xE9 p\xEDsmeno (A\u2013Z).",
    letterAlreadyGuessed(letter) {
      return `P\xEDsmeno \u201E${letter.toUpperCase()}" u\u017E jsi h\xE1dal/a.`;
    },
    correctInName(letter) {
      return `Spr\xE1vn\u011B! P\xEDsmeno \u201E${letter.toUpperCase()}" je ve jm\xE9nu.`;
    },
    wrongInName(letter) {
      return `\u0160patn\u011B! P\xEDsmeno \u201E${letter.toUpperCase()}" ve jm\xE9nu nen\xED.`;
    },
    correctInSpell(letter) {
      return `Spr\xE1vn\u011B! P\xEDsmeno \u201E${letter.toUpperCase()}" je v zakl\xEDnadle.`;
    },
    wrongInSpell(letter) {
      return `\u0160patn\u011B! P\xEDsmeno \u201E${letter.toUpperCase()}" v zakl\xEDnadle nen\xED.`;
    },
    winTitle: "Gratulujeme!",
    loseTitle: "Do\u0161ly \u017Eivoty!",
    winCharacter: "Uhodl/a jsi postavu:",
    loseCharacter: "Spr\xE1vn\xE1 postava byla:",
    winSpell: "Uhodl/a jsi zakl\xEDnadlo:",
    loseSpell: "Spr\xE1vn\xE9 zakl\xEDnadlo bylo:",
    noWrongLetters: "\u2014",
    wrongLettersLabel: "\u0160patn\xE1 p\xEDsmena:"
  },
  quiz: {
    housePrompt: "Vyber kolej, do kter\xE9 postava pat\u0159\xED\u2026",
    photoPrompt: "Kdo je na fotce?",
    houseCorrect(name, house) {
      return `Spr\xE1vn\u011B! ${name} pat\u0159\xED do ${house}.`;
    },
    houseWrong(name, house) {
      return `\u0160patn\u011B! ${name} pat\u0159\xED do ${house}.`;
    },
    photoCorrect(name) {
      return `Spr\xE1vn\u011B! Je to ${name}.`;
    },
    photoWrong(name) {
      return `\u0160patn\u011B! Na fotce je ${name}.`;
    },
    loseTitle: "Do\u0161ly \u017Eivoty!",
    scoreLabel: "Tv\xE9 sk\xF3re:",
    lastCharacterLabel: "Posledn\xED postava:",
    correctHouseLabel: "Spr\xE1vn\xE1 kolej:"
  },
  rps: {
    prompt: "Vyber sv\u016Fj tah \u2014 k\xE1men, n\u016F\u017Eky, nebo pap\xEDr?",
    moves: {
      rock: "\u{1FAA8} K\xE1men",
      paper: "\u{1F4C4} Pap\xEDr",
      scissors: "\u2702\uFE0F N\u016F\u017Eky"
    },
    roundWin(playerLabel, opponentLabel) {
      return `Vyhr\xE1ls kolo! ${playerLabel} por\xE1\u017E\xED ${opponentLabel}.`;
    },
    roundLose(playerLabel, opponentLabel) {
      return `Prohr\xE1ls kolo! ${opponentLabel} por\xE1\u017E\xED ${playerLabel}.`;
    },
    roundTie(moveLabel) {
      return `Rem\xEDza! Oba jste zvolili ${moveLabel}.`;
    },
    matchWinTitle: "Vyhr\xE1ls z\xE1pas!",
    matchLoseTitle: "Prohr\xE1ls z\xE1pas!",
    yourWinsLabel: "Tv\xE9 v\xFDhry:",
    opponentWinsLabel: "V\xFDhry soupe\u0159e:",
    lastOpponentLabel: "Posledn\xED soupe\u0159:",
    opponentAlt: "Fotografie soupe\u0159e",
    noHouse: "Bez koleje"
  },
  ui: {
    newGame: "Nov\xE1 hra",
    guessLetter: "H\xE1dat",
    playAgain: "Hr\xE1t znovu",
    backToMenu: "\u2190 Zp\u011Bt na menu",
    localeLabel: "Jazyk",
    footerText: "L\xEDb\xED se ti hry? Po\u0161li autorovi kouzeln\xFD n\xE1poj",
    buyMeCoffee: "\u2615 Buy Me a Coffee",
    klodoMetr: "\u{1F346} Kl\xF3do-Metr",
    loadingDefault: "Na\u010D\xEDt\xE1m data\u2026",
    livesLabel: "\u017Divoty",
    scoreLabel: "Sk\xF3re",
    letterPlaceholder: "Zadej p\xEDsmeno",
    keyboardHint: "Tip: m\u016F\u017Ee\u0161 ps\xE1t p\u0159\xEDmo na kl\xE1vesnici a potvrdit Enterem",
    skipToContent: "P\u0159esko\u010Dit na obsah",
    swUpdateMessage: "Je dostupn\xE1 nov\xE1 verze aplikace.",
    swUpdateReload: "Obnovit",
    rpsYou: "Ty",
    rpsOpponent: "Soupe\u0159"
  },
  pages: {
    menuTitle: "Harry Potter Games",
    menuSubtitle: "Vyber si hru ze sv\u011Bta Harryho Pottera. Data z HP API.",
    menuCharacterTitle: "H\xE1dej jm\xE9no postavy",
    menuCharacterDesc: "Hangman styl \u2014 uhodni jm\xE9no postavy p\xEDsmeno po p\xEDsmenu. M\xE1\u0161 10 \u017Eivot\u016F.",
    menuHouseTitle: "H\xE1dej kolej postavy",
    menuHouseDesc: "Uka\u017E znalost Bradavic \u2014 ke jm\xE9nu postavy vyber spr\xE1vnou kolej ze \u010Dty\u0159 mo\u017Enost\xED.",
    menuSpellTitle: "H\xE1dej zakl\xEDnadlo",
    menuSpellDesc: "Uhodni zakl\xEDnadlo p\xEDsmeno po p\xEDsmenu. M\xE1\u0161 10 \u017Eivot\u016F.",
    menuPhotoTitle: "Kdo je na fotce?",
    menuPhotoDesc: "Pod\xEDvej se na fotku postavy a vyber spr\xE1vn\xE9 jm\xE9no ze \u010Dty\u0159 mo\u017Enost\xED.",
    menuRpsTitle: "K\xE1men, n\u016F\u017Eky, pap\xEDr",
    menuRpsDesc: "Utkej se v k\xE1men\u2013n\u016F\u017Eky\u2013pap\xEDr proti postav\xE1m z Bradavic. Kdo prvn\xED z\xEDsk\xE1 p\u011Bt v\xFDher, bere z\xE1pas.",
    menuPlay: "Hr\xE1t \u2192",
    hangmanCharacterTitle: "H\xE1dej postavu z Harryho Pottera",
    hangmanCharacterDesc: "Uhodni jm\xE9no postavy p\xEDsmeno po p\xEDsmenu. M\xE1\u0161 10 \u017Eivot\u016F.",
    hangmanCharacterInitial: "H\xE1dej p\xEDsmeno ve jm\xE9nu postavy\u2026",
    hangmanSpellTitle: "H\xE1dej zakl\xEDnadlo",
    hangmanSpellDesc: "Uhodni zakl\xEDnadlo p\xEDsmeno po p\xEDsmenu. M\xE1\u0161 10 \u017Eivot\u016F.",
    hangmanSpellInitial: "H\xE1dej p\xEDsmeno v zakl\xEDnadle\u2026",
    hangmanWrongLetters: "\u0160patn\xE1 p\xEDsmena:",
    hangmanWrongLettersEmpty: "Zat\xEDm \u017E\xE1dn\xE1",
    quizHouseTitle: "H\xE1dej kolej postavy",
    quizHouseDesc: "Ke jm\xE9nu postavy vyber spr\xE1vnou Bradavickou kolej.",
    quizHouseInitial: "Vyber kolej, do kter\xE9 postava pat\u0159\xED\u2026",
    quizPhotoTitle: "Kdo je na fotce?",
    quizPhotoDesc: "Pod\xEDvej se na fotku a vyber spr\xE1vn\xE9 jm\xE9no postavy.",
    quizPhotoInitial: "Kdo je na fotce?",
    rpsTitle: "K\xE1men, n\u016F\u017Eky, pap\xEDr",
    rpsDesc: "Utkej se v k\xE1men\u2013n\u016F\u017Eky\u2013pap\xEDr proti postav\xE1m z Bradavic. Kdo prvn\xED z\xEDsk\xE1 p\u011Bt v\xFDher, bere z\xE1pas.",
    rpsInitial: "Vyber sv\u016Fj tah \u2014 k\xE1men, n\u016F\u017Eky, nebo pap\xEDr?"
  }
};
export {
  cs
};
