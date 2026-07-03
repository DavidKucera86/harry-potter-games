export const STRINGS = {
  loading: {
    characters: 'Načítám postavy…',
    spells: 'Načítám kouzla…',
    default: 'Načítám data…',
  },
  errors: {
    loadCharacters: 'Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.',
    loadSpells: 'Nepodařilo se načíst kouzla. Zkus to znovu tlačítkem Nová hra.',
    emptyCharacters: 'Prázdný seznam postav',
    emptySpells: 'Prázdný seznam kouzel',
    notEnoughCharacters: 'Nedostatek postav',
    notEnoughPhotoCharacters: 'Nedostatek postav s fotkou',
    allPhotosBroken: 'Nepodařilo se načíst fotky postav. Zkus to znovu tlačítkem Nová hra.',
  },
  a11y: {
    livesLabel: 'Zbývající životy',
    photoAlt: 'Fotka postavy',
    loadingBusy: 'Načítám data hry',
  },
  hangman: {
    guessCharacter: 'Hádej písmeno ve jménu postavy…',
    guessSpell: 'Hádej písmeno v zaklínadle…',
    invalidLetter: 'Zadej prosím platné písmeno (A–Z).',
    letterAlreadyGuessed(letter) {
      return `Písmeno „${letter.toUpperCase()}" už jsi hádal/a.`;
    },
    correctInName(letter) {
      return `Správně! Písmeno „${letter.toUpperCase()}" je ve jménu.`;
    },
    wrongInName(letter) {
      return `Špatně! Písmeno „${letter.toUpperCase()}" ve jménu není.`;
    },
    correctInSpell(letter) {
      return `Správně! Písmeno „${letter.toUpperCase()}" je v zaklínadle.`;
    },
    wrongInSpell(letter) {
      return `Špatně! Písmeno „${letter.toUpperCase()}" v zaklínadle není.`;
    },
    winTitle: 'Gratulujeme!',
    loseTitle: 'Došly životy!',
    winCharacter: 'Uhodl/a jsi postavu:',
    loseCharacter: 'Správná postava byla:',
    winSpell: 'Uhodl/a jsi zaklínadlo:',
    loseSpell: 'Správné zaklínadlo bylo:',
    noWrongLetters: '—',
  },
  quiz: {
    housePrompt: 'Vyber kolej, do které postava patří…',
    photoPrompt: 'Kdo je na fotce?',
    houseCorrect(name, house) {
      return `Správně! ${name} patří do ${house}.`;
    },
    houseWrong(name, house) {
      return `Špatně! ${name} patří do ${house}.`;
    },
    photoCorrect(name) {
      return `Správně! Je to ${name}.`;
    },
    photoWrong(name) {
      return `Špatně! Na fotce je ${name}.`;
    },
    loseTitle: 'Došly životy!',
    scoreLabel: 'Tvé skóre:',
    lastCharacterLabel: 'Poslední postava:',
    correctHouseLabel: 'Správná kolej:',
  },
};
