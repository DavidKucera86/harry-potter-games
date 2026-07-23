import type { TopicRegistry } from '../../shared/chatEngine.js';

/**
 * Shared topic taxonomy for the Harry Potter world. Keyword sets are authored
 * once here and reused by every character; each character supplies their own
 * quotes per topic (in `quotes`). `deferrable` marks world/lore/opinion topics
 * that one character may relay from another ("I don't know, but Dumbledore
 * says…"). Personal topics (family, romance, one's own name/age…) are
 * `deferrable: false` — a character answers those only for themselves, never on
 * someone else's behalf.
 */
export const TOPICS: TopicRegistry = {
  // --- Personal / small-talk: answered only from a character's own quotes ---
  pozdrav: {
    deferrable: false,
    keywords: {
      cs: ['ahoj', 'cau', 'nazdar', 'zdrav', 'dobry den', 'dobre rano', 'dobry vecer', 'vitej'],
      en: ['hello', 'hey there', 'greetings', 'good morning', 'good evening', 'good day'],
    },
  },
  jaksemas: {
    deferrable: false,
    keywords: {
      cs: ['jak se mas', 'jak se mate', 'jak ti je', 'jak se ti dari', 'jak se vede', 'jak se citis', 'co je noveho', 'co delas', 'jak to jde'],
      en: ['how are you', 'how do you do', 'how are things', 'how have you been', 'how are you feeling', 'how is it going', 'whats up'],
    },
  },
  oblibene: {
    deferrable: false,
    keywords: {
      cs: ['co mas rad', 'mas rad', 'co te bavi', 'oblib', 'co miluje', 'co preferuje', 'co te tesi'],
      en: ['what do you like', 'do you like', 'what do you enjoy', 'favourite', 'favorite', 'what makes you happy'],
    },
  },
  identita: {
    deferrable: false,
    keywords: {
      cs: ['kdo jsi', 'kdo jste', 'jak se jmenuje', 'predstav se', 'co jsi zac', 'o sobe'],
      en: ['who are you', 'what is your name', 'whats your name', 'introduce yourself', 'about you'],
    },
  },
  namety: {
    deferrable: false,
    keywords: {
      cs: ['o cem', 'co umis', 'co vis', 'na co se', 'poradi', 'napovez', 'temata', 'co bys'],
      en: ['what can we talk', 'what can you', 'what do you know', 'suggest a topic', 'topics', 'help me', 'what should i ask'],
    },
  },
  podekovani: {
    deferrable: false,
    keywords: {
      cs: ['diky', 'dekuj', 'dekuju', 'jsi hodny'],
      en: ['thank', 'thanks', 'cheers', 'much appreciated'],
    },
  },
  rozlouceni: {
    deferrable: false,
    keywords: {
      cs: ['sbohem', 'nashledanou', 'na shledanou', 'mej se', 'loucim', 'tak zatim', 'papa'],
      en: ['goodbye', 'good bye', 'farewell', 'see you', 'take care'],
    },
  },
  vtipy: {
    deferrable: false,
    keywords: {
      cs: ['vtip', 'sranda', 'legrace', 'humor', 'rozesmej', 'nasmej', 'pobav', 'zavtipkuj'],
      en: ['joke', 'funny', 'make me laugh', 'tell me something funny', 'humour', 'humor'],
    },
  },
  vek: {
    deferrable: false,
    keywords: {
      cs: ['kolik ti je', 'kolik je ti let', 'jak stary', 'jak jsi stary', 'tvuj vek', 'jak jsi mlady'],
      en: ['how old', 'your age', 'how many years'],
    },
  },
  oblibenekouzlo: {
    deferrable: false,
    keywords: {
      cs: ['oblibene kouzlo', 'oblibene zaklinad', 'nejoblibenejsi kouzlo', 'tvoje kouzlo', 'tve kouzlo', 'oblibena magie', 'jake kouzlo'],
      en: ['favourite spell', 'favorite spell', 'best spell', 'favourite charm', 'favorite charm'],
    },
  },
  rodina: {
    deferrable: false,
    keywords: {
      cs: ['rodin', 'rodic', 'sourozenec', 'bratr', 'sestra', 'aberforth', 'ariana', 'kendra', 'percival', 'otec', 'matka'],
      en: ['family', 'brother', 'sister', 'parents', 'aberforth', 'ariana'],
    },
  },
  romantika: {
    deferrable: false,
    keywords: {
      cs: ['romant', 'zamilovan', 'partner', 'vztah', 'manzel', 'ozenil', 'svatba', 'grindelwald', 'gellert', 'milostn', 'zena tveho'],
      en: ['love life', 'relationship', 'married', 'romantic', 'partner', 'grindelwald', 'gellert', 'ever love', 'in love'],
    },
  },
  buh: {
    deferrable: false,
    keywords: {
      cs: ['buh', 'boha', 'boze', 'vira', 'veri', 'nabozenstv', 'modl', 'posmrtn', 'duse', 'onen svet'],
      en: ['god', 'religion', 'believe in', 'faith', 'afterlife', 'the soul', 'higher power'],
    },
  },
  rowling: {
    deferrable: false,
    keywords: {
      cs: ['rowling', 'autork', 'spisovatelk', 'kdo te napsal', 'kdo te vymyslel', 'joanne', 'jkr', 'tvuj tvurce'],
      en: ['rowling', 'author', 'writer', 'who wrote you', 'who created you', 'your creator', 'joanne'],
    },
  },
  heslo: {
    deferrable: false,
    keywords: {
      cs: ['heslo', 'hesla', 'heslem', 'jak zni to heslo', 'heslo do pracovny'],
      en: ['password', 'the password'],
    },
  },
  tituly: {
    deferrable: false,
    keywords: {
      cs: ['tvuj titul', 'jake mas tituly', 'tituly', 'merlinuv rad', 'rad merlina', 'nejvyssi divotvurce', 'kartick'],
      en: ['your titles', 'order of merlin', 'supreme mugwump', 'chief warlock', 'chocolate frog card'],
    },
  },

  // --- World / lore / opinions: relayable between characters (deferrable) ---
  sladkosti: {
    deferrable: true,
    keywords: {
      cs: ['sladk', 'cukr', 'drops', 'citron', 'bonbon', 'medov', 'mlsa', 'serbet', 'cokolad', 'cokoladova zaba', 'lizatko', 'bertie', 'fazolky', 'ledova mys', 'sumak'],
      en: ['sweet', 'sherbet', 'lemon', 'candy', 'sugar', 'honeyduke', 'chocolate frog', 'bertie bott', 'fizzing whizz', 'acid pop', 'lollipop'],
    },
  },
  smrt: {
    deferrable: true,
    keywords: {
      cs: ['smrt', 'umir', 'zemr', 'konec', 'ztrat', 'zesnul'],
      en: ['death', 'die', 'dying', 'mortal', 'loss', 'grief'],
    },
  },
  strach: {
    deferrable: true,
    keywords: {
      cs: ['strach', 'boj', 'temn', 'nebezpec', 'zlo'],
      en: ['fear', 'afraid', 'danger', 'evil'],
    },
  },
  temne_casy: {
    deferrable: true,
    keywords: {
      cs: ['temne cas', 'temnych cas', 'temna doba', 'temne doby', 'temna leta', 'temne obdobi'],
      en: ['dark times', 'dark days', 'dark era', 'darkest of times'],
    },
  },
  laska: {
    deferrable: true,
    keywords: {
      cs: ['lask', 'cit', 'srdc', 'obet', 'milov'],
      en: ['love', 'heart', 'sacrifice', 'affection'],
    },
  },
  moudrost: {
    deferrable: true,
    keywords: {
      cs: ['moudr', 'vedom', 'volb', 'rozhod', 'spravn', 'rada'],
      en: ['wisdom', 'wise', 'choice', 'decision', 'right thing', 'advice'],
    },
  },
  tajemstvi: {
    deferrable: true,
    keywords: {
      cs: ['tajemstv', 'tajnost', 'skryvas', 'skryvate', 'co skryvas', 'tajis', 'zahad'],
      en: ['secret', 'mystery', 'what are you hiding', 'conceal'],
    },
  },
  bradavice: {
    deferrable: true,
    keywords: {
      cs: ['bradavic', 'skol', 'kolej', 'nebelvir', 'zmijoz', 'havraspar', 'mrzimor', 'reditel'],
      en: ['hogwarts', 'school', 'house', 'gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'],
    },
  },
  famfrpal: {
    deferrable: true,
    keywords: {
      cs: ['famfrpal', 'kostet', 'zlatonk', 'metl', 'chytac', 'zapas'],
      en: ['quidditch', 'broom', 'snitch', 'seeker', 'bludger', 'match'],
    },
  },
  kouzla: {
    deferrable: true,
    keywords: {
      cs: ['kouzl', 'zaklinad', 'holdk', 'lektvar', 'magie', 'carod'],
      en: ['spell', 'magic', 'wand', 'potion', 'charm', 'enchant'],
    },
  },
  pratelstvi: {
    deferrable: true,
    keywords: {
      cs: ['pratel', 'kamarad', 'vernos', 'spojenec', 'druh'],
      en: ['friend', 'friendship', 'loyalty', 'companion', 'ally'],
    },
  },
  harry: {
    deferrable: true,
    keywords: {
      cs: ['harry', 'potter', 'harryho', 'harrym'],
      en: ['harry', 'potter'],
    },
  },
  hermiona: {
    deferrable: true,
    keywords: {
      cs: ['hermion', 'granger'],
      en: ['hermione', 'granger'],
    },
  },
  ron: {
    deferrable: true,
    keywords: {
      cs: ['ron ', 'ronovi', 'ronald', 'weasley', 'weasleym'],
      en: ['ron ', 'ronald', 'weasley'],
    },
  },
  snape: {
    deferrable: true,
    keywords: {
      cs: ['snape', 'severus', 'snapeov', 'snejp'],
      en: ['snape', 'severus'],
    },
  },
  hagrid: {
    deferrable: true,
    keywords: {
      cs: ['hagrid'],
      en: ['hagrid'],
    },
  },
  mcgonagall: {
    deferrable: true,
    keywords: {
      cs: ['mcgonagall', 'minerv'],
      en: ['mcgonagall', 'minerva'],
    },
  },
  voldemort: {
    deferrable: true,
    keywords: {
      cs: ['voldemort', 'temny pan', 'ty-vis-kdo', 'tom rojvol', 'tom raddle', 'raddle', 'lord zla'],
      en: ['voldemort', 'dark lord', 'you know who', 'tom riddle', 'riddle'],
    },
  },
  draco: {
    deferrable: true,
    keywords: {
      cs: ['draco', 'malfoy', 'malfoyov'],
      en: ['draco', 'malfoy'],
    },
  },
  viteal: {
    deferrable: true,
    keywords: {
      cs: ['viteal', 'roztrhnout dusi', 'rozdelit dusi', 'roztrzena duse', 'kus duse', 'nesmrteln'],
      en: ['horcrux', 'split the soul', 'splitting the soul', 'torn soul', 'immortal'],
    },
  },
  relikvie: {
    deferrable: true,
    keywords: {
      cs: ['relikvi', 'kamen vzkriseni', 'neviditelny plast', 'pan smrti', 'panem smrti', 'peverell'],
      en: ['deathly hallows', 'hallows', 'resurrection stone', 'cloak of invisibility', 'master of death', 'peverell'],
    },
  },
  viteal_zniceni: {
    deferrable: true,
    keywords: {
      cs: ['znicit viteal', 'zniceni viteal', 'znicil viteal', 'nici viteal', 'kdo znicil', 'jak znicit', 'kolik viteal', 'ktere viteal', 'sedm viteal', 'medailon', 'pohar', 'diadem', 'nagini', 'bazilis', 'prsten'],
      en: ['destroy the horcrux', 'destroy a horcrux', 'destroyed the horcrux', 'how many horcrux', 'which horcrux', 'seven horcrux', 'the diary', 'the locket', 'the cup', 'the diadem', 'nagini', 'basilisk'],
    },
  },
  bezova_hulka: {
    deferrable: true,
    keywords: {
      cs: ['bezova hulka', 'hulka z bezu', 'hulka smrti', 'nejmocnejsi hulka', 'pan hulky', 'majitel hulky', 'komu patri hulka'],
      en: ['elder wand', 'deathstick', 'wand of destiny', 'wandlore', 'master of the wand', 'owns the wand'],
    },
  },
  brumbaluv_plan: {
    deferrable: true,
    keywords: {
      cs: ['tvuj plan', 'tvoje smrt', 'tva smrt', 'proc jsi zemrel', 'proc te zabil', 'kdo te zabil', 'cerna ruka', 'zcernal', 'prokleta ruk', 'tva ruk', 'tvou ruk', 'proc snape'],
      en: ['your death', 'your plan', 'who killed you', 'why did you die', 'why snape killed', 'blackened hand', 'cursed hand', 'withered hand'],
    },
  },
  fawkes: {
    deferrable: true,
    keywords: {
      cs: ['fawkes', 'fenix'],
      en: ['fawkes', 'phoenix'],
    },
  },
  flamel: {
    deferrable: true,
    keywords: {
      cs: ['flamel', 'mudrc', 'alchym', 'elixir zivota', 'draci krev', 'perenela'],
      en: ['flamel', 'philosopher', 'sorcerer', 'alchemy', 'elixir of life', 'dragon blood', 'perenelle'],
    },
  },
  rad_fenixe: {
    deferrable: true,
    keywords: {
      cs: ['rad fenixe', 'odboj proti', 'tajne spolecenstvi', 'kdo se postavil', 'kdo bojoval', 'kdo vzdoroval', 'odpor proti', 'hrdinov'],
      en: ['order of the phoenix', 'order of phoenix', 'who fought', 'who resisted', 'who stood against', 'who opposed'],
    },
  },
  grindelwald_souboj: {
    deferrable: true,
    keywords: {
      cs: ['souboj s grindelwald', 'porazil grindelwald', 'porazil jsi grindelwald', 'pro vyssi dobro', 'vetsi dobro', 'nurmengard', 'rok 1945'],
      en: ['duel with grindelwald', 'defeated grindelwald', 'defeat grindelwald', 'for the greater good', 'the greater good', 'nurmengard'],
    },
  },
  zrcadlo: {
    deferrable: true,
    keywords: {
      cs: ['zrcadlo z erised', 'zrcadlo touhy', 'erised', 'esald', 'zrcadlo, ktere'],
      en: ['mirror of erised', 'the mirror', 'deepest desire'],
    },
  },
  myslanka: {
    deferrable: true,
    keywords: {
      cs: ['myslanka', 'vzpominky do', 'ulozit vzpominku', 'nadoba na vzpominky', 'penzieve'],
      en: ['pensieve', 'store memories', 'basin of memories'],
    },
  },
  proroctvi: {
    deferrable: true,
    keywords: {
      cs: ['proroctvi', 'vestba', 'trelawney', 'predpoved o harrym'],
      en: ['prophecy', 'foretold', 'trelawney'],
    },
  },
  puvod: {
    deferrable: true,
    keywords: {
      cs: ['mudl', 'motak', 'cistokrev', 'cistot', 'ciste krve', 'polovicni krev', 'mudlovsk', 'puvod krve', 'spinava krev'],
      en: ['muggle', 'mudblood', 'blood purity', 'pure-blood', 'half-blood', 'blood status'],
    },
  },
  mozkomori: {
    deferrable: true,
    keywords: {
      cs: ['mozkomor', 'azkaban'],
      en: ['dementor', 'azkaban'],
    },
  },
  zakladatele: {
    deferrable: true,
    keywords: {
      cs: ['zakladatel', 'ctyri zakladatele', 'zalozil bradavice', 'zalozili bradavice', 'godric', 'salazar', 'rowena', 'helga', 'salazar zmijozel', 'godric nebelvir', 'rowena havraspar', 'helga mrzimor'],
      en: ['founder', 'four greatest', 'godric', 'salazar', 'rowena', 'helga'],
    },
  },
  tajemna_komnata: {
    deferrable: true,
    keywords: {
      cs: ['tajemna komnata', 'tajemne komnaty', 'tajemnou komnatu', 'dedic zmijozel', 'dedicem zmijozela'],
      en: ['chamber of secrets', 'heir of slytherin'],
    },
  },
  komnata_potreby: {
    deferrable: true,
    keywords: {
      cs: ['komnata nejvyssi potreby', 'komnata potreby', 'komnatu nejvyssi', 'mistnost nejvyssi potreby'],
      en: ['room of requirement', 'come and go room'],
    },
  },
  duchove: {
    deferrable: true,
    keywords: {
      cs: ['duchov', 'prizrak', 'bezhlavy nick', 'temer bezhlavy', 'krvavy baron', 'seda dama', 'ufnukana ursula', 'tlusty mnich'],
      en: ['ghost', 'bloody baron', 'moaning myrtle', 'grey lady', 'nearly headless', 'fat friar'],
    },
  },
  nitrozpyt: {
    deferrable: true,
    keywords: {
      cs: ['nitrozpyt', 'nitrobran', 'legilim', 'occlumen', 'neverbaln', 'nemluvna magi', 'nemluvna kouzla', 'cteni mysli'],
      en: ['legilimency', 'occlumency', 'legilimens', 'nonverbal magic', 'reading minds', 'read your mind'],
    },
  },
  valky: {
    deferrable: true,
    keywords: {
      cs: ['valk', 'smrtijed', 'druha valka', 'prvni valka', 'kouzelnicka valka'],
      en: ['wizarding war', 'death eater', 'second war', 'first war'],
    },
  },
  lektvary: {
    deferrable: true,
    keywords: {
      cs: ['mnoholicny lektvar', 'mnoholicneho lektvar', 'felix felicis', 'tekute stesti', 'tekuteho stesti', 'amortenci', 'veritaserum', 'polyjuice'],
      en: ['polyjuice', 'felix felicis', 'liquid luck', 'amortentia', 'veritaserum'],
    },
  },
};
