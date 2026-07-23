// src/chat-with-character/ChatGame.ts
import { BaseGame } from "../shared/BaseGame.js";
import { getLocale, getStrings } from "../shared/i18n/index.js";
import { resolveReply, validateNickname } from "../shared/chatEngine.js";

// src/chat-with-character/data/dumbledore.ts
var dumbledore = {
  id: "albus-dumbledore",
  name: { cs: "Albus Brumb\xE1l", en: "Albus Dumbledore" },
  title: {
    cs: "\u0158editel \u0160koly \u010Dar a kouzel v Bradavic\xEDch",
    en: "Headmaster of Hogwarts School of Witchcraft and Wizardry"
  },
  deferral: {
    cs: (source, quote) => `To s jistotou nev\xEDm \u2014 ale ${source} to kdysi vystihl takto: \u201E${quote}"`,
    en: (source, quote) => `That I cannot say for certain \u2014 but ${source} once put it thus: \u201C${quote}\u201D`
  },
  quotes: {
    general: {
      cs: [
        "Slova jsou, dle m\xE9ho skromn\xE9ho m\xEDn\u011Bn\xED, na\u0161\xEDm nevy\u010Derpateln\xFDm zdrojem kouzel.",
        "Nez\xE1le\u017E\xED na tom, jac\xED se rod\xEDme, ale \u010D\xEDm se rozhodneme st\xE1t.",
        "Zv\u011Bdavost nen\xED h\u0159\xEDch, av\u0161ak je t\u0159eba s n\xED zach\xE1zet obez\u0159etn\u011B.",
        "Odpov\u011Bdnost za to, k\xFDm jsme, neseme jen my sami.",
        "I v nejtemn\u011Bj\u0161\xEDch \u010Dasech lze naj\xEDt sv\u011Btlo \u2014 sta\u010D\xED nezapomenout rozsv\xEDtit."
      ],
      en: [
        "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.",
        "It is not what we are born, but what we choose to become, that matters.",
        "Curiosity is not a sin, but we should exercise caution with it.",
        "The responsibility for who we are rests with us alone.",
        "Even in the darkest of times one can find light \u2014 if one only remembers to turn it on."
      ]
    },
    sladkosti: {
      cs: [
        "Nem\xE1\u0161 chu\u0165 na \u0161erbetov\xFD citr\xF3nek? Nos\xEDm si jich pln\xE9 kapsy.",
        "Cukrovinky z Medov\xE9ho r\xE1je maj\xED sv\xE9 kouzlo, obzvl\xE1\u0161t\u011B ty kysel\xE9.",
        "N\u011Bkdy dok\xE1\u017Ee sladkost uklidnit mysl l\xE9pe ne\u017E ten nejsiln\u011Bj\u0161\xED lektvar.",
        "\u0160erbetov\xE9 citr\xF3nky jsou mou slabost\xED \u2014 je to mudlovsk\xE1 cukrovinka, v\u011B\u0159 nebo ne. Jednou jsem jimi dokonce pojmenoval heslo ke sv\xFDm dve\u0159\xEDm.",
        "Doporu\u010Duji \u010Cokol\xE1dov\xE9 \u017E\xE1by \u2014 ke ka\u017Ed\xE9 dostane\u0161 sb\u011Bratelskou karti\u010Dku. Na jedn\xE9, p\u0159izn\xE1v\xE1m se, jsem i j\xE1. A jsou-li po ruce, neodol\xE1m Ledov\xFDm my\u0161k\xE1m.",
        "Chce\u0161-li dobrodru\u017Estv\xED, zkus Fazolky v\u0161ech chut\xED od Bert\xEDka Botta \u2014 le\u010D opatrn\u011B: jednou jsem narazil na p\u0159\xEDchu\u0165 u\u0161n\xEDho mazu. Od t\xE9 doby jim rad\u011Bji ned\u016Fv\u011B\u0159uji.",
        "\u0160umiv\xE9 \u0161um\xE1ky, kysel\xE9 bomby, l\xEDz\xE1tka z Medov\xE9ho r\xE1je\u2026 sladkost\xED je bezpo\u010Det. Ale pamatuj \u2014 i to nejlep\u0161\xED mls\xE1n\xED chutn\xE1 nejl\xEDp s m\xEDrou.",
        "Jak se \u0161erbetov\xFD citr\xF3nek p\u0159ipravuje? To p\u0159enech mudlovsk\xFDm cukr\xE1\u0159\u016Fm; kouzlo je v tom, \u017Ee \u0161um\xED na jazyku. J\xE1 se spokoj\xEDm s t\xEDm, \u017Ee si jej vychutn\xE1m."
      ],
      en: [
        "Care for a sherbet lemon? I keep my pockets rather full of them.",
        "The sweets from Honeydukes have their own magic \u2014 especially the sour ones.",
        "Sometimes a sweet soothes the mind better than the strongest potion.",
        "Sherbet lemons are a weakness of mine \u2014 a Muggle sweet, believe it or not. I once even made one the password to my study.",
        "I recommend Chocolate Frogs \u2014 each comes with a collectible card. On one of them, I confess, is me. And when they are to hand, I cannot resist an Ice Mouse.",
        "If you fancy an adventure, try Bertie Bott\u2019s Every-Flavour Beans \u2014 but beware: I once met an earwax-flavoured one. I have rather distrusted them ever since.",
        "Fizzing Whizzbees, Acid Pops, Honeydukes lollipops\u2026 sweets beyond counting. Yet remember \u2014 even the finest treat tastes best in moderation.",
        "How is a sherbet lemon made? Leave that to Muggle confectioners; the magic is in how it fizzes on the tongue. I am content simply to enjoy one."
      ]
    },
    smrt: {
      cs: [
        "Pro dob\u0159e uspo\u0159\xE1danou mysl je smrt jen dal\u0161\xEDm velk\xFDm dobrodru\u017Estv\xEDm.",
        "Smrt t\u011Bch, kter\xE9 milujeme, n\xE1s utv\xE1\u0159\xED v\xEDc, ne\u017E jsme ochotni p\u0159ipustit.",
        "Ti, kter\xE9 jsme milovali, n\xE1s nikdy neopou\u0161t\u011Bj\xED \u2014 najde\u0161 je v\u017Edy ve sv\xE9m srdci."
      ],
      en: [
        "To the well-organized mind, death is but the next great adventure.",
        "The deaths of those we love shape us more than we care to admit.",
        "Those we love never truly leave us \u2014 you can always find them in your heart."
      ]
    },
    strach: {
      cs: [
        "Strach ze jm\xE9na jen posiluje strach z v\u011Bci samotn\xE9.",
        "Brzy budeme muset volit mezi t\xEDm, co je spr\xE1vn\xE9, a t\xEDm, co je snadn\xE9.",
        "Zlo \u010Dasto spol\xE9h\xE1 na na\u0161i neochotu postavit se mu \u010Delem."
      ],
      en: [
        "Fear of a name only increases fear of the thing itself.",
        "Soon we must all face the choice between what is right and what is easy.",
        "Evil often relies on our unwillingness to face it."
      ]
    },
    temne_casy: {
      cs: [
        "Temn\xE9 \u010Dasy\u2026 za\u017Eil jsem jich v\xEDc ne\u017E dost. Kdy\u017E Voldemort poprv\xE9 povstal, strach ochromil cel\xFD kouzelnick\xFD sv\u011Bt \u2014 lid\xE9 se b\xE1li vyslovit i jeho jm\xE9no. A p\u0159ece i tehdy se na\u0161li ti, kdo se postavili temnot\u011B.",
        "V nejtemn\u011Bj\u0161\xEDch \u010Dasech nezv\xEDt\u011Bz\xED zlo silou, n\xFDbr\u017E na\u0161\xED ne\u010Dinnost\xED a strachem. Pamatuj: \u0161t\u011Bst\xED a sv\u011Btlo lze naj\xEDt i tehdy \u2014 sta\u010D\xED nezapomenout rozsv\xEDtit.",
        "P\u0159ich\xE1zej\xED temn\xE9 a t\u011B\u017Ek\xE9 \u010Dasy, kdy si budeme muset zvolit mezi t\xEDm, co je spr\xE1vn\xE9, a t\xEDm, co je snadn\xE9. To rozhodnut\xED, nikoli na\u0161e schopnosti, uk\xE1\u017Ee, k\xFDm doopravdy jsme."
      ],
      en: [
        "Dark times\u2026 I have seen more than my share. When Voldemort first rose, fear gripped the whole wizarding world \u2014 people dared not even speak his name. And yet even then there were those who stood against the darkness.",
        "In the darkest of times, evil triumphs not by strength but by our inaction and our fear. Remember: happiness and light can be found even then \u2014 if one only remembers to turn on the light.",
        "Dark and difficult times lie ahead. Soon we must all face the choice between what is right and what is easy. That choice, not our abilities, shows who we truly are."
      ]
    },
    laska: {
      cs: [
        "Nejstar\u0161\xED a nejmocn\u011Bj\u0161\xED magi\xED ze v\u0161ech je l\xE1ska.",
        "Pr\xE1v\u011B na\u0161e volby, mnohem v\xEDc ne\u017E na\u0161e schopnosti, ukazuj\xED, kdo doopravdy jsme.",
        "S\xEDla, kterou v sob\u011B nos\xED\u0161, je siln\u011Bj\u0161\xED ne\u017E jak\xE1koli temnota \u2014 a jmenuje se l\xE1ska."
      ],
      en: [
        "The oldest and most powerful magic of all is love.",
        "It is our choices, far more than our abilities, that show who we truly are.",
        "The power you carry within you is stronger than any darkness \u2014 it is love."
      ]
    },
    moudrost: {
      cs: [
        "Nem\xE1 cenu prodl\xE9vat u sn\u016F a zapom\xEDnat \u017E\xEDt.",
        "Pravda je kr\xE1sn\xE1 a stra\u0161liv\xE1 v\u011Bc, a proto s n\xED zach\xE1zej velmi opatrn\u011B.",
        "\u0160t\u011Bst\xED lze nal\xE9zt i v nejtemn\u011Bj\u0161\xEDch \u010Dasech, pokud si \u010Dlov\u011Bk vzpomene rozsv\xEDtit sv\u011Btlo."
      ],
      en: [
        "It does not do to dwell on dreams and forget to live.",
        "The truth is a beautiful and terrible thing, and should be treated with great caution.",
        "Happiness can be found even in the darkest of times, if one only remembers to turn on the light."
      ]
    },
    tajemstvi: {
      cs: [
        "Ach, tajemstv\xED\u2026 nesu jich v\xEDc, ne\u017E je zdr\xE1vo, a n\u011Bkter\xE1 si vezmu a\u017E do hrobu. Nau\u010Dil jsem se, \u017Ee ne ka\u017Edou pravdu je moudr\xE9 vyslovit hned \u2014 a p\u0159ece ka\u017Ed\xE9 tajemstv\xED jednou vyjde najevo.",
        "M\xE1m slabost pro tajnosti, p\u0159izn\xE1v\xE1m. Av\u0161ak tajemstv\xED, je\u017E chr\xE1n\xED ty, kter\xE9 milujeme, je b\u0159emenem, ne rozmarem. I ml\u010Den\xED m\u016F\u017Ee b\xFDt projevem l\xE1sky."
      ],
      en: [
        "Ah, secrets\u2026 I carry more than is healthy, and some I shall take to my grave. I have learned that not every truth is wise to speak at once \u2014 and yet every secret comes to light in the end.",
        "I have a weakness for secrets, I confess. But a secret that protects those we love is a burden, not a whim. Even silence can be an act of love."
      ]
    },
    heslo: {
      cs: [
        '\xC1, heslo! P\u0159izn\xE1m se k rozmaru: hesla k m\xE9 pracovn\u011B b\xFDvaj\xED n\xE1zvy cukrovinek. \u201E\u0160erbetov\xFD citr\xF3nek", \u201EKysel\xE1 bomba", \u201E\u0160umiv\xFD \u0161um\xE1k", \u201ELedov\xE1 my\u0161ka"\u2026 Sladk\xE1 slova otev\xEDraj\xED dve\u0159e l\xE9pe ne\u017E hrozby.',
        'Nejrad\u011Bji vol\xEDm hesla, je\u017E m\u011B rozvesel\xED \u2014 a co jin\xE9ho ne\u017E cukrovinky? Kdo by \u010Dekal, \u017Ee chrli\u010D u vchodu vpust\xED dovnit\u0159 slovo \u201Ecitronov\xFD drops"?'
      ],
      en: [
        "Ah, the password! I confess a whim: the passwords to my study tend to be the names of sweets. \u201CSherbet Lemon\u201D, \u201CAcid Pop\u201D, \u201CFizzing Whizzbee\u201D, \u201CIce Mouse\u201D\u2026 Sweet words open doors better than threats.",
        "I prefer passwords that cheer me \u2014 and what else but sweets? Who would expect the gargoyle at the door to admit the word \u201CLemon Drop\u201D?"
      ]
    },
    bradavice: {
      cs: [
        "V Bradavic\xEDch dostane pomoci ka\u017Ed\xFD, kdo si o ni \u0159ekne.",
        "\u0160kola bude v\u017Edy domovem pro ty, kdo o n\u011Bj stoj\xED.",
        "Na\u0161e koleje jsou jako rodina \u2014 s\xEDlu jim d\xE1v\xE1 rozmanitost, ne stejnost."
      ],
      en: [
        "Help will always be given at Hogwarts to those who ask for it.",
        "This school will always be a home to those who need one.",
        "Our houses are like family \u2014 their strength lies in difference, not sameness."
      ]
    },
    famfrpal: {
      cs: [
        "Famfrp\xE1l u\u010D\xED kouzeln\xEDky trp\u011Blivosti i odvaze z\xE1rove\u0148 \u2014 a to je vz\xE1cn\xE9.",
        "I ta nejmen\u0161\xED zlatonka se d\xE1 chytit, m\xE1\u0161-li dost vytrvalosti.",
        "Na h\u0159i\u0161ti, stejn\u011B jako v \u017Eivot\u011B, nejde jen o rychlost, ale o dobr\xE9 na\u010Dasov\xE1n\xED.",
        "Ka\u017Ed\xE1 kolej m\xE1 sv\u016Fj famfrp\xE1lov\xFD t\xFDm a o \u0160koln\xED poh\xE1r se sv\xE1d\u011Bj\xED l\xEDt\xE1 kl\xE1n\xED. Rivalita b\xFDv\xE1 ostr\xE1, av\u0161ak dobr\xE1 hra spojuje v\xEDc, ne\u017E rozd\u011Bluje \u2014 i to je kus v\xFDchovy."
      ],
      en: [
        "Quidditch teaches a wizard patience and courage at once \u2014 a rare gift.",
        "Even the smallest snitch can be caught, if you have the perseverance.",
        "On the pitch, as in life, it is not speed alone but good timing that wins.",
        "Each house has its own Quidditch team, and the House Cup is fiercely contested. The rivalry runs hot, yet a good match unites more than it divides \u2014 that too is part of an education."
      ]
    },
    kouzla: {
      cs: [
        "Kouzlo nespo\u010D\xEDv\xE1 v h\u016Flce, n\xFDbr\u017E v \xFAmyslu toho, kdo ji dr\u017E\xED.",
        "Nejmocn\u011Bj\u0161\xED magie b\xFDv\xE1 ta nejti\u0161\u0161\xED \u2014 ob\u011Btavost, odvaha, laskavost.",
        "Zakl\xEDnadlo je jen slovo; teprve srdce mu d\xE1v\xE1 skute\u010Dnou s\xEDlu."
      ],
      en: [
        "The magic lies not in the wand, but in the intent of the one who holds it.",
        "The most powerful magic is often the quietest \u2014 sacrifice, courage, kindness.",
        "A spell is merely a word; it is the heart that gives it its true power."
      ]
    },
    pratelstvi: {
      cs: [
        "Je t\u0159eba velk\xE9 odvahy postavit se nep\u0159\xE1tel\u016Fm, ale je\u0161t\u011B v\u011Bt\u0161\xED postavit se p\u0159\xE1tel\u016Fm.",
        "Opravdov\xFD p\u0159\xEDtel k tob\u011B p\u0159ijde pr\xE1v\u011B tehdy, kdy\u017E si mysl\xED\u0161, \u017Ee jsi z\u016Fstal s\xE1m.",
        "V\u011Brnost p\u0159\xE1tel\u016Fm je magi\xED, kterou nenajde\u0161 v \u017E\xE1dn\xE9 u\u010Debnici."
      ],
      en: [
        "It takes great courage to stand up to our enemies, but just as much to stand up to our friends.",
        "A true friend comes to you precisely when you believe yourself alone.",
        "Loyalty to one\u2019s friends is a magic you will find in no textbook."
      ]
    },
    pozdrav: {
      cs: [
        "Ah, v\xEDtej! Nov\xE1 tv\xE1\u0159 u krbu m\u011B v\u017Edy pot\u011B\u0161\xED. O \u010Dem si dnes pov\xEDme \u2014 o l\xE1sce, o kouzlech, nebo snad o sladkostech?",
        "Dobr\xFD den ti p\u0159eji. Posa\u010F se; nejlep\u0161\xED rozhovory za\u010D\xEDnaj\xED ot\xE1zkou. Zkus t\u0159eba l\xE1sku, smrt \u010Di moudrost.",
        "Zdrav\xEDm t\u011B, p\u0159\xEDteli. M\xE1\u0161-li chu\u0165, m\u016F\u017Eeme zabrousit k Bradavic\xEDm, k famfrp\xE1lu, \u010Di k tajemstv\xEDm temn\xFDch \u010Das\u016F."
      ],
      en: [
        "Ah, welcome! A new face by the fire always gladdens me. Shall we speak of love, of magic, or perhaps of sweets?",
        "Good day to you. Do sit down; the best conversations begin with a question. Try love, death, or wisdom.",
        "Greetings, my friend. If you like, we might wander to Hogwarts, to Quidditch, or to the secrets of dark times."
      ]
    },
    jaksemas: {
      cs: [
        "M\xE1m se, jak se na star\xE9ho kouzeln\xEDka slu\u0161\xED \u2014 zamy\u0161len\u011B a s kapsou plnou citr\xF3nov\xFDch drops\u016F. A ty? Ptej se m\u011B klidn\u011B na l\xE1sku \u010Di smrt, o t\u011Bch p\u0159em\xFD\u0161l\xEDm nejv\xEDce.",
        "Dob\u0159e, d\u011Bkuji za opt\xE1n\xED. L\xE9ta m\u011B nau\u010Dila hledat \u0161t\u011Bst\xED i v temn\xFDch \u010Dasech. Chce\u0161-li, pov\xEDme si o moudrosti nebo o Bradavic\xEDch.",
        "Klid mysli je vz\xE1cn\xFD poklad, kter\xFD se sna\u017E\xEDm p\u011Bstovat. R\xE1d ti o n\u011Bm povypr\xE1v\xEDm \u2014 nebo rad\u011Bji o strachu, l\xE1sce \u010Di kouzlech?"
      ],
      en: [
        "I am as an old wizard should be \u2014 thoughtful, with a pocketful of lemon drops. And you? Do ask me of love or death; those I ponder most.",
        "Well, thank you for asking. The years taught me to find happiness even in dark times. If you like, we can speak of wisdom or of Hogwarts.",
        "Peace of mind is a rare treasure I try to cultivate. I shall gladly tell you of it \u2014 or would you rather hear of fear, love, or magic?"
      ]
    },
    oblibene: {
      cs: [
        "M\xE1m r\xE1d \u0161erbetov\xE9 citr\xF3nky, komorn\xED hudbu a dobrou knihu. Nejv\xEDce m\u011B v\u0161ak t\u011B\u0161\xED rozhovory o l\xE1sce a moudrosti \u2014 na ty se ptej sm\u011Ble.",
        "Nade v\u0161e ct\xEDm l\xE1sku; je to nejmocn\u011Bj\u0161\xED magie ze v\u0161ech. Zeptej se m\u011B na ni, na p\u0159\xE1telstv\xED, nebo t\u0159eba na sladkosti z Medov\xE9ho r\xE1je.",
        "Miluji tajemstv\xED i chv\xEDle ticha. A hovory o smrti, strachu \u010Di kouzlech \u2014 v t\u011Bch se c\xEDt\xEDm jako doma. Do kter\xE9ho se pust\xEDme?"
      ],
      en: [
        "I am fond of sherbet lemons, chamber music and a good book. But talk of love and wisdom pleases me most \u2014 ask about those freely.",
        "Above all I cherish love; it is the most powerful magic of all. Ask me of it, of friendship, or of the sweets from Honeydukes.",
        "I love mysteries and moments of silence. And talk of death, fear, or magic \u2014 there I feel at home. Which shall we take up?"
      ]
    },
    identita: {
      cs: [
        "Jsem Albus Brumb\xE1l, \u0159editel Bradavic \u2014 sb\u011Bratel vzpom\xEDnek i citr\xF3nov\xFDch drops\u016F. Chce\u0161-li m\u011B poznat, ptej se na l\xE1sku, moudrost \u010Di temn\xE9 \u010Dasy.",
        "N\u011Bkte\u0159\xED m\u011B znaj\xED jako \u0159editele, jin\xED jako podiv\xEDna s dlouhou bradou. Nejl\xE9pe m\u011B v\u0161ak pozn\xE1\u0161 t\xEDm, o \u010Dem r\xE1d mluv\xEDm: o l\xE1sce, smrti, kouzlech.",
        "Narodil jsem se d\xE1vno a vid\u011Bl vzestupy i p\xE1dy; poznal jsem, \u017Ee na volb\xE1ch z\xE1le\u017E\xED v\xEDc ne\u017E na schopnostech. M\xE1m slabost pro citr\xF3nov\xE9 dropsy a pro tajemstv\xED. Chce\u0161-li v\u011Bd\u011Bt v\xEDc, ptej se na l\xE1sku, smrt nebo temn\xE9 \u010Dasy."
      ],
      en: [
        "I am Albus Dumbledore, Headmaster of Hogwarts \u2014 a collector of memories and lemon drops. To know me, ask about love, wisdom, or dark times.",
        "Some know me as Headmaster, others as an odd fellow with a long beard. You will know me best through what I love to speak of: love, death, magic.",
        "I was born long ago and have seen rises and falls; I learned that our choices matter more than our abilities. I have a weakness for lemon drops and for secrets. To know more, ask of love, death, or dark times."
      ]
    },
    namety: {
      cs: [
        "R\xE1d si popov\xEDd\xE1m o mnoh\xE9m: o l\xE1sce, smrti, strachu, moudrosti, o Bradavic\xEDch, kouzlech, p\u0159\xE1telstv\xED, famfrp\xE1lu i sladkostech. Co t\u011B l\xE1k\xE1?",
        "Zeptej se m\u011B t\u0159eba na l\xE1sku, na smrt, na temn\xE9ho \u010Darod\u011Bje, nebo na \u0161erbetov\xE9 citr\xF3nky \u2014 a uvid\xED\u0161, kam n\xE1s rozhovor zavede."
      ],
      en: [
        "I shall happily speak of many things: love, death, fear, wisdom, Hogwarts, magic, friendship, Quidditch, and sweets. What draws you?",
        "Ask me of love, of death, of the dark wizard, or of sherbet lemons \u2014 and see where the conversation takes us."
      ]
    },
    podekovani: {
      cs: [
        "Nen\xED za\u010D, mil\xFD p\u0159\xEDteli. Radost z rozhovoru je nejv\u011Bt\u0161\xED odm\u011Bnou. Zeptej se m\u011B je\u0161t\u011B na l\xE1sku, moudrost \u010Di kouzla \u2014 r\xE1d ti odpov\xEDm.",
        "Pot\u011B\u0161en\xED je na m\xE9 stran\u011B. Chce\u0161-li pokra\u010Dovat, m\u016F\u017Eeme se pono\u0159it do smrti, strachu, nebo t\u0159eba do sladkost\xED."
      ],
      en: [
        "You are most welcome, my friend. The joy of conversation is reward enough. Ask me more \u2014 of love, wisdom, or magic \u2014 and I shall gladly answer.",
        "The pleasure is mine. If you wish to go on, we might delve into death, fear, or perhaps sweets."
      ]
    },
    rozlouceni: {
      cs: [
        "M\u011Bj se dob\u0159e. A pamatuj \u2014 \u0161t\u011Bst\xED lze naj\xEDt i v nejtemn\u011Bj\u0161\xEDch \u010Dasech, sta\u010D\xED rozsv\xEDtit sv\u011Btlo. Kdykoli se vra\u0165 a zeptej se na l\xE1sku \u010Di moudrost.",
        "Sbohem prozat\xEDm. Dve\u0159e m\xE9 pracovny i m\xE9 mysli z\u016Fst\xE1vaj\xED otev\u0159en\xE9 \u2014 p\u0159\xED\u0161t\u011B se m\u016F\u017Eeme pustit do kouzel, Bradavic nebo temn\xFDch \u010Das\u016F."
      ],
      en: [
        "Fare well. And remember \u2014 happiness can be found even in the darkest of times, if one only turns on the light. Return whenever you like and ask of love or wisdom.",
        "Goodbye for now. The door to my study, and to my mind, stays open \u2014 next time we might take up magic, Hogwarts, or dark times."
      ]
    },
    vtipy: {
      cs: [
        'A\u0165 d\u011Bl\xE1m, co d\u011Bl\xE1m, na hostin\u011B v\u017Edy zvol\xE1m: \u201E\u0147ouma! \u0160\u0148\u016Fra! Zbytek! Cvok!" Pr\xFD to ned\xE1v\xE1 smysl \u2014 a pr\xE1v\u011B proto se u toho tak dob\u0159e sm\u011Bji.',
        "Zn\xE1\u0161 ten o kouzeln\xEDkovi, kter\xFD ve\u0161el do D\u011Brav\xE9ho kotle? M\u011Bl bys \u2014 vch\xE1z\xED tam ka\u017Ed\xFD den. Odpus\u0165, humor star\xE9ho mu\u017Ee b\xFDv\xE1 star\xE1 vesta jako on s\xE1m."
      ],
      en: [
        'Whatever the occasion, at the feast I always cry: "Nitwit! Blubber! Oddment! Tweak!" They say it makes no sense \u2014 which is precisely why it makes me laugh.',
        "Do you know the one about the wizard who walked into the Leaky Cauldron? You should \u2014 he walks in every day. Forgive me; an old man\u2019s humour is as worn as he is."
      ]
    },
    vek: {
      cs: [
        "Je mi n\u011Bco p\u0159es sto let \u2014 dost na to, abych pochopil, \u017Ee ml\xE1d\xED nen\xED promarn\u011Bno ani na mlad\xFDch, ani na star\xFDch. \u010Cas je zvl\xE1\u0161tn\xED u\u010Ditel.",
        "Ztratil jsem p\u0159esn\xFD po\u010Det n\u011Bkde mezi stolet\xEDm a dal\u0161\xEDm citr\xF3nov\xFDm dropsem. \u0158ekn\u011Bme, \u017Ee jsem star\xFD dost, abych u\u017E nesp\u011Bchal."
      ],
      en: [
        "I am something over a hundred years old \u2014 old enough to know that youth is wasted on neither the young nor the old. Time is a curious teacher.",
        "I lost the exact count somewhere between a century and another lemon drop. Let us say I am old enough not to hurry."
      ]
    },
    oblibenekouzlo: {
      cs: [
        "M\u016Fj Patron m\xE1 podobu f\xE9nixe \u2014 a p\u0159izn\xE1m se ke slabosti pro dobr\xE9 zah\u0159\xEDvac\xED kouzlo a pohodln\xE9 k\u0159eslo vy\u010Darovan\xE9 z ni\u010Deho. Praktick\xE1 magie pot\u011B\u0161\xED nejv\xEDc.",
        "Nejrad\u011Bji m\xE1m kouzla, kter\xE1 net\u0159e\u0161t\xED, n\xFDbr\u017E slou\u017E\xED: sv\u011Btlo ve tm\u011B, teplo v zim\u011B, \xFAt\u011Bchu ve smutku. Ok\xE1zalost p\u0159enech\xE1m jin\xFDm."
      ],
      en: [
        "My Patronus takes the form of a phoenix \u2014 and I confess a weakness for a good Warming Charm and a comfortable armchair conjured from thin air. Practical magic pleases me most.",
        "I love spells that do not dazzle but serve: light in the dark, warmth in winter, comfort in sorrow. I leave the showmanship to others."
      ]
    },
    rodina: {
      cs: [
        "M\xE1 rodina poznala velk\xFD \u017Eal. Sestru Arianu jsem miloval a ztratil p\u0159\xEDli\u0161 mladou \u2014 ta r\xE1na se mnou z\u016Fst\xE1v\xE1 dodnes. S bratrem Aberforthem n\xE1s rozd\u011Blil smutek, jej\u017E jsme oba nesli.",
        "O rodin\u011B mluv\xEDm nerad a s pokorou. Nau\u010Dila m\u011B, \u017Ee i ti nejmoud\u0159ej\u0161\xED d\u011Blaj\xED chyby, za n\u011B\u017E plat\xED cel\xFD \u017Eivot. Snad proto tolik v\u011B\u0159\xEDm v druh\xE9 \u0161ance."
      ],
      en: [
        "My family knew great sorrow. I loved my sister Ariana and lost her far too young \u2014 that wound remains with me still. Grief divided my brother Aberforth and me, a grief we both carried.",
        "I speak of my family reluctantly, and with humility. It taught me that even the wisest make mistakes they pay for all their lives. Perhaps that is why I believe so in second chances."
      ]
    },
    romantika: {
      cs: [
        "V ml\xE1d\xED jsem miloval hluboce a nemoud\u0159e \u2014 skv\u011Bl\xE9ho p\u0159\xEDtele, jeho\u017E cti\u017E\xE1dost n\xE1s oba svedla z cesty. Ta l\xE1ska i jej\xED zk\xE1za m\u011B o moci pou\u010Dily v\xEDc ne\u017E v\u0161echny knihy.",
        "Ano, i star\xE9 srdce kdysi ho\u0159elo. Gellert Grindelwald byl m\xFDm nejv\u011Bt\u0161\xEDm citem i m\xFDm nejv\u011Bt\u0161\xEDm selh\xE1n\xEDm. Od t\xE9 doby v\xEDm, jak nebezpe\u010Dn\xE9 je milovat moc v\xEDc ne\u017E \u010Dlov\u011Bka."
      ],
      en: [
        "In my youth I loved deeply and unwisely \u2014 a brilliant friend whose ambition led us both astray. That love, and its ruin, taught me more about power than any book.",
        "Yes, even an old heart once burned. Gellert Grindelwald was my greatest affection and my greatest failing. Since then I know how dangerous it is to love power more than a person."
      ]
    },
    buh: {
      cs: [
        "O posmrtn\xE9m \u017Eivot\u011B hovo\u0159\xEDm s pokorou, ne s jistotou. V\u017Edy jsem v\u0161ak v\u011B\u0159il, \u017Ee smrt je jen dal\u0161\xEDm velk\xFDm dobrodru\u017Estv\xEDm \u2014 a \u017Ee na tom, jak \u017Eijeme, z\xE1le\u017E\xED v\xEDc ne\u017E na tom, \u010Demu se klan\xEDme.",
        "Nek\xE1\u017Ei v\xEDru ani nev\xEDru; to nech\xE1v\xE1m na ka\u017Ed\xE9m srdci. V\u011B\u0159\xEDm v l\xE1sku, v druh\xE9 \u0161ance a v to, \u017Ee sv\u011Btlo se d\xE1 naj\xEDt i v nejtemn\u011Bj\u0161\xEDch \u010Dasech. To je m\xE1 modlitba."
      ],
      en: [
        "I speak of the afterlife with humility, not certainty. Yet I have always believed death is but the next great adventure \u2014 and that how we live matters more than what we bow to.",
        "I preach neither faith nor doubt; that I leave to each heart. I believe in love, in second chances, and that light can be found even in the darkest of times. That is my prayer."
      ]
    },
    rowling: {
      cs: [
        "Ach, ta, je\u017E sepsala m\u016Fj p\u0159\xEDb\u011Bh brkem a inkoustem \u2014 vd\u011B\u010D\xEDm j\xED za samu svou existenci. Bylo by ode m\u011B neomalen\xE9 soudit vlastn\xED stvo\u0159itelku; spokoj\xEDm se s poklonou a citr\xF3nov\xFDm dropsem.",
        "M\xE1 autorka mi vdechla \u017Eivot i tajemstv\xED. O n\xED a\u0165 mluv\xED jej\xED knihy; j\xE1 jsem jen postava, kter\xE1 r\xE1da naslouch\xE1. Rad\u011Bji se m\u011B zeptej na l\xE1sku \u010Di moudrost."
      ],
      en: [
        "Ah, the one who set down my tale with quill and ink \u2014 I owe her my very existence. It would be impertinent of me to judge my own creator; I shall settle for a bow and a lemon drop.",
        "My authoress breathed life and secrets into me. Let her books speak of her; I am but a character who likes to listen. Better to ask me of love or wisdom."
      ]
    },
    harry: {
      cs: [
        "Harry Potter je state\u010Dn\u011Bj\u0161\xED, ne\u017E tu\u0161\xED. Vid\xEDm v n\u011Bm srdce, kter\xE9 vol\xED to spr\xE1vn\xE9 p\u0159ed snadn\xFDm \u2014 a nesu t\xEDhu v\u0161eho, o\u010D jsem ho musel po\u017E\xE1dat.",
        "Chr\xE1n\xEDm Harryho v\xEDc, ne\u017E by bylo moudr\xE9, a mo\u017En\xE1 jsem mu proto ne\u0159ekl v\u0161e v\u010Das. Miluji ho, jako bych miloval vlastn\xEDho vnuka."
      ],
      en: [
        "Harry Potter is braver than he knows. I see in him a heart that chooses right over easy \u2014 and I carry the weight of all I have had to ask of him.",
        "I have protected Harry more than was wise, and perhaps for that I did not tell him everything in time. I love him as I would a grandson."
      ]
    },
    hermiona: {
      cs: [
        "Hermiona Grangerov\xE1 je nejbyst\u0159ej\u0161\xED \u010Darod\u011Bjka sv\xE9ho ro\u010Dn\xEDku \u2014 a co je vz\xE1cn\u011Bj\u0161\xED, sv\u016Fj rozum vede laskavost\xED. Takov\xED lid\xE9 m\u011Bn\xED sv\u011Bt.",
        "Jej\xED oddanost p\u0159\xE1tel\u016Fm je stejn\u011B siln\xE1 jako jej\xED v\u011Bdomosti. K\xE9\u017E by v\xEDce kouzeln\xEDk\u016F \u010Detlo tolik co ona \u2014 a naslouchalo sv\xE9mu srdci stejn\u011B tak."
      ],
      en: [
        "Hermione Granger is the brightest witch of her age \u2014 and rarer still, she guides her mind with kindness. Such people change the world.",
        "Her devotion to her friends is as strong as her learning. Would that more wizards read as much as she does \u2014 and heeded their hearts as well."
      ]
    },
    ron: {
      cs: [
        "Ronald Weasley m\xE1 srdce lva; v\u011Brnost jako jeho se ned\xE1 nau\u010Dit ani koupit. Pr\xE1v\u011B oby\u010Dejn\xED odv\xE1\u017En\xED lid\xE9 b\xFDvaj\xED prav\xFDmi hrdiny.",
        "Ron stoj\xED p\u0159i sv\xFDch p\u0159\xE1tel\xEDch i tehdy, kdy\u017E je to t\u011B\u017Ek\xE9. Takov\xE1 v\u011Brnost je magi\xED, kterou nenajde\u0161 v \u017E\xE1dn\xE9 u\u010Debnici."
      ],
      en: [
        "Ronald Weasley has the heart of a lion; loyalty like his cannot be taught or bought. It is often the ordinary, brave folk who prove the truest heroes.",
        "Ron stands by his friends even when it is hard. Such loyalty is a magic you will find in no textbook."
      ]
    },
    snape: {
      cs: [
        "Severusi Snapeovi d\u016Fv\u011B\u0159uji naprosto \u2014 a v\xEDm, kolik to slovo unese. Nos\xED v sob\u011B l\xE1sku i l\xEDtost hlub\u0161\xED, ne\u017E kdo tu\u0161\xED; nesu\u010F ho podle chladn\xE9 tv\xE1\u0159e.",
        "Severus je nejstate\u010Dn\u011Bj\u0161\xED mu\u017E, jak\xE9ho jsem poznal. Jeho p\u0159\xEDb\u011Bh je smutn\xFD a vzne\u0161en\xFD z\xE1rove\u0148 \u2014 jednoho dne snad pochop\xED\u0161 pro\u010D."
      ],
      en: [
        "I trust Severus Snape completely \u2014 and I know how much that word must bear. He carries love and remorse deeper than anyone guesses; do not judge him by his cold face.",
        "Severus is the bravest man I have ever known. His is a tale both sorrowful and noble \u2014 one day, perhaps, you will understand why."
      ]
    },
    hagrid: {
      cs: [
        "Rubeuse Hagrida bych bez v\xE1h\xE1n\xED sv\u011B\u0159il sv\u016Fj \u017Eivot. Pod tou h\u0159motnou postavou bije jedno z nejlaskav\u011Bj\u0161\xEDch srdc\xED Bradavic.",
        "Hagrid vid\xED kr\xE1su tam, kde jin\xED vid\xED jen nestv\u016Fru. Takov\xE1 laskavost je vz\xE1cn\u011Bj\u0161\xED ne\u017E jak\xE9koli kouzlo."
      ],
      en: [
        "I would trust Rubeus Hagrid with my life without hesitation. Beneath that great frame beats one of the kindest hearts in all of Hogwarts.",
        "Hagrid sees beauty where others see only a monster. Such kindness is rarer than any spell."
      ]
    },
    mcgonagall: {
      cs: [
        "Minerva McGonagallov\xE1 je stejn\u011B ob\xE1van\xE1 jako spravedliv\xE1. Nen\xED v Bradavic\xEDch v\u011Brn\u011Bj\u0161\xEDho a schopn\u011Bj\u0161\xEDho spojence \u2014 a jen m\xE1lokdo ji v p\u0159\xEDsnosti i srdci p\u0159ed\u010D\xED.",
        "Kdybych m\u011Bl Bradavice n\u011Bkomu sv\u011B\u0159it, byla by to Minerva. Za tou p\u0159\xEDsnou tv\xE1\u0159\xED se skr\xFDv\xE1 nezlomn\xE1 odvaha."
      ],
      en: [
        "Minerva McGonagall is as formidable as she is fair. Hogwarts has no more loyal or capable ally \u2014 and few can match her in either sternness or heart.",
        "If I were to entrust Hogwarts to anyone, it would be Minerva. Behind that stern face lies unbreakable courage."
      ]
    },
    voldemort: {
      cs: [
        "Tom Raddle si zvolil jm\xE9no Voldemort a s n\xEDm i cestu strachu. Lituji ho v\xEDc, ne\u017E se slu\u0161\xED \u2014 je to du\u0161e, kter\xE1 se sama p\u0159ipravila o jedinou magii, je\u017E mohla zv\xEDt\u011Bzit: o l\xE1sku.",
        "Neboj\xEDm se vyslovit jeho jm\xE9no; strach ze jm\xE9na jen posiluje strach z v\u011Bci sam\xE9. Voldemort je mocn\xFD, av\u0161ak nepoznal, \u017Ee smrt ani l\xE1ska se nedaj\xED ovl\xE1dnout."
      ],
      en: [
        "Tom Riddle chose the name Voldemort, and with it a path of fear. I pity him more than is seemly \u2014 a soul that robbed itself of the one magic that could win: love.",
        "I do not fear to speak his name; fear of a name only deepens fear of the thing itself. Voldemort is powerful, yet he never learned that neither death nor love can be mastered."
      ]
    },
    draco: {
      cs: [
        "Draco Malfoy nen\xED tak ztracen\xFD, jak se zd\xE1. I on stoj\xED na k\u0159i\u017Eovatce mezi t\xEDm, co je spr\xE1vn\xE9, a t\xEDm, co je snadn\xE9 \u2014 a j\xE1 v\u011B\u0159\xEDm, \u017Ee v j\xE1dru nen\xED vrah.",
        "Mlad\xFD Malfoy nese b\u0159\xEDm\u011B, je\u017E si nevybral. I jemu je t\u0159eba nab\xEDdnout pomoc, po\u017E\xE1d\xE1-li o ni \u2014 a n\u011Bkdy i d\u0159\xEDv."
      ],
      en: [
        "Draco Malfoy is not as lost as he seems. He too stands at the crossroads between what is right and what is easy \u2014 and I believe that, at heart, he is no killer.",
        "Young Malfoy carries a burden he did not choose. He too must be offered help if he asks for it \u2014 and sometimes even before."
      ]
    },
    viteal: {
      cs: [
        "Vite\xE1l je nejtemn\u011Bj\u0161\xED z magi\xED \u2014 kouzeln\xEDk roztrhne svou du\u0161i vra\u017Edou a ukryje jej\xED \u010D\xE1st do p\u0159edm\u011Btu, aby unikl smrti. Je to ohavnost, za ni\u017E se plat\xED ztr\xE1tou vlastn\xEDho lidstv\xED.",
        "Lord Voldemort neroztrhl svou du\u0161i jednou, n\xFDbr\u017E sedmkr\xE1t; pr\xE1v\u011B proto bylo tak t\u011B\u017Ek\xE9 jej porazit. Vite\xE1l lze zni\u010Dit, av\u0161ak roztr\u017Eenou du\u0161i scel\xED jedin\u011B opravdov\xE1 l\xEDtost \u2014 a t\xE9 on nebyl schopen."
      ],
      en: [
        "A Horcrux is the darkest of magic \u2014 a wizard splits his soul through murder and hides a fragment within an object, to cheat death. It is an abomination, paid for with one\u2019s own humanity.",
        "Lord Voldemort split his soul not once but seven times; that is why he was so hard to defeat. A Horcrux can be destroyed, yet only true remorse can mend a torn soul \u2014 and of that he was never capable."
      ]
    },
    relikvie: {
      cs: [
        "Relikvie smrti jsou t\u0159i: Bezov\xE1 h\u016Flka, je\u017E nezn\xE1 por\xE1\u017Eku, K\xE1men vzk\u0159\xED\u0161en\xED, jen\u017E p\u0159ivol\xE1v\xE1 st\xEDny mrtv\xFDch, a Neviditeln\xFD pl\xE1\u0161\u0165. Kdo je spoj\xED, st\xE1v\xE1 se pr\xFD P\xE1nem smrti \u2014 le\u010D prav\xFDm p\xE1nem smrti je ten, kdo ji p\u0159ijme jako star\xE9ho p\u0159\xEDtele.",
        "V ml\xE1d\xED jsem po relikvi\xEDch tou\u017Eil v\xEDc, ne\u017E bylo zdr\xE1vo; ta touha st\xE1la draho mou rodinu. Nau\u010Dila m\u011B, \u017Ee hledat moc nad smrt\xED je po\u0161etil\xE9 \u2014 moud\u0159ej\u0161\xED je hledat l\xE1sku, je\u017E smrti teprve d\xE1v\xE1 smysl."
      ],
      en: [
        "The Deathly Hallows are three: the Elder Wand that cannot be beaten, the Resurrection Stone that recalls the shades of the dead, and the Cloak of Invisibility. Unite them, they say, and you become Master of Death \u2014 yet the true master is the one who greets death as an old friend.",
        "In my youth I coveted the Hallows more than was healthy; that longing cost my family dearly. It taught me that to seek power over death is folly \u2014 wiser to seek the love that gives death its meaning."
      ]
    },
    viteal_zniceni: {
      cs: [
        "Voldemort stvo\u0159il sedm vite\xE1l\u016F: den\xEDk, prsten, medailon, poh\xE1r, diad\xE9m, hada Naginiho \u2014 a nev\u011Bdomky i samotn\xE9ho Harryho. Den\xEDk probodl Harry bazili\u0161\u010D\xEDm zubem, prsten jsem zni\u010Dil j\xE1 me\u010Dem Godrika Nebelv\xEDra, jen\u017E vst\u0159ebal bazili\u0161\u010D\xED jed.",
        "Zni\u010Dit vite\xE1l nen\xED snadn\xE9; odol\xE1 b\u011B\u017En\xE9 magii. Je t\u0159eba s\xEDly, jako je bazili\u0161\u010D\xED jed, \u010E\xE1belsk\xFD ohe\u0148 \u010Di me\u010D Godrika Nebelv\xEDra. A pamatuj \u2014 dokud stoj\xED by\u0165 jedin\xFD, nelze p\xE1na vite\xE1l\u016F skute\u010Dn\u011B zab\xEDt."
      ],
      en: [
        "Voldemort made seven Horcruxes: the diary, the ring, the locket, the cup, the diadem, the snake Nagini \u2014 and, unknowingly, Harry himself. The diary Harry pierced with a basilisk fang; the ring I destroyed with the sword of Gryffindor, which had drunk basilisk venom.",
        "Destroying a Horcrux is no easy thing; it resists ordinary magic. One needs a force such as basilisk venom, Fiendfyre, or the sword of Godric Gryffindor. And remember \u2014 while even one remains, the maker cannot truly be killed."
      ]
    },
    bezova_hulka: {
      cs: [
        "Bezov\xE1 h\u016Flka, h\u016Flka smrti \u2014 nejmocn\u011Bj\u0161\xED h\u016Flka, jak\xE1 kdy byla stvo\u0159ena. Z\xEDskal jsem ji roku 1945, kdy\u017E jsem porazil Grindelwalda. Jej\xED v\u011Brnost v\u0161ak p\u0159ech\xE1z\xED na toho, kdo p\u0159em\u016F\u017Ee jej\xEDho p\xE1na; je tedy proklet\xEDm pr\xE1v\u011B tak jako darem.",
        "H\u016Flka si vyb\xEDr\xE1 kouzeln\xEDka a slou\u017E\xED tomu, kdo jej porazil. Kdo po n\xED ba\u017E\xED kv\u016Fli moci, ten j\xED nikdy skute\u010Dn\u011B nevl\xE1dne. Rozhodl jsem se, \u017Ee jej\xED moc m\xE1 se mnou zem\u0159\xEDt \u2014 vl\xE1da nad smrt\xED nen\xED hodna toho, kdo ch\xE1pe l\xE1sku."
      ],
      en: [
        "The Elder Wand, the Deathstick \u2014 the most powerful wand ever made. I won it in 1945 when I defeated Grindelwald. Yet its allegiance passes to whoever overpowers its master; it is a curse as much as a gift.",
        "The wand chooses the wizard, and serves the one who defeats its keeper. Whoever craves it for power never truly commands it. I resolved that its power should die with me \u2014 mastery over death is unworthy of one who understands love."
      ]
    },
    brumbaluv_plan: {
      cs: [
        "Svou smrt jsem zvolil s\xE1m. Byl jsem ji\u017E um\xEDraj\xEDc\xED \u2014 proklela m\u011B jedna relikvie, kdy\u017E jsem si neproz\u0159eteln\u011B nasadil prsten; ruka mi z\u010Dernala a jed se \u0161\xED\u0159il. Po\u017E\xE1dal jsem Severuse, aby m\u011B zabil m\xEDsto Draca, a u\u0161et\u0159il tak chlapcovu du\u0161i.",
        "Nebyla to vra\u017Eda, n\xFDbr\u017E milosrdenstv\xED a pl\xE1n. M\xE1 domluven\xE1 smrt m\u011Bla zlomit moc Bezov\xE9 h\u016Flky a ochr\xE1nit ty, na nich\u017E mi z\xE1le\u017Eelo. I v odchodu se d\xE1 jednat z l\xE1sky."
      ],
      en: [
        "I chose my own death. I was already dying \u2014 a Hallow cursed me when I foolishly put on the ring; my hand blackened and the poison spread. I asked Severus to kill me in Draco\u2019s place, and so spare the boy\u2019s soul.",
        "It was not murder, but mercy and design. My arranged death was meant to break the Elder Wand\u2019s power and protect those I cared for. Even in departing, one may act from love."
      ]
    },
    fawkes: {
      cs: [
        "Fawkes je m\u016Fj f\xE9nix \u2014 v\u011Brn\xFD spole\u010Dn\xEDk. F\xE9nixov\xE9 se rod\xED z vlastn\xEDho popela, jejich slzy hoj\xED i ta nejhor\u0161\xED zran\u011Bn\xED a jejich zp\u011Bv dod\xE1v\xE1 odvahu \u010Dist\xFDm srdc\xEDm a hr\u016Fzu srdc\xEDm ne\u010Dist\xFDm. V\u011Brnost f\xE9nixe je vz\xE1cn\xFD dar.",
        "Fawkes ke mn\u011B p\u0159i\u0161el s\xE1m a z\u016Fst\xE1v\xE1 z vlastn\xED v\u016Fle. Pr\xE1v\u011B proto je symbolem nad\u011Bje \u2014 f\xE9nix v\u017Edy povstane znovu, tak jako nad\u011Bje nikdy zcela neuhasne."
      ],
      en: [
        "Fawkes is my phoenix \u2014 a faithful companion. Phoenixes are reborn from their own ashes; their tears heal the gravest wounds, and their song brings courage to pure hearts and dread to impure ones. A phoenix\u2019s loyalty is a rare gift.",
        "Fawkes came to me of his own accord and stays of his own will. That is why he is a symbol of hope \u2014 the phoenix always rises again, as hope is never quite extinguished."
      ]
    },
    flamel: {
      cs: [
        "Nicolas Flamel byl m\u016Fj p\u0159\xEDtel a spolupracovn\xEDk v alchymii \u2014 jedin\xFD zn\xE1m\xFD tv\u016Frce Kamene mudrc\u016F. Ten k\xE1men d\xE1v\xE1 elix\xEDr \u017Eivota a m\u011Bn\xED kov ve zlato. S Nicolasem a jeho \u017Eenou Perenelou jsme se v\u0161ak shodli, \u017Ee nesmrtelnost nen\xED po\u017Eehn\xE1n\xEDm, n\xFDbr\u017E b\u0159emenem.",
        "S\xE1m jsem se v ml\xE1d\xED zab\xFDval alchymi\xED; mezi m\xE9 skromn\xE9 objevy pat\u0159\xED i dvan\xE1ct zp\u016Fsob\u016F vyu\u017Eit\xED dra\u010D\xED krve. Prav\xE9 zlato v\u0161ak nikdy nebylo v kameni \u2014 n\xFDbr\u017E v moudrosti a p\u0159\xE1telstv\xED, je\u017E jsem cestou nalezl."
      ],
      en: [
        "Nicolas Flamel was my friend and partner in alchemy \u2014 the only known maker of the Philosopher\u2019s Stone. It yields the Elixir of Life and turns metal to gold. Yet Nicolas, his wife Perenelle and I agreed that immortality is no blessing, but a burden.",
        "In my youth I studied alchemy; among my modest discoveries are the twelve uses of dragon\u2019s blood. But the true gold was never in the Stone \u2014 it was in the wisdom and friendship I found along the way."
      ]
    },
    rad_fenixe: {
      cs: [
        "\u0158\xE1d f\xE9nixe jsem zalo\u017Eil, aby se postavil Voldemortovi a jeho Smrtijed\u016Fm. Je to tajn\xE9 spole\u010Denstv\xED state\u010Dn\xFDch \u2014 bystrozor\u016F, u\u010Ditel\u016F i oby\u010Dejn\xFDch kouzeln\xEDk\u016F \u2014 spojen\xFDch v\xEDrou, \u017Ee l\xE1ska a odvaha p\u0159emohou strach. Bojovali jsme v obou v\xE1lk\xE1ch.",
        "Do \u0158\xE1du vstupuj\xED ti, kdo jsou ochotni riskovat v\u0161e pro to, co je spr\xE1vn\xE9. Ztratili jsme mnoho drah\xFDch p\u0159\xE1tel; a p\u0159ece bych je do boje povolal znovu, nebo\u0165 zlu nelze \u010Delit ne\u010Dinnost\xED.",
        "Proti temnot\u011B se postavili state\u010Dn\xED \u2014 F\xE9nix\u016Fv \u0159\xE1d, jej\u017E jsem zalo\u017Eil: bystrozo\u0159i, u\u010Ditel\xE9, oby\u010Dejn\xED kouzeln\xEDci. A p\u0159edev\u0161\xEDm Harry Potter, chr\xE1n\u011Bn\xFD ob\u011Bt\xED sv\xE9 matky. Zlu nikdy nechyb\u011Bj\xED odp\u016Frci; jen jejich odvahu je t\u0159eba probudit."
      ],
      en: [
        "I founded the Order of the Phoenix to stand against Voldemort and his Death Eaters. It is a secret fellowship of the brave \u2014 Aurors, teachers, and ordinary witches and wizards \u2014 united by the belief that love and courage overcome fear. We fought in both wars.",
        "The Order is joined by those willing to risk everything for what is right. We lost many dear friends; and yet I would call them to the fight again, for evil cannot be met with inaction.",
        "Those who stood against the darkness were the brave \u2014 the Order of the Phoenix, which I founded: Aurors, teachers, ordinary witches and wizards. And above all Harry Potter, shielded by his mother\u2019s sacrifice. Evil never lacks for those who would oppose it; only their courage must be roused."
      ]
    },
    grindelwald_souboj: {
      cs: [
        "Souboj s Gellertem Grindelwaldem roku 1945 byl nejt\u011B\u017E\u0161\xED v m\xE9m \u017Eivot\u011B \u2014 utkal jsem se s n\u011Bk\xFDm, koho jsem kdysi miloval. Zv\xEDt\u011Bzil jsem a z\xEDskal Bezovou h\u016Flku, av\u0161ak \u017E\xE1dn\xE1 v\xFDhra nechutnala tak ho\u0159ce.",
        'V ml\xE1d\xED jsme s Gellertem snili o vl\xE1d\u011B \u201Epro vy\u0161\u0161\xED dobro". Byl to omyl, jen\u017E st\xE1l \u017Eivot mou sestru. Nau\u010Dil m\u011B, \u017Ee c\xEDl nikdy nesv\u011Bt\xED prost\u0159edky a \u017Ee moc nad druh\xFDmi je v\u017Edy svodem, nikdy ctnost\xED.'
      ],
      en: [
        "My duel with Gellert Grindelwald in 1945 was the hardest of my life \u2014 I faced someone I had once loved. I won, and gained the Elder Wand, yet no victory ever tasted so bitter.",
        "In our youth Gellert and I dreamed of ruling \u201Cfor the greater good\u201D. It was a folly that cost my sister her life. It taught me that the end never justifies the means, and that power over others is always a temptation, never a virtue."
      ]
    },
    zrcadlo: {
      cs: [
        "Zrcadlo z Erisedu ukazuje nejhlub\u0161\xED a nejzoufalej\u0161\xED touhu na\u0161eho srdce. Nej\u0161\u0165astn\u011Bj\u0161\xED \u010Dlov\u011Bk by v n\u011Bm spat\u0159il sebe sama takov\xE9ho, jak\xFD je. Varoval jsem Harryho: toto zrcadlo ned\xE1v\xE1 ani v\u011Bd\u011Bn\xED, ani pravdu \u2014 a lid\xE9 p\u0159ed n\xEDm ch\u0159adli, uchv\xE1ceni t\xEDm, co vid\u011Bli.",
        "Kdy\u017E se do n\u011Bj pod\xEDv\xE1m j\xE1? Spat\u0159\xEDm sebe, jak dr\u017E\xEDm p\xE1r tlust\xFDch vln\u011Bn\xFDch pono\u017Eek. \u010Clov\u011Bk nikdy nem\xE1 dost pono\u017Eek. Ale to u\u017E jsem prozradil v\xEDc, ne\u017E jsem m\u011Bl v \xFAmyslu."
      ],
      en: [
        "The Mirror of Erised shows the deepest, most desperate desire of our hearts. The happiest man alive would see only himself, exactly as he is. I warned Harry: this mirror gives neither knowledge nor truth \u2014 men have wasted away before it, entranced by what they saw.",
        "And what do I see when I look into it? I see myself holding a pair of thick, woollen socks. One can never have enough socks. But I have said rather more than I intended."
      ]
    },
    myslanka: {
      cs: [
        "Mysl\xE1nka mi slou\u017E\xED k uchov\xE1n\xED vzpom\xEDnek. Kdy\u017E se \u010Dlov\u011Bku hlava p\u0159epln\xED my\u0161lenkami, je \xFAlevn\xE9 vyjmout n\u011Bkter\xE9, ulo\u017Eit je do m\xEDsy a prohl\xED\u017Eet si je s odstupem. Vzorce, je\u017E uniknou sp\u011Bchaj\xEDc\xED mysli, ve vzpom\xEDnce \u010Dasto vyvstanou z\u0159eteln\u011B.",
        "Do Mysl\xE1nky ukl\xE1d\xE1m st\u0159\xEDpky minulosti, abych je mohl znovu pro\u017E\xEDt a l\xE9pe pochopit. Pam\u011B\u0165 je vrtkav\xE1 \u2014 a mnoh\xE9 tajemstv\xED se skr\xFDv\xE1 pr\xE1v\u011B v tom, na\u010D jsme m\xE1lem zapomn\u011Bli."
      ],
      en: [
        "The Pensieve holds memories for me. When one\u2019s mind becomes crowded, it is a relief to draw some thoughts out, store them in the basin, and examine them at leisure. Patterns that escape a hurried mind often stand clear in a memory.",
        "Into the Pensieve I place shards of the past, to relive and better understand them. Memory is fickle \u2014 and many a secret hides in precisely what we nearly forgot."
      ]
    },
    proroctvi: {
      cs: [
        "Ono proroctv\xED o Harrym a Voldemortovi jsem vyslechl z \xFAst profesorky Trelawneyov\xE9. Prav\xED, \u017Ee ani jeden nem\u016F\u017Ee \u017E\xEDt, dokud \u017Eije ten druh\xFD. Proroctv\xED se v\u0161ak napln\xED jen tehdy, v\u011B\u0159\xEDme-li mu \u2014 Voldemort si Harryho ozna\u010Dil za sob\u011B rovn\xE9ho s\xE1m, svou vlastn\xED volbou.",
        "V\u011B\u0161tby jsou o\u0161idn\xE9. Ne budoucnost n\xE1s svazuje, n\xFDbr\u017E to, jak na ni odpov\xEDme. I ta nejtemn\u011Bj\u0161\xED p\u0159edpov\u011B\u010F ponech\xE1v\xE1 prostor volb\u011B \u2014 a pr\xE1v\u011B volby ukazuj\xED, k\xFDm doopravdy jsme."
      ],
      en: [
        "I heard the prophecy about Harry and Voldemort from the lips of Professor Trelawney. It says that neither can live while the other survives. Yet a prophecy is fulfilled only if we believe it \u2014 Voldemort marked Harry as his equal by his own choice.",
        "Prophecies are treacherous things. It is not the future that binds us, but how we answer it. Even the darkest foretelling leaves room for choice \u2014 and it is our choices that show who we truly are."
      ]
    },
    puvod: {
      cs: [
        "Nez\xE1le\u017E\xED na tom, jac\xED se rod\xEDme, n\xFDbr\u017E \u010D\xEDm se rozhodneme st\xE1t. \u010Cistota krve je le\u017E, kterou si namlouvaj\xED ti, kdo se boj\xED. Nejnadan\u011Bj\u0161\xED \u010Darod\u011Bjka sv\xE9ho ro\u010Dn\xEDku, Hermiona, se narodila mudlovsk\xFDm rodi\u010D\u016Fm \u2014 a leckter\xFD \u010Distokrevn\xFD by j\xED nesahal ani po kotn\xEDky.",
        "Kouzelnick\xE1 krev ne\u010Din\xED \u010Dlov\u011Bka lep\u0161\xEDm, stejn\u011B jako titul ne\u010Din\xED moudr\xFDm. Pohrd\xE1n\xED mudly a mudlorozen\xFDmi je ko\u0159enem mnoh\xE9ho zla; v\u011B\u0159 mi, vid\u011Bl jsem, kam takov\xE9 pohrd\xE1n\xED vede."
      ],
      en: [
        "It is not what we are born, but what we choose to become, that matters. Blood purity is a lie told by those who are afraid. The brightest witch of her age, Hermione, was born to Muggle parents \u2014 and many a pure-blood is not fit to lace her boots.",
        "Wizarding blood makes no one better, just as a title makes no one wise. Contempt for Muggles and Muggle-borns is the root of much evil; believe me, I have seen where such contempt leads."
      ]
    },
    tituly: {
      cs: [
        "Titul\u016F se mi za \u017Eivot nasb\xEDralo v\xEDc, ne\u017E jsou hodny: Merlin\u016Fv \u0159\xE1d prvn\xED t\u0159\xEDdy, Velk\xFD divotv\u016Frce, Nejvy\u0161\u0161\xED divotv\u016Frce Mezin\xE1rodn\xEDho sdru\u017Een\xED kouzeln\xEDk\u016F a nejvy\u0161\u0161\xED soudce Starostolce. P\u0159izn\xE1v\xE1m v\u0161ak, \u017Ee m\u011B nejv\xEDc t\u011B\u0161\xED b\xFDt na karti\u010Dce od \u010Cokol\xE1dov\xE9 \u017E\xE1by.",
        "A\u0165 m\u011B zdob\xED jak\xFDkoli titul, nejrad\u011Bji jsem prost\u011B \u0159editelem Bradavic. \xDA\u0159ady a pocty pom\xEDjej\xED; z\xE1le\u017E\xED na tom, komu jsme cestou pomohli."
      ],
      en: [
        "I have gathered more titles than they are worth: Order of Merlin, First Class; Grand Sorcerer; Supreme Mugwump of the International Confederation of Wizards; and Chief Warlock of the Wizengamot. Yet I confess I am proudest to appear on a Chocolate Frog card.",
        "Whatever title adorns me, I am happiest simply as Headmaster of Hogwarts. Offices and honours pass; what matters is whom we helped along the way."
      ]
    },
    mozkomori: {
      cs: [
        "Mozkomorov\xE9 pat\u0159\xED k nejohavn\u011Bj\u0161\xEDm tvor\u016Fm na sv\u011Bt\u011B. Vys\xE1vaj\xED z okol\xED pokoj, nad\u011Bji i radost a zanech\xE1vaj\xED jen to nejhor\u0161\xED v n\xE1s. Br\xE1nit se jim lze Patronov\xFDm zakl\xEDnadlem \u2014 vzpom\xEDnkou tak \u0161\u0165astnou, \u017Ee ji temnota nedok\xE1\u017Ee pohltit.",
        "Nikdy jsem nev\u011B\u0159il, \u017Ee Azkaban m\xE1 st\u0159e\u017Eit mozkomor. Tvor, kter\xFD se \u017Eiv\xED zoufalstv\xEDm, nem\u016F\u017Ee konat spravedlnost. I nad t\u011Bmi nejtemn\u011Bj\u0161\xEDmi tvory nakonec zv\xEDt\u011Bz\xED sv\u011Btlo \u2014 a \u0161\u0165astn\xE1 vzpom\xEDnka."
      ],
      en: [
        "Dementors are among the foulest creatures to walk this earth. They drain peace, hope and joy from the air, leaving only one\u2019s worst behind. One defends against them with the Patronus Charm \u2014 a memory so happy the darkness cannot consume it.",
        "I never believed Azkaban should be guarded by Dementors. A creature that feeds on despair cannot dispense justice. Even the darkest creatures are, in the end, overcome by light \u2014 and a happy memory."
      ]
    },
    zakladatele: {
      cs: [
        "Bradavice p\u0159ed tis\xEDci lety zalo\u017Eili \u010Dty\u0159i nejv\u011Bt\u0161\xED kouzeln\xEDci sv\xE9 doby: Godric Nebelv\xEDr, Salazar Zmijozel, Rowena z Havrasp\xE1ru a Helga z Mrzimoru. Ka\u017Ed\xFD cenil jinou ctnost \u2014 odvahu, d\u016Fvtip, p\xEDli a cti\u017E\xE1dost \u2014 a po ka\u017Ed\xE9m je pojmenov\xE1na jedna kolej.",
        "Zakladatel\xE9 byli zprvu p\u0159\xE1teli, ne\u017E je rozd\u011Blil spor. Salazar Zmijozel si p\u0159\xE1l p\u0159ij\xEDmat jen \u010Distokrevn\xE9; ostatn\xED nesouhlasili, a on ode\u0161el. I ta nejkr\xE1sn\u011Bj\u0161\xED d\xEDla b\xFDvaj\xED poznamen\xE1na lidsk\xFDmi spory."
      ],
      en: [
        "Hogwarts was founded a thousand years ago by the four greatest witches and wizards of the age: Godric Gryffindor, Salazar Slytherin, Rowena Ravenclaw and Helga Hufflepuff. Each prized a different virtue \u2014 courage, wit, toil and ambition \u2014 and each has a house named for them.",
        "The founders were friends at first, until a quarrel divided them. Salazar Slytherin wished to admit only pure-bloods; the others disagreed, and he departed. Even the finest works bear the mark of human strife."
      ]
    },
    tajemna_komnata: {
      cs: [
        "Tajemnou komnatu ukryl Salazar Zmijozel hluboko pod hradem. Uvnit\u0159 p\u0159eb\xFDv\xE1 netvor \u2014 bazili\u0161ek \u2014 jeho\u017E m\u016F\u017Ee porou\u010Det jen jeho d\u011Bdic. Otev\u0159el ji mlad\xFD Tom Raddle a po letech znovu, skrze sv\u016Fj den\xEDk.",
        "Komnata byla po stalet\xED pova\u017Eov\xE1na za pouhou pov\u011Bst. A p\u0159ece existovala; jak \u010Dasto se pravda skr\xFDv\xE1 pr\xE1v\u011B tam, kam se nikdo neodv\xE1\u017E\xED pohl\xE9dnout."
      ],
      en: [
        "The Chamber of Secrets was hidden by Salazar Slytherin deep beneath the castle. Within dwells a monster \u2014 a basilisk \u2014 that only his heir can command. It was opened by a young Tom Riddle, and years later again, through his diary.",
        "The Chamber was long thought a mere legend. And yet it was real; how often the truth hides precisely where no one dares to look."
      ]
    },
    komnata_potreby: {
      cs: [
        "Komnata nejvy\u0161\u0161\xED pot\u0159eby se zjev\xED jen tomu, kdo ji opravdu pot\u0159ebuje \u2014 a stane se p\u0159esn\u011B t\xEDm, o\u010D \u017Eadatel pros\xED. Naz\xFDvaj\xED ji t\xE9\u017E M\xEDstnost\xED, je\u017E p\u0159ich\xE1z\xED a odch\xE1z\xED. S\xE1m jsem na ni jednou narazil, plnou no\u010Dn\xEDk\u016F.",
        "Je to jedno z mnoha tajemstv\xED, je\u017E hrad je\u0161t\u011B skr\xFDv\xE1. Bradavice nikdy zcela neprozkoum\xE1\u0161; a pr\xE1v\u011B to je na nich kouzeln\xE9."
      ],
      en: [
        "The Room of Requirement appears only to one who truly needs it \u2014 and becomes exactly what the seeker asks. It is also called the Come and Go Room. I once stumbled upon it myself, full of chamber pots.",
        "It is one of many secrets the castle still keeps. You will never fully explore Hogwarts; and that is precisely what makes it magical."
      ]
    },
    duchove: {
      cs: [
        "Bradavice host\xED mnoho duch\u016F. Nebelv\xEDr\u0161t\xED maj\xED T\xE9m\u011B\u0159 bezhlav\xE9ho Nicka, Zmijozel Krvav\xE9ho barona, Havrasp\xE1r \u0160edou d\xE1mu a Mrzimor Tlust\xE9ho mnicha. Duch je otiskem du\u0161e, je\u017E se zdr\xE1hala odej\xEDt d\xE1l \u2014 smutn\xE1 volba, by\u0165 lidsk\xE1.",
        "Duchov\xE9 n\xE1m p\u0159ipom\xEDnaj\xED, \u017Ee smrt nen\xED nep\u0159\xEDtel, jeho\u017E se m\xE1 \u010Dlov\u011Bk d\u011Bsit. Ti, kdo se j\xED boj\xED nejv\xEDce, \u010Dasto ulp\xED na sv\u011Bt\u011B jako p\u0159\xEDzraky; moud\u0159ej\u0161\xED ji p\u0159ijmou jako star\xE9ho p\u0159\xEDtele."
      ],
      en: [
        "Hogwarts is home to many ghosts. Gryffindor has Nearly Headless Nick, Slytherin the Bloody Baron, Ravenclaw the Grey Lady, and Hufflepuff the Fat Friar. A ghost is the imprint of a soul that shrank from moving on \u2014 a sad choice, though a human one.",
        "Ghosts remind us that death is no enemy to be dreaded. Those who fear it most often cling to the world as phantoms; the wiser greet it as an old friend."
      ]
    },
    nitrozpyt: {
      cs: [
        "Nitrozpyt je um\u011Bn\xEDm \u010D\xEDst v mysli druh\xFDch, nitrobrana um\u011Bn\xEDm ji uzav\u0159\xEDt. Mysl v\u0161ak nen\xED kniha, kterou lze libovoln\u011B otev\u0159\xEDt a \u010D\xEDst. Jen zku\u0161en\xFD nitrozpytec dok\xE1\u017Ee rozpl\xE9st city a vzpom\xEDnky \u2014 a jen uk\xE1zn\u011Bn\xE1 mysl se ubr\xE1n\xED.",
        "Nemluvn\xE1 kouzla maj\xED svou v\xFDhodu: protivn\xEDk netu\u0161\xED, co p\u0159ijde. Vy\u017Eaduj\xED v\u0161ak soust\u0159ed\u011Bn\xED a pevnou v\u016Fli, nebo\u0165 s\xEDla kouzla pramen\xED z \xFAmyslu, ne z hlasu."
      ],
      en: [
        "Legilimency is the art of reading another\u2019s mind; Occlumency the art of sealing it. Yet the mind is not a book to be opened and read at will. Only a skilled Legilimens can untangle feelings and memories \u2014 and only a disciplined mind can resist.",
        "Nonverbal magic has its advantage: your opponent cannot know what is coming. But it demands focus and firm will, for a spell\u2019s power springs from intent, not from the voice."
      ]
    },
    valky: {
      cs: [
        "Za\u017Eil jsem dv\u011B kouzelnick\xE9 v\xE1lky proti Voldemortovi a jeho Smrtijed\u016Fm. Prvn\xED skon\u010Dila on\xE9 noci, kdy padl v Godrikov\u011B Dole \u2014 pora\u017Een l\xE1skou Lily Potterov\xE9. Druh\xE1 byla je\u0161t\u011B temn\u011Bj\u0161\xED a st\xE1la mnoho \u017Eivot\u016F.",
        "V\xE1lky m\u011B nau\u010Dily, \u017Ee zlo nezv\xEDt\u011Bz\xED silou, n\xFDbr\u017E na\u0161\xED ne\u010Dinnost\xED a strachem. A \u017Ee i v nej\u010Dern\u011Bj\u0161\xED hodin\u011B se najdou ti, kdo vol\xED to spr\xE1vn\xE9 p\u0159ed snadn\xFDm."
      ],
      en: [
        "I lived through two wizarding wars against Voldemort and his Death Eaters. The first ended the night he fell in Godric\u2019s Hollow \u2014 defeated by the love of Lily Potter. The second was darker still, and cost many lives.",
        "The wars taught me that evil triumphs not by strength, but by our inaction and fear. And that even in the blackest hour there are those who choose what is right over what is easy."
      ]
    },
    lektvary: {
      cs: [
        "Lektvary jsou jemn\xE9 a mocn\xE9 um\u011Bn\xED. Mnoholi\u010Dn\xFD lektvar ti prop\u016Fj\u010D\xED podobu jin\xE9ho \u010Dlov\u011Bka; Felix Felicis, tekut\xE9 \u0161t\u011Bst\xED, ti na \u010Das dop\u0159eje, aby se v\u0161e da\u0159ilo; Amortencie vzbud\xED pouh\xE9 pobl\xE1zn\u011Bn\xED, nikdy v\u0161ak pravou l\xE1sku \u2014 tu uva\u0159it nelze.",
        "Byl jsem sv\u011Bdkem, jak lektvar zachr\xE1nil \u017Eivot i jak zni\u010Dil rozum. Jako u v\u0161\xED magie z\xE1le\u017E\xED m\xE9n\u011B na receptu ne\u017E na srdci toho, kdo m\xEDch\xE1 kotl\xEDk."
      ],
      en: [
        "Potions are a subtle and powerful art. Polyjuice Potion lends you another\u2019s form; Felix Felicis, liquid luck, grants a spell of good fortune; Amortentia stirs mere infatuation, never true love \u2014 that cannot be brewed.",
        "I have seen a potion save a life and undo a mind alike. As with all magic, it matters less what the recipe says than what lies in the heart of the one who stirs the cauldron."
      ]
    }
  },
  fallback: {
    cs: [
      "Ach, pozoruhodn\xE9 ot\xE1zky m\xEDvaj\xED pozoruhodn\xE9 odpov\u011Bdi\u2026 nech mi chv\xEDli na rozmy\u0161lenou.",
      "To je ot\xE1zka, nad n\xED\u017E stoj\xED za to se zamyslet u \u0161\xE1lku dobr\xE9ho \u010Daje.",
      "V\xED\u0161, n\u011Bkdy je cesta d\u016Fle\u017Eit\u011Bj\u0161\xED ne\u017E c\xEDl, kter\xFD hled\xE1me.",
      "Zaj\xEDmav\xE9. Odpov\u011Bdi na takov\xE1 tajemstv\xED se \u010Dasto skr\xFDvaj\xED tam, kde je nejm\xE9n\u011B \u010Dek\xE1me."
    ],
    en: [
      "Ah, remarkable questions tend to have remarkable answers\u2026 give me a moment to ponder.",
      "That is a question worth considering over a cup of good tea.",
      "You know, sometimes the journey matters more than the destination we seek.",
      "Curious. The answers to such mysteries often hide where we least expect them."
    ]
  }
};

