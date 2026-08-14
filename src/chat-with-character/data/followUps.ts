import type { FollowUpRegistry } from '../../shared/chatEngine.js';

/**
 * Questions offered to the player after a reply. They belong to the topic, not
 * to a character — these are things the *player* asks — and they are authored
 * here rather than in `topics.ts`, which holds matching data only.
 *
 * `default` opens a conversation (no topic matched yet) and tops up any topic
 * without a bespoke set; `byTopic` deepens the handful of topics players
 * actually dig into. Every question must itself resolve to a topic, or clicking
 * it would answer with the generic fallback — `followUps.test.ts` enforces that.
 */
export const FOLLOW_UPS: FollowUpRegistry = {
  default: {
    cs: [
      'Co je viteál?',
      'Pověz mi o relikviích smrti',
      'Jaké je tvé oblíbené kouzlo?',
      'Co si myslíš o Harrym?',
      'Proč tě zabil Snape?',
      'Jaké sladkosti máš rád?',
      'Kdo založil Bradavice?',
      'Co je Bezová hůlka?',
      'Co je Tajemná komnata?',
      'Řekni mi nějaký vtip',
    ],
    en: [
      'What is a Horcrux?',
      'Tell me about the Deathly Hallows',
      'What is your favourite spell?',
      'What do you think of Harry?',
      'Why did Snape kill you?',
      'What sweets do you like?',
      'Who were the four founders?',
      'What is the Elder Wand?',
      'What is the Chamber of Secrets?',
      'Tell me a joke',
    ],
  },
  byTopic: {
    technologie: {
      cs: ['Jak vlastně funguje kouzlo?', 'Co je nitrobrana?', 'Kdo byl Tom Raddle?'],
      en: ['How does a spell actually work?', 'What is Occlumency?', 'Who was Tom Riddle?'],
    },
    nitrozpyt: {
      cs: ['Co je ukázněná mysl?', 'Co je myslánka?', 'Umí Snape nitrobranu?'],
      en: ['What is a disciplined mind?', 'What is a Pensieve?', 'Is Snape a Legilimens?'],
    },
    bdelost: {
      cs: ['Co je nitrobrana?', 'Jak se cvičí pozornost?', 'Co ukazuje zrcadlo z Erisedu?'],
      en: ['What is Occlumency?', 'How does one train attention?', 'What does the Mirror of Erised show?'],
    },
    sladkosti: {
      cs: ['Proč máš rád citronové bonbony?', 'Jaké bylo heslo do tvé pracovny?', 'Co je čokoládová žába?'],
      en: ['Why do you love sherbet lemons?', 'What was the password to your study?', 'What is a Chocolate Frog?'],
    },
    harry: {
      cs: ['Proč Harry přežil?', 'Co říká proroctví?', 'Byl Harry viteál?'],
      en: ['Why did Harry survive?', 'What does the prophecy say?', 'Was Harry a Horcrux?'],
    },
    voldemort: {
      cs: ['Kolik viteálů si vytvořil?', 'Jak jsi Toma Raddlea poznal?', 'Proč se bojíme vyslovit jeho jméno?'],
      en: ['How many Horcruxes did he make?', 'How did you meet Tom Riddle?', 'Why do we fear his name?'],
    },
    viteal: {
      cs: ['Jak zničit viteál?', 'Které viteály to byly?', 'Co jsou relikvie smrti?'],
      en: ['How do you destroy a Horcrux?', 'Which Horcruxes were there?', 'What are the Deathly Hallows?'],
    },
    viteal_zniceni: {
      cs: ['Kdo zničil medailon?', 'Co je Tajemná komnata?', 'Proč tvá ruka zčernala?'],
      en: ['Who destroyed the locket?', 'What is the Chamber of Secrets?', 'What happened to your cursed hand?'],
    },
    relikvie: {
      cs: ['Kdo byli bratři Peverellové?', 'Komu patří Bezová hůlka?', 'Co ukazuje kámen vzkříšení?'],
      en: ['Who were the Peverell brothers?', 'Who owns the Elder Wand?', 'What does the Resurrection Stone show?'],
    },
    bezova_hulka: {
      cs: ['Kdo je pán hůlky?', 'Jaký byl souboj s Grindelwaldem?', 'Co jsou relikvie smrti?'],
      en: ['Who is the master of the wand?', 'How did you defeat Grindelwald?', 'What are the Deathly Hallows?'],
    },
    brumbaluv_plan: {
      cs: ['Proč jsi Snapeovi věřil?', 'Proč tvá ruka zčernala?', 'Co je Bezová hůlka?'],
      en: ['Why did you trust Snape?', 'What happened to your cursed hand?', 'What is the Elder Wand?'],
    },
    bradavice: {
      cs: ['Kdo založil Bradavice?', 'Co je Komnata nejvyšší potřeby?', 'Kdo jsou zdejší duchové?'],
      en: ['Who were the four founders?', 'What is the Room of Requirement?', 'Why do some become ghosts?'],
    },
    kouzla: {
      cs: ['Jaké je tvé oblíbené kouzlo?', 'Co je nitrobrana?', 'Co je myslánka?'],
      en: ['What is your favourite spell?', 'What is Occlumency?', 'What is a Pensieve?'],
    },
    smrt: {
      cs: ['Bojíš se smrti?', 'Co jsou mozkomorové?', 'Existují duchové?'],
      en: ['Do you fear death?', 'What are Dementors?', 'Why do some become ghosts?'],
    },
    laska: {
      cs: ['Proč nás láska chrání?', 'Co ukazuje zrcadlo z Erisedu?', 'Byl jsi někdy zamilovaný?'],
      en: ['Why does love protect us?', 'What does the Mirror of Erised show?', 'Have you ever been in love?'],
    },
    snape: {
      cs: ['Proč jsi Snapeovi věřil?', 'Proč tě zabil Snape?', 'Umí Snape nitrobranu?'],
      en: ['Why did you trust Snape?', 'What was your plan with Snape?', 'Is Snape a Legilimens?'],
    },

    // --- Small talk and the personal topics: lead the player from a pleasantry
    // towards something he can actually tell a story about. ---
    pozdrav: {
      cs: ['Kdo jsi?', 'O čem si můžeme povídat?', 'Co je čokoládová žába?'],
      en: ['Who are you?', 'What can we talk about?', 'What is a Chocolate Frog?'],
    },
    jaksemas: {
      cs: ['Jaké jsou tvé oblíbené věci?', 'Jak najdu vnitřní klid?', 'Poradíš mi něco moudrého?'],
      en: ['What are your favourite things?', 'How does one find inner peace?', 'Can you share some wisdom?'],
    },
    oblibene: {
      cs: ['Které sladkosti jsou nejlepší?', 'Jaké kouzlo máš nejraději?', 'Hraješ rád famfrpál?'],
      en: ['Which sweets are the best?', 'What is your best spell?', 'Do you enjoy Quidditch?'],
    },
    identita: {
      cs: ['Kolik ti je let?', 'Jaké máš tituly?', 'Pověz mi o své rodině'],
      en: ['How old are you?', 'What are your titles?', 'Tell me about your family'],
    },
    namety: {
      cs: ['Pověz mi o viteálech', 'Jak se hraje famfrpál?', 'Co je Mnoholičný lektvar?'],
      en: ['Tell me about Horcruxes', 'How is Quidditch played?', 'What is Polyjuice Potion?'],
    },
    podekovani: {
      cs: ['Jaká je tvá nejlepší rada?', 'Co je pravé přátelství?', 'Řekni mi ještě nějaký vtip'],
      en: ['What is your best advice?', 'What is true friendship?', 'Tell me another joke'],
    },
    rozlouceni: {
      cs: ['Co dokáže láska?', 'Jak se cvičí ukázněná mysl?', 'Je smrt konec?'],
      en: ['What can love do?', 'How does one train a disciplined mind?', 'Is death the end?'],
    },
    vtipy: {
      cs: ['Jaké heslo máš na dveřích?', 'Kdo je tvůj bratr Aberforth?', 'Co jsou fazolky všech chutí?'],
      en: ['What password do you use?', 'Who is your brother Aberforth?', 'What are Bertie Bott’s beans?'],
    },
    vek: {
      cs: ['Kdo byl Nicolas Flamel?', 'Kdo tě vymyslel?', 'Je nesmrtelnost možná?'],
      en: ['Who was Nicolas Flamel?', 'Who created you?', 'Is immortality possible?'],
    },
    oblibenekouzlo: {
      cs: ['Jak se bránit mozkomorům?', 'Co je nemluvná magie?', 'Odkud se bere síla zaklínadla?'],
      en: [
        'How does one fight a Dementor?',
        'What is nonverbal magic?',
        'Where does a spell’s power come from?',
      ],
    },
    rodina: {
      cs: ['Jaký byl souboj s Grindelwaldem?', 'Proč ses nikdy neoženil?', 'Jak ses vyrovnal se ztrátou?'],
      en: ['What happened at Nurmengard?', 'Did you ever love anyone?', 'How did you bear the loss?'],
    },
    romantika: {
      cs: ['Co znamenalo pro vyšší dobro?', 'Jak láska mění srdce?', 'Jak poznat správnou volbu?'],
      en: [
        'What did the greater good mean?',
        'How does love change the heart?',
        'How does one know the right choice?',
      ],
    },
    buh: {
      cs: ['Co se děje po smrti?', 'Proč vznikají duchové?', 'Co je kus duše?'],
      en: ['What happens after death?', 'Why do some become ghosts?', 'What does splitting the soul do?'],
    },
    rowling: {
      cs: ['Umíš programovat?', 'Kdo jsi doopravdy?', 'Co je tvé největší tajemství?'],
      en: ['Do you know about programming?', 'Who are you, truly?', 'What is your greatest secret?'],
    },
    heslo: {
      cs: ['Jaké to je být ředitelem Bradavic?', 'Co jsou šumivé šumáky?', 'Jaká tajemství hrad skrývá?'],
      en: ['What is Hogwarts like?', 'What are Fizzing Whizzbees?', 'What secrets does the castle keep?'],
    },
    tituly: {
      cs: ['Jaké to je vést Bradavice?', 'Co dělal Řád fénixe?', 'Jaké byly kouzelnické války?'],
      en: [
        'What is it like to lead Hogwarts?',
        'What did the Order of the Phoenix do?',
        'What were the wizarding wars like?',
      ],
    },

    // --- The big themes: fear, dark times, wisdom, secrets, sport, friendship. ---
    strach: {
      cs: ['Kdo jsou mozkomorové?', 'Kdo je Temný pán?', 'Jaké byly temné časy?'],
      en: ['Who are the Dementors?', 'Who is the Dark Lord?', 'What were the dark times like?'],
    },
    temne_casy: {
      cs: ['Kdy povstal Voldemort?', 'Kdo se postavil temnotě?', 'Jakou roli měl Harry Potter?'],
      en: ['When did Voldemort rise?', 'Who stood against the darkness?', 'What was Harry Potter’s part in it?'],
    },
    moudrost: {
      cs: ['Proč je pozornost vzácná?', 'Proč je zrcadlo touhy nebezpečné?', 'Co je nejmocnější magie?'],
      en: ['Why is attention so rare?', 'Why is the Mirror of Erised dangerous?', 'What is the most powerful magic?'],
    },
    tajemstvi: {
      cs: ['Jak najdu Komnatu nejvyšší potřeby?', 'K čemu je myslánka?', 'Jaký byl tvůj plán?'],
      en: ['How do I find the Room of Requirement?', 'What do you store in the Pensieve?', 'What was your plan?'],
    },
    famfrpal: {
      cs: ['Které koleje spolu soupeří?', 'Co dělá dobrého kamaráda?', 'Jaká kouzla se hodí ve hře?'],
      en: ['Which houses compete?', 'What makes a good ally?', 'Which spells help in a game?'],
    },
    pratelstvi: {
      cs: ['Jaká je Hermiona Grangerová?', 'Co si myslíš o Ronovi?', 'Jaký je Harry Potter?'],
      en: ['What is Hermione Granger like?', 'What do you think of Ronald Weasley?', 'What is Harry Potter like?'],
    },

    // --- People around the castle. ---
    hermiona: {
      cs: ['Co si myslíš o Ronaldu Weasleym?', 'Jak je to s čistotou krve?', 'Kdo je Harry Potter?'],
      en: ['What of Ronald Weasley?', 'What about blood purity?', 'Who is Harry Potter?'],
    },
    ron: {
      cs: ['Jaká je Hermiona?', 'Kdo je nejlepší chytač?', 'Proč je věrnost důležitá?'],
      en: ['What is Hermione like?', 'Who is the best Seeker?', 'Why does loyalty matter?'],
    },
    hagrid: {
      cs: ['Kdo otevřel Tajemnou komnatu?', 'Kdo učí v Bradavicích?', 'Kdo je Minerva McGonagallová?'],
      en: ['Who opened the Chamber of Secrets?', 'Who teaches at Hogwarts?', 'Who is Minerva McGonagall?'],
    },
    mcgonagall: {
      cs: ['Kdo dál povede Bradavice?', 'Jaká kouzla učí?', 'Kdo bojoval v Řádu?'],
      en: ['Who will lead Hogwarts next?', 'What magic does she teach?', 'Who fought in the Order?'],
    },
    draco: {
      cs: ['Jak Snape Draca chránil?', 'Co po něm chtěl Temný pán?', 'Jaký byl tvůj plán s věží?'],
      en: ['How did Severus protect the boy?', 'What did the Dark Lord want from him?', 'What was your plan on the tower?'],
    },

    // --- Lore: objects, places, prophecy, war. ---
    fawkes: {
      cs: ['Proč se Řád fénixe jmenuje takto?', 'Kdo zabil baziliška?', 'Je smrt jen dalším dobrodružstvím?'],
      en: [
        'Why is the Order of the Phoenix so named?',
        'Who killed the basilisk?',
        'Is death but the next adventure?',
      ],
    },
    flamel: {
      cs: ['Je nesmrtelnost prokletím?', 'Proč se bojíme smrti?', 'Co je Felix Felicis?'],
      en: ['Is immortality a curse?', 'Why do we fear death?', 'What is Felix Felicis?'],
    },
    rad_fenixe: {
      cs: ['Kdo byli Smrtijedi?', 'Kdo je Voldemort?', 'Čím byl Harry pro Řád?'],
      en: ['Who were the Death Eaters?', 'Who is Voldemort?', 'What was Harry to the Order?'],
    },
    grindelwald_souboj: {
      cs: ['Co je Bezová hůlka?', 'Miloval jsi Gellerta?', 'Kdo byla Ariana?'],
      en: ['What is the Elder Wand?', 'Did you love Gellert?', 'Who was Ariana?'],
    },
    zrcadlo: {
      cs: ['Co je kámen mudrců?', 'Po čem touží srdce?', 'Co je kámen vzkříšení?'],
      en: ['What is the Philosopher’s Stone?', 'What does the heart desire?', 'What is the Resurrection Stone?'],
    },
    myslanka: {
      cs: ['Co je nitrozpyt?', 'Kdo vyslovil to proroctví?', 'Co ti vzpomínky o Raddleovi prozradily?'],
      en: [
        'What is Legilimency?',
        'Who spoke the prophecy?',
        'What did the memories reveal about Riddle?',
      ],
    },
    proroctvi: {
      cs: ['Proč si Harryho vybral?', 'Co si o tom myslel Temný pán?', 'Máme svobodnou volbu?'],
      en: ['Why did he choose Harry?', 'What did the Dark Lord make of it?', 'Do we have free choice?'],
    },
    puvod: {
      cs: ['Proč je Hermiona výjimečná?', 'Jaký původ měl Tom Raddle?', 'Proč vznikla válka?'],
      en: ['Why is Hermione exceptional?', 'What was Tom Riddle’s ancestry?', 'Why did the first war begin?'],
    },
    mozkomori: {
      cs: ['Čeho se bojíš ty sám?', 'Jaké kouzlo je nejlepší obranou?', 'Co je horší než smrt?'],
      en: ['What do you fear yourself?', 'What is your best spell for defence?', 'What is worse than death?'],
    },
    zakladatele: {
      cs: ['Kdo je dědic Zmijozela?', 'Jak se dělí koleje?', 'Kdo je Šedá dáma?'],
      en: ['Who is the heir of Slytherin?', 'How are the houses divided?', 'Who is the Grey Lady?'],
    },
    tajemna_komnata: {
      cs: ['Kdo zničil deník?', 'Proč obvinili Hagrida?', 'Kdo je Ufňukaná Uršula?'],
      en: ['Who destroyed the diary?', 'Why was Hagrid accused?', 'Who is Moaning Myrtle?'],
    },
    komnata_potreby: {
      cs: ['Kde se ukrýval diadém?', 'Jaká další tajemství hrad má?', 'Co ještě skrývají Bradavice?'],
      en: [
        'Where was the diadem hidden?',
        'What other secrets does the castle hold?',
        'What else does Hogwarts hide?',
      ],
    },
    duchove: {
      cs: ['Věříš v posmrtný život?', 'Proč se lidé bojí smrti?', 'Kdo je fénix Fawkes?'],
      en: ['What becomes of the soul?', 'Why do people fear death?', 'Who is Fawkes the phoenix?'],
    },
    valky: {
      cs: ['Proč byli mudlorození pronásledováni?', 'Co dělali mozkomorové ve válce?', 'Jaký je Draco Malfoy?'],
      en: ['Why were Muggle-borns persecuted?', 'What did the Dementors do in the war?', 'What of Draco Malfoy?'],
    },
    lektvary: {
      cs: ['Jaký byl Snape jako učitel?', 'Lze uvařit lásku?', 'Které kouzlo je nejtěžší?'],
      en: ['What was Snape like as a teacher?', 'Can love be brewed?', 'Which spell is the hardest?'],
    },
  },
};
