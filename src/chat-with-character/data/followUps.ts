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
  },
};