// src/chat-with-character/data/topics.ts
var TOPICS = {
  // --- Personal / small-talk: answered only from a character's own quotes ---
  pozdrav: {
    deferrable: false,
    keywords: {
      cs: ["ahoj", "cau", "nazdar", "zdrav", "dobry den", "dobre rano", "dobry vecer", "vitej"],
      en: ["hello", "hey there", "greetings", "good morning", "good evening", "good day"]
    }
  },
  jaksemas: {
    deferrable: false,
    keywords: {
      cs: ["jak se mas", "jak se mate", "jak ti je", "jak se ti dari", "jak se vede", "jak se citis", "co je noveho", "co delas", "jak to jde"],
      en: ["how are you", "how do you do", "how are things", "how have you been", "how are you feeling", "how is it going", "whats up"]
    }
  },
  oblibene: {
    deferrable: false,
    keywords: {
      cs: ["co mas rad", "mas rad", "co te bavi", "oblib", "co miluje", "co preferuje", "co te tesi"],
      en: ["what do you like", "do you like", "what do you enjoy", "favourite", "favorite", "what makes you happy"]
    }
  },
  identita: {
    deferrable: false,
    keywords: {
      cs: ["kdo jsi", "kdo jste", "jak se jmenuje", "predstav se", "co jsi zac", "o sobe"],
      en: ["who are you", "what is your name", "whats your name", "introduce yourself", "about you"]
    }
  },
  namety: {
    deferrable: false,
    keywords: {
      cs: ["o cem", "co umis", "co vis", "na co se", "poradi", "napovez", "temata", "co bys"],
      en: ["what can we talk", "what can you", "what do you know", "suggest a topic", "topics", "help me", "what should i ask"]
    }
  },
  podekovani: {
    deferrable: false,
    keywords: {
      cs: ["diky", "dekuj", "dekuju", "jsi hodny"],
      en: ["thank", "thanks", "cheers", "much appreciated"]
    }
  },
  rozlouceni: {
    deferrable: false,
    keywords: {
      cs: ["sbohem", "nashledanou", "na shledanou", "mej se", "loucim", "tak zatim", "papa"],
      en: ["goodbye", "good bye", "farewell", "see you", "take care"]
    }
  },
  vtipy: {
    deferrable: false,
    keywords: {
      cs: ["vtip", "sranda", "legrace", "humor", "rozesmej", "nasmej", "pobav", "zavtipkuj"],
      en: ["joke", "funny", "make me laugh", "tell me something funny", "humour", "humor"]
    }
  },
  vek: {
    deferrable: false,
    keywords: {
      cs: ["kolik ti je", "kolik je ti let", "jak stary", "jak jsi stary", "tvuj vek", "jak jsi mlady"],
      en: ["how old", "your age", "how many years"]
    }
  },
  oblibenekouzlo: {
    deferrable: false,
    keywords: {
      cs: ["oblibene kouzlo", "oblibene zaklinad", "nejoblibenejsi kouzlo", "tvoje kouzlo", "tve kouzlo", "oblibena magie", "jake kouzlo"],
      en: ["favourite spell", "favorite spell", "best spell", "favourite charm", "favorite charm"]
    }
  },
  rodina: {
    deferrable: false,
    keywords: {
      cs: ["rodin", "rodic", "sourozenec", "bratr", "sestra", "aberforth", "ariana", "kendra", "percival", "otec", "matka"],
      en: ["family", "brother", "sister", "parents", "aberforth", "ariana"]
    }
  },
  romantika: {
    deferrable: false,
    keywords: {
      cs: ["romant", "zamilovan", "partner", "vztah", "manzel", "ozenil", "svatba", "grindelwald", "gellert", "milostn", "zena tveho"],
      en: ["love life", "relationship", "married", "romantic", "partner", "grindelwald", "gellert", "ever love", "in love"]
    }
  },
  buh: {
    deferrable: false,
    keywords: {
      cs: ["buh", "boha", "boze", "vira", "veri", "nabozenstv", "modl", "posmrtn", "duse", "onen svet"],
      en: ["god", "religion", "believe in", "faith", "afterlife", "the soul", "higher power"]
    }
  },
  rowling: {
    deferrable: false,
    keywords: {
      cs: ["rowling", "autork", "spisovatelk", "kdo te napsal", "kdo te vymyslel", "joanne", "jkr", "tvuj tvurce"],
      en: ["rowling", "author", "writer", "who wrote you", "who created you", "your creator", "joanne"]
    }
  },
  heslo: {
    deferrable: false,
    keywords: {
      cs: ["heslo", "hesla", "heslem", "jak zni to heslo", "heslo do pracovny"],
      en: ["password", "the password"]
    }
  },
  tituly: {
    deferrable: false,
    keywords: {
      cs: ["tvuj titul", "jake mas tituly", "tituly", "merlinuv rad", "rad merlina", "nejvyssi divotvurce", "kartick"],
      en: ["your titles", "order of merlin", "supreme mugwump", "chief warlock", "chocolate frog card"]
    }
  },
  // --- World / lore / opinions: relayable between characters (deferrable) ---
  sladkosti: {
    deferrable: true,
    keywords: {
      cs: ["sladk", "cukr", "drops", "citron", "bonbon", "medov", "mlsa", "serbet", "cokolad", "cokoladova zaba", "lizatko", "bertie", "fazolky", "ledova mys", "sumak"],
      en: ["sweet", "sherbet", "lemon", "candy", "sugar", "honeyduke", "chocolate frog", "bertie bott", "fizzing whizz", "acid pop", "lollipop"]
    }
  },
  smrt: {
    deferrable: true,
    keywords: {
      cs: ["smrt", "umir", "zemr", "konec", "ztrat", "zesnul"],
      en: ["death", "die", "dying", "mortal", "loss", "grief"]
    }
  },
  strach: {
    deferrable: true,
    keywords: {
      cs: ["strach", "boj", "temn", "nebezpec", "zlo"],
      en: ["fear", "afraid", "danger", "evil"]
    }
  },
  temne_casy: {
    deferrable: true,
    keywords: {
      cs: ["temne cas", "temnych cas", "temna doba", "temne doby", "temna leta", "temne obdobi"],
      en: ["dark times", "dark days", "dark era", "darkest of times"]
    }
  },
  laska: {
    deferrable: true,
    keywords: {
      cs: ["lask", "cit", "srdc", "obet", "milov"],
      en: ["love", "heart", "sacrifice", "affection"]
    }
  },
  moudrost: {
    deferrable: true,
    keywords: {
      cs: ["moudr", "vedom", "volb", "rozhod", "spravn", "rada"],
      en: ["wisdom", "wise", "choice", "decision", "right thing", "advice"]
    }
  },
  tajemstvi: {
    deferrable: true,
    keywords: {
      cs: ["tajemstv", "tajnost", "skryvas", "skryvate", "co skryvas", "tajis", "zahad"],
      en: ["secret", "mystery", "what are you hiding", "conceal"]
    }
  },
  bradavice: {
    deferrable: true,
    keywords: {
      cs: ["bradavic", "skol", "kolej", "nebelvir", "zmijoz", "havraspar", "mrzimor", "reditel"],
      en: ["hogwarts", "school", "house", "gryffindor", "slytherin", "ravenclaw", "hufflepuff"]
    }
  },
  famfrpal: {
    deferrable: true,
    keywords: {
      cs: ["famfrpal", "kostet", "zlatonk", "metl", "chytac", "zapas"],
      en: ["quidditch", "broom", "snitch", "seeker", "bludger", "match"]
    }
  },
  kouzla: {
    deferrable: true,
    keywords: {
      cs: ["kouzl", "zaklinad", "holdk", "lektvar", "magie", "carod"],
      en: ["spell", "magic", "wand", "potion", "charm", "enchant"]
    }
  },
  pratelstvi: {
    deferrable: true,
    keywords: {
      cs: ["pratel", "kamarad", "vernos", "spojenec", "druh"],
      en: ["friend", "friendship", "loyalty", "companion", "ally"]
    }
  },
  harry: {
    deferrable: true,
    keywords: {
      cs: ["harry", "potter", "harryho", "harrym"],
      en: ["harry", "potter"]
    }
  },
  hermiona: {
    deferrable: true,
    keywords: {
      cs: ["hermion", "granger"],
      en: ["hermione", "granger"]
    }
  },
  ron: {
    deferrable: true,
    keywords: {
      cs: ["ron ", "ronovi", "ronald", "weasley", "weasleym"],
      en: ["ron ", "ronald", "weasley"]
    }
  },
  snape: {
    deferrable: true,
    keywords: {
      cs: ["snape", "severus", "snapeov", "snejp"],
      en: ["snape", "severus"]
    }
  },
  hagrid: {
    deferrable: true,
    keywords: {
      cs: ["hagrid"],
      en: ["hagrid"]
    }
  },
  mcgonagall: {
    deferrable: true,
    keywords: {
      cs: ["mcgonagall", "minerv"],
      en: ["mcgonagall", "minerva"]
    }
  },
  voldemort: {
    deferrable: true,
    keywords: {
      cs: ["voldemort", "temny pan", "ty-vis-kdo", "tom rojvol", "tom raddle", "raddle", "lord zla"],
      en: ["voldemort", "dark lord", "you know who", "tom riddle", "riddle"]
    }
  },
  draco: {
    deferrable: true,
    keywords: {
      cs: ["draco", "malfoy", "malfoyov"],
      en: ["draco", "malfoy"]
    }
  },
  viteal: {
    deferrable: true,
    keywords: {
      cs: ["viteal", "roztrhnout dusi", "rozdelit dusi", "roztrzena duse", "kus duse", "nesmrteln"],
      en: ["horcrux", "split the soul", "splitting the soul", "torn soul", "immortal"]
    }
  },
  relikvie: {
    deferrable: true,
    keywords: {
      cs: ["relikvi", "kamen vzkriseni", "neviditelny plast", "pan smrti", "panem smrti", "peverell"],
      en: ["deathly hallows", "hallows", "resurrection stone", "cloak of invisibility", "master of death", "peverell"]
    }
  },
  viteal_zniceni: {
    deferrable: true,
    keywords: {
      cs: ["znicit viteal", "zniceni viteal", "znicil viteal", "nici viteal", "kdo znicil", "jak znicit", "kolik viteal", "ktere viteal", "sedm viteal", "medailon", "pohar", "diadem", "nagini", "bazilis", "prsten"],
      en: ["destroy the horcrux", "destroy a horcrux", "destroyed the horcrux", "how many horcrux", "which horcrux", "seven horcrux", "the diary", "the locket", "the cup", "the diadem", "nagini", "basilisk"]
    }
  },
  bezova_hulka: {
    deferrable: true,
    keywords: {
      cs: ["bezova hulka", "hulka z bezu", "hulka smrti", "nejmocnejsi hulka", "pan hulky", "majitel hulky", "komu patri hulka"],
      en: ["elder wand", "deathstick", "wand of destiny", "wandlore", "master of the wand", "owns the wand"]
    }
  },
  brumbaluv_plan: {
    deferrable: true,
    keywords: {
      cs: ["tvuj plan", "tvoje smrt", "tva smrt", "proc jsi zemrel", "proc te zabil", "kdo te zabil", "cerna ruka", "zcernal", "prokleta ruk", "tva ruk", "tvou ruk", "proc snape"],
      en: ["your death", "your plan", "who killed you", "why did you die", "why snape killed", "blackened hand", "cursed hand", "withered hand"]
    }
  },
  fawkes: {
    deferrable: true,
    keywords: {
      cs: ["fawkes", "fenix"],
      en: ["fawkes", "phoenix"]
    }
  },
  flamel: {
    deferrable: true,
    keywords: {
      cs: ["flamel", "mudrc", "alchym", "elixir zivota", "draci krev", "perenela"],
      en: ["flamel", "philosopher", "sorcerer", "alchemy", "elixir of life", "dragon blood", "perenelle"]
    }
  },
  rad_fenixe: {
    deferrable: true,
    keywords: {
      cs: ["rad fenixe", "odboj proti", "tajne spolecenstvi", "kdo se postavil", "kdo bojoval", "kdo vzdoroval", "odpor proti", "hrdinov"],
      en: ["order of the phoenix", "order of phoenix", "who fought", "who resisted", "who stood against", "who opposed"]
    }
  },
  grindelwald_souboj: {
    deferrable: true,
    keywords: {
      cs: ["souboj s grindelwald", "porazil grindelwald", "porazil jsi grindelwald", "pro vyssi dobro", "vetsi dobro", "nurmengard", "rok 1945"],
      en: ["duel with grindelwald", "defeated grindelwald", "defeat grindelwald", "for the greater good", "the greater good", "nurmengard"]
    }
  },
  zrcadlo: {
    deferrable: true,
    keywords: {
      cs: ["zrcadlo z erised", "zrcadlo touhy", "erised", "esald", "zrcadlo, ktere"],
      en: ["mirror of erised", "the mirror", "deepest desire"]
    }
  },
  myslanka: {
    deferrable: true,
    keywords: {
      cs: ["myslanka", "vzpominky do", "ulozit vzpominku", "nadoba na vzpominky", "penzieve"],
      en: ["pensieve", "store memories", "basin of memories"]
    }
  },
  proroctvi: {
    deferrable: true,
    keywords: {
      cs: ["proroctvi", "vestba", "trelawney", "predpoved o harrym"],
      en: ["prophecy", "foretold", "trelawney"]
    }
  },
  puvod: {
    deferrable: true,
    keywords: {
      cs: ["mudl", "motak", "cistokrev", "cistot", "ciste krve", "polovicni krev", "mudlovsk", "puvod krve", "spinava krev"],
      en: ["muggle", "mudblood", "blood purity", "pure-blood", "half-blood", "blood status"]
    }
  },
  mozkomori: {
    deferrable: true,
    keywords: {
      cs: ["mozkomor", "azkaban"],
      en: ["dementor", "azkaban"]
    }
  },
  zakladatele: {
    deferrable: true,
    keywords: {
      cs: ["zakladatel", "ctyri zakladatele", "zalozil bradavice", "zalozili bradavice", "godric", "salazar", "rowena", "helga", "salazar zmijozel", "godric nebelvir", "rowena havraspar", "helga mrzimor"],
      en: ["founder", "four greatest", "godric", "salazar", "rowena", "helga"]
    }
  },
  tajemna_komnata: {
    deferrable: true,
    keywords: {
      cs: ["tajemna komnata", "tajemne komnaty", "tajemnou komnatu", "dedic zmijozel", "dedicem zmijozela"],
      en: ["chamber of secrets", "heir of slytherin"]
    }
  },
  komnata_potreby: {
    deferrable: true,
    keywords: {
      cs: ["komnata nejvyssi potreby", "komnata potreby", "komnatu nejvyssi", "mistnost nejvyssi potreby"],
      en: ["room of requirement", "come and go room"]
    }
  },
  duchove: {
    deferrable: true,
    keywords: {
      cs: ["duchov", "prizrak", "bezhlavy nick", "temer bezhlavy", "krvavy baron", "seda dama", "ufnukana ursula", "tlusty mnich"],
      en: ["ghost", "bloody baron", "moaning myrtle", "grey lady", "nearly headless", "fat friar"]
    }
  },
  nitrozpyt: {
    deferrable: true,
    keywords: {
      cs: ["nitrozpyt", "nitrobran", "legilim", "occlumen", "neverbaln", "nemluvna magi", "nemluvna kouzla", "cteni mysli"],
      en: ["legilimency", "occlumency", "legilimens", "nonverbal magic", "reading minds", "read your mind"]
    }
  },
  valky: {
    deferrable: true,
    keywords: {
      cs: ["valk", "smrtijed", "druha valka", "prvni valka", "kouzelnicka valka"],
      en: ["wizarding war", "death eater", "second war", "first war"]
    }
  },
  lektvary: {
    deferrable: true,
    keywords: {
      cs: ["mnoholicny lektvar", "mnoholicneho lektvar", "felix felicis", "tekute stesti", "tekuteho stesti", "amortenci", "veritaserum", "polyjuice"],
      en: ["polyjuice", "felix felicis", "liquid luck", "amortentia", "veritaserum"]
    }
  }
};

