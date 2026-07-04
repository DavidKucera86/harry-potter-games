export const cs = {
  loading: {
    characters: 'Načítám postavy…',
    spells: 'Načítám kouzla…',
    default: 'Načítám data…',
  },
  errors: {
    loadCharacters: 'Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.',
    loadSpells: 'Nepodařilo se načíst kouzla. Zkus to znovu tlačítkem Nová hra.',
    fetchTimeoutCharacters: 'Načítání postav trvá příliš dlouho. Zkus to znovu tlačítkem Nová hra.',
    fetchTimeoutSpells: 'Načítání kouzel trvá příliš dlouho. Zkus to znovu tlačítkem Nová hra.',
    emptyCharacters: 'Prázdný seznam postav',
    emptySpells: 'Prázdný seznam kouzel',
    notEnoughCharacters: 'Nedostatek postav',
    notEnoughPhotoCharacters: 'Nedostatek postav s fotkou',
    allPhotosBroken: 'Nepodařilo se načíst fotky postav. Zkus to znovu tlačítkem Nová hra.',
  },
  a11y: {
    livesLabel: 'Zbývající životy',
    photoAlt: 'Fotografie postavy — hádej jméno',
    loadingBusy: 'Načítám data hry',
  },
  hangman: {
    guessCharacter: 'Hádej písmeno ve jménu postavy…',
    guessSpell: 'Hádej písmeno v zaklínadle…',
    invalidLetter: 'Zadej prosím platné písmeno (A–Z).',
    letterAlreadyGuessed(letter: string) {
      return `Písmeno „${letter.toUpperCase()}" už jsi hádal/a.`;
    },
    correctInName(letter: string) {
      return `Správně! Písmeno „${letter.toUpperCase()}" je ve jménu.`;
    },
    wrongInName(letter: string) {
      return `Špatně! Písmeno „${letter.toUpperCase()}" ve jménu není.`;
    },
    correctInSpell(letter: string) {
      return `Správně! Písmeno „${letter.toUpperCase()}" je v zaklínadle.`;
    },
    wrongInSpell(letter: string) {
      return `Špatně! Písmeno „${letter.toUpperCase()}" v zaklínadle není.`;
    },
    winTitle: 'Gratulujeme!',
    loseTitle: 'Došly životy!',
    winCharacter: 'Uhodl/a jsi postavu:',
    loseCharacter: 'Správná postava byla:',
    winSpell: 'Uhodl/a jsi zaklínadlo:',
    loseSpell: 'Správné zaklínadlo bylo:',
    noWrongLetters: '—',
    wrongLettersLabel: 'Špatná písmena:',
  },
  quiz: {
    housePrompt: 'Vyber kolej, do které postava patří…',
    photoPrompt: 'Kdo je na fotce?',
    houseCorrect(name: string, house: string) {
      return `Správně! ${name} patří do ${house}.`;
    },
    houseWrong(name: string, house: string) {
      return `Špatně! ${name} patří do ${house}.`;
    },
    photoCorrect(name: string) {
      return `Správně! Je to ${name}.`;
    },
    photoWrong(name: string) {
      return `Špatně! Na fotce je ${name}.`;
    },
    loseTitle: 'Došly životy!',
    scoreLabel: 'Tvé skóre:',
    lastCharacterLabel: 'Poslední postava:',
    correctHouseLabel: 'Správná kolej:',
  },
  ui: {
    newGame: 'Nová hra',
    guessLetter: 'Hádat',
    playAgain: 'Hrát znovu',
    backToMenu: '← Zpět na menu',
    localeLabel: 'Jazyk',
    footerText: 'Líbí se ti hry? Pošli autorovi kouzelný nápoj',
    buyMeCoffee: '☕ Buy Me a Coffee',
    loadingDefault: 'Načítám data…',
  },
  pages: {
    menuTitle: 'Harry Potter Games',
    menuSubtitle: 'Vyber si hru ze světa Harryho Pottera. Data z HP API.',
    menuCharacterTitle: 'Hádej jméno postavy',
    menuCharacterDesc: 'Hangman styl — uhodni jméno postavy písmeno po písmenu. Máš 10 životů.',
    menuHouseTitle: 'Hádej kolej postavy',
    menuHouseDesc: 'Ukaž znalost Bradavic — ke jménu postavy vyber správnou kolej ze čtyř možností.',
    menuSpellTitle: 'Hádej zaklínadlo',
    menuSpellDesc: 'Uhodni zaklínadlo písmeno po písmenu. Máš 10 životů.',
    menuPhotoTitle: 'Kdo je na fotce?',
    menuPhotoDesc: 'Podívej se na fotku postavy a vyber správné jméno ze čtyř možností.',
    menuPlay: 'Hrát →',
    hangmanCharacterTitle: 'Hádej postavu z Harryho Pottera',
    hangmanCharacterDesc: 'Uhodni jméno postavy písmeno po písmenu. Máš 10 životů.',
    hangmanCharacterInitial: 'Hádej písmeno ve jménu postavy…',
    hangmanSpellTitle: 'Hádej zaklínadlo',
    hangmanSpellDesc: 'Uhodni zaklínadlo písmeno po písmenu. Máš 10 životů.',
    hangmanSpellInitial: 'Hádej písmeno v zaklínadle…',
    hangmanWrongLetters: 'Špatná písmena:',
    hangmanWrongLettersEmpty: 'Zatím žádná',
    quizHouseTitle: 'Hádej kolej postavy',
    quizHouseDesc: 'Ke jménu postavy vyber správnou Bradavickou kolej.',
    quizHouseInitial: 'Vyber kolej, do které postava patří…',
    quizPhotoTitle: 'Kdo je na fotce?',
    quizPhotoDesc: 'Podívej se na fotku a vyber správné jméno postavy.',
    quizPhotoInitial: 'Kdo je na fotce?',
  },
} as const;

export type LocaleStrings = typeof cs;
