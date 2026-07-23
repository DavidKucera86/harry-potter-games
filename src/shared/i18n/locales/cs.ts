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
    wordDisplayLabel: 'Hádané slovo',
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
  rps: {
    prompt: 'Vyber svůj tah — kámen, nůžky, nebo papír?',
    moves: {
      rock: '🪨 Kámen',
      paper: '📄 Papír',
      scissors: '✂️ Nůžky',
    },
    roundWin(playerLabel: string, opponentLabel: string) {
      return `Vyhráls kolo! ${playerLabel} poráží ${opponentLabel}.`;
    },
    roundLose(playerLabel: string, opponentLabel: string) {
      return `Prohráls kolo! ${opponentLabel} poráží ${playerLabel}.`;
    },
    roundTie(moveLabel: string) {
      return `Remíza! Oba jste zvolili ${moveLabel}.`;
    },
    matchWinTitle: 'Vyhráls zápas!',
    matchLoseTitle: 'Prohráls zápas!',
    yourWinsLabel: 'Tvé výhry:',
    opponentWinsLabel: 'Výhry soupeře:',
    lastOpponentLabel: 'Poslední soupeř:',
    opponentAlt: 'Fotografie soupeře',
    noHouse: 'Bez koleje',
  },
  chat: {
    greeting(nickname: string) {
      return `Vítej, ${nickname}. Posaď se a dej si šerbetový citrónek. Ptej se na cokoli — nejraději hovořím o lásce, smrti, moudrosti a tajemstvích Bradavic.`;
    },
    errorEmptyNickname: 'Zadej prosím svou přezdívku.',
    errorTooLongNickname: 'Přezdívka smí mít nejvýš 32 znaků.',
    errorNoCharacter: 'Vyber prosím postavu, se kterou si chceš povídat.',
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
    livesLabel: 'Životy',
    scoreLabel: 'Skóre',
    letterPlaceholder: 'Zadej písmeno',
    keyboardHint: 'Tip: můžeš psát přímo na klávesnici a potvrdit Enterem',
    skipToContent: 'Přeskočit na obsah',
    swUpdateMessage: 'Je dostupná nová verze aplikace.',
    swUpdateReload: 'Obnovit',
    rpsYou: 'Ty',
    rpsOpponent: 'Soupeř',
    chatStart: 'Začít chat',
    chatSend: 'Odeslat',
    chatBack: '← Změnit postavu',
    chatYou: 'Ty',
    chatNicknamePlaceholder: 'Zadej přezdívku (max. 32 znaků)',
    chatMessagePlaceholder: 'Napiš zprávu…',
    chatLogLabel: 'Průběh konverzace',
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
    menuRpsTitle: 'Kámen, nůžky, papír',
    menuRpsDesc: 'Utkej se v kámen–nůžky–papír proti postavám z Bradavic. Kdo první získá pět výher, bere zápas.',
    menuChatTitle: 'Chat s postavou',
    menuChatDesc: 'Vyber si postavu ze světa Harryho Pottera a dej se s ní do řeči. Zatím si můžeš popovídat s Brumbálem.',
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
    rpsTitle: 'Kámen, nůžky, papír',
    rpsDesc: 'Utkej se v kámen–nůžky–papír proti postavám z Bradavic. Kdo první získá pět výher, bere zápas.',
    rpsInitial: 'Vyber svůj tah — kámen, nůžky, nebo papír?',
    chatTitle: 'Chat s postavou z Harryho Pottera',
    chatDesc: 'Vyber si postavu a dej se s ní do řeči. Odpovídá připravenými hláškami podle toho, o čem píšeš.',
    chatSetupHeading: 'Než začneme',
    chatNicknameLabel: 'Tvá přezdívka',
    chatCharacterLabel: 'S kým si chceš povídat?',
  },
} as const;

export type LocaleStrings = typeof cs;