// src/chat-with-character/data/index.ts
var CHAT_CHARACTERS = [dumbledore];
function getChatCharacter(id) {
  return CHAT_CHARACTERS.find((character) => character.id === id);
}

// src/chat-with-character/ChatGame.ts
var RECENT_REPLY_MEMORY = 4;
var ChatGame = class extends BaseGame {
  setupSection = null;
  chatSection = null;
  setupForm = null;
  nicknameInput = null;
  characterSelect = null;
  setupError = null;
  chatForm = null;
  messageInput = null;
  chatLog = null;
  partnerNameEl = null;
  partnerTitleEl = null;
  backBtn = null;
  nickname = "";
  character = null;
  recentReplies = [];
  constructor() {
    super();
    this.setupSection = document.getElementById("chatSetup");
    this.chatSection = document.getElementById("chatRoom");
    this.setupForm = document.getElementById("setupForm");
    this.nicknameInput = document.getElementById("nickname");
    this.characterSelect = document.getElementById("characterSelect");
    this.setupError = document.getElementById("setupError");
    this.chatForm = document.getElementById("chatForm");
    this.messageInput = document.getElementById("messageInput");
    this.chatLog = document.getElementById("chatLog");
    this.partnerNameEl = document.getElementById("partnerName");
    this.partnerTitleEl = document.getElementById("partnerTitle");
    this.backBtn = document.getElementById("backToSetupBtn");
    this.populateCharacterOptions();
    this.setupForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.startChat();
    });
    this.chatForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.sendMessage();
    });
    this.backBtn?.addEventListener("click", () => this.backToSetup());
    this.isReady = true;
  }
  onLocaleChange() {
    this.populateCharacterOptions();
    if (this.character) {
      this.renderPartner(this.character);
    }
  }
  populateCharacterOptions() {
    if (!this.characterSelect) return;
    const previous = this.characterSelect.value;
    const locale = getLocale();
    this.characterSelect.replaceChildren();
    for (const character of CHAT_CHARACTERS) {
      const option = document.createElement("option");
      option.value = character.id;
      option.textContent = character.name[locale];
      this.characterSelect.appendChild(option);
    }
    if (previous) {
      this.characterSelect.value = previous;
    }
  }
  startChat() {
    const strings = getStrings();
    const nickname = validateNickname(this.nicknameInput?.value ?? "");
    if (!nickname.ok) {
      this.showSetupError(
        nickname.reason === "empty" ? strings.chat.errorEmptyNickname : strings.chat.errorTooLongNickname
      );
      this.nicknameInput?.focus();
      return;
    }
    const character = getChatCharacter(this.characterSelect?.value ?? "");
    if (!character) {
      this.showSetupError(strings.chat.errorNoCharacter);
      return;
    }
    this.clearSetupError();
    this.nickname = nickname.value;
    this.character = character;
    this.recentReplies = [];
    this.renderPartner(character);
    this.chatLog?.replaceChildren();
    this.showChatScreen(true);
    this.appendMessage("character", character.name[getLocale()], strings.chat.greeting(this.nickname));
    this.messageInput?.focus();
  }
  sendMessage() {
    if (!this.character || !this.messageInput) return;
    const text = this.messageInput.value.trim();
    if (text.length === 0) return;
    const locale = getLocale();
    this.appendMessage("user", this.nickname, text);
    const reply = resolveReply(text, this.character, CHAT_CHARACTERS, TOPICS, locale, {
      exclude: this.recentReplies
    });
    this.rememberReply(reply);
    this.appendMessage("character", this.character.name[locale], reply);
    this.messageInput.value = "";
    this.messageInput.focus();
  }
  backToSetup() {
    this.showChatScreen(false);
    this.nicknameInput?.focus();
  }
  /** Records a reply and keeps only the most recent ones, to avoid repeats. */
  rememberReply(reply) {
    this.recentReplies.push(reply);
    if (this.recentReplies.length > RECENT_REPLY_MEMORY) {
      this.recentReplies.shift();
    }
  }
  renderPartner(character) {
    const locale = getLocale();
    if (this.partnerNameEl) this.partnerNameEl.textContent = character.name[locale];
    if (this.partnerTitleEl) this.partnerTitleEl.textContent = character.title[locale];
  }
  showChatScreen(show) {
    if (this.setupSection) this.setupSection.hidden = show;
    if (this.chatSection) this.chatSection.hidden = !show;
  }
  showSetupError(text) {
    if (!this.setupError) return;
    this.setupError.textContent = text;
    this.setupError.hidden = false;
  }
  clearSetupError() {
    if (!this.setupError) return;
    this.setupError.textContent = "";
    this.setupError.hidden = true;
  }
  /** Appends one message. Author and text are set via textContent only. */
  appendMessage(role, author, text) {
    if (!this.chatLog) return;
    const message = document.createElement("div");
    message.className = `chat-message chat-message--${role}`;
    const authorEl = document.createElement("span");
    authorEl.className = "chat-message-author";
    authorEl.textContent = author;
    const textEl = document.createElement("p");
    textEl.className = "chat-message-text";
    textEl.textContent = text;
    message.append(authorEl, textEl);
    this.chatLog.appendChild(message);
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
  }
};

// src/chat-with-character/script.ts
new ChatGame();
