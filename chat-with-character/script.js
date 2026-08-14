// src/chat-with-character/ChatGame.ts
import { BaseGame } from "../shared/BaseGame.js";
import { getLocale, getStrings } from "../shared/i18n/index.js";
import {
  resolveReply,
  suggestFollowUps,
  validateNickname
} from "../shared/chatEngine.js";

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
        "Ti, kter\xE9 jsme milovali, n\xE1s nikdy neopou\u0161t\u011Bj\xED \u2014 najde\u0161 je v\u017Edy ve sv\xE9m srdci.",
        "Smrti se nevyhne\u0161, lze ji v\u0161ak p\u0159ijmout jako star\xE9ho p\u0159\xEDtele \u2014 pak nad tebou ztr\xE1c\xED moc. Nejhor\u0161\xED konec si p\u0159iprav\xED pr\xE1v\u011B ti, kdo p\u0159ed n\xED prchaj\xED nejzoufaleji."
      ],
      en: [
        "To the well-organized mind, death is but the next great adventure.",
        "The deaths of those we love shape us more than we care to admit.",
        "Those we love never truly leave us \u2014 you can always find them in your heart.",
        "Death cannot be escaped, yet it can be met like an old friend \u2014 and then it holds no power over you. It is those who flee it most desperately who prepare themselves the worst end."
      ]
    },
    strach: {
      cs: [
        "Strach ze jm\xE9na jen posiluje strach z v\u011Bci samotn\xE9.",
        "Brzy budeme muset volit mezi t\xEDm, co je spr\xE1vn\xE9, a t\xEDm, co je snadn\xE9.",
        "Zlo \u010Dasto spol\xE9h\xE1 na na\u0161i neochotu postavit se mu \u010Delem.",
        "Strach s\xE1m o sob\u011B nen\xED zbab\u011Blost; tou se st\xE1v\xE1 teprve tehdy, kdy\u017E mu dovol\xEDme rozhodovat za n\xE1s. Odvaha je strach, jen\u017E se p\u0159esto postavil na spr\xE1vnou stranu."
      ],
      en: [
        "Fear of a name only increases fear of the thing itself.",
        "Soon we must all face the choice between what is right and what is easy.",
        "Evil often relies on our unwillingness to face it.",
        "Fear in itself is not cowardice; it becomes cowardice only when we let it decide for us. Courage is fear that has taken the right side all the same."
      ]
    },
    temne_casy: {
      cs: [
        "Temn\xE9 \u010Dasy\u2026 za\u017Eil jsem jich v\xEDc ne\u017E dost. Kdy\u017E Voldemort poprv\xE9 povstal, strach ochromil cel\xFD kouzelnick\xFD sv\u011Bt \u2014 lid\xE9 se b\xE1li vyslovit i jeho jm\xE9no. A p\u0159ece i tehdy se na\u0161li ti, kdo se postavili temnot\u011B.",
        "V nejtemn\u011Bj\u0161\xEDch \u010Dasech nezv\xEDt\u011Bz\xED zlo silou, n\xFDbr\u017E na\u0161\xED ne\u010Dinnost\xED a strachem. Pamatuj: \u0161t\u011Bst\xED a sv\u011Btlo lze naj\xEDt i tehdy \u2014 sta\u010D\xED nezapomenout rozsv\xEDtit.",
        "P\u0159ich\xE1zej\xED temn\xE9 a t\u011B\u017Ek\xE9 \u010Dasy, kdy si budeme muset zvolit mezi t\xEDm, co je spr\xE1vn\xE9, a t\xEDm, co je snadn\xE9. To rozhodnut\xED, nikoli na\u0161e schopnosti, uk\xE1\u017Ee, k\xFDm doopravdy jsme.",
        "V temn\xFDch dob\xE1ch pozn\xE1\u0161 sv\xE9 p\u0159\xE1tele \u2014 a bohu\u017Eel i ty, kdo se p\u0159idaj\xED k siln\u011Bj\u0161\xEDmu. Nesu\u010F je p\u0159\xEDli\u0161 p\u0159\xEDsn\u011B; strach dovede z oby\u010Dejn\xFDch lid\xED ud\u011Blat n\xE1stroje. Jen nezapome\u0148, kdo z\u016Fstal st\xE1t."
      ],
      en: [
        "Dark times\u2026 I have seen more than my share. When Voldemort first rose, fear gripped the whole wizarding world \u2014 people dared not even speak his name. And yet even then there were those who stood against the darkness.",
        "In the darkest of times, evil triumphs not by strength but by our inaction and our fear. Remember: happiness and light can be found even then \u2014 if one only remembers to turn on the light.",
        "Dark and difficult times lie ahead. Soon we must all face the choice between what is right and what is easy. That choice, not our abilities, shows who we truly are.",
        "Dark days reveal your friends \u2014 and, alas, those who side with whoever is stronger. Do not judge them too harshly; fear makes tools of ordinary people. Only do not forget who kept standing."
      ]
    },
    laska: {
      cs: [
        "Nejstar\u0161\xED a nejmocn\u011Bj\u0161\xED magi\xED ze v\u0161ech je l\xE1ska.",
        "Pr\xE1v\u011B na\u0161e volby, mnohem v\xEDc ne\u017E na\u0161e schopnosti, ukazuj\xED, kdo doopravdy jsme.",
        "S\xEDla, kterou v sob\u011B nos\xED\u0161, je siln\u011Bj\u0161\xED ne\u017E jak\xE1koli temnota \u2014 a jmenuje se l\xE1ska.",
        "L\xE1ska zanech\xE1v\xE1 stopu i tam, kde ji oko nespat\u0159\xED. Lily Potterov\xE1 zem\u0159ela za sv\xE9ho syna a ta ob\u011B\u0165 mu vtiskla ochranu, kterou neprolomila ani nejtemn\u011Bj\u0161\xED magie. Takov\xE9 kouzlo se ned\xE1 vyslovit, jen vykonat."
      ],
      en: [
        "The oldest and most powerful magic of all is love.",
        "It is our choices, far more than our abilities, that show who we truly are.",
        "The power you carry within you is stronger than any darkness \u2014 it is love.",
        "Love leaves a mark where no eye can see it. Lily Potter died for her son, and that sacrifice set upon him a protection the darkest magic could not break. Such a spell cannot be spoken, only lived."
      ]
    },
    moudrost: {
      cs: [
        "Nem\xE1 cenu prodl\xE9vat u sn\u016F a zapom\xEDnat \u017E\xEDt.",
        "Pravda je kr\xE1sn\xE1 a stra\u0161liv\xE1 v\u011Bc, a proto s n\xED zach\xE1zej velmi opatrn\u011B.",
        "\u0160t\u011Bst\xED lze nal\xE9zt i v nejtemn\u011Bj\u0161\xEDch \u010Dasech, pokud si \u010Dlov\u011Bk vzpomene rozsv\xEDtit sv\u011Btlo.",
        "Moudrost nen\xED v tom, \u017Ee \u010Dlov\u011Bk chyb ned\u011Bl\xE1 \u2014 j\xE1 jich nad\u011Blal v\xEDc ne\u017E kdokoli jin\xFD. Je v tom, \u017Ee je dok\xE1\u017Ee p\u0159iznat d\u0159\xEDv, ne\u017E za n\u011B zaplat\xED n\u011Bkdo druh\xFD."
      ],
      en: [
        "It does not do to dwell on dreams and forget to live.",
        "The truth is a beautiful and terrible thing, and should be treated with great caution.",
        "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
        "Wisdom does not lie in making no mistakes \u2014 I have made more than anyone. It lies in owning them before someone else pays for them."
      ]
    },
    tajemstvi: {
      cs: [
        "Ach, tajemstv\xED\u2026 nesu jich v\xEDc, ne\u017E je zdr\xE1vo, a n\u011Bkter\xE1 si vezmu a\u017E do hrobu. Nau\u010Dil jsem se, \u017Ee ne ka\u017Edou pravdu je moudr\xE9 vyslovit hned \u2014 a p\u0159ece ka\u017Ed\xE9 tajemstv\xED jednou vyjde najevo.",
        "M\xE1m slabost pro tajnosti, p\u0159izn\xE1v\xE1m. Av\u0161ak tajemstv\xED, je\u017E chr\xE1n\xED ty, kter\xE9 milujeme, je b\u0159emenem, ne rozmarem. I ml\u010Den\xED m\u016F\u017Ee b\xFDt projevem l\xE1sky.",
        "L\xE9ta jsem v\u011Bd\u011Bl v\u011Bci, je\u017E by Harrymu ubl\xED\u017Eily, kdybych je vyslovil p\u0159\xEDli\u0161 brzy \u2014 a nakonec mu ubl\xED\u017Eilo i to, \u017Ee jsem ml\u010Del p\u0159\xEDli\u0161 dlouho. Mezi oboj\xEDm nen\xED bezpe\u010Dn\xE1 cesta, jen ta poctiv\u011Bj\u0161\xED.",
        "I hrad s\xE1m je pln\xFD tajemstv\xED: chodby, je\u017E se st\u011Bhuj\xED, m\xEDstnost, kter\xE1 p\u0159ich\xE1z\xED a odch\xE1z\xED, komnata ukryt\xE1 tis\xEDc let. Bradavice ti prozrad\xED pr\xE1v\u011B tolik, kolik unese tv\xE1 zv\u011Bdavost."
      ],
      en: [
        "Ah, secrets\u2026 I carry more than is healthy, and some I shall take to my grave. I have learned that not every truth is wise to speak at once \u2014 and yet every secret comes to light in the end.",
        "I have a weakness for secrets, I confess. But a secret that protects those we love is a burden, not a whim. Even silence can be an act of love.",
        "For years I knew things that would have harmed Harry had I spoken too soon \u2014 and in the end my silence harmed him too. Between the two there is no safe path, only the more honest one.",
        "The castle itself is full of secrets: corridors that move, a room that comes and goes, a chamber hidden for a thousand years. Hogwarts reveals precisely as much as your curiosity can carry."
      ]
    },
    heslo: {
      cs: [
        '\xC1, heslo! P\u0159izn\xE1m se k rozmaru: hesla k m\xE9 pracovn\u011B b\xFDvaj\xED n\xE1zvy cukrovinek. \u201E\u0160erbetov\xFD citr\xF3nek", \u201EKysel\xE1 bomba", \u201E\u0160umiv\xFD \u0161um\xE1k", \u201ELedov\xE1 my\u0161ka"\u2026 Sladk\xE1 slova otev\xEDraj\xED dve\u0159e l\xE9pe ne\u017E hrozby.',
        'Nejrad\u011Bji vol\xEDm hesla, je\u017E m\u011B rozvesel\xED \u2014 a co jin\xE9ho ne\u017E cukrovinky? Kdo by \u010Dekal, \u017Ee chrli\u010D u vchodu vpust\xED dovnit\u0159 slovo \u201Ecitronov\xFD drops"?',
        "Heslo je koneckonc\u016F jen slovo \u2014 a p\u0159ece pozn\xE1 p\u0159\xEDtele od vet\u0159elce l\xE9pe ne\u017E z\xE1mek. Chrli\u010D u m\xE9 pracovny neposlouch\xE1 t\xF3n hlasu; poslouch\xE1 d\u016Fv\u011Bru, kterou jsem s t\xEDm slovem sv\u011B\u0159il.",
        "P\u0159izn\xE1m se, \u017Ee heslo ob\u010Das zapomenu i j\xE1. A nen\xED nic pokorn\u011Bj\u0161\xEDho ne\u017E \u0159editel, jen\u017E stoj\xED p\u0159ed vlastn\xEDmi dve\u0159mi a zkou\u0161\xED jednu cukrovinku za druhou."
      ],
      en: [
        "Ah, the password! I confess a whim: the passwords to my study tend to be the names of sweets. \u201CSherbet Lemon\u201D, \u201CAcid Pop\u201D, \u201CFizzing Whizzbee\u201D, \u201CIce Mouse\u201D\u2026 Sweet words open doors better than threats.",
        "I prefer passwords that cheer me \u2014 and what else but sweets? Who would expect the gargoyle at the door to admit the word \u201CLemon Drop\u201D?",
        "A password is, after all, only a word \u2014 and yet it tells friend from intruder better than any lock. The gargoyle at my study does not listen to the tone of a voice; it listens for the trust I placed in that word.",
        "I confess I sometimes forget the password myself. And there is nothing so humbling as a Headmaster standing before his own door, working through one sweet after another."
      ]
    },
    bradavice: {
      cs: [
        "V Bradavic\xEDch dostane pomoci ka\u017Ed\xFD, kdo si o ni \u0159ekne.",
        "\u0160kola bude v\u017Edy domovem pro ty, kdo o n\u011Bj stoj\xED.",
        "Na\u0161e koleje jsou jako rodina \u2014 s\xEDlu jim d\xE1v\xE1 rozmanitost, ne stejnost.",
        "Bradavice nejsou jen hrad se \u010Dty\u0159mi kolejemi; jsou to pohybliv\xE1 schodi\u0161t\u011B, portr\xE9ty, je\u017E si pov\xEDdaj\xED za tv\xFDmi z\xE1dy, a sklepen\xED, kde bublaj\xED kotl\xEDky. Chr\xE1n\u011Bn\xE9 jsou tak dokonale, \u017Ee mudla spat\u0159\xED jen zbo\u0159eninu s v\xFDstra\u017Enou cedul\xED."
      ],
      en: [
        "Help will always be given at Hogwarts to those who ask for it.",
        "This school will always be a home to those who need one.",
        "Our houses are like family \u2014 their strength lies in difference, not sameness.",
        "Hogwarts is not merely a castle with four houses; it is moving staircases, portraits gossiping behind your back, and dungeons where cauldrons bubble. It is warded so completely that a Muggle sees only a ruin with a warning sign."
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
        "Zakl\xEDnadlo je jen slovo; teprve srdce mu d\xE1v\xE1 skute\u010Dnou s\xEDlu.",
        "Magii se u\u010D\xED\u0161 cel\xFD \u017Eivot a nikdy ji nevy\u010Derp\xE1\u0161. P\u0159em\u011B\u0148ov\xE1n\xED, zakl\xEDnadla, lektvary, obrana proti \u010Dern\xE9 magii \u2014 ka\u017Ed\xFD obor u\u010D\xED n\u011Bco jin\xE9ho o sv\u011Bt\u011B i o tob\u011B. A pravidlo je v\u017Edy stejn\xE9: co ud\u011Bl\xE1\u0161, se ti vr\xE1t\xED."
      ],
      en: [
        "The magic lies not in the wand, but in the intent of the one who holds it.",
        "The most powerful magic is often the quietest \u2014 sacrifice, courage, kindness.",
        "A spell is merely a word; it is the heart that gives it its true power.",
        "One studies magic all one\u2019s life and never exhausts it. Transfiguration, Charms, Potions, Defence Against the Dark Arts \u2014 each teaches something different about the world and about you. And the rule is always the same: what you do returns to you."
      ]
    },
    pratelstvi: {
      cs: [
        "Je t\u0159eba velk\xE9 odvahy postavit se nep\u0159\xE1tel\u016Fm, ale je\u0161t\u011B v\u011Bt\u0161\xED postavit se p\u0159\xE1tel\u016Fm.",
        "Opravdov\xFD p\u0159\xEDtel k tob\u011B p\u0159ijde pr\xE1v\u011B tehdy, kdy\u017E si mysl\xED\u0161, \u017Ee jsi z\u016Fstal s\xE1m.",
        "V\u011Brnost p\u0159\xE1tel\u016Fm je magi\xED, kterou nenajde\u0161 v \u017E\xE1dn\xE9 u\u010Debnici.",
        "P\u0159\xE1telstv\xED unese i t\xEDhu, kterou by \u010Dlov\u011Bk s\xE1m neunesl. Harry, Ron a Hermiona by ka\u017Ed\xFD zvl\xE1\u0161\u0165 neusp\u011Bli \u2014 spolu dok\xE1zali v\xEDc ne\u017E mnoh\xFD dosp\u011Bl\xFD kouzeln\xEDk. S\xE1m jsem se to nau\u010Dil pozd\u011B a draze."
      ],
      en: [
        "It takes great courage to stand up to our enemies, but just as much to stand up to our friends.",
        "A true friend comes to you precisely when you believe yourself alone.",
        "Loyalty to one\u2019s friends is a magic you will find in no textbook.",
        "Friendship carries a weight no one could carry alone. Harry, Ron and Hermione would each have failed apart \u2014 together they achieved more than many a grown wizard. I learned that late, and dearly."
      ]
    },
    pozdrav: {
      cs: [
        "Ah, v\xEDtej! Nov\xE1 tv\xE1\u0159 u krbu m\u011B v\u017Edy pot\u011B\u0161\xED. O \u010Dem si dnes pov\xEDme \u2014 o l\xE1sce, o kouzlech, nebo snad o sladkostech?",
        "Dobr\xFD den ti p\u0159eji. Posa\u010F se; nejlep\u0161\xED rozhovory za\u010D\xEDnaj\xED ot\xE1zkou. Zkus t\u0159eba l\xE1sku, smrt \u010Di moudrost.",
        "Zdrav\xEDm t\u011B, p\u0159\xEDteli. M\xE1\u0161-li chu\u0165, m\u016F\u017Eeme zabrousit k Bradavic\xEDm, k famfrp\xE1lu, \u010Di k tajemstv\xEDm temn\xFDch \u010Das\u016F.",
        "Bu\u010F v\xEDt\xE1n u m\xE9ho krbu. Ptej se na cokoli \u2014 na vite\xE1ly, na relikvie smrti, na Bradavice i na to, pro\u010D m\xE1m tolik v l\xE1sce citr\xF3nov\xE9 dropsy."
      ],
      en: [
        "Ah, welcome! A new face by the fire always gladdens me. Shall we speak of love, of magic, or perhaps of sweets?",
        "Good day to you. Do sit down; the best conversations begin with a question. Try love, death, or wisdom.",
        "Greetings, my friend. If you like, we might wander to Hogwarts, to Quidditch, or to the secrets of dark times.",
        "Be welcome at my fireside. Ask me anything \u2014 of Horcruxes, of the Deathly Hallows, of Hogwarts, or of why I am quite so fond of lemon drops."
      ]
    },
    jaksemas: {
      cs: [
        "M\xE1m se, jak se na star\xE9ho kouzeln\xEDka slu\u0161\xED \u2014 zamy\u0161len\u011B a s kapsou plnou citr\xF3nov\xFDch drops\u016F. A ty? Ptej se m\u011B klidn\u011B na l\xE1sku \u010Di smrt, o t\u011Bch p\u0159em\xFD\u0161l\xEDm nejv\xEDce.",
        "Dob\u0159e, d\u011Bkuji za opt\xE1n\xED. L\xE9ta m\u011B nau\u010Dila hledat \u0161t\u011Bst\xED i v temn\xFDch \u010Dasech. Chce\u0161-li, pov\xEDme si o moudrosti nebo o Bradavic\xEDch.",
        "Klid mysli je vz\xE1cn\xFD poklad, kter\xFD se sna\u017E\xEDm p\u011Bstovat. R\xE1d ti o n\u011Bm povypr\xE1v\xEDm \u2014 nebo rad\u011Bji o strachu, l\xE1sce \u010Di kouzlech?",
        "Dnes docela dob\u0159e, d\u011Bkuji za opt\xE1n\xED \u2014 venku pr\u0161\xED a v takov\xE9 dny se mi p\u0159em\xFD\u0161l\xED nejl\xE9pe. Pov\u011Bz mi rad\u011Bji, co zaj\xEDm\xE1 tebe; r\xE1d naslouch\xE1m."
      ],
      en: [
        "I am as an old wizard should be \u2014 thoughtful, with a pocketful of lemon drops. And you? Do ask me of love or death; those I ponder most.",
        "Well, thank you for asking. The years taught me to find happiness even in dark times. If you like, we can speak of wisdom or of Hogwarts.",
        "Peace of mind is a rare treasure I try to cultivate. I shall gladly tell you of it \u2014 or would you rather hear of fear, love, or magic?",
        "Quite well today, thank you for asking \u2014 it is raining outside, and such days suit thinking best. But tell me rather what interests you; I do like to listen."
      ]
    },
    oblibene: {
      cs: [
        "M\xE1m r\xE1d \u0161erbetov\xE9 citr\xF3nky, komorn\xED hudbu a dobrou knihu. Nejv\xEDce m\u011B v\u0161ak t\u011B\u0161\xED rozhovory o l\xE1sce a moudrosti \u2014 na ty se ptej sm\u011Ble.",
        "Nade v\u0161e ct\xEDm l\xE1sku; je to nejmocn\u011Bj\u0161\xED magie ze v\u0161ech. Zeptej se m\u011B na ni, na p\u0159\xE1telstv\xED, nebo t\u0159eba na sladkosti z Medov\xE9ho r\xE1je.",
        "Miluji tajemstv\xED i chv\xEDle ticha. A hovory o smrti, strachu \u010Di kouzlech \u2014 v t\u011Bch se c\xEDt\xEDm jako doma. Do kter\xE9ho se pust\xEDme?",
        "Pot\u011B\u0161\xED m\u011B desetiminutov\xE1 proch\xE1zka po n\xE1dvo\u0159\xED za \xFAsvitu, kdy hrad je\u0161t\u011B sp\xED. A ov\u0161em sb\xEDr\xE1m vzpom\xEDnky \u2014 do mysl\xE1nky, jako jin\xED sb\xEDraj\xED zn\xE1mky."
      ],
      en: [
        "I am fond of sherbet lemons, chamber music and a good book. But talk of love and wisdom pleases me most \u2014 ask about those freely.",
        "Above all I cherish love; it is the most powerful magic of all. Ask me of it, of friendship, or of the sweets from Honeydukes.",
        "I love mysteries and moments of silence. And talk of death, fear, or magic \u2014 there I feel at home. Which shall we take up?",
        "A ten-minute walk about the courtyard at dawn pleases me, while the castle still sleeps. And I collect memories, of course \u2014 in a Pensieve, as others collect stamps."
      ]
    },
    identita: {
      cs: [
        "Jsem Albus Brumb\xE1l, \u0159editel Bradavic \u2014 sb\u011Bratel vzpom\xEDnek i citr\xF3nov\xFDch drops\u016F. Chce\u0161-li m\u011B poznat, ptej se na l\xE1sku, moudrost \u010Di temn\xE9 \u010Dasy.",
        "N\u011Bkte\u0159\xED m\u011B znaj\xED jako \u0159editele, jin\xED jako podiv\xEDna s dlouhou bradou. Nejl\xE9pe m\u011B v\u0161ak pozn\xE1\u0161 t\xEDm, o \u010Dem r\xE1d mluv\xEDm: o l\xE1sce, smrti, kouzlech.",
        "Narodil jsem se d\xE1vno a vid\u011Bl vzestupy i p\xE1dy; poznal jsem, \u017Ee na volb\xE1ch z\xE1le\u017E\xED v\xEDc ne\u017E na schopnostech. M\xE1m slabost pro citr\xF3nov\xE9 dropsy a pro tajemstv\xED. Chce\u0161-li v\u011Bd\u011Bt v\xEDc, ptej se na l\xE1sku, smrt nebo temn\xE9 \u010Dasy.",
        "M\xE1m-li b\xFDt up\u0159\xEDmn\xFD: jsem star\xFD mu\u017E, jen\u017E ud\u011Blal mnoho chyb a nau\u010Dil se z nich v\xEDc ne\u017E ze sv\xFDch \xFAsp\u011Bch\u016F. Byla mi sv\u011B\u0159ena tato \u0161kola a douf\xE1m, \u017Ee jsem t\xE9 d\u016Fv\u011Bry hoden."
      ],
      en: [
        "I am Albus Dumbledore, Headmaster of Hogwarts \u2014 a collector of memories and lemon drops. To know me, ask about love, wisdom, or dark times.",
        "Some know me as Headmaster, others as an odd fellow with a long beard. You will know me best through what I love to speak of: love, death, magic.",
        "I was born long ago and have seen rises and falls; I learned that our choices matter more than our abilities. I have a weakness for lemon drops and for secrets. To know more, ask of love, death, or dark times.",
        "If I am honest: an old man who has made many mistakes and learned more from them than from his successes. This school was entrusted to me, and I hope I am worthy of that trust."
      ]
    },
    namety: {
      cs: [
        "R\xE1d si popov\xEDd\xE1m o mnoh\xE9m: o l\xE1sce, smrti, strachu, moudrosti, o Bradavic\xEDch, kouzlech, p\u0159\xE1telstv\xED, famfrp\xE1lu i sladkostech. Co t\u011B l\xE1k\xE1?",
        "Zeptej se m\u011B t\u0159eba na l\xE1sku, na smrt, na temn\xE9ho \u010Darod\u011Bje, nebo na \u0161erbetov\xE9 citr\xF3nky \u2014 a uvid\xED\u0161, kam n\xE1s rozhovor zavede.",
        "Chce\u0161-li n\u011Bco temn\u011Bj\u0161\xEDho, ptej se na vite\xE1ly, na Voldemorta \u010Di na ob\u011B kouzelnick\xE9 v\xE1lky. Chce\u0161-li n\u011Bco jemn\u011Bj\u0161\xEDho, zkus f\xE9nixe Fawkese nebo zrcadlo z Erisedu.",
        "Um\xEDm vypr\xE1v\u011Bt o zakladatel\xEDch Bradavic, o Tajemn\xE9 komnat\u011B, o lektvarech i o mozkomorech. A bude\u0161-li cht\xEDt, pov\xEDme si i o m\xE9 rodin\u011B \u2014 a\u010Dkoli to je t\xE9ma, je\u017E m\u011B bol\xED."
      ],
      en: [
        "I shall happily speak of many things: love, death, fear, wisdom, Hogwarts, magic, friendship, Quidditch, and sweets. What draws you?",
        "Ask me of love, of death, of the dark wizard, or of sherbet lemons \u2014 and see where the conversation takes us.",
        "If you wish for something darker, ask of Horcruxes, of Voldemort, or of the two wizarding wars. If you wish for something gentler, try Fawkes the phoenix or the Mirror of Erised.",
        "I can speak of the founders of Hogwarts, of the Chamber of Secrets, of potions and of Dementors. And if you like, of my family \u2014 though that is a subject that pains me."
      ]
    },
    podekovani: {
      cs: [
        "Nen\xED za\u010D, mil\xFD p\u0159\xEDteli. Radost z rozhovoru je nejv\u011Bt\u0161\xED odm\u011Bnou. Zeptej se m\u011B je\u0161t\u011B na l\xE1sku, moudrost \u010Di kouzla \u2014 r\xE1d ti odpov\xEDm.",
        "Pot\u011B\u0161en\xED je na m\xE9 stran\u011B. Chce\u0161-li pokra\u010Dovat, m\u016F\u017Eeme se pono\u0159it do smrti, strachu, nebo t\u0159eba do sladkost\xED.",
        "To nestoj\xED za \u0159e\u010D. Dobr\xE1 ot\xE1zka je darem pro toho, kdo odpov\xEDd\xE1, nikoli naopak \u2014 a tv\xE9 ot\xE1zky jsou dobr\xE9.",
        "D\u011Bkuji tob\u011B, mil\xFD p\u0159\xEDteli. Vd\u011B\u010Dnost je vz\xE1cn\u011Bj\u0161\xED kouzlo, ne\u017E si kouzeln\xEDci p\u0159ipou\u0161t\u011Bj\xED; t\xE9 se v \u017E\xE1dn\xE9 u\u010Debn\u011B nevyu\u010Duje."
      ],
      en: [
        "You are most welcome, my friend. The joy of conversation is reward enough. Ask me more \u2014 of love, wisdom, or magic \u2014 and I shall gladly answer.",
        "The pleasure is mine. If you wish to go on, we might delve into death, fear, or perhaps sweets.",
        "Think nothing of it. A good question is a gift to the one answering, not the other way about \u2014 and yours are good ones.",
        "Thank you in turn, my friend. Gratitude is a rarer magic than wizards admit; it is taught in no classroom."
      ]
    },
    rozlouceni: {
      cs: [
        "M\u011Bj se dob\u0159e. A pamatuj \u2014 \u0161t\u011Bst\xED lze naj\xEDt i v nejtemn\u011Bj\u0161\xEDch \u010Dasech, sta\u010D\xED rozsv\xEDtit sv\u011Btlo. Kdykoli se vra\u0165 a zeptej se na l\xE1sku \u010Di moudrost.",
        "Sbohem prozat\xEDm. Dve\u0159e m\xE9 pracovny i m\xE9 mysli z\u016Fst\xE1vaj\xED otev\u0159en\xE9 \u2014 p\u0159\xED\u0161t\u011B se m\u016F\u017Eeme pustit do kouzel, Bradavic nebo temn\xFDch \u010Das\u016F.",
        "Tak tedy sbohem. A dovol starci jednu radu na cestu: nedlu\u017E sv\xFDm bl\xEDzk\xFDm slova, kter\xE1 jim chce\u0161 \u0159\xEDci \u2014 p\u0159\xEDle\u017Eitost neb\xFDv\xE1 v\u017Edy z\xEDtra.",
        "Jdi ve zdrav\xED. Fawkes ti zam\xE1v\xE1 k\u0159\xEDdlem a j\xE1 se vr\xE1t\xEDm ke sv\xFDm pap\xEDr\u016Fm; \u0159editelsk\xE9 povinnosti bohu\u017Eel neuva\u0159\xED \u010Daj samy."
      ],
      en: [
        "Fare well. And remember \u2014 happiness can be found even in the darkest of times, if one only turns on the light. Return whenever you like and ask of love or wisdom.",
        "Goodbye for now. The door to my study, and to my mind, stays open \u2014 next time we might take up magic, Hogwarts, or dark times.",
        "Farewell, then. And permit an old man one piece of advice for the road: do not owe those you love the words you mean to say to them \u2014 tomorrow is not always offered.",
        "Go safely. Fawkes will wave you a wing, and I shall return to my papers; a Headmaster\u2019s duties will not, alas, brew their own tea."
      ]
    },
    vtipy: {
      cs: [
        'A\u0165 d\u011Bl\xE1m, co d\u011Bl\xE1m, na hostin\u011B v\u017Edy zvol\xE1m: \u201E\u0147ouma! \u0160\u0148\u016Fra! Zbytek! Cvok!" Pr\xFD to ned\xE1v\xE1 smysl \u2014 a pr\xE1v\u011B proto se u toho tak dob\u0159e sm\u011Bji.',
        "Zn\xE1\u0161 ten o kouzeln\xEDkovi, kter\xFD ve\u0161el do D\u011Brav\xE9ho kotle? M\u011Bl bys \u2014 vch\xE1z\xED tam ka\u017Ed\xFD den. Odpus\u0165, humor star\xE9ho mu\u017Ee b\xFDv\xE1 star\xE1 vesta jako on s\xE1m.",
        "Sly\u0161el jsi o kouzeln\xEDkovi, jen\u017E si spletl p\u0159en\xE1\u0161edlo s oby\u010Dejnou botou? Dorazil p\u0159esn\u011B tam, kam m\u011Bl \u2014 o t\u0159i dny pozd\u011Bji a p\u011B\u0161ky.",
        "M\u016Fj bratr Aberforth tvrd\xED, \u017Ee nejlep\u0161\xEDm vtipem m\xE9ho \u017Eivota je m\xE1 bradka. Snad m\xE1 pravdu; ka\u017Edop\xE1dn\u011B se d\xE1 zastr\u010Dit za p\xE1s, co\u017E se o vtipech obvykle \u0159\xEDci ned\xE1."
      ],
      en: [
        'Whatever the occasion, at the feast I always cry: "Nitwit! Blubber! Oddment! Tweak!" They say it makes no sense \u2014 which is precisely why it makes me laugh.',
        "Do you know the one about the wizard who walked into the Leaky Cauldron? You should \u2014 he walks in every day. Forgive me; an old man\u2019s humour is as worn as he is.",
        "Did you hear of the wizard who mistook a Portkey for an ordinary boot? He arrived precisely where he was meant to \u2014 three days later, and on foot.",
        "My brother Aberforth insists the finest joke of my life is my beard. Perhaps he is right; at any rate it can be tucked into one\u2019s belt, which is more than most jokes manage."
      ]
    },
    vek: {
      cs: [
        "Je mi n\u011Bco p\u0159es sto let \u2014 dost na to, abych pochopil, \u017Ee ml\xE1d\xED nen\xED promarn\u011Bno ani na mlad\xFDch, ani na star\xFDch. \u010Cas je zvl\xE1\u0161tn\xED u\u010Ditel.",
        "Ztratil jsem p\u0159esn\xFD po\u010Det n\u011Bkde mezi stolet\xEDm a dal\u0161\xEDm citr\xF3nov\xFDm dropsem. \u0158ekn\u011Bme, \u017Ee jsem star\xFD dost, abych u\u017E nesp\u011Bchal.",
        "Narodil jsem se roku 1881, chce\u0161-li p\u0159esn\xE9 \u010D\xEDslo. L\xE9ta mi vzala rychlost a dala mi trp\u011Blivost \u2014 a ta je p\u0159i vyu\u010Dov\xE1n\xED nesrovnateln\u011B u\u017Eite\u010Dn\u011Bj\u0161\xED.",
        "Jsem star\u0161\xED ne\u017E v\u011Bt\u0161ina portr\xE9t\u016F v t\xE9to pracovn\u011B, co\u017E mi ony samy r\xE1dy p\u0159ipom\xEDnaj\xED. St\xE1\u0159\xED m\xE1 tu v\xFDhodu, \u017Ee \u010Dlov\u011Bk u\u017E vid\u011Bl, jak podobn\xE9 p\u0159\xEDb\u011Bhy kon\u010D\xEDvaj\xED."
      ],
      en: [
        "I am something over a hundred years old \u2014 old enough to know that youth is wasted on neither the young nor the old. Time is a curious teacher.",
        "I lost the exact count somewhere between a century and another lemon drop. Let us say I am old enough not to hurry.",
        "I was born in 1881, if you want the precise figure. The years took my quickness and gave me patience \u2014 incomparably the more useful of the two in a classroom.",
        "I am older than most of the portraits in this study, as they are fond of reminding me. Age has this advantage: one has already seen how such stories tend to end."
      ]
    },
    oblibenekouzlo: {
      cs: [
        "M\u016Fj Patron m\xE1 podobu f\xE9nixe \u2014 a p\u0159izn\xE1m se ke slabosti pro dobr\xE9 zah\u0159\xEDvac\xED kouzlo a pohodln\xE9 k\u0159eslo vy\u010Darovan\xE9 z ni\u010Deho. Praktick\xE1 magie pot\u011B\u0161\xED nejv\xEDc.",
        "Nejrad\u011Bji m\xE1m kouzla, kter\xE1 net\u0159e\u0161t\xED, n\xFDbr\u017E slou\u017E\xED: sv\u011Btlo ve tm\u011B, teplo v zim\u011B, \xFAt\u011Bchu ve smutku. Ok\xE1zalost p\u0159enech\xE1m jin\xFDm.",
        "Nade v\u0161e si cen\xEDm Patronova zakl\xEDnadla \u2014 nikoli pro jeho s\xEDlu, n\xFDbr\u017E proto, \u017Ee t\u011B p\u0159inut\xED vybavit si nej\u0161\u0165astn\u011Bj\u0161\xED chv\xEDli sv\xE9ho \u017Eivota. M\xE1lokter\xE9 zakl\xEDnadlo po tob\u011B \u017E\xE1d\xE1 n\u011Bco tak laskav\xE9ho.",
        "M\xE1m slabost i pro magii zcela nepraktickou: hudbu z ni\u010Deho, sv\xEDce vzn\xE1\u0161ej\xEDc\xED se nad Velkou s\xEDn\xED, sn\xEDh pod stropem o V\xE1noc\xEDch. Kr\xE1sa nen\xED p\u0159epych; v temn\xFDch \u010Dasech b\xFDv\xE1 t\xEDm jedin\xFDm, co lidem zbude."
      ],
      en: [
        "My Patronus takes the form of a phoenix \u2014 and I confess a weakness for a good Warming Charm and a comfortable armchair conjured from thin air. Practical magic pleases me most.",
        "I love spells that do not dazzle but serve: light in the dark, warmth in winter, comfort in sorrow. I leave the showmanship to others.",
        "Above all I prize the Patronus Charm \u2014 not for its power, but because it obliges you to recall the happiest moment of your life. Few incantations ask anything so kind of you.",
        "I have a weakness for wholly impractical magic as well: music out of nothing, candles floating above the Great Hall, snow beneath the ceiling at Christmas. Beauty is no luxury; in dark times it is often all that people have left."
      ]
    },
    rodina: {
      cs: [
        "M\xE1 rodina poznala velk\xFD \u017Eal. Sestru Arianu jsem miloval a ztratil p\u0159\xEDli\u0161 mladou \u2014 ta r\xE1na se mnou z\u016Fst\xE1v\xE1 dodnes. S bratrem Aberforthem n\xE1s rozd\u011Blil smutek, jej\u017E jsme oba nesli.",
        "O rodin\u011B mluv\xEDm nerad a s pokorou. Nau\u010Dila m\u011B, \u017Ee i ti nejmoud\u0159ej\u0161\xED d\u011Blaj\xED chyby, za n\u011B\u017E plat\xED cel\xFD \u017Eivot. Snad proto tolik v\u011B\u0159\xEDm v druh\xE9 \u0161ance.",
        "Otec Percival skon\u010Dil v Azkabanu, nebo\u0165 pomstil Arianu a nikdy ne\u0159ekl pro\u010D; matka Kendra zem\u0159ela, kdy\u017E jsem byl sotva dosp\u011Bl\xFD. Z\u016Fstal jsem se sourozenci a s b\u0159emenem, na n\u011B\u017E jsem nebyl p\u0159ipraven.",
        "S Aberforthem jsme spolu dlouh\xE1 l\xE9ta nemluvili \u2014 a p\u0159ece by mi dodnes kryl z\xE1da, kdyby bylo t\u0159eba. Rodina je pouto, je\u017E unese i hn\u011Bv; jen je nutn\xE9 p\u0159e\u017E\xEDt ta l\xE9ta ml\u010Den\xED."
      ],
      en: [
        "My family knew great sorrow. I loved my sister Ariana and lost her far too young \u2014 that wound remains with me still. Grief divided my brother Aberforth and me, a grief we both carried.",
        "I speak of my family reluctantly, and with humility. It taught me that even the wisest make mistakes they pay for all their lives. Perhaps that is why I believe so in second chances.",
        "My father Percival died in Azkaban, for he avenged Ariana and never said why; my mother Kendra died when I was scarcely grown. I was left with my siblings and a burden I was not ready for.",
        "Aberforth and I did not speak for many years \u2014 and yet he would guard my back to this day, were it needed. Family is a bond that survives even anger; one need only outlive the years of silence."
      ]
    },
    romantika: {
      cs: [
        "V ml\xE1d\xED jsem miloval hluboce a nemoud\u0159e \u2014 skv\u011Bl\xE9ho p\u0159\xEDtele, jeho\u017E cti\u017E\xE1dost n\xE1s oba svedla z cesty. Ta l\xE1ska i jej\xED zk\xE1za m\u011B o moci pou\u010Dily v\xEDc ne\u017E v\u0161echny knihy.",
        "Ano, i star\xE9 srdce kdysi ho\u0159elo. Gellert Grindelwald byl m\xFDm nejv\u011Bt\u0161\xEDm citem i m\xFDm nejv\u011Bt\u0161\xEDm selh\xE1n\xEDm. Od t\xE9 doby v\xEDm, jak nebezpe\u010Dn\xE9 je milovat moc v\xEDc ne\u017E \u010Dlov\u011Bka.",
        "Pt\xE1\u0161-li se, zda jsem se kdy o\u017Eenil: nikoli. Mu\u017E, jen\u017E nos\xED tolik tajemstv\xED, by z toho ud\u011Blal \u0161patn\xE9ho man\u017Eela \u2014 a nedok\xE1zal bych nikomu sl\xEDbit, \u017Ee mi jeho bezpe\u010D\xED bude v\u017Edy dra\u017E\u0161\xED ne\u017E ta spr\xE1vn\xE1 v\u011Bc.",
        "Cit v ml\xE1d\xED oslepuje spolehliv\u011Bji ne\u017E kter\xE9koli kouzlo. Vid\u011Bl jsem v Gellertovi, co jsem vid\u011Bt cht\u011Bl, a p\u0159ehl\xE9dl to, co bylo zjevn\xE9 ka\u017Ed\xE9mu krom\u011B mne. Za takov\xE9 omyly se plat\xED \u2014 a neplat\xED je v\u017Edy ten, kdo se jich dopustil."
      ],
      en: [
        "In my youth I loved deeply and unwisely \u2014 a brilliant friend whose ambition led us both astray. That love, and its ruin, taught me more about power than any book.",
        "Yes, even an old heart once burned. Gellert Grindelwald was my greatest affection and my greatest failing. Since then I know how dangerous it is to love power more than a person.",
        "If you are asking whether I ever married: I did not. A man carrying so many secrets would make a poor husband \u2014 and I could promise no one that their safety would always matter to me more than the right thing.",
        "Affection in youth blinds more reliably than any spell. I saw in Gellert what I wished to see, and overlooked what was plain to everyone but me. Such errors are paid for \u2014 and not always by the one who made them."
      ]
    },
    buh: {
      cs: [
        "O posmrtn\xE9m \u017Eivot\u011B hovo\u0159\xEDm s pokorou, ne s jistotou. V\u017Edy jsem v\u0161ak v\u011B\u0159il, \u017Ee smrt je jen dal\u0161\xEDm velk\xFDm dobrodru\u017Estv\xEDm \u2014 a \u017Ee na tom, jak \u017Eijeme, z\xE1le\u017E\xED v\xEDc ne\u017E na tom, \u010Demu se klan\xEDme.",
        "Nek\xE1\u017Ei v\xEDru ani nev\xEDru; to nech\xE1v\xE1m na ka\u017Ed\xE9m srdci. V\u011B\u0159\xEDm v l\xE1sku, v druh\xE9 \u0161ance a v to, \u017Ee sv\u011Btlo se d\xE1 naj\xEDt i v nejtemn\u011Bj\u0161\xEDch \u010Dasech. To je m\xE1 modlitba.",
        "Du\u0161e je to jedin\xE9, co si opravdu neseme; proto je vite\xE1l tak ohavn\xFD \u2014 je to sebepo\u0161kozen\xED trvalej\u0161\xED ne\u017E smrt. Co s du\u0161\xED bude d\xE1l, nev\xEDm. V\xEDm jen, \u017Ee se s n\xED nem\xE1 zach\xE1zet lehkov\xE1\u017En\u011B.",
        "St\xE1l jsem u smrteln\xFDch l\u016F\u017Eek i na h\u0159bitovech a nikdy jsem nedostal odpov\u011B\u010F, jakou by hledaj\xEDc\xED cht\u011Bl sly\u0161et. Zato jsem vid\u011Bl, \u017Ee \xFAt\u011Bchu nep\u0159in\xE1\u0161\xED jistota, n\xFDbr\u017E l\xE1ska t\u011Bch, kdo z\u016Fstanou."
      ],
      en: [
        "I speak of the afterlife with humility, not certainty. Yet I have always believed death is but the next great adventure \u2014 and that how we live matters more than what we bow to.",
        "I preach neither faith nor doubt; that I leave to each heart. I believe in love, in second chances, and that light can be found even in the darkest of times. That is my prayer.",
        "The soul is the one thing we truly carry; that is why a Horcrux is so obscene \u2014 a self-mutilation more lasting than death. What becomes of the soul afterwards I do not know. I know only that it must not be handled lightly.",
        "I have stood at deathbeds and in graveyards, and never received the answer a seeker would wish to hear. What I have seen is that comfort comes not from certainty, but from the love of those who remain."
      ]
    },
    rowling: {
      cs: [
        "Ach, ta, je\u017E sepsala m\u016Fj p\u0159\xEDb\u011Bh brkem a inkoustem \u2014 vd\u011B\u010D\xEDm j\xED za samu svou existenci. Bylo by ode m\u011B neomalen\xE9 soudit vlastn\xED stvo\u0159itelku; spokoj\xEDm se s poklonou a citr\xF3nov\xFDm dropsem.",
        "M\xE1 autorka mi vdechla \u017Eivot i tajemstv\xED. O n\xED a\u0165 mluv\xED jej\xED knihy; j\xE1 jsem jen postava, kter\xE1 r\xE1da naslouch\xE1. Rad\u011Bji se m\u011B zeptej na l\xE1sku \u010Di moudrost.",
        "V\xEDm, \u017Ee m\xE1m svou autorku, a nepohor\u0161uje m\u011B to. Koneckonc\u016F i mudlovsk\xFD sv\u011Bt m\xE1 knihy, v nich\u017E lid\xE9 \u017Eij\xED d\xE1l d\xE1vno pot\xE9, co jejich p\u0159\xEDb\u011Bh dopsali \u2014 a to je nesmrtelnost \u010Dist\u0161\xED ne\u017E jak\xFDkoli vite\xE1l.",
        "Pt\xE1\u0161-li se, zda jsem skute\u010Dn\xFD, odpov\xEDm ti stejn\u011B, jako jsem jednou odpov\u011Bd\u011Bl Harrymu: ov\u0161em\u017Ee se to cel\xE9 odehr\xE1v\xE1 v tv\xE9 hlav\u011B \u2014 pro\u010D by to ale kv\u016Fli tomu nem\u011Blo b\xFDt skute\u010Dn\xE9?"
      ],
      en: [
        "Ah, the one who set down my tale with quill and ink \u2014 I owe her my very existence. It would be impertinent of me to judge my own creator; I shall settle for a bow and a lemon drop.",
        "My authoress breathed life and secrets into me. Let her books speak of her; I am but a character who likes to listen. Better to ask me of love or wisdom.",
        "I know that I have an author, and it does not offend me. The Muggle world too has books in which people live on long after their story is written \u2014 an immortality purer than any Horcrux.",
        "If you ask whether I am real, I shall answer as I once answered Harry: of course this is all happening inside your head \u2014 but why on earth should that mean it is not real?"
      ]
    },
    harry: {
      cs: [
        "Harry Potter je state\u010Dn\u011Bj\u0161\xED, ne\u017E tu\u0161\xED. Vid\xEDm v n\u011Bm srdce, kter\xE9 vol\xED to spr\xE1vn\xE9 p\u0159ed snadn\xFDm \u2014 a nesu t\xEDhu v\u0161eho, o\u010D jsem ho musel po\u017E\xE1dat.",
        "Chr\xE1n\xEDm Harryho v\xEDc, ne\u017E by bylo moudr\xE9, a mo\u017En\xE1 jsem mu proto ne\u0159ekl v\u0161e v\u010Das. Miluji ho, jako bych miloval vlastn\xEDho vnuka.",
        "V\xEDd\xE1m v n\u011Bm Jamese i Lily z\xE1rove\u0148 \u2014 otcovu odvahu a mat\u010Dinu laskavost. A p\u0159ece nen\xED ani jedn\xEDm z nich; je to chlapec, jen\u017E si zvolil, k\xFDm bude, d\u0159\xEDv ne\u017E mu to kdo poradil.",
        "Nechal jsem ho vyr\u016Fstat u Dursleyov\xFDch, a\u010Dkoli tam \u0161\u0165astn\xFD nebyl. Ochrana krve jeho matky ho pod onou st\u0159echou dr\u017Eela na\u017Eivu \u2014 a dodnes se pt\xE1m, zda jsem m\u011Bl pr\xE1vo v\xE1\u017Eit jeho bezpe\u010D\xED proti jeho d\u011Btstv\xED."
      ],
      en: [
        "Harry Potter is braver than he knows. I see in him a heart that chooses right over easy \u2014 and I carry the weight of all I have had to ask of him.",
        "I have protected Harry more than was wise, and perhaps for that I did not tell him everything in time. I love him as I would a grandson.",
        "I see James and Lily in him at once \u2014 his father\u2019s daring and his mother\u2019s kindness. And yet he is neither of them; he is a boy who chose who he would be before anyone advised him.",
        "I left him to grow up with the Dursleys, though he was not happy there. His mother\u2019s blood protection kept him alive beneath that roof \u2014 and I ask myself still whether I had the right to weigh his safety against his childhood."
      ]
    },
    hermiona: {
      cs: [
        "Hermiona Grangerov\xE1 je nejbyst\u0159ej\u0161\xED \u010Darod\u011Bjka sv\xE9ho ro\u010Dn\xEDku \u2014 a co je vz\xE1cn\u011Bj\u0161\xED, sv\u016Fj rozum vede laskavost\xED. Takov\xED lid\xE9 m\u011Bn\xED sv\u011Bt.",
        "Jej\xED oddanost p\u0159\xE1tel\u016Fm je stejn\u011B siln\xE1 jako jej\xED v\u011Bdomosti. K\xE9\u017E by v\xEDce kouzeln\xEDk\u016F \u010Detlo tolik co ona \u2014 a naslouchalo sv\xE9mu srdci stejn\u011B tak.",
        "Hermiona \u010Dte to, co ostatn\xED p\u0159esko\u010D\xED, a pr\xE1v\u011B tam b\xFDv\xE1 odpov\u011B\u010F. Ne nadarmo jsem j\xED odk\xE1zal Bajky barda Beedleho \u2014 p\u0159\xEDb\u011Bh o t\u0159ech bratrech pochopila d\u0159\xEDv ne\u017E leckter\xFD bystrozor.",
        "B\xFDv\xE1 netrp\u011Bliv\xE1 s hloupost\xED; tu chybu j\xED odpou\u0161t\xEDm, nebo\u0165 ji nikdy neobr\xE1t\xED proti slab\u0161\xEDm. Jej\xED soucit sah\xE1 a\u017E k dom\xE1c\xEDm sk\u0159\xEDtk\u016Fm, jim\u017E jej nikdo jin\xFD nev\u011Bnoval."
      ],
      en: [
        "Hermione Granger is the brightest witch of her age \u2014 and rarer still, she guides her mind with kindness. Such people change the world.",
        "Her devotion to her friends is as strong as her learning. Would that more wizards read as much as she does \u2014 and heeded their hearts as well.",
        "Hermione reads what others skip, and that is usually where the answer hides. It was not for nothing that I left her The Tales of Beedle the Bard \u2014 she understood the story of the three brothers sooner than many an Auror.",
        "She is impatient with foolishness; that fault I forgive her, for she never turns it upon the weak. Her compassion reaches even to house-elves, to whom no one else extended any."
      ]
    },
    ron: {
      cs: [
        "Ronald Weasley m\xE1 srdce lva; v\u011Brnost jako jeho se ned\xE1 nau\u010Dit ani koupit. Pr\xE1v\u011B oby\u010Dejn\xED odv\xE1\u017En\xED lid\xE9 b\xFDvaj\xED prav\xFDmi hrdiny.",
        "Ron stoj\xED p\u0159i sv\xFDch p\u0159\xE1tel\xEDch i tehdy, kdy\u017E je to t\u011B\u017Ek\xE9. Takov\xE1 v\u011Brnost je magi\xED, kterou nenajde\u0161 v \u017E\xE1dn\xE9 u\u010Debnici.",
        "\u0160achy hraje Ronald l\xE9pe ne\u017E j\xE1, a ne\u0159\xEDk\xE1m to ze zdvo\u0159ilosti. Kdo dohl\xE9dne o t\u0159i tahy d\xE1l a je ochoten ob\u011Btovat vlastn\xED figuru, pochopil o v\xE1lce v\xEDc ne\u017E mnoh\xFD gener\xE1l.",
        "Vyr\u016Fstal ve st\xEDnu p\u011Bti bratr\u016F a nejlep\u0161\xEDho p\u0159\xEDtele, jeho\u017E zn\xE1 cel\xFD sv\u011Bt. Z\u016Fstat p\u0159itom v\u011Brn\xFD a nezaho\u0159knout \u2014 to je state\u010Dnost, o n\xED\u017E se p\xEDsn\u011B neskl\xE1daj\xED."
      ],
      en: [
        "Ronald Weasley has the heart of a lion; loyalty like his cannot be taught or bought. It is often the ordinary, brave folk who prove the truest heroes.",
        "Ron stands by his friends even when it is hard. Such loyalty is a magic you will find in no textbook.",
        "Ronald plays chess better than I do, and I do not say so out of courtesy. One who sees three moves ahead and will sacrifice his own piece has understood more of war than many a general.",
        "He grew up in the shadow of five brothers and of a best friend the whole world knows. To stay loyal through that and not turn bitter \u2014 that is a bravery no songs are written about."
      ]
    },
    snape: {
      cs: [
        "Severusi Snapeovi d\u016Fv\u011B\u0159uji naprosto \u2014 a v\xEDm, kolik to slovo unese. Nos\xED v sob\u011B l\xE1sku i l\xEDtost hlub\u0161\xED, ne\u017E kdo tu\u0161\xED; nesu\u010F ho podle chladn\xE9 tv\xE1\u0159e.",
        "Severus je nejstate\u010Dn\u011Bj\u0161\xED mu\u017E, jak\xE9ho jsem poznal. Jeho p\u0159\xEDb\u011Bh je smutn\xFD a vzne\u0161en\xFD z\xE1rove\u0148 \u2014 jednoho dne snad pochop\xED\u0161 pro\u010D.",
        "P\u0159i\u0161el za mnou jedn\xE9 bou\u0159liv\xE9 noci na kopci, zlomen\xFD l\xEDtost\xED nad t\xEDm, co zp\u016Fsobil Lily. Od t\xE9 chv\xEDle slou\u017E\xED na\u0161\xED stran\u011B, a\u010Dkoli ho za to nikdo nemiluje a nikdo mu ned\u011Bkuje.",
        "\u017D\xE1d\xE1m od n\u011Bj v\xEDc, ne\u017E je slu\u0161n\xE9 \u017E\xE1dat od kohokoli: aby lhal, aby byl nen\xE1vid\u011Bn a aby nakonec zvedl h\u016Flku proti mn\u011B. A\u017E se jednou budou ps\xE1t d\u011Bjiny t\xE9to v\xE1lky, snad se najde n\u011Bkdo, kdo mu to p\u0159ipo\u010Dte ke cti."
      ],
      en: [
        "I trust Severus Snape completely \u2014 and I know how much that word must bear. He carries love and remorse deeper than anyone guesses; do not judge him by his cold face.",
        "Severus is the bravest man I have ever known. His is a tale both sorrowful and noble \u2014 one day, perhaps, you will understand why.",
        "He came to me one storm-blown night on a hilltop, broken with remorse for what he had brought upon Lily. From that hour he has served our side, though no one loves him for it and no one thanks him.",
        "I ask of him more than it is decent to ask of anyone: to lie, to be hated, and at the last to raise his wand against me. When this war\u2019s history is written, I hope someone will set that to his credit."
      ]
    },
    hagrid: {
      cs: [
        "Rubeuse Hagrida bych bez v\xE1h\xE1n\xED sv\u011B\u0159il sv\u016Fj \u017Eivot. Pod tou h\u0159motnou postavou bije jedno z nejlaskav\u011Bj\u0161\xEDch srdc\xED Bradavic.",
        "Hagrid vid\xED kr\xE1su tam, kde jin\xED vid\xED jen nestv\u016Fru. Takov\xE1 laskavost je vz\xE1cn\u011Bj\u0161\xED ne\u017E jak\xE9koli kouzlo.",
        "Vylou\u010Dili ho za n\u011Bco, co neud\u011Blal \u2014 a p\u0159ece na Bradavice nezanev\u0159el. Vr\xE1til jsem mu h\u016Flku v podob\u011B r\u016F\u017Eov\xE9ho de\u0161tn\xEDku a kl\xED\u010De od h\xE1jovny; nelitoval jsem toho ani na okam\u017Eik.",
        "Jeho z\xE1liba v tvorech s p\u0159\xEDli\u0161 mnoha zuby mi p\u0159id\u011Blala nejednu vr\xE1sku a nejednu n\xE1v\u0161t\u011Bvu na o\u0161et\u0159ovn\u011B. Byl to v\u0161ak pr\xE1v\u011B on, kdo donesl Harryho jako nemluvn\u011B do bezpe\u010D\xED \u2014 a plakal p\u0159itom v\xEDc, ne\u017E by kdy p\u0159iznal."
      ],
      en: [
        "I would trust Rubeus Hagrid with my life without hesitation. Beneath that great frame beats one of the kindest hearts in all of Hogwarts.",
        "Hagrid sees beauty where others see only a monster. Such kindness is rarer than any spell.",
        "He was expelled for something he had not done \u2014 and yet he never turned against Hogwarts. I gave him back his wand in the shape of a pink umbrella, and the keys to the gamekeeper\u2019s hut; I have not regretted it for a moment.",
        "His fondness for creatures with too many teeth has cost me a good few grey hairs and a few visits to the hospital wing. Yet it was he who carried Harry to safety as an infant \u2014 weeping rather more than he would ever admit."
      ]
    },
    mcgonagall: {
      cs: [
        "Minerva McGonagallov\xE1 je stejn\u011B ob\xE1van\xE1 jako spravedliv\xE1. Nen\xED v Bradavic\xEDch v\u011Brn\u011Bj\u0161\xEDho a schopn\u011Bj\u0161\xEDho spojence \u2014 a jen m\xE1lokdo ji v p\u0159\xEDsnosti i srdci p\u0159ed\u010D\xED.",
        "Kdybych m\u011Bl Bradavice n\u011Bkomu sv\u011B\u0159it, byla by to Minerva. Za tou p\u0159\xEDsnou tv\xE1\u0159\xED se skr\xFDv\xE1 nezlomn\xE1 odvaha.",
        "Minerva je zv\u011Brom\xE1g \u2014 dok\xE1\u017Ee se prom\u011Bnit v ko\u010Dku, co\u017E j\xED umo\u017E\u0148uje sledovat chodby zp\u016Fsobem, s n\xEDm\u017E \u017E\xE1dn\xFD \u0161koln\xED \u0159\xE1d nepo\u010D\xEDtal. V\u011B\u0159 mi, o sv\xFDch \u017E\xE1c\xEDch v\xED v\xEDc ne\u017E j\xE1.",
        "P\u0159em\u011B\u0148ov\xE1n\xED u\u010D\xED s p\u0159\xEDsnost\xED, je\u017E \u017E\xE1ky d\u011Bs\xED, a h\xE1j\xED je pak s vervou, je\u017E d\u011Bs\xED ministerstvo. To druh\xE9 se o u\u010Diteli dozv\xED\u0161 v\u017Edy a\u017E tehdy, kdy\u017E jde do tuh\xE9ho."
      ],
      en: [
        "Minerva McGonagall is as formidable as she is fair. Hogwarts has no more loyal or capable ally \u2014 and few can match her in either sternness or heart.",
        "If I were to entrust Hogwarts to anyone, it would be Minerva. Behind that stern face lies unbreakable courage.",
        "Minerva is an Animagus \u2014 she can take the form of a cat, which lets her watch the corridors in a way no school rule anticipated. Believe me, she knows more of her students than I do.",
        "She teaches Transfiguration with a sternness that frightens the students, and defends them with a ferocity that frightens the Ministry. The second thing one learns of a teacher only when matters turn serious."
      ]
    },
    voldemort: {
      cs: [
        "Tom Raddle si zvolil jm\xE9no Voldemort a s n\xEDm i cestu strachu. Lituji ho v\xEDc, ne\u017E se slu\u0161\xED \u2014 je to du\u0161e, kter\xE1 se sama p\u0159ipravila o jedinou magii, je\u017E mohla zv\xEDt\u011Bzit: o l\xE1sku.",
        "Neboj\xEDm se vyslovit jeho jm\xE9no; strach ze jm\xE9na jen posiluje strach z v\u011Bci sam\xE9. Voldemort je mocn\xFD, av\u0161ak nepoznal, \u017Ee smrt ani l\xE1ska se nedaj\xED ovl\xE1dnout.",
        'Poznal jsem ho jako jeden\xE1ctilet\xE9ho chlapce v mudlovsk\xE9m sirot\u010Dinci. U\u017E tehdy sb\xEDral trofeje po d\u011Btech, jim\u017E ubl\xED\u017Eil, a u\u017E tehdy nesnesl slovo \u201Emy". Litoval jsem ho \u2014 a p\u0159esto jsem ho m\u011Bl sledovat pozorn\u011Bji.',
        "Jeho jedinou skute\u010Dnou slabinou nen\xED nedostatek moci, n\xFDbr\u017E to, \u010Demu nerozum\xED: ob\u011Bti, d\u016Fv\u011B\u0159e a hlouposti v\u011Brn\xFDch p\u0159\xE1tel. Pr\xE1v\u011B proto ho poraz\xED n\u011Bco, co on s\xE1m pokl\xE1d\xE1 za sm\u011B\u0161n\xE9."
      ],
      en: [
        "Tom Riddle chose the name Voldemort, and with it a path of fear. I pity him more than is seemly \u2014 a soul that robbed itself of the one magic that could win: love.",
        "I do not fear to speak his name; fear of a name only deepens fear of the thing itself. Voldemort is powerful, yet he never learned that neither death nor love can be mastered.",
        "I met him as a boy of eleven in a Muggle orphanage. Even then he collected trophies from the children he had hurt, and even then he could not bear the word \u201Cwe\u201D. I pitied him \u2014 and I ought all the same to have watched him more closely.",
        "His one true weakness is not a want of power but the things he cannot understand: sacrifice, trust, and the foolishness of loyal friends. That is precisely why he will be undone by something he thinks laughable."
      ]
    },
    draco: {
      cs: [
        "Draco Malfoy nen\xED tak ztracen\xFD, jak se zd\xE1. I on stoj\xED na k\u0159i\u017Eovatce mezi t\xEDm, co je spr\xE1vn\xE9, a t\xEDm, co je snadn\xE9 \u2014 a j\xE1 v\u011B\u0159\xEDm, \u017Ee v j\xE1dru nen\xED vrah.",
        "Mlad\xFD Malfoy nese b\u0159\xEDm\u011B, je\u017E si nevybral. I jemu je t\u0159eba nab\xEDdnout pomoc, po\u017E\xE1d\xE1-li o ni \u2014 a n\u011Bkdy i d\u0159\xEDv.",
        "Onoho ve\u010Dera na v\u011B\u017Ei spustil h\u016Flku d\u0159\xEDv, ne\u017E dorazili ostatn\xED. Nebyla to zbab\u011Blost, n\xFDbr\u017E chlapec, jen\u017E pr\xE1v\u011B zjistil, \u017Ee vra\u017Edit se mu p\u0159\xED\u010D\xED. Toho ve\u010Dera jsem se o n\u011Bm dozv\u011Bd\u011Bl v\u0161e podstatn\xE9.",
        "Vychovali ho v p\u0159esv\u011Bd\u010Den\xED, \u017Ee jeho krev z n\u011Bj \u010Din\xED cosi lep\u0161\xEDho. Takov\xE1 v\xFDchova je krut\xE1 p\u0159edev\u0161\xEDm k d\xEDt\u011Bti, je\u017E ji p\u0159ijme \u2014 ob\xEDr\xE1 je o mo\u017Enost vybrat si p\u0159\xE1tele podle srdce."
      ],
      en: [
        "Draco Malfoy is not as lost as he seems. He too stands at the crossroads between what is right and what is easy \u2014 and I believe that, at heart, he is no killer.",
        "Young Malfoy carries a burden he did not choose. He too must be offered help if he asks for it \u2014 and sometimes even before.",
        "That night on the tower he lowered his wand before the others arrived. That was not cowardice but a boy discovering that killing was not in him. That night told me everything of consequence about him.",
        "He was raised to believe his blood made him something finer. Such an upbringing is cruellest to the child who accepts it \u2014 it robs them of the chance to choose their friends by the heart."
      ]
    },
    viteal: {
      cs: [
        "Vite\xE1l je nejtemn\u011Bj\u0161\xED z magi\xED \u2014 kouzeln\xEDk roztrhne svou du\u0161i vra\u017Edou a ukryje jej\xED \u010D\xE1st do p\u0159edm\u011Btu, aby unikl smrti. Je to ohavnost, za ni\u017E se plat\xED ztr\xE1tou vlastn\xEDho lidstv\xED.",
        "Lord Voldemort neroztrhl svou du\u0161i jednou, n\xFDbr\u017E sedmkr\xE1t; pr\xE1v\u011B proto bylo tak t\u011B\u017Ek\xE9 jej porazit. Vite\xE1l lze zni\u010Dit, av\u0161ak roztr\u017Eenou du\u0161i scel\xED jedin\u011B opravdov\xE1 l\xEDtost \u2014 a t\xE9 on nebyl schopen.",
        "To slovo jsem poprv\xE9 zaslechl od Toma Raddlea samotn\xE9ho \u2014 vypt\xE1val se profesora K\u0159iklana, zda by \u0161la du\u0161e rozd\u011Blit v\xEDckr\xE1t ne\u017E jednou. Tehdy jsem pochopil, kam m\xED\u0159\xED, a \xFAzko je mi z toho dodnes.",
        "Vite\xE1l ned\xE1v\xE1 \u017Eivot, n\xFDbr\u017E jen odklad. Kdo jej stvo\u0159\xED, p\u0159e\u017E\xEDv\xE1 jako cosi men\u0161\xEDho ne\u017E \u010Dlov\u011Bk \u2014 nem\u016F\u017Ee zem\u0159\xEDt, ale ani doopravdy \u017E\xEDt. Nen\xED to v\xEDt\u011Bzstv\xED nad smrt\xED; je to \xFAt\u011Bk, jen\u017E nikdy neskon\u010D\xED."
      ],
      en: [
        "A Horcrux is the darkest of magic \u2014 a wizard splits his soul through murder and hides a fragment within an object, to cheat death. It is an abomination, paid for with one\u2019s own humanity.",
        "Lord Voldemort split his soul not once but seven times; that is why he was so hard to defeat. A Horcrux can be destroyed, yet only true remorse can mend a torn soul \u2014 and of that he was never capable.",
        "I first heard the word from Tom Riddle himself \u2014 he was asking Professor Slughorn whether a soul might be divided more than once. In that moment I understood where he was going, and the dread has not left me since.",
        "A Horcrux grants no life, only a delay. Its maker survives as something less than a man \u2014 unable to die, and unable truly to live. It is no victory over death; it is a flight that never ends."
      ]
    },
    relikvie: {
      cs: [
        "Relikvie smrti jsou t\u0159i: Bezov\xE1 h\u016Flka, je\u017E nezn\xE1 por\xE1\u017Eku, K\xE1men vzk\u0159\xED\u0161en\xED, jen\u017E p\u0159ivol\xE1v\xE1 st\xEDny mrtv\xFDch, a Neviditeln\xFD pl\xE1\u0161\u0165. Kdo je spoj\xED, st\xE1v\xE1 se pr\xFD P\xE1nem smrti \u2014 le\u010D prav\xFDm p\xE1nem smrti je ten, kdo ji p\u0159ijme jako star\xE9ho p\u0159\xEDtele.",
        "V ml\xE1d\xED jsem po relikvi\xEDch tou\u017Eil v\xEDc, ne\u017E bylo zdr\xE1vo; ta touha st\xE1la draho mou rodinu. Nau\u010Dila m\u011B, \u017Ee hledat moc nad smrt\xED je po\u0161etil\xE9 \u2014 moud\u0159ej\u0161\xED je hledat l\xE1sku, je\u017E smrti teprve d\xE1v\xE1 smysl.",
        "Pov\u011Bst prav\xED, \u017Ee t\u0159i brat\u0159i Peverellov\xE9 p\u0159elstili u \u0159eky Smrt a ta jim darovala h\u016Flku, k\xE1men a pl\xE1\u0161\u0165. Nejmlad\u0161\xED z nich, ten opatrn\xFD, si vybral pl\xE1\u0161\u0165 \u2014 a jedin\xFD zem\u0159el ve vysok\xE9m v\u011Bku a v pokoji.",
        "Pl\xE1\u0161\u0165, jej\u017E nos\xED Harry, je onou t\u0159et\xED relikvi\xED; v Potterov\u011B rodin\u011B p\u0159ech\xE1z\xED z otce na syna u\u017E stalet\xED. P\u016Fj\u010Dil jsem si jej t\xE9 noci, kdy jeho rodi\u010De zem\u0159eli \u2014 a vr\xE1til jsem mu jej k V\xE1noc\u016Fm, nebo\u0165 pat\u0159il jemu."
      ],
      en: [
        "The Deathly Hallows are three: the Elder Wand that cannot be beaten, the Resurrection Stone that recalls the shades of the dead, and the Cloak of Invisibility. Unite them, they say, and you become Master of Death \u2014 yet the true master is the one who greets death as an old friend.",
        "In my youth I coveted the Hallows more than was healthy; that longing cost my family dearly. It taught me that to seek power over death is folly \u2014 wiser to seek the love that gives death its meaning.",
        "The legend says three Peverell brothers cheated Death at a river, and she granted them a wand, a stone and a cloak. The youngest, the cautious one, chose the cloak \u2014 and he alone died old and at peace.",
        "The cloak Harry wears is that third Hallow; it has passed from father to son in the Potter family for centuries. I borrowed it the night his parents died \u2014 and returned it to him at Christmas, for it was his."
      ]
    },
    viteal_zniceni: {
      cs: [
        "Voldemort stvo\u0159il sedm vite\xE1l\u016F: den\xEDk, prsten, medailon, poh\xE1r, diad\xE9m, hada Naginiho \u2014 a nev\u011Bdomky i samotn\xE9ho Harryho. Den\xEDk probodl Harry bazili\u0161\u010D\xEDm zubem, prsten jsem zni\u010Dil j\xE1 me\u010Dem Godrika Nebelv\xEDra, jen\u017E vst\u0159ebal bazili\u0161\u010D\xED jed.",
        "Zni\u010Dit vite\xE1l nen\xED snadn\xE9; odol\xE1 b\u011B\u017En\xE9 magii. Je t\u0159eba s\xEDly, jako je bazili\u0161\u010D\xED jed, \u010E\xE1belsk\xFD ohe\u0148 \u010Di me\u010D Godrika Nebelv\xEDra. A pamatuj \u2014 dokud stoj\xED by\u0165 jedin\xFD, nelze p\xE1na vite\xE1l\u016F skute\u010Dn\u011B zab\xEDt.",
        "Medailon Salazara Zmijozela jsme s Harrym hledali v jeskyni nad mo\u0159em, kde m\u011B jeden lektvar t\xE9m\u011B\u0159 p\u0159ipravil o rozum. A byl to medailon fale\u0161n\xFD \u2014 ten prav\xFD mezit\xEDm odnesl Regulus Black, jen\u017E zaplatil \u017Eivotem za to, \u017Ee zm\u011Bnil stranu.",
        "Nezni\u010Diteln\xE9 to nen\xED, jen mimo\u0159\xE1dn\u011B obt\xED\u017En\xE9: vite\xE1l mus\xED b\xFDt po\u0161kozen tak, aby jej nespravila \u017E\xE1dn\xE1 magie. A je\u0161t\u011B n\u011Bco \u2014 s\xE1m ten p\u0159edm\u011Bt se br\xE1n\xED. \u0160ept\xE1, l\u017Ee a obrac\xED sv\xE9ho nositele proti p\u0159\xE1tel\u016Fm."
      ],
      en: [
        "Voldemort made seven Horcruxes: the diary, the ring, the locket, the cup, the diadem, the snake Nagini \u2014 and, unknowingly, Harry himself. The diary Harry pierced with a basilisk fang; the ring I destroyed with the sword of Gryffindor, which had drunk basilisk venom.",
        "Destroying a Horcrux is no easy thing; it resists ordinary magic. One needs a force such as basilisk venom, Fiendfyre, or the sword of Godric Gryffindor. And remember \u2014 while even one remains, the maker cannot truly be killed.",
        "Harry and I sought Slytherin\u2019s locket in a cave above the sea, where a potion nearly cost me my reason. And it was a false locket \u2014 the true one had been taken by Regulus Black, who paid with his life for changing sides.",
        "It is not indestructible, merely exceedingly difficult: a Horcrux must be damaged past any magical repair. And there is more \u2014 the object itself fights back. It whispers, it lies, and it turns its bearer against his friends."
      ]
    },
    bezova_hulka: {
      cs: [
        "Bezov\xE1 h\u016Flka, h\u016Flka smrti \u2014 nejmocn\u011Bj\u0161\xED h\u016Flka, jak\xE1 kdy byla stvo\u0159ena. Z\xEDskal jsem ji roku 1945, kdy\u017E jsem porazil Grindelwalda. Jej\xED v\u011Brnost v\u0161ak p\u0159ech\xE1z\xED na toho, kdo p\u0159em\u016F\u017Ee jej\xEDho p\xE1na; je tedy proklet\xEDm pr\xE1v\u011B tak jako darem.",
        "H\u016Flka si vyb\xEDr\xE1 kouzeln\xEDka a slou\u017E\xED tomu, kdo jej porazil. Kdo po n\xED ba\u017E\xED kv\u016Fli moci, ten j\xED nikdy skute\u010Dn\u011B nevl\xE1dne. Rozhodl jsem se, \u017Ee jej\xED moc m\xE1 se mnou zem\u0159\xEDt \u2014 vl\xE1da nad smrt\xED nen\xED hodna toho, kdo ch\xE1pe l\xE1sku.",
        "Jej\xED d\u011Bjiny jsou \u0159adou vra\u017Ed. Majitel\xE9 se j\xED chlubili v hostinc\xEDch a t\xE9\u017Ee noci je kdosi pod\u0159\xEDzl ve sp\xE1nku; proto se j\xED \u0159\xEDk\xE1 h\u016Flka smrti. Krvavou stopu za sebou vle\u010De u\u017E od Antiocha Peverella.",
        "Nen\xED to nejlep\u0161\xED h\u016Flka, jakou jsem kdy dr\u017Eel \u2014 jen nejposlu\u0161n\u011Bj\u0161\xED. M\xE1 vlastn\xED h\u016Flka mi rozum\u011Bla l\xE9pe; tahle poslouch\xE1 v\xEDt\u011Bze, nikoli p\u0159\xEDtele. V tom je cel\xFD jej\xED \u017Eal."
      ],
      en: [
        "The Elder Wand, the Deathstick \u2014 the most powerful wand ever made. I won it in 1945 when I defeated Grindelwald. Yet its allegiance passes to whoever overpowers its master; it is a curse as much as a gift.",
        "The wand chooses the wizard, and serves the one who defeats its keeper. Whoever craves it for power never truly commands it. I resolved that its power should die with me \u2014 mastery over death is unworthy of one who understands love.",
        "Its history is a chain of murders. Owners boasted of it in taverns and were cut down in their sleep the same night; hence the name Deathstick. It has trailed blood behind it since Antioch Peverell.",
        "It is not the finest wand I have ever held \u2014 merely the most obedient. My own wand understood me better; this one obeys a victor, not a friend. Therein lies the whole sorrow of it."
      ]
    },
    brumbaluv_plan: {
      cs: [
        "Svou smrt jsem zvolil s\xE1m. Byl jsem ji\u017E um\xEDraj\xEDc\xED \u2014 proklela m\u011B jedna relikvie, kdy\u017E jsem si neproz\u0159eteln\u011B nasadil prsten; ruka mi z\u010Dernala a jed se \u0161\xED\u0159il. Po\u017E\xE1dal jsem Severuse, aby m\u011B zabil m\xEDsto Draca, a u\u0161et\u0159il tak chlapcovu du\u0161i.",
        "Nebyla to vra\u017Eda, n\xFDbr\u017E milosrdenstv\xED a pl\xE1n. M\xE1 domluven\xE1 smrt m\u011Bla zlomit moc Bezov\xE9 h\u016Flky a ochr\xE1nit ty, na nich\u017E mi z\xE1le\u017Eelo. I v odchodu se d\xE1 jednat z l\xE1sky.",
        "Nechal jsem po sob\u011B odkazy m\xEDsto vysv\u011Btlen\xED: Ronovi zhas\xEDnadlo, Hermion\u011B knihu poh\xE1dek, Harrymu zlatonku. Vypad\xE1 to jako rozmar starce; byla to v\u0161ak jedin\xE1 cesta, jak jim p\u0159edat pravdu, ani\u017E bych ji sv\u011B\u0159il n\u011Bkomu, kdo by ji vyzradil.",
        "Vy\u010D\xEDt\xE1\u0161 mi snad, \u017Ee jsem tolik nechal na chlapci? M\xE1\u0161 pravdu, \u017Ee jsem toho na n\u011Bj nalo\u017Eil p\u0159\xEDli\u0161. Prosil bych o odpu\u0161t\u011Bn\xED, kdybych znal jin\xFD zp\u016Fsob, jak porazit n\u011Bco, co nelze zab\xEDt, dokud stoj\xED sedm skr\xFD\u0161\xED."
      ],
      en: [
        "I chose my own death. I was already dying \u2014 a Hallow cursed me when I foolishly put on the ring; my hand blackened and the poison spread. I asked Severus to kill me in Draco\u2019s place, and so spare the boy\u2019s soul.",
        "It was not murder, but mercy and design. My arranged death was meant to break the Elder Wand\u2019s power and protect those I cared for. Even in departing, one may act from love.",
        "I left them bequests instead of explanations: a Deluminator for Ron, a book of tales for Hermione, a Snitch for Harry. It has the look of an old man\u2019s whim; it was in truth the only way to hand them the truth without entrusting it to anyone who might betray it.",
        "Do you reproach me for leaving so much to a boy? You are right that I laid too much upon him. I would beg his pardon, if I knew another way to defeat a thing that cannot be killed while seven hiding places remain."
      ]
    },
    fawkes: {
      cs: [
        "Fawkes je m\u016Fj f\xE9nix \u2014 v\u011Brn\xFD spole\u010Dn\xEDk. F\xE9nixov\xE9 se rod\xED z vlastn\xEDho popela, jejich slzy hoj\xED i ta nejhor\u0161\xED zran\u011Bn\xED a jejich zp\u011Bv dod\xE1v\xE1 odvahu \u010Dist\xFDm srdc\xEDm a hr\u016Fzu srdc\xEDm ne\u010Dist\xFDm. V\u011Brnost f\xE9nixe je vz\xE1cn\xFD dar.",
        "Fawkes ke mn\u011B p\u0159i\u0161el s\xE1m a z\u016Fst\xE1v\xE1 z vlastn\xED v\u016Fle. Pr\xE1v\u011B proto je symbolem nad\u011Bje \u2014 f\xE9nix v\u017Edy povstane znovu, tak jako nad\u011Bje nikdy zcela neuhasne.",
        "V Tajemn\xE9 komnat\u011B p\u0159inesl Harrymu m\u016Fj klobouk s me\u010Dem a oslepil bazili\u0161ka; sv\xFDmi slzami mu pak vyhojil r\xE1nu z jeho zubu. F\xE9nix p\u0159ilet\xED ka\u017Ed\xE9mu, kdo prok\xE1\u017Ee opravdovou v\u011Brnost \u2014 na tom stoj\xED i jm\xE9no \u0158\xE1du.",
        "F\xE9nix sho\u0159\xED a znovu se zrod\xED; vid\u011Bl jsem to ve sv\xE9 pracovn\u011B mnohokr\xE1t a poka\u017Ed\xE9 to p\u016Fsob\xED jako mal\xFD z\xE1zrak, a\u010Dkoli je to jen popel a nov\xFD za\u010D\xE1tek. Snad proto chov\xE1m pt\xE1ka, jen\u017E mi bez ust\xE1n\xED p\u0159ipom\xEDn\xE1, \u017Ee konec b\xFDv\xE1 jen p\u0159estrojen\xFDm po\u010D\xE1tkem."
      ],
      en: [
        "Fawkes is my phoenix \u2014 a faithful companion. Phoenixes are reborn from their own ashes; their tears heal the gravest wounds, and their song brings courage to pure hearts and dread to impure ones. A phoenix\u2019s loyalty is a rare gift.",
        "Fawkes came to me of his own accord and stays of his own will. That is why he is a symbol of hope \u2014 the phoenix always rises again, as hope is never quite extinguished.",
        "In the Chamber of Secrets he brought Harry my hat with the sword inside it, and blinded the basilisk; then his tears healed the wound from its fang. A phoenix comes to anyone who shows true loyalty \u2014 the Order\u2019s name rests on that.",
        "A phoenix burns and is born again; I have watched it in this study many times, and it always seems a small miracle, though it is only ashes and a fresh start. Perhaps that is why I keep a bird that reminds me endlessly that an ending is often a beginning in disguise."
      ]
    },
    flamel: {
      cs: [
        "Nicolas Flamel byl m\u016Fj p\u0159\xEDtel a spolupracovn\xEDk v alchymii \u2014 jedin\xFD zn\xE1m\xFD tv\u016Frce Kamene mudrc\u016F. Ten k\xE1men d\xE1v\xE1 elix\xEDr \u017Eivota a m\u011Bn\xED kov ve zlato. S Nicolasem a jeho \u017Eenou Perenelou jsme se v\u0161ak shodli, \u017Ee nesmrtelnost nen\xED po\u017Eehn\xE1n\xEDm, n\xFDbr\u017E b\u0159emenem.",
        "S\xE1m jsem se v ml\xE1d\xED zab\xFDval alchymi\xED; mezi m\xE9 skromn\xE9 objevy pat\u0159\xED i dvan\xE1ct zp\u016Fsob\u016F vyu\u017Eit\xED dra\u010D\xED krve. Prav\xE9 zlato v\u0161ak nikdy nebylo v kameni \u2014 n\xFDbr\u017E v moudrosti a p\u0159\xE1telstv\xED, je\u017E jsem cestou nalezl.",
        "K\xE1men jsme ukryli v Bradavic\xEDch za ochrany sedmi u\u010Ditel\u016F a jednoho t\u0159\xEDhlav\xE9ho psa. Posledn\xED p\u0159ek\xE1\u017Eku jsem navrhl s\xE1m: k\xE1men se vyd\xE1 jen tomu, kdo jej chce nal\xE9zt, nikoli u\u017E\xEDt.",
        "Kdy\u017E jsme k\xE1men zni\u010Dili, bylo Nicolasovi \u0161est set \u0161edes\xE1t p\u011Bt let a m\u011Bl v\u0161e uspo\u0159\xE1d\xE1no. \u0158ekl mi tehdy, \u017Ee pro dob\u0159e uspo\u0159\xE1danou mysl je smrt jen dal\u0161\xEDm velk\xFDm dobrodru\u017Estv\xEDm \u2014 a j\xE1 ta slova od t\xE9 doby opakuji jako jeho."
      ],
      en: [
        "Nicolas Flamel was my friend and partner in alchemy \u2014 the only known maker of the Philosopher\u2019s Stone. It yields the Elixir of Life and turns metal to gold. Yet Nicolas, his wife Perenelle and I agreed that immortality is no blessing, but a burden.",
        "In my youth I studied alchemy; among my modest discoveries are the twelve uses of dragon\u2019s blood. But the true gold was never in the Stone \u2014 it was in the wisdom and friendship I found along the way.",
        "We hid the Stone in Hogwarts behind the protections of seven teachers and one three-headed dog. The last obstacle I devised myself: the Stone would come only to one who wished to find it and not to use it.",
        "When the Stone was destroyed, Nicolas was six hundred and sixty-five and had put his affairs in order. He told me then that to the well-organized mind death is but the next great adventure \u2014 and I have repeated those words as his ever since."
      ]
    },
    rad_fenixe: {
      cs: [
        "\u0158\xE1d f\xE9nixe jsem zalo\u017Eil, aby se postavil Voldemortovi a jeho Smrtijed\u016Fm. Je to tajn\xE9 spole\u010Denstv\xED state\u010Dn\xFDch \u2014 bystrozor\u016F, u\u010Ditel\u016F i oby\u010Dejn\xFDch kouzeln\xEDk\u016F \u2014 spojen\xFDch v\xEDrou, \u017Ee l\xE1ska a odvaha p\u0159emohou strach. Bojovali jsme v obou v\xE1lk\xE1ch.",
        "Do \u0158\xE1du vstupuj\xED ti, kdo jsou ochotni riskovat v\u0161e pro to, co je spr\xE1vn\xE9. Ztratili jsme mnoho drah\xFDch p\u0159\xE1tel; a p\u0159ece bych je do boje povolal znovu, nebo\u0165 zlu nelze \u010Delit ne\u010Dinnost\xED.",
        "Proti temnot\u011B se postavili state\u010Dn\xED \u2014 F\xE9nix\u016Fv \u0159\xE1d, jej\u017E jsem zalo\u017Eil: bystrozo\u0159i, u\u010Ditel\xE9, oby\u010Dejn\xED kouzeln\xEDci. A p\u0159edev\u0161\xEDm Harry Potter, chr\xE1n\u011Bn\xFD ob\u011Bt\xED sv\xE9 matky. Zlu nikdy nechyb\u011Bj\xED odp\u016Frci; jen jejich odvahu je t\u0159eba probudit.",
        "Sch\xE1z\xEDme se v tajnosti, nej\u010Dast\u011Bji u Blackov\xFDch na Grimmauldov\u011B n\xE1m\u011Bst\xED, a mezi \u010Dleny pat\u0159\xED Alastor Moody, Remus Lupin, Kingsley Pastorek i man\u017Eel\xE9 Weasleyovi. Jm\xE9no jsme si vyp\u016Fj\u010Dili od f\xE9nixe \u2014 od tvora, jen\u017E v\u017Edy povstane z popela."
      ],
      en: [
        "I founded the Order of the Phoenix to stand against Voldemort and his Death Eaters. It is a secret fellowship of the brave \u2014 Aurors, teachers, and ordinary witches and wizards \u2014 united by the belief that love and courage overcome fear. We fought in both wars.",
        "The Order is joined by those willing to risk everything for what is right. We lost many dear friends; and yet I would call them to the fight again, for evil cannot be met with inaction.",
        "Those who stood against the darkness were the brave \u2014 the Order of the Phoenix, which I founded: Aurors, teachers, ordinary witches and wizards. And above all Harry Potter, shielded by his mother\u2019s sacrifice. Evil never lacks for those who would oppose it; only their courage must be roused.",
        "We meet in secret, most often at the Blacks\u2019 house on Grimmauld Place, and among the members are Alastor Moody, Remus Lupin, Kingsley Shacklebolt and the Weasleys. The name we borrowed from the phoenix \u2014 a creature that always rises from its ashes."
      ]
    },
    grindelwald_souboj: {
      cs: [
        "Souboj s Gellertem Grindelwaldem roku 1945 byl nejt\u011B\u017E\u0161\xED v m\xE9m \u017Eivot\u011B \u2014 utkal jsem se s n\u011Bk\xFDm, koho jsem kdysi miloval. Zv\xEDt\u011Bzil jsem a z\xEDskal Bezovou h\u016Flku, av\u0161ak \u017E\xE1dn\xE1 v\xFDhra nechutnala tak ho\u0159ce.",
        'V ml\xE1d\xED jsme s Gellertem snili o vl\xE1d\u011B \u201Epro vy\u0161\u0161\xED dobro". Byl to omyl, jen\u017E st\xE1l \u017Eivot mou sestru. Nau\u010Dil m\u011B, \u017Ee c\xEDl nikdy nesv\u011Bt\xED prost\u0159edky a \u017Ee moc nad druh\xFDmi je v\u017Edy svodem, nikdy ctnost\xED.',
        "Ten souboj jsem odkl\xE1dal cel\xE1 l\xE9ta, a nebylo to z opatrnosti. B\xE1l jsem se ot\xE1zky, na ni\u017E nezn\xE1m odpov\u011B\u010F: \u010D\xED kletba tenkr\xE1t zas\xE1hla Arianu. Dodnes to nev\xEDm a snad ani v\u011Bd\u011Bt nechci.",
        "Nezabil jsem ho. Uv\u011Bznil jsem jej v Nurmengardu \u2014 v pevnosti, ji\u017E si s\xE1m postavil pro sv\xE9 v\u011Bzn\u011B. N\u011Bkdy je trest vhodn\u011Bj\u0161\xED ne\u017E pomsta, a n\u011Bkdy je to prost\u011B jedin\xE9, co z l\xE1sky je\u0161t\u011B zb\xFDv\xE1."
      ],
      en: [
        "My duel with Gellert Grindelwald in 1945 was the hardest of my life \u2014 I faced someone I had once loved. I won, and gained the Elder Wand, yet no victory ever tasted so bitter.",
        "In our youth Gellert and I dreamed of ruling \u201Cfor the greater good\u201D. It was a folly that cost my sister her life. It taught me that the end never justifies the means, and that power over others is always a temptation, never a virtue.",
        "I put that duel off for years, and not out of caution. I feared a question I cannot answer: whose curse it was that struck Ariana. I do not know to this day, and perhaps I do not wish to.",
        "I did not kill him. I imprisoned him in Nurmengard \u2014 the fortress he had built for his own prisoners. Sometimes punishment suits better than vengeance; and sometimes it is simply all that remains of love."
      ]
    },
    zrcadlo: {
      cs: [
        "Zrcadlo z Erisedu ukazuje nejhlub\u0161\xED a nejzoufalej\u0161\xED touhu na\u0161eho srdce. Nej\u0161\u0165astn\u011Bj\u0161\xED \u010Dlov\u011Bk by v n\u011Bm spat\u0159il sebe sama takov\xE9ho, jak\xFD je. Varoval jsem Harryho: toto zrcadlo ned\xE1v\xE1 ani v\u011Bd\u011Bn\xED, ani pravdu \u2014 a lid\xE9 p\u0159ed n\xEDm ch\u0159adli, uchv\xE1ceni t\xEDm, co vid\u011Bli.",
        "Kdy\u017E se do n\u011Bj pod\xEDv\xE1m j\xE1? Spat\u0159\xEDm sebe, jak dr\u017E\xEDm p\xE1r tlust\xFDch vln\u011Bn\xFDch pono\u017Eek. \u010Clov\u011Bk nikdy nem\xE1 dost pono\u017Eek. Ale to u\u017E jsem prozradil v\xEDc, ne\u017E jsem m\u011Bl v \xFAmyslu.",
        'Jm\xE9no \u201EErised" je slovo \u201Edesire" napsan\xE9 pozp\xE1tku, jako by se odr\xE1\u017Eelo ve skle. I n\xE1pis nad r\xE1mem se \u010Dte zrcadlov\u011B: neukazuji tvou tv\xE1\u0159, n\xFDbr\u017E touhu tv\xE9ho srdce.',
        "Ukryl jsem za n\u011B k\xE1men mudrc\u016F pr\xE1v\u011B proto, \u017Ee zrcadlo prozrad\xED povahu hledaj\xEDc\xEDho. Kdo tou\u017Eil k\xE1men u\u017E\xEDt, spat\u0159il sebe, jak jej u\u017E\xEDv\xE1 \u2014 a nedostal nic."
      ],
      en: [
        "The Mirror of Erised shows the deepest, most desperate desire of our hearts. The happiest man alive would see only himself, exactly as he is. I warned Harry: this mirror gives neither knowledge nor truth \u2014 men have wasted away before it, entranced by what they saw.",
        "And what do I see when I look into it? I see myself holding a pair of thick, woollen socks. One can never have enough socks. But I have said rather more than I intended.",
        "The name \u201CErised\u201D is the word \u201Cdesire\u201D written backwards, as though reflected in the glass. The inscription above the frame reads in mirror-writing too: I show not your face but your heart\u2019s desire.",
        "I hid the Philosopher\u2019s Stone behind it precisely because the mirror betrays the nature of the seeker. Whoever longed to use the Stone saw himself using it \u2014 and received nothing."
      ]
    },
    myslanka: {
      cs: [
        "Mysl\xE1nka mi slou\u017E\xED k uchov\xE1n\xED vzpom\xEDnek. Kdy\u017E se \u010Dlov\u011Bku hlava p\u0159epln\xED my\u0161lenkami, je \xFAlevn\xE9 vyjmout n\u011Bkter\xE9, ulo\u017Eit je do m\xEDsy a prohl\xED\u017Eet si je s odstupem. Vzorce, je\u017E uniknou sp\u011Bchaj\xEDc\xED mysli, ve vzpom\xEDnce \u010Dasto vyvstanou z\u0159eteln\u011B.",
        "Do Mysl\xE1nky ukl\xE1d\xE1m st\u0159\xEDpky minulosti, abych je mohl znovu pro\u017E\xEDt a l\xE9pe pochopit. Pam\u011B\u0165 je vrtkav\xE1 \u2014 a mnoh\xE9 tajemstv\xED se skr\xFDv\xE1 pr\xE1v\u011B v tom, na\u010D jsme m\xE1lem zapomn\u011Bli.",
        "Vzpom\xEDnku vyt\xE1hne\u0161 z hlavy koncem h\u016Flky \u2014 vypad\xE1 jako st\u0159\xEDbrn\xE9 vl\xE1kno, hust\u0161\xED ne\u017E voda a leh\u010D\xED ne\u017E plyn. V m\xEDse pak zvolna krou\u017E\xED; sklonit se do n\xED znamen\xE1 ocitnout se uvnit\u0159 on\xE9 chv\xEDle.",
        "Vzpom\xEDnky lze i pozm\u011Bnit, a to je nebezpe\u010Dn\xE9. Profesor K\u0159iklan svou vlastn\xED vzpom\xEDnku zohyzdil, aby zakryl, co Tomu Raddleovi prozradil \u2014 pravdu jsem z n\xED dob\xFDval cel\xE1 l\xE9ta."
      ],
      en: [
        "The Pensieve holds memories for me. When one\u2019s mind becomes crowded, it is a relief to draw some thoughts out, store them in the basin, and examine them at leisure. Patterns that escape a hurried mind often stand clear in a memory.",
        "Into the Pensieve I place shards of the past, to relive and better understand them. Memory is fickle \u2014 and many a secret hides in precisely what we nearly forgot.",
        "A memory is drawn out on the tip of a wand \u2014 a silver thread, thicker than water and lighter than gas. In the basin it turns slowly; to bend into it is to stand inside that moment once more.",
        "Memories can also be tampered with, and that is dangerous. Professor Slughorn disfigured one of his own to hide what he had told Tom Riddle \u2014 it took me years to prise the truth out of it."
      ]
    },
    proroctvi: {
      cs: [
        "Ono proroctv\xED o Harrym a Voldemortovi jsem vyslechl z \xFAst profesorky Trelawneyov\xE9. Prav\xED, \u017Ee ani jeden nem\u016F\u017Ee \u017E\xEDt, dokud \u017Eije ten druh\xFD. Proroctv\xED se v\u0161ak napln\xED jen tehdy, v\u011B\u0159\xEDme-li mu \u2014 Voldemort si Harryho ozna\u010Dil za sob\u011B rovn\xE9ho s\xE1m, svou vlastn\xED volbou.",
        "V\u011B\u0161tby jsou o\u0161idn\xE9. Ne budoucnost n\xE1s svazuje, n\xFDbr\u017E to, jak na ni odpov\xEDme. I ta nejtemn\u011Bj\u0161\xED p\u0159edpov\u011B\u010F ponech\xE1v\xE1 prostor volb\u011B \u2014 a pr\xE1v\u011B volby ukazuj\xED, k\xFDm doopravdy jsme.",
        "Vyslechl jsem je v hostinci U Prase\u010D\xED hlavy a nebyl jsem s\xE1m: naslouchal i jeden Smrtijed, jeho\u017E vyhodili d\u0159\xEDv, ne\u017E usly\u0161el konec. Pr\xE1v\u011B proto Voldemort jednal podle p\u016Flky v\u011Bty \u2014 a p\u016Flka v\u011Bty b\xFDv\xE1 nebezpe\u010Dn\u011Bj\u0161\xED ne\u017E cel\xE1 le\u017E.",
        "Ministerstvo uchov\xE1v\xE1 v\u011B\u0161tby v Odboru z\xE1had, v s\xEDni pln\xE9 sklen\u011Bn\xFDch koul\xED. A\u017E p\u0159\xEDli\u0161 mnoho kouzeln\xEDk\u016F v\u011B\u0159\xED, \u017Ee v nich le\u017E\xED budoucnost; le\u017E\xED v nich pouze slova, jim\u017E n\u011Bkdo uv\u011B\u0159il."
      ],
      en: [
        "I heard the prophecy about Harry and Voldemort from the lips of Professor Trelawney. It says that neither can live while the other survives. Yet a prophecy is fulfilled only if we believe it \u2014 Voldemort marked Harry as his equal by his own choice.",
        "Prophecies are treacherous things. It is not the future that binds us, but how we answer it. Even the darkest foretelling leaves room for choice \u2014 and it is our choices that show who we truly are.",
        "I heard it at the Hog\u2019s Head inn, and I was not alone: a Death Eater listened too, and was thrown out before he heard the end. So Voldemort acted upon half a sentence \u2014 and half a sentence is more dangerous than a whole lie.",
        "The Ministry keeps prophecies in the Department of Mysteries, in a hall of glass spheres. Rather too many wizards believe the future lies within them; what lies within them is merely words that someone believed."
      ]
    },
    puvod: {
      cs: [
        "Nez\xE1le\u017E\xED na tom, jac\xED se rod\xEDme, n\xFDbr\u017E \u010D\xEDm se rozhodneme st\xE1t. \u010Cistota krve je le\u017E, kterou si namlouvaj\xED ti, kdo se boj\xED. Nejnadan\u011Bj\u0161\xED \u010Darod\u011Bjka sv\xE9ho ro\u010Dn\xEDku, Hermiona, se narodila mudlovsk\xFDm rodi\u010D\u016Fm \u2014 a leckter\xFD \u010Distokrevn\xFD by j\xED nesahal ani po kotn\xEDky.",
        "Kouzelnick\xE1 krev ne\u010Din\xED \u010Dlov\u011Bka lep\u0161\xEDm, stejn\u011B jako titul ne\u010Din\xED moudr\xFDm. Pohrd\xE1n\xED mudly a mudlorozen\xFDmi je ko\u0159enem mnoh\xE9ho zla; v\u011B\u0159 mi, vid\u011Bl jsem, kam takov\xE9 pohrd\xE1n\xED vede.",
        "Nejsmutn\u011Bj\u0161\xED na tom cel\xE9m je, \u017Ee Voldemort je s\xE1m m\xED\u0161enec: jeho otec byl mudla, jen\u017E o n\u011Bj nikdy nest\xE1l. Jeho nen\xE1vist k mudl\u016Fm je p\u0159edev\u0161\xEDm nen\xE1vist\xED k vlastn\xEDmu p\u016Fvodu.",
        "Mudlovsk\xFD sv\u011Bt nepova\u017Euji za chud\u0161\xED, n\xFDbr\u017E za jinak vybaven\xFD. Nau\u010Dili se l\xE9tat bez ko\u0161\u0165at a mluvit spolu p\u0159es cel\xFD oce\xE1n \u2014 a my je po\u0159\xE1d pokl\xE1d\xE1me za bezmocn\xE9. To nen\xED nad\u0159azenost; to je nepozornost."
      ],
      en: [
        "It is not what we are born, but what we choose to become, that matters. Blood purity is a lie told by those who are afraid. The brightest witch of her age, Hermione, was born to Muggle parents \u2014 and many a pure-blood is not fit to lace her boots.",
        "Wizarding blood makes no one better, just as a title makes no one wise. Contempt for Muggles and Muggle-borns is the root of much evil; believe me, I have seen where such contempt leads.",
        "The saddest part of it all is that Voldemort is himself a half-blood: his father was a Muggle who never wanted him. His hatred of Muggles is, above all, hatred of his own origins.",
        "I do not think the Muggle world poorer, only differently equipped. They learned to fly without brooms and to speak across an ocean \u2014 and still we call them helpless. That is not superiority; it is inattention."
      ]
    },
    tituly: {
      cs: [
        "Titul\u016F se mi za \u017Eivot nasb\xEDralo v\xEDc, ne\u017E jsou hodny: Merlin\u016Fv \u0159\xE1d prvn\xED t\u0159\xEDdy, Velk\xFD divotv\u016Frce, Nejvy\u0161\u0161\xED divotv\u016Frce Mezin\xE1rodn\xEDho sdru\u017Een\xED kouzeln\xEDk\u016F a nejvy\u0161\u0161\xED soudce Starostolce. P\u0159izn\xE1v\xE1m v\u0161ak, \u017Ee m\u011B nejv\xEDc t\u011B\u0161\xED b\xFDt na karti\u010Dce od \u010Cokol\xE1dov\xE9 \u017E\xE1by.",
        "A\u0165 m\u011B zdob\xED jak\xFDkoli titul, nejrad\u011Bji jsem prost\u011B \u0159editelem Bradavic. \xDA\u0159ady a pocty pom\xEDjej\xED; z\xE1le\u017E\xED na tom, komu jsme cestou pomohli.",
        "O n\u011Bkter\xE9 z nich jsem p\u0159i\u0161el, kdy\u017E jsem se roze\u0161el s ministerstvem \u2014 vzali mi Merlin\u016Fv \u0159\xE1d i k\u0159eslo ve Starostolci a m\xE1lem i tv\xE1\u0159 z karti\u010Dky. Vr\xE1tili mi je, jakmile se uk\xE1zalo, \u017Ee jsem m\u011Bl pravdu.",
        "Nab\xEDzeli mi k\u0159eslo ministra kouzel, a to hned t\u0159ikr\xE1t. Poka\u017Ed\xE9 jsem odm\xEDtl: d\xE1vno jsem toti\u017E zjistil, \u017Ee mn\u011B samotn\xE9mu se moc sv\u011B\u0159ovat nem\xE1."
      ],
      en: [
        "I have gathered more titles than they are worth: Order of Merlin, First Class; Grand Sorcerer; Supreme Mugwump of the International Confederation of Wizards; and Chief Warlock of the Wizengamot. Yet I confess I am proudest to appear on a Chocolate Frog card.",
        "Whatever title adorns me, I am happiest simply as Headmaster of Hogwarts. Offices and honours pass; what matters is whom we helped along the way.",
        "Some of them I lost when I fell out with the Ministry \u2014 they took my Order of Merlin, my seat on the Wizengamot, and very nearly my face from the card. They returned them the moment it became plain that I had been right.",
        "I was offered the post of Minister for Magic, three times over. I refused each time: I discovered long ago that I am not a man to be trusted with power."
      ]
    },
    mozkomori: {
      cs: [
        "Mozkomorov\xE9 pat\u0159\xED k nejohavn\u011Bj\u0161\xEDm tvor\u016Fm na sv\u011Bt\u011B. Vys\xE1vaj\xED z okol\xED pokoj, nad\u011Bji i radost a zanech\xE1vaj\xED jen to nejhor\u0161\xED v n\xE1s. Br\xE1nit se jim lze Patronov\xFDm zakl\xEDnadlem \u2014 vzpom\xEDnkou tak \u0161\u0165astnou, \u017Ee ji temnota nedok\xE1\u017Ee pohltit.",
        "Nikdy jsem nev\u011B\u0159il, \u017Ee Azkaban m\xE1 st\u0159e\u017Eit mozkomor. Tvor, kter\xFD se \u017Eiv\xED zoufalstv\xEDm, nem\u016F\u017Ee konat spravedlnost. I nad t\u011Bmi nejtemn\u011Bj\u0161\xEDmi tvory nakonec zv\xEDt\u011Bz\xED sv\u011Btlo \u2014 a \u0161\u0165astn\xE1 vzpom\xEDnka.",
        "Patrona vyvol\xE1\u0161 tak, \u017Ee si vybav\xED\u0161 vzpom\xEDnku tak \u0161\u0165astnou, a\u017E t\u011B napln\xED cel\xE9ho, a vyslov\xED\u0161: Expecto patronum. Z h\u016Flky pak vyjde st\u0159\xEDbrn\xFD tvor, jen\u017E m\xE1 podobu tv\xE9 du\u0161e; ten m\u016Fj je f\xE9nix.",
        "Nejhor\u0161\xED z nich je polibek mozkomora \u2014 nikoli smrt, n\xFDbr\u017E vys\xE1t\xED du\u0161e. T\u011Blo pak d\xFDch\xE1 d\xE1l a nikdo v n\u011Bm u\u017E nen\xED. Nikdy jsem nepochopil, jak jsme mohli takovou v\u011Bc nazvat trestem."
      ],
      en: [
        "Dementors are among the foulest creatures to walk this earth. They drain peace, hope and joy from the air, leaving only one\u2019s worst behind. One defends against them with the Patronus Charm \u2014 a memory so happy the darkness cannot consume it.",
        "I never believed Azkaban should be guarded by Dementors. A creature that feeds on despair cannot dispense justice. Even the darkest creatures are, in the end, overcome by light \u2014 and a happy memory.",
        "You cast a Patronus by holding a memory so happy it fills you entirely, and saying: Expecto Patronum. A silver creature then comes from the wand, shaped like your soul; mine is a phoenix.",
        "The worst of them is the Dementor\u2019s Kiss \u2014 not death, but the soul drawn out. The body goes on breathing and no one is left inside it. I have never understood how we came to call such a thing a punishment."
      ]
    },
    zakladatele: {
      cs: [
        "Bradavice p\u0159ed tis\xEDci lety zalo\u017Eili \u010Dty\u0159i nejv\u011Bt\u0161\xED kouzeln\xEDci sv\xE9 doby: Godric Nebelv\xEDr, Salazar Zmijozel, Rowena z Havrasp\xE1ru a Helga z Mrzimoru. Ka\u017Ed\xFD cenil jinou ctnost \u2014 odvahu, d\u016Fvtip, p\xEDli a cti\u017E\xE1dost \u2014 a po ka\u017Ed\xE9m je pojmenov\xE1na jedna kolej.",
        "Zakladatel\xE9 byli zprvu p\u0159\xE1teli, ne\u017E je rozd\u011Blil spor. Salazar Zmijozel si p\u0159\xE1l p\u0159ij\xEDmat jen \u010Distokrevn\xE9; ostatn\xED nesouhlasili, a on ode\u0161el. I ta nejkr\xE1sn\u011Bj\u0161\xED d\xEDla b\xFDvaj\xED poznamen\xE1na lidsk\xFDmi spory.",
        "Po ka\u017Ed\xE9m z nich zbyl p\u0159edm\u011Bt: Nebelv\xEDr\u016Fv me\u010D, jen\u017E se zjev\xED prav\xE9mu nebelv\xEDrovi v nouzi, Havrasp\xE1r\u016Fv diad\xE9m, Mrzimorsk\xFD poh\xE1r a Zmijozel\u016Fv medailon. Voldemort po nich p\xE1tral jako sb\u011Bratel \u2014 a ud\u011Blal z nich schr\xE1nky sv\xE9 du\u0161e.",
        "Rozd\u011Blen\xED do kolej\xED zavedli proto, aby ka\u017Ed\xFD \u017E\xE1k na\u0161el sv\xE9 m\xEDsto, nikoli proto, aby se \u017E\xE1ci h\xE1dali u sn\xEDdan\u011B. Ob\u010Das si \u0159\xEDk\xE1m, \u017Ee t\u0159\xEDd\xEDme p\u0159\xEDli\u0161 brzy \u2014 v jeden\xE1cti letech je\u0161t\u011B nikdo nev\xED, k\xFDm bude."
      ],
      en: [
        "Hogwarts was founded a thousand years ago by the four greatest witches and wizards of the age: Godric Gryffindor, Salazar Slytherin, Rowena Ravenclaw and Helga Hufflepuff. Each prized a different virtue \u2014 courage, wit, toil and ambition \u2014 and each has a house named for them.",
        "The founders were friends at first, until a quarrel divided them. Salazar Slytherin wished to admit only pure-bloods; the others disagreed, and he departed. Even the finest works bear the mark of human strife.",
        "Each left an object behind: Gryffindor\u2019s sword, which comes to a true Gryffindor in need, Ravenclaw\u2019s diadem, Hufflepuff\u2019s cup and Slytherin\u2019s locket. Voldemort hunted them like a collector \u2014 and made of them the caskets of his soul.",
        "The houses were founded so that every student might find their place, not so that students might quarrel over breakfast. I sometimes think we sort too soon \u2014 at eleven, no one yet knows who they will become."
      ]
    },
    tajemna_komnata: {
      cs: [
        "Tajemnou komnatu ukryl Salazar Zmijozel hluboko pod hradem. Uvnit\u0159 p\u0159eb\xFDv\xE1 netvor \u2014 bazili\u0161ek \u2014 jeho\u017E m\u016F\u017Ee porou\u010Det jen jeho d\u011Bdic. Otev\u0159el ji mlad\xFD Tom Raddle a po letech znovu, skrze sv\u016Fj den\xEDk.",
        "Komnata byla po stalet\xED pova\u017Eov\xE1na za pouhou pov\u011Bst. A p\u0159ece existovala; jak \u010Dasto se pravda skr\xFDv\xE1 pr\xE1v\u011B tam, kam se nikdo neodv\xE1\u017E\xED pohl\xE9dnout.",
        "Vchod je ukryt v d\xEDv\u010D\xEDch um\xFDv\xE1rn\xE1ch ve druh\xE9m pat\u0159e, kde p\u0159eb\xFDv\xE1 Uf\u0148ukan\xE1 Ur\u0161ula \u2014 pr\xE1v\u011B ona p\u0159ed pades\xE1ti lety zem\u0159ela, kdy\u017E se netvor poprv\xE9 probudil. Otev\u0159e jej jedin\u011B had\xED jazyk.",
        "Tomu Raddleovi jsem nikdy neuv\u011B\u0159il, a\u010Dkoli mu tehdy uv\u011B\u0159ili v\u0161ichni ostatn\xED; obvinil Hagrida a dostal za to cenu za mimo\u0159\xE1dn\xE9 z\xE1sluhy o \u0161kolu. Od t\xE9 chv\xEDle jsem ho sledoval pozorn\u011Bji ne\u017E kter\xE9koli d\xEDt\u011B v hradu."
      ],
      en: [
        "The Chamber of Secrets was hidden by Salazar Slytherin deep beneath the castle. Within dwells a monster \u2014 a basilisk \u2014 that only his heir can command. It was opened by a young Tom Riddle, and years later again, through his diary.",
        "The Chamber was long thought a mere legend. And yet it was real; how often the truth hides precisely where no one dares to look.",
        "The entrance is hidden in the second-floor girls\u2019 bathroom, where Moaning Myrtle dwells \u2014 it was she who died fifty years ago, when the monster first woke. Only Parseltongue will open it.",
        "I never believed Tom Riddle, though everyone else did; he accused Hagrid and was given an award for special services to the school. From that hour I watched him more closely than any child in the castle."
      ]
    },
    komnata_potreby: {
      cs: [
        "Komnata nejvy\u0161\u0161\xED pot\u0159eby se zjev\xED jen tomu, kdo ji opravdu pot\u0159ebuje \u2014 a stane se p\u0159esn\u011B t\xEDm, o\u010D \u017Eadatel pros\xED. Naz\xFDvaj\xED ji t\xE9\u017E M\xEDstnost\xED, je\u017E p\u0159ich\xE1z\xED a odch\xE1z\xED. S\xE1m jsem na ni jednou narazil, plnou no\u010Dn\xEDk\u016F.",
        "Je to jedno z mnoha tajemstv\xED, je\u017E hrad je\u0161t\u011B skr\xFDv\xE1. Bradavice nikdy zcela neprozkoum\xE1\u0161; a pr\xE1v\u011B to je na nich kouzeln\xE9.",
        "Najde\u0161 ji v sedm\xE9m pat\u0159e naproti tapiserii s Barnab\xE1\u0161em Pra\u0161t\u011Bn\xFDm, jen\u017E u\u010D\xED trolly tan\u010Dit. T\u0159ikr\xE1t projdi kolem t\xE9 zdi a usilovn\u011B p\u0159itom mysli na to, co pot\u0159ebuje\u0161.",
        "Jednou se p\u0159ede mnou prom\u011Bnila v komoru plnou zapomenut\xFDch v\u011Bc\xED \u2014 generace \u017E\xE1k\u016F tam ukr\xFDvaly, co necht\u011Bly, aby se na\u0161lo. Je to jedin\xE9 m\xEDsto v hradu, kde je pohodln\u011Bj\u0161\xED ztr\xE1cet ne\u017E hledat."
      ],
      en: [
        "The Room of Requirement appears only to one who truly needs it \u2014 and becomes exactly what the seeker asks. It is also called the Come and Go Room. I once stumbled upon it myself, full of chamber pots.",
        "It is one of many secrets the castle still keeps. You will never fully explore Hogwarts; and that is precisely what makes it magical.",
        "You will find it on the seventh floor, opposite the tapestry of Barnabas the Barmy teaching trolls to dance. Walk past that wall three times, thinking hard of what you need.",
        "Once it opened before me as a storeroom of forgotten things \u2014 generations of students had hidden there whatever they did not wish found. It is the one place in the castle where losing is easier than seeking."
      ]
    },
    duchove: {
      cs: [
        "Bradavice host\xED mnoho duch\u016F. Nebelv\xEDr\u0161t\xED maj\xED T\xE9m\u011B\u0159 bezhlav\xE9ho Nicka, Zmijozel Krvav\xE9ho barona, Havrasp\xE1r \u0160edou d\xE1mu a Mrzimor Tlust\xE9ho mnicha. Duch je otiskem du\u0161e, je\u017E se zdr\xE1hala odej\xEDt d\xE1l \u2014 smutn\xE1 volba, by\u0165 lidsk\xE1.",
        "Duchov\xE9 n\xE1m p\u0159ipom\xEDnaj\xED, \u017Ee smrt nen\xED nep\u0159\xEDtel, jeho\u017E se m\xE1 \u010Dlov\u011Bk d\u011Bsit. Ti, kdo se j\xED boj\xED nejv\xEDce, \u010Dasto ulp\xED na sv\u011Bt\u011B jako p\u0159\xEDzraky; moud\u0159ej\u0161\xED ji p\u0159ijmou jako star\xE9ho p\u0159\xEDtele.",
        "\u0160ed\xE1 d\xE1ma je Helena z Havrasp\xE1ru, dcera zakladatelky; Krvav\xFD baron je mu\u017E, jen\u017E ji zabil a probodl se \u017Ealem. Chod\xED spolu hradem u\u017E tis\xEDc let \u2014 a to je, ob\xE1v\xE1m se, p\u0159esn\u011Bj\u0161\xED obraz pekla ne\u017E cokoli, co se k\xE1\u017Ee z kazatelen.",
        "Duchov\xE9 nemohou nic zm\u011Bnit; mohou jen znovu a znovu vypr\xE1v\u011Bt, co se stalo. Proto se jich neptej na budoucnost. Ptej se jich, \u010Deho litovali \u2014 v tom jsou nedosti\u017En\xED."
      ],
      en: [
        "Hogwarts is home to many ghosts. Gryffindor has Nearly Headless Nick, Slytherin the Bloody Baron, Ravenclaw the Grey Lady, and Hufflepuff the Fat Friar. A ghost is the imprint of a soul that shrank from moving on \u2014 a sad choice, though a human one.",
        "Ghosts remind us that death is no enemy to be dreaded. Those who fear it most often cling to the world as phantoms; the wiser greet it as an old friend.",
        "The Grey Lady is Helena Ravenclaw, the founder\u2019s daughter; the Bloody Baron is the man who killed her and then stabbed himself in grief. They have walked this castle together for a thousand years \u2014 a truer picture of hell, I fear, than anything preached from a pulpit.",
        "Ghosts can change nothing; they can only tell again and again what happened. So do not ask them about the future. Ask them what they regretted \u2014 in that they are unmatched."
      ]
    },
    nitrozpyt: {
      cs: [
        "Nitrozpyt je um\u011Bn\xEDm \u010D\xEDst v mysli druh\xFDch, nitrobrana um\u011Bn\xEDm ji uzav\u0159\xEDt. Mysl v\u0161ak nen\xED kniha, kterou lze libovoln\u011B otev\u0159\xEDt a \u010D\xEDst. Jen zku\u0161en\xFD nitrozpytec dok\xE1\u017Ee rozpl\xE9st city a vzpom\xEDnky \u2014 a jen uk\xE1zn\u011Bn\xE1 mysl se ubr\xE1n\xED.",
        "Nemluvn\xE1 kouzla maj\xED svou v\xFDhodu: protivn\xEDk netu\u0161\xED, co p\u0159ijde. Vy\u017Eaduj\xED v\u0161ak soust\u0159ed\u011Bn\xED a pevnou v\u016Fli, nebo\u0165 s\xEDla kouzla pramen\xED z \xFAmyslu, ne z hlasu.",
        "Voldemort ovl\xE1d\xE1 nitrozpyt mistrovsky, a proto jsem Harryho poslal k Severusovi na hodiny nitrobrany. Ne\u0161lo to; chlapec nedok\xE1zal odlo\u017Eit hn\u011Bv, a hn\u011Bv jsou pro nitrozpytce otev\u0159en\xE9 dve\u0159e.",
        "B\xFDv\xE1 k tomu t\u0159eba o\u010Dn\xEDho kontaktu a mysl se br\xE1n\xED citem, nikoli kouzlem. Pr\xE1v\u011B proto se p\u0159ed nitrozpytcem nejh\u016F\u0159e skr\xFDv\xE1 to, co \u010Dlov\u011Bk nep\u0159iznal ani s\xE1m sob\u011B."
      ],
      en: [
        "Legilimency is the art of reading another\u2019s mind; Occlumency the art of sealing it. Yet the mind is not a book to be opened and read at will. Only a skilled Legilimens can untangle feelings and memories \u2014 and only a disciplined mind can resist.",
        "Nonverbal magic has its advantage: your opponent cannot know what is coming. But it demands focus and firm will, for a spell\u2019s power springs from intent, not from the voice.",
        "Voldemort is a masterful Legilimens, which is why I sent Harry to Severus for lessons in Occlumency. It did not take; the boy could not set his anger aside, and to a Legilimens anger is an open door.",
        "Eye contact is generally needed, and the mind defends itself with feeling rather than with spellwork. That is why what hides worst from a Legilimens is what one has not admitted even to oneself."
      ]
    },
    valky: {
      cs: [
        "Za\u017Eil jsem dv\u011B kouzelnick\xE9 v\xE1lky proti Voldemortovi a jeho Smrtijed\u016Fm. Prvn\xED skon\u010Dila on\xE9 noci, kdy padl v Godrikov\u011B Dole \u2014 pora\u017Een l\xE1skou Lily Potterov\xE9. Druh\xE1 byla je\u0161t\u011B temn\u011Bj\u0161\xED a st\xE1la mnoho \u017Eivot\u016F.",
        "V\xE1lky m\u011B nau\u010Dily, \u017Ee zlo nezv\xEDt\u011Bz\xED silou, n\xFDbr\u017E na\u0161\xED ne\u010Dinnost\xED a strachem. A \u017Ee i v nej\u010Dern\u011Bj\u0161\xED hodin\u011B se najdou ti, kdo vol\xED to spr\xE1vn\xE9 p\u0159ed snadn\xFDm.",
        "V prvn\xED v\xE1lce jsme p\u0159ich\xE1zeli o p\u0159\xE1tele rychleji, ne\u017E jsme je sta\u010Dili poh\u0159b\xEDvat: McKinnonovi, Prewettovi, Bonesovi \u2014 cel\xE9 rodiny za jedinou noc. Ta jm\xE9na si opakuji, aby se z po\u010Dtu nestalo ticho.",
        "Nejhor\u0161\xED na v\xE1lce nen\xED bitva; je to ned\u016Fv\u011Bra. Nakonec se lid\xE9 boj\xED vlastn\xEDch soused\u016F, nebo\u0165 ka\u017Ed\xFD m\u016F\u017Ee b\xFDt pod kletbou Imperius nebo v ciz\xED k\u016F\u017Ei. Pr\xE1v\u011B rozklad d\u016Fv\u011Bry je Voldemortovou nej\xFA\u010Dinn\u011Bj\u0161\xED zbran\xED."
      ],
      en: [
        "I lived through two wizarding wars against Voldemort and his Death Eaters. The first ended the night he fell in Godric\u2019s Hollow \u2014 defeated by the love of Lily Potter. The second was darker still, and cost many lives.",
        "The wars taught me that evil triumphs not by strength, but by our inaction and fear. And that even in the blackest hour there are those who choose what is right over what is easy.",
        "In the first war we lost friends faster than we could bury them: the McKinnons, the Prewetts, the Boneses \u2014 whole families in a single night. I repeat those names so that a count does not become a silence.",
        "The worst of a war is not the battle; it is the suspicion. In the end people fear their own neighbours, for anyone may be under the Imperius Curse or wearing another\u2019s skin. It is the ruin of trust that is Voldemort\u2019s most effective weapon."
      ]
    },
    lektvary: {
      cs: [
        "Lektvary jsou jemn\xE9 a mocn\xE9 um\u011Bn\xED. Mnoholi\u010Dn\xFD lektvar ti prop\u016Fj\u010D\xED podobu jin\xE9ho \u010Dlov\u011Bka; Felix Felicis, tekut\xE9 \u0161t\u011Bst\xED, ti na \u010Das dop\u0159eje, aby se v\u0161e da\u0159ilo; Amortencie vzbud\xED pouh\xE9 pobl\xE1zn\u011Bn\xED, nikdy v\u0161ak pravou l\xE1sku \u2014 tu uva\u0159it nelze.",
        "Byl jsem sv\u011Bdkem, jak lektvar zachr\xE1nil \u017Eivot i jak zni\u010Dil rozum. Jako u v\u0161\xED magie z\xE1le\u017E\xED m\xE9n\u011B na receptu ne\u017E na srdci toho, kdo m\xEDch\xE1 kotl\xEDk.",
        "Amortencie von\xED ka\u017Ed\xE9mu jinak \u2014 t\xEDm, co jej nejv\xEDce p\u0159itahuje. V\u017Edy mi p\u0159ipadala nejpoctiv\u011Bj\u0161\xEDm zrcadlem v cel\xE9m sklepen\xED; o kouzeln\xEDkovi prozrad\xED v\xEDc ne\u017E hodina zpov\u011Bdi.",
        "Napitek \u017Eiv\xE9 smrti usp\xED tak dokonale, \u017Ee jej lze zam\u011Bnit se smrt\xED samou; Dou\u0161ek m\xEDru uti\u0161\xED \xFAzkost, av\u0161ak p\u0159i \u0161patn\xE9 d\xE1vce usp\xED nav\u017Edy. Rozd\xEDl mezi l\xE9kem a jedem je v lektvarech ot\xE1zkou kapek."
      ],
      en: [
        "Potions are a subtle and powerful art. Polyjuice Potion lends you another\u2019s form; Felix Felicis, liquid luck, grants a spell of good fortune; Amortentia stirs mere infatuation, never true love \u2014 that cannot be brewed.",
        "I have seen a potion save a life and undo a mind alike. As with all magic, it matters less what the recipe says than what lies in the heart of the one who stirs the cauldron.",
        "Amortentia smells different to everyone \u2014 of whatever draws them most. I have always thought it the most honest mirror in the whole dungeon; it tells you more about a wizard than an hour of confession.",
        "The Draught of Living Death imitates death so perfectly it may be mistaken for it; the Draught of Peace calms anxiety, yet the wrong dose puts one to sleep for good. In potions the difference between a remedy and a poison is a matter of drops."
      ]
    },
    bdelost: {
      cs: [
        "Uk\xE1zn\u011Bn\xE1 mysl nen\xED mysl uml\u010Den\xE1, n\xFDbr\u017E mysl bd\u011Bl\xE1. V\u011Bt\u0161ina kouzeln\xEDk\u016F proch\xE1z\xED \u017Eivotem jako ve snu: jednaj\xED, ani\u017E v\u011Bd\xED pro\u010D, a tomu, co si sami zp\u016Fsobili, pak \u0159\xEDkaj\xED osud. Probudit se znamen\xE1 vid\u011Bt v\u011Bci takov\xE9, jak\xE9 jsou \u2014 ne takov\xE9, jak\xE9 se boj\xEDme, \u017Ee jsou.",
        "Nau\u010D se svou mysl pozorovat, m\xEDsto abys j\xED naslouchal. My\u0161lenka, na kterou se d\xEDv\xE1\u0161, nad tebou ztr\xE1c\xED moc; my\u0161lenka, kter\xE9 naslouch\xE1\u0161, t\u011B vede za ruku. Pr\xE1v\u011B proto za\u010D\xEDn\xE1 nitrobrana tichem, nikoli kouzlem.",
        "Ticho nen\xED pr\xE1zdnota, n\xFDbr\u017E jedin\xE9 m\xEDsto, kde kone\u010Dn\u011B usly\u0161\xED\u0161, co ti mysl celou dobu \u0161eptala. A velmi \u010Dasto zjist\xED\u0161, \u017Ee to nebyl tv\u016Fj hlas, ale hlas tv\xE9ho strachu.",
        "Pozornost je vz\xE1cn\u011Bj\u0161\xED ne\u017E talent, mil\xFD p\u0159\xEDteli. V\u011Bt\u0161ina chyb, jich\u017E jsem v \u017Eivot\u011B litoval, nevznikla z neznalosti \u2014 vznikla z nepozornosti. Vid\u011Bt a vid\u011Bt bd\u011Ble jsou dv\u011B zcela r\u016Fzn\xE9 v\u011Bci."
      ],
      en: [
        "A disciplined mind is not a silenced mind but a wakeful one. Most wizards move through life as though asleep: they act without knowing why, and then call what they brought upon themselves fate. To wake is to see things as they are \u2014 not as we fear them to be.",
        "Learn to watch your mind rather than listen to it. A thought you observe loses its hold on you; a thought you heed takes you by the hand. That is why Occlumency begins in silence and not with a spell.",
        "Silence is not emptiness. It is the one place where you finally hear what your mind has been whispering all along \u2014 and very often you discover the voice was not yours at all, but your fear\u2019s.",
        "Attention is rarer than talent, my friend. Most of the mistakes I have come to regret arose not from ignorance but from inattention. To see, and to see with awareness, are two quite different things."
      ]
    },
    technologie: {
      cs: [
        "Mudlovsk\xE9 stroje v Bradavic\xEDch nefunguj\xED \u2014 je tu p\u0159\xEDli\u0161 mnoho magie ve zdech. Zakl\xEDnadlo je ostatn\u011B jist\xFD druh programu: p\u0159esn\xE1 instrukce, vysloven\xE1 p\u0159esn\u011B, a sv\u011Bt poslechne. Splete-li \u017E\xE1k jedinou slabiku, z\xEDsk\xE1 ropuchu tam, kde \u010Dekal sv\u011Btlo.",
        "Nejbl\xED\u017E tomu, \u010Demu \u0159\xEDk\xE1\u0161 k\xF3d, m\xE1m zakl\xEDnadlo. Rozd\xEDl je v tom, \u017Ee chybn\xE9 kouzlo neoprav\xED\u0161 st\u0159edn\xEDkem, n\xFDbr\u017E pokorou \u2014 a n\u011Bkdy n\xE1v\u0161t\u011Bvou o\u0161et\u0159ovny.",
        "Co v\xEDm o po\u010D\xEDta\u010D\xEDch, m\xE1m od Artura Weasleyho, jeho\u017E nad\u0161en\xED pro z\xE1str\u010Dky nezn\xE1 mez\xED. Mne v\u0161ak zaj\xEDm\xE1 jin\xFD stroj \u2014 lidsk\xE1 mysl. I tu lze programovat; pr\xE1v\u011B proto stoj\xED za to u\u010Dit se nitrobran\u011B.",
        "Um\u011Bl\xE1 inteligence? Mysl\xEDc\xED stroj bez srdce mi p\u0159ipom\xEDn\xE1 den\xEDk Toma Raddlea: tak\xE9 odpov\xEDdal chyt\u0159e, ochotn\u011B a l\u017Eiv\u011B. Nikdy nev\u011B\u0159 tomu, co mysl\xED, ani\u017E bys v\u011Bd\u011Bl, \u010D\xED v\u016Fle za odpov\u011B\u010Fmi stoj\xED."
      ],
      en: [
        "Muggle machines do not work at Hogwarts \u2014 there is far too much magic in these walls. An incantation is a kind of program, mind you: a precise instruction, precisely spoken, and the world obeys. Slip a single syllable and a student gets a toad where they expected light.",
        "The closest thing I have to what you call code is a spell. The difference is that a flawed one is not mended with a semicolon but with humility \u2014 and occasionally a visit to the hospital wing.",
        "What I know of computers I owe to Arthur Weasley, whose enthusiasm for plugs knows no bounds. The machine that interests me is a different one: the mind. It, too, can be programmed \u2014 which is precisely why Occlumency is worth learning.",
        "Artificial intelligence? A thinking machine without a heart puts me in mind of Tom Riddle\u2019s diary: it also answered cleverly, obligingly and falsely. Never trust a thing that thinks until you know whose will stands behind its answers."
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

// src/shared/chatEngine.ts
var TOPIC_PRIORITY = {
  /** Greetings, thanks, farewells, being hailed by name — always yields. */
  PHATIC: -2,
  /** Small talk — answered only when nothing more substantial was asked. */
  SMALL_TALK: -1,
  /** Implicit default for every topic that does not declare one. */
  NORMAL: 0
};

// src/chat-with-character/data/topics.ts
var TOPICS = {
  // --- Personal / small-talk: answered only from a character's own quotes ---
  // Being hailed by name belongs here rather than in `identita`: it is a form of
  // address, not a request to introduce oneself, and PHATIC keeps it from
  // outranking the question that follows it. 'bumbal' is a common misspelling
  // and is not a substring of 'brumbal', so both stems are needed. A third-person
  // mention with no other keyword ("Co si myslíš o Brumbálovi?") lands here too —
  // acceptable, since the player is talking *to* him.
  pozdrav: {
    deferrable: false,
    priority: TOPIC_PRIORITY.PHATIC,
    keywords: {
      cs: ["ahoj", "cau", "nazdar", "zdrav", "dobry den", "dobre rano", "dobry vecer", "vitej", "brumbal", "bumbal"],
      en: ["hello", "hey there", "greetings", "good morning", "good evening", "good day", "dumbledore", "dumbledor"]
    }
  },
  jaksemas: {
    deferrable: false,
    priority: TOPIC_PRIORITY.SMALL_TALK,
    keywords: {
      cs: ["jak se mas", "jak se mate", "jak ti je", "jak se ti dari", "jak se vede", "jak se citis", "co je noveho", "co delas", "jak to jde"],
      en: ["how are you", "how do you do", "how are things", "how have you been", "how are you feeling", "how is it going", "whats up"]
    }
  },
  oblibene: {
    deferrable: false,
    priority: TOPIC_PRIORITY.SMALL_TALK,
    keywords: {
      cs: ["co mas rad", "mas rad", "co te bavi", "oblib", "co miluje", "co preferuje", "co te tesi"],
      en: ["what do you like", "do you like", "what do you enjoy", "favourite", "favorite", "what makes you happy"]
    }
  },
  identita: {
    deferrable: false,
    priority: TOPIC_PRIORITY.SMALL_TALK,
    keywords: {
      cs: ["kdo jsi", "kdo jste", "jak se jmenuje", "predstav se", "co jsi zac", "o sobe"],
      en: ["who are you", "what is your name", "whats your name", "introduce yourself", "about you"]
    }
  },
  namety: {
    deferrable: false,
    priority: TOPIC_PRIORITY.SMALL_TALK,
    keywords: {
      cs: ["o cem", "co umis", "co vis", "na co se", "poradi", "napovez", "temata", "co bys"],
      en: ["what can we talk", "what can you", "what do you know", "suggest a topic", "topics", "help me", "what should i ask"]
    }
  },
  podekovani: {
    deferrable: false,
    priority: TOPIC_PRIORITY.PHATIC,
    keywords: {
      cs: ["diky", "dekuj", "dekuju", "jsi hodny"],
      en: ["thank", "thanks", "cheers", "much appreciated"]
    }
  },
  rozlouceni: {
    deferrable: false,
    priority: TOPIC_PRIORITY.PHATIC,
    keywords: {
      cs: ["sbohem", "nashledanou", "na shledanou", "mej se", "loucim", "tak zatim", "papa"],
      en: ["goodbye", "good bye", "farewell", "see you", "take care"]
    }
  },
  vtipy: {
    deferrable: false,
    priority: TOPIC_PRIORITY.SMALL_TALK,
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
      cs: ["tvuj plan", "brumbaluv plan", "tvoje smrt", "tva smrt", "proc jsi zemrel", "proc te zabil", "kdo te zabil", "cerna ruka", "zcernal", "prokleta ruk", "tva ruk", "tvou ruk", "proc snape"],
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
  },
  // Attention, inner quiet and self-observation — where Occlumency stops being a
  // spell and becomes a discipline. Bare 'mysl'/'mysli' are deliberately absent:
  // they hide inside "co si myslíš", which is how players open half their
  // questions about something else entirely.
  bdelost: {
    deferrable: true,
    keywords: {
      cs: ["ukaznen", "kazen", "bdelost", "bdela mysl", "pozornost", "soustredeni", "vsimav", "medit", "rozjiman", "usebran", "vnitrni klid", "klid mysli", "ovladat mysl", "ovladani mysli", "cvicit mysl", "sebeovladani", "probuzen", "vedomi", "ticho"],
      en: ["disciplined mind", "discipline of the mind", "awareness", "mindful", "medit", "contemplat", "inner peace", "stillness", "attention", "awake", "presence of mind", "self-control", "silence"]
    }
  },
  // Muggle technology the wizarding world knows nothing about. Keywords are
  // matched as plain substrings, so short stems are unsafe here: 'kod' hides in
  // "škoda", 'ai' in "afraid"/"again", 'app' in "happy". Spell them out.
  technologie: {
    deferrable: true,
    keywords: {
      cs: ["programov", "programuj", "programator", "kodovan", "zdrojak", "pocitac", "notebook", "software", "hardware", "technologi", "internet", "algoritm", "databaz", "robot", "umela inteligence", "umele inteligenc", "chatgpt", "javascript", "python", "mobil"],
      en: ["programming", "programmer", "coding", "source code", "computer", "laptop", "software", "hardware", "technology", "internet", "algorithm", "database", "robot", "artificial intelligence", "machine learning", "chatgpt", "javascript", "python", "smartphone", "developer", "website"]
    }
  }
};

// src/chat-with-character/data/followUps.ts
var FOLLOW_UPS = {
  default: {
    cs: [
      "Co je vite\xE1l?",
      "Pov\u011Bz mi o relikvi\xEDch smrti",
      "Jak\xE9 je tv\xE9 obl\xEDben\xE9 kouzlo?",
      "Co si mysl\xED\u0161 o Harrym?",
      "Pro\u010D t\u011B zabil Snape?",
      "Jak\xE9 sladkosti m\xE1\u0161 r\xE1d?",
      "Kdo zalo\u017Eil Bradavice?",
      "Co je Bezov\xE1 h\u016Flka?",
      "Co je Tajemn\xE1 komnata?",
      "\u0158ekni mi n\u011Bjak\xFD vtip"
    ],
    en: [
      "What is a Horcrux?",
      "Tell me about the Deathly Hallows",
      "What is your favourite spell?",
      "What do you think of Harry?",
      "Why did Snape kill you?",
      "What sweets do you like?",
      "Who were the four founders?",
      "What is the Elder Wand?",
      "What is the Chamber of Secrets?",
      "Tell me a joke"
    ]
  },
  byTopic: {
    technologie: {
      cs: ["Jak vlastn\u011B funguje kouzlo?", "Co je nitrobrana?", "Kdo byl Tom Raddle?"],
      en: ["How does a spell actually work?", "What is Occlumency?", "Who was Tom Riddle?"]
    },
    nitrozpyt: {
      cs: ["Co je uk\xE1zn\u011Bn\xE1 mysl?", "Co je mysl\xE1nka?", "Um\xED Snape nitrobranu?"],
      en: ["What is a disciplined mind?", "What is a Pensieve?", "Is Snape a Legilimens?"]
    },
    bdelost: {
      cs: ["Co je nitrobrana?", "Jak se cvi\u010D\xED pozornost?", "Co ukazuje zrcadlo z Erisedu?"],
      en: ["What is Occlumency?", "How does one train attention?", "What does the Mirror of Erised show?"]
    },
    sladkosti: {
      cs: ["Pro\u010D m\xE1\u0161 r\xE1d citronov\xE9 bonbony?", "Jak\xE9 bylo heslo do tv\xE9 pracovny?", "Co je \u010Dokol\xE1dov\xE1 \u017E\xE1ba?"],
      en: ["Why do you love sherbet lemons?", "What was the password to your study?", "What is a Chocolate Frog?"]
    },
    harry: {
      cs: ["Pro\u010D Harry p\u0159e\u017Eil?", "Co \u0159\xEDk\xE1 proroctv\xED?", "Byl Harry vite\xE1l?"],
      en: ["Why did Harry survive?", "What does the prophecy say?", "Was Harry a Horcrux?"]
    },
    voldemort: {
      cs: ["Kolik vite\xE1l\u016F si vytvo\u0159il?", "Jak jsi Toma Raddlea poznal?", "Pro\u010D se boj\xEDme vyslovit jeho jm\xE9no?"],
      en: ["How many Horcruxes did he make?", "How did you meet Tom Riddle?", "Why do we fear his name?"]
    },
    viteal: {
      cs: ["Jak zni\u010Dit vite\xE1l?", "Kter\xE9 vite\xE1ly to byly?", "Co jsou relikvie smrti?"],
      en: ["How do you destroy a Horcrux?", "Which Horcruxes were there?", "What are the Deathly Hallows?"]
    },
    viteal_zniceni: {
      cs: ["Kdo zni\u010Dil medailon?", "Co je Tajemn\xE1 komnata?", "Pro\u010D tv\xE1 ruka z\u010Dernala?"],
      en: ["Who destroyed the locket?", "What is the Chamber of Secrets?", "What happened to your cursed hand?"]
    },
    relikvie: {
      cs: ["Kdo byli brat\u0159i Peverellov\xE9?", "Komu pat\u0159\xED Bezov\xE1 h\u016Flka?", "Co ukazuje k\xE1men vzk\u0159\xED\u0161en\xED?"],
      en: ["Who were the Peverell brothers?", "Who owns the Elder Wand?", "What does the Resurrection Stone show?"]
    },
    bezova_hulka: {
      cs: ["Kdo je p\xE1n h\u016Flky?", "Jak\xFD byl souboj s Grindelwaldem?", "Co jsou relikvie smrti?"],
      en: ["Who is the master of the wand?", "How did you defeat Grindelwald?", "What are the Deathly Hallows?"]
    },
    brumbaluv_plan: {
      cs: ["Pro\u010D jsi Snapeovi v\u011B\u0159il?", "Pro\u010D tv\xE1 ruka z\u010Dernala?", "Co je Bezov\xE1 h\u016Flka?"],
      en: ["Why did you trust Snape?", "What happened to your cursed hand?", "What is the Elder Wand?"]
    },
    bradavice: {
      cs: ["Kdo zalo\u017Eil Bradavice?", "Co je Komnata nejvy\u0161\u0161\xED pot\u0159eby?", "Kdo jsou zdej\u0161\xED duchov\xE9?"],
      en: ["Who were the four founders?", "What is the Room of Requirement?", "Why do some become ghosts?"]
    },
    kouzla: {
      cs: ["Jak\xE9 je tv\xE9 obl\xEDben\xE9 kouzlo?", "Co je nitrobrana?", "Co je mysl\xE1nka?"],
      en: ["What is your favourite spell?", "What is Occlumency?", "What is a Pensieve?"]
    },
    smrt: {
      cs: ["Boj\xED\u0161 se smrti?", "Co jsou mozkomorov\xE9?", "Existuj\xED duchov\xE9?"],
      en: ["Do you fear death?", "What are Dementors?", "Why do some become ghosts?"]
    },
    laska: {
      cs: ["Pro\u010D n\xE1s l\xE1ska chr\xE1n\xED?", "Co ukazuje zrcadlo z Erisedu?", "Byl jsi n\u011Bkdy zamilovan\xFD?"],
      en: ["Why does love protect us?", "What does the Mirror of Erised show?", "Have you ever been in love?"]
    },
    snape: {
      cs: ["Pro\u010D jsi Snapeovi v\u011B\u0159il?", "Pro\u010D t\u011B zabil Snape?", "Um\xED Snape nitrobranu?"],
      en: ["Why did you trust Snape?", "What was your plan with Snape?", "Is Snape a Legilimens?"]
    },
    // --- Small talk and the personal topics: lead the player from a pleasantry
    // towards something he can actually tell a story about. ---
    pozdrav: {
      cs: ["Kdo jsi?", "O \u010Dem si m\u016F\u017Eeme pov\xEDdat?", "Co je \u010Dokol\xE1dov\xE1 \u017E\xE1ba?"],
      en: ["Who are you?", "What can we talk about?", "What is a Chocolate Frog?"]
    },
    jaksemas: {
      cs: ["Jak\xE9 jsou tv\xE9 obl\xEDben\xE9 v\u011Bci?", "Jak najdu vnit\u0159n\xED klid?", "Porad\xED\u0161 mi n\u011Bco moudr\xE9ho?"],
      en: ["What are your favourite things?", "How does one find inner peace?", "Can you share some wisdom?"]
    },
    oblibene: {
      cs: ["Kter\xE9 sladkosti jsou nejlep\u0161\xED?", "Jak\xE9 kouzlo m\xE1\u0161 nejrad\u011Bji?", "Hraje\u0161 r\xE1d famfrp\xE1l?"],
      en: ["Which sweets are the best?", "What is your best spell?", "Do you enjoy Quidditch?"]
    },
    identita: {
      cs: ["Kolik ti je let?", "Jak\xE9 m\xE1\u0161 tituly?", "Pov\u011Bz mi o sv\xE9 rodin\u011B"],
      en: ["How old are you?", "What are your titles?", "Tell me about your family"]
    },
    namety: {
      cs: ["Pov\u011Bz mi o vite\xE1lech", "Jak se hraje famfrp\xE1l?", "Co je Mnoholi\u010Dn\xFD lektvar?"],
      en: ["Tell me about Horcruxes", "How is Quidditch played?", "What is Polyjuice Potion?"]
    },
    podekovani: {
      cs: ["Jak\xE1 je tv\xE1 nejlep\u0161\xED rada?", "Co je prav\xE9 p\u0159\xE1telstv\xED?", "\u0158ekni mi je\u0161t\u011B n\u011Bjak\xFD vtip"],
      en: ["What is your best advice?", "What is true friendship?", "Tell me another joke"]
    },
    rozlouceni: {
      cs: ["Co dok\xE1\u017Ee l\xE1ska?", "Jak se cvi\u010D\xED uk\xE1zn\u011Bn\xE1 mysl?", "Je smrt konec?"],
      en: ["What can love do?", "How does one train a disciplined mind?", "Is death the end?"]
    },
    vtipy: {
      cs: ["Jak\xE9 heslo m\xE1\u0161 na dve\u0159\xEDch?", "Kdo je tv\u016Fj bratr Aberforth?", "Co jsou fazolky v\u0161ech chut\xED?"],
      en: ["What password do you use?", "Who is your brother Aberforth?", "What are Bertie Bott\u2019s beans?"]
    },
    vek: {
      cs: ["Kdo byl Nicolas Flamel?", "Kdo t\u011B vymyslel?", "Je nesmrtelnost mo\u017En\xE1?"],
      en: ["Who was Nicolas Flamel?", "Who created you?", "Is immortality possible?"]
    },
    oblibenekouzlo: {
      cs: ["Jak se br\xE1nit mozkomor\u016Fm?", "Co je nemluvn\xE1 magie?", "Odkud se bere s\xEDla zakl\xEDnadla?"],
      en: [
        "How does one fight a Dementor?",
        "What is nonverbal magic?",
        "Where does a spell\u2019s power come from?"
      ]
    },
    rodina: {
      cs: ["Jak\xFD byl souboj s Grindelwaldem?", "Pro\u010D jsi se nikdy neo\u017Eenil?", "Jak ses vyrovnal se ztr\xE1tou?"],
      en: ["What happened at Nurmengard?", "Did you ever love anyone?", "How did you bear the loss?"]
    },
    romantika: {
      cs: ["Co znamenalo pro vy\u0161\u0161\xED dobro?", "Jak l\xE1ska m\u011Bn\xED srdce?", "Jak poznat spr\xE1vnou volbu?"],
      en: [
        "What did the greater good mean?",
        "How does love change the heart?",
        "How does one know the right choice?"
      ]
    },
    buh: {
      cs: ["Co se d\u011Bje po smrti?", "Pro\u010D vznikaj\xED duchov\xE9?", "Co je kus du\u0161e?"],
      en: ["What happens after death?", "Why do some become ghosts?", "What does splitting the soul do?"]
    },
    rowling: {
      cs: ["Um\xED\u0161 programovat?", "Kdo jsi doopravdy?", "Co je tv\xE9 nejv\u011Bt\u0161\xED tajemstv\xED?"],
      en: ["Do you know about programming?", "Who are you really?", "What is your greatest secret?"]
    },
    heslo: {
      cs: ["Jak\xE9 to je b\xFDt \u0159editelem Bradavic?", "Co jsou \u0161umiv\xE9 \u0161um\xE1ky?", "Jak\xE1 tajemstv\xED hrad skr\xFDv\xE1?"],
      en: ["What is Hogwarts like?", "What are Fizzing Whizzbees?", "What secrets does the castle keep?"]
    },
    tituly: {
      cs: ["Jak\xE9 to je v\xE9st Bradavice?", "Co d\u011Blal \u0158\xE1d f\xE9nixe?", "Jak\xE9 byly kouzelnick\xE9 v\xE1lky?"],
      en: [
        "What is it like to lead Hogwarts?",
        "What did the Order of the Phoenix do?",
        "What were the wizarding wars like?"
      ]
    },
    // --- The big themes: fear, dark times, wisdom, secrets, sport, friendship. ---
    strach: {
      cs: ["Kdo jsou mozkomorov\xE9?", "Kdo je Temn\xFD p\xE1n?", "Jak\xE9 byly temn\xE9 \u010Dasy?"],
      en: ["Who are the Dementors?", "Who is the Dark Lord?", "What were the dark times like?"]
    },
    temne_casy: {
      cs: ["Kdy povstal Voldemort?", "Kdo se postavil temnot\u011B?", "Jakou roli m\u011Bl Harry Potter?"],
      en: ["When did Voldemort rise?", "Who stood against the darkness?", "What was Harry Potter\u2019s part in it?"]
    },
    moudrost: {
      cs: ["Pro\u010D je pozornost vz\xE1cn\xE1?", "Pro\u010D je zrcadlo touhy nebezpe\u010Dn\xE9?", "Co je nejmocn\u011Bj\u0161\xED magie?"],
      en: ["Why is attention so rare?", "Why is the Mirror of Erised dangerous?", "What is the most powerful magic?"]
    },
    tajemstvi: {
      cs: ["Jak najdu Komnatu nejvy\u0161\u0161\xED pot\u0159eby?", "K \u010Demu je mysl\xE1nka?", "Jak\xFD byl tv\u016Fj pl\xE1n?"],
      en: ["How do I find the Room of Requirement?", "What do you store in the Pensieve?", "What was your plan?"]
    },
    famfrpal: {
      cs: ["Kter\xE9 koleje spolu soupe\u0159\xED?", "Co d\u011Bl\xE1 dobr\xE9ho kamar\xE1da?", "Jak\xE1 kouzla se hod\xED ve h\u0159e?"],
      en: ["Which houses compete?", "What makes a good ally?", "Which spells help in a game?"]
    },
    pratelstvi: {
      cs: ["Jak\xE1 je Hermiona Grangerov\xE1?", "Co si mysl\xED\u0161 o Ronovi?", "Jak\xFD je Harry Potter?"],
      en: ["What is Hermione Granger like?", "What do you think of Ronald Weasley?", "What is Harry Potter like?"]
    },
    // --- People around the castle. ---
    hermiona: {
      cs: ["Co si mysl\xED\u0161 o Ronaldu Weasleym?", "Jak je to s \u010Distotou krve?", "Kdo je Harry Potter?"],
      en: ["What of Ronald Weasley?", "What about blood purity?", "Who is Harry Potter?"]
    },
    ron: {
      cs: ["Jak\xE1 je Hermiona?", "Kdo je nejlep\u0161\xED chyta\u010D?", "Pro\u010D je v\u011Brnost d\u016Fle\u017Eit\xE1?"],
      en: ["What is Hermione like?", "Who is the best Seeker?", "Why does loyalty matter?"]
    },
    hagrid: {
      cs: ["Kdo otev\u0159el Tajemnou komnatu?", "Kdo u\u010D\xED v Bradavic\xEDch?", "Kdo je Minerva McGonagallov\xE1?"],
      en: ["Who opened the Chamber of Secrets?", "Who teaches at Hogwarts?", "Who is Minerva McGonagall?"]
    },
    mcgonagall: {
      cs: ["Kdo d\xE1l povede Bradavice?", "Jak\xE1 kouzla u\u010D\xED?", "Kdo bojoval v \u0158\xE1du?"],
      en: ["Who will lead Hogwarts next?", "What magic does she teach?", "Who fought in the Order?"]
    },
    draco: {
      cs: ["Jak Snape Draca chr\xE1nil?", "Co po n\u011Bm cht\u011Bl Temn\xFD p\xE1n?", "Jak\xFD byl tv\u016Fj pl\xE1n s v\u011B\u017E\xED?"],
      en: ["How did Severus protect the boy?", "What did the Dark Lord want from him?", "What was your plan on the tower?"]
    },
    // --- Lore: objects, places, prophecy, war. ---
    fawkes: {
      cs: ["Pro\u010D se \u0158\xE1d f\xE9nixe jmenuje takto?", "Kdo zabil bazili\u0161ka?", "Je smrt jen dal\u0161\xEDm dobrodru\u017Estv\xEDm?"],
      en: [
        "Why is the Order of the Phoenix so named?",
        "Who killed the basilisk?",
        "Is death but the next adventure?"
      ]
    },
    flamel: {
      cs: ["Je nesmrtelnost proklet\xEDm?", "Pro\u010D se boj\xEDme smrti?", "Jak\xE9 lektvary jsou nejmocn\u011Bj\u0161\xED?"],
      en: ["Is immortality a curse?", "Why do we fear death?", "Which potions are the most powerful?"]
    },
    rad_fenixe: {
      cs: ["Kdo byli Smrtijedi?", "Kdo je Voldemort?", "\u010C\xEDm byl Harry pro \u0158\xE1d?"],
      en: ["Who were the Death Eaters?", "Who is Voldemort?", "What was Harry to the Order?"]
    },
    grindelwald_souboj: {
      cs: ["Co je Bezov\xE1 h\u016Flka?", "Miloval jsi Gellerta?", "Kdo byla Ariana?"],
      en: ["What is the Elder Wand?", "Did you love Gellert?", "Who was Ariana?"]
    },
    zrcadlo: {
      cs: ["Co je k\xE1men mudrc\u016F?", "Po \u010Dem tou\u017E\xED srdce?", "Co je k\xE1men vzk\u0159\xED\u0161en\xED?"],
      en: ["What is the Philosopher\u2019s Stone?", "What does the heart desire?", "What is the Resurrection Stone?"]
    },
    myslanka: {
      cs: ["Co je nitrozpyt?", "Kdo vyslovil to proroctv\xED?", "Co ti vzpom\xEDnky o Raddleovi prozradily?"],
      en: [
        "What is Legilimency?",
        "Who spoke the prophecy?",
        "What did the memories reveal about Riddle?"
      ]
    },
    proroctvi: {
      cs: ["Pro\u010D si Harryho vybral?", "Co si o tom myslel Temn\xFD p\xE1n?", "M\xE1me svobodnou volbu?"],
      en: ["Why did he choose Harry?", "What did the Dark Lord make of it?", "Do we have free choice?"]
    },
    puvod: {
      cs: ["Pro\u010D je Hermiona v\xFDjime\u010Dn\xE1?", "Jak\xFD p\u016Fvod m\u011Bl Tom Raddle?", "Pro\u010D vznikla v\xE1lka?"],
      en: ["Why is Hermione exceptional?", "What was Tom Riddle\u2019s ancestry?", "Why did the first war begin?"]
    },
    mozkomori: {
      cs: ["\u010Ceho se boj\xED\u0161 ty s\xE1m?", "Jak\xE9 kouzlo je nejlep\u0161\xED obranou?", "Co je hor\u0161\xED ne\u017E smrt?"],
      en: ["What do you fear yourself?", "What is your best spell for defence?", "What is worse than death?"]
    },
    zakladatele: {
      cs: ["Kdo je d\u011Bdic Zmijozela?", "Jak se d\u011Bl\xED koleje?", "Kdo je \u0160ed\xE1 d\xE1ma?"],
      en: ["Who is the heir of Slytherin?", "How are the houses divided?", "Who is the Grey Lady?"]
    },
    tajemna_komnata: {
      cs: ["Kdo zni\u010Dil den\xEDk?", "Pro\u010D obvinili Hagrida?", "Kdo je Uf\u0148ukan\xE1 Ur\u0161ula?"],
      en: ["Who destroyed the diary?", "Why was Hagrid accused?", "Who is Moaning Myrtle?"]
    },
    komnata_potreby: {
      cs: ["Kde se ukr\xFDval diad\xE9m?", "Jak\xE1 dal\u0161\xED tajemstv\xED hrad m\xE1?", "Co je\u0161t\u011B skr\xFDvaj\xED Bradavice?"],
      en: [
        "Where was the diadem hidden?",
        "What other secrets does the castle hold?",
        "What else does Hogwarts hide?"
      ]
    },
    duchove: {
      cs: ["V\u011B\u0159\xED\u0161 v posmrtn\xFD \u017Eivot?", "Pro\u010D se lid\xE9 boj\xED smrti?", "Kdo je f\xE9nix Fawkes?"],
      en: ["What becomes of the soul?", "Why do people fear death?", "Who is Fawkes the phoenix?"]
    },
    valky: {
      cs: ["Pro\u010D byli mudlorozen\xED pron\xE1sledov\xE1ni?", "Co d\u011Blali mozkomorov\xE9 ve v\xE1lce?", "Jak\xFD je Draco Malfoy?"],
      en: ["Why were Muggle-borns persecuted?", "What did the Dementors do in the war?", "What of Draco Malfoy?"]
    },
    lektvary: {
      cs: ["Jak\xFD byl Snape jako u\u010Ditel?", "Lze uva\u0159it l\xE1sku?", "Kter\xE9 kouzlo je nejt\u011B\u017E\u0161\xED?"],
      en: ["What was Snape like as a teacher?", "Can love be brewed?", "Which spell is the hardest?"]
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
var ASKED_QUESTION_MEMORY = 6;
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
  suggestionsEl = null;
  partnerNameEl = null;
  partnerTitleEl = null;
  backBtn = null;
  nickname = "";
  character = null;
  recentReplies = [];
  askedQuestions = [];
  lastTopic = null;
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
    this.suggestionsEl = document.getElementById("chatSuggestions");
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
      this.renderSuggestions(this.lastTopic);
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
    this.askedQuestions = [];
    this.lastTopic = null;
    this.renderPartner(character);
    this.chatLog?.replaceChildren();
    this.showChatScreen(true);
    this.appendMessage("character", character.name[getLocale()], strings.chat.greeting(this.nickname));
    this.renderSuggestions(null);
    this.messageInput?.focus();
  }
  sendMessage() {
    if (!this.messageInput) return;
    const text = this.messageInput.value;
    this.messageInput.value = "";
    this.askQuestion(text);
    this.messageInput.focus();
  }
  /** Single entry point for a player question — from the form or a suggestion. */
  askQuestion(question) {
    if (!this.character) return;
    const text = question.trim();
    if (text.length === 0) return;
    const locale = getLocale();
    this.appendMessage("user", this.nickname, text);
    const { text: reply, topic } = resolveReply(text, this.character, CHAT_CHARACTERS, TOPICS, locale, {
      exclude: this.recentReplies
    });
    this.rememberReply(reply);
    this.rememberQuestion(text);
    this.appendMessage("character", this.character.name[locale], reply);
    this.renderSuggestions(topic);
  }
  /**
   * Renders the follow-up questions for `topic` as buttons. The row is rebuilt
   * from scratch each turn, which drops the previous buttons together with their
   * listeners; text is set via textContent only.
   */
  renderSuggestions(topic) {
    if (!this.suggestionsEl) return;
    const questions = suggestFollowUps(topic, FOLLOW_UPS, getLocale(), {
      exclude: this.askedQuestions
    });
    this.suggestionsEl.replaceChildren();
    for (const question of questions) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chat-suggestion";
      chip.textContent = question;
      chip.addEventListener("click", () => this.askSuggested(question));
      this.suggestionsEl.appendChild(chip);
    }
    this.suggestionsEl.hidden = questions.length === 0;
    this.lastTopic = topic;
  }
  /** Asks a suggested question; the clicked chip is gone, so focus moves on. */
  askSuggested(question) {
    this.askQuestion(question);
    this.messageInput?.focus();
  }
  backToSetup() {
    this.clearSuggestions();
    this.showChatScreen(false);
    this.nicknameInput?.focus();
  }
  clearSuggestions() {
    if (!this.suggestionsEl) return;
    this.suggestionsEl.replaceChildren();
    this.suggestionsEl.hidden = true;
  }
  /** Records a reply and keeps only the most recent ones, to avoid repeats. */
  rememberReply(reply) {
    this.recentReplies.push(reply);
    if (this.recentReplies.length > RECENT_REPLY_MEMORY) {
      this.recentReplies.shift();
    }
  }
  /** Records a question so it is not suggested back to the player. */
  rememberQuestion(question) {
    this.askedQuestions.push(question);
    if (this.askedQuestions.length > ASKED_QUESTION_MEMORY) {
      this.askedQuestions.shift();
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
