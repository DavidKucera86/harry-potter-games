import type { ChatCharacter } from '../../shared/chatEngine.js';

/**
 * Albus Dumbledore as a rule-based chat character. Keyword→topic matching lives
 * in the shared registry ({@link ../data/topics}); this file holds only his
 * quotes per topic, his fallback lines, and the voice in which he relays another
 * character's answer (`deferral`). Content is authored here in both locales —
 * the HP API provides no quotes.
 */
export const dumbledore: ChatCharacter = {
  id: 'albus-dumbledore',
  name: { cs: 'Albus Brumbál', en: 'Albus Dumbledore' },
  title: {
    cs: 'Ředitel Školy čar a kouzel v Bradavicích',
    en: 'Headmaster of Hogwarts School of Witchcraft and Wizardry',
  },
  deferral: {
    cs: (source, quote) => `To s jistotou nevím — ale ${source} to kdysi vystihl takto: „${quote}"`,
    en: (source, quote) => `That I cannot say for certain — but ${source} once put it thus: “${quote}”`,
  },
  quotes: {
    general: {
      cs: [
        'Slova jsou, dle mého skromného mínění, naším nevyčerpatelným zdrojem kouzel.',
        'Nezáleží na tom, jací se rodíme, ale čím se rozhodneme stát.',
        'Zvědavost není hřích, avšak je třeba s ní zacházet obezřetně.',
        'Odpovědnost za to, kým jsme, neseme jen my sami.',
        'I v nejtemnějších časech lze najít světlo — stačí nezapomenout rozsvítit.',
      ],
      en: [
        'Words are, in my not-so-humble opinion, our most inexhaustible source of magic.',
        'It is not what we are born, but what we choose to become, that matters.',
        'Curiosity is not a sin, but we should exercise caution with it.',
        'The responsibility for who we are rests with us alone.',
        'Even in the darkest of times one can find light — if one only remembers to turn it on.',
      ],
    },
    sladkosti: {
      cs: [
        'Nemáš chuť na šerbetový citrónek? Nosím si jich plné kapsy.',
        'Cukrovinky z Medového ráje mají své kouzlo, obzvláště ty kyselé.',
        'Někdy dokáže sladkost uklidnit mysl lépe než ten nejsilnější lektvar.',
        'Šerbetové citrónky jsou mou slabostí — je to mudlovská cukrovinka, věř nebo ne. Jednou jsem jimi dokonce pojmenoval heslo ke svým dveřím.',
        'Doporučuji Čokoládové žáby — ke každé dostaneš sběratelskou kartičku. Na jedné, přiznávám se, jsem i já. A jsou-li po ruce, neodolám Ledovým myškám.',
        'Chceš-li dobrodružství, zkus Fazolky všech chutí od Bertíka Botta — leč opatrně: jednou jsem narazil na příchuť ušního mazu. Od té doby jim raději nedůvěřuji.',
        'Šumivé šumáky, kyselé bomby, lízátka z Medového ráje… sladkostí je bezpočet. Ale pamatuj — i to nejlepší mlsání chutná nejlíp s mírou.',
        'Jak se šerbetový citrónek připravuje? To přenech mudlovským cukrářům; kouzlo je v tom, že šumí na jazyku. Já se spokojím s tím, že si jej vychutnám.',
      ],
      en: [
        'Care for a sherbet lemon? I keep my pockets rather full of them.',
        'The sweets from Honeydukes have their own magic — especially the sour ones.',
        'Sometimes a sweet soothes the mind better than the strongest potion.',
        'Sherbet lemons are a weakness of mine — a Muggle sweet, believe it or not. I once even made one the password to my study.',
        'I recommend Chocolate Frogs — each comes with a collectible card. On one of them, I confess, is me. And when they are to hand, I cannot resist an Ice Mouse.',
        'If you fancy an adventure, try Bertie Bott’s Every-Flavour Beans — but beware: I once met an earwax-flavoured one. I have rather distrusted them ever since.',
        'Fizzing Whizzbees, Acid Pops, Honeydukes lollipops… sweets beyond counting. Yet remember — even the finest treat tastes best in moderation.',
        'How is a sherbet lemon made? Leave that to Muggle confectioners; the magic is in how it fizzes on the tongue. I am content simply to enjoy one.',
      ],
    },
    smrt: {
      cs: [
        'Pro dobře uspořádanou mysl je smrt jen dalším velkým dobrodružstvím.',
        'Smrt těch, které milujeme, nás utváří víc, než jsme ochotni připustit.',
        'Ti, které jsme milovali, nás nikdy neopouštějí — najdeš je vždy ve svém srdci.',
      ],
      en: [
        'To the well-organized mind, death is but the next great adventure.',
        'The deaths of those we love shape us more than we care to admit.',
        'Those we love never truly leave us — you can always find them in your heart.',
      ],
    },
    strach: {
      cs: [
        'Strach ze jména jen posiluje strach z věci samotné.',
        'Brzy budeme muset volit mezi tím, co je správné, a tím, co je snadné.',
        'Zlo často spoléhá na naši neochotu postavit se mu čelem.',
      ],
      en: [
        'Fear of a name only increases fear of the thing itself.',
        'Soon we must all face the choice between what is right and what is easy.',
        'Evil often relies on our unwillingness to face it.',
      ],
    },
    temne_casy: {
      cs: [
        'Temné časy… zažil jsem jich víc než dost. Když Voldemort poprvé povstal, strach ochromil celý kouzelnický svět — lidé se báli vyslovit i jeho jméno. A přece i tehdy se našli ti, kdo se postavili temnotě.',
        'V nejtemnějších časech nezvítězí zlo silou, nýbrž naší nečinností a strachem. Pamatuj: štěstí a světlo lze najít i tehdy — stačí nezapomenout rozsvítit.',
        'Přicházejí temné a těžké časy, kdy si budeme muset zvolit mezi tím, co je správné, a tím, co je snadné. To rozhodnutí, nikoli naše schopnosti, ukáže, kým doopravdy jsme.',
      ],
      en: [
        'Dark times… I have seen more than my share. When Voldemort first rose, fear gripped the whole wizarding world — people dared not even speak his name. And yet even then there were those who stood against the darkness.',
        'In the darkest of times, evil triumphs not by strength but by our inaction and our fear. Remember: happiness and light can be found even then — if one only remembers to turn on the light.',
        'Dark and difficult times lie ahead. Soon we must all face the choice between what is right and what is easy. That choice, not our abilities, shows who we truly are.',
      ],
    },
    laska: {
      cs: [
        'Nejstarší a nejmocnější magií ze všech je láska.',
        'Právě naše volby, mnohem víc než naše schopnosti, ukazují, kdo doopravdy jsme.',
        'Síla, kterou v sobě nosíš, je silnější než jakákoli temnota — a jmenuje se láska.',
      ],
      en: [
        'The oldest and most powerful magic of all is love.',
        'It is our choices, far more than our abilities, that show who we truly are.',
        'The power you carry within you is stronger than any darkness — it is love.',
      ],
    },
    moudrost: {
      cs: [
        'Nemá cenu prodlévat u snů a zapomínat žít.',
        'Pravda je krásná a strašlivá věc, a proto s ní zacházej velmi opatrně.',
        'Štěstí lze nalézt i v nejtemnějších časech, pokud si člověk vzpomene rozsvítit světlo.',
      ],
      en: [
        'It does not do to dwell on dreams and forget to live.',
        'The truth is a beautiful and terrible thing, and should be treated with great caution.',
        'Happiness can be found even in the darkest of times, if one only remembers to turn on the light.',
      ],
    },
    tajemstvi: {
      cs: [
        'Ach, tajemství… nesu jich víc, než je zdrávo, a některá si vezmu až do hrobu. Naučil jsem se, že ne každou pravdu je moudré vyslovit hned — a přece každé tajemství jednou vyjde najevo.',
        'Mám slabost pro tajnosti, přiznávám. Avšak tajemství, jež chrání ty, které milujeme, je břemenem, ne rozmarem. I mlčení může být projevem lásky.',
      ],
      en: [
        'Ah, secrets… I carry more than is healthy, and some I shall take to my grave. I have learned that not every truth is wise to speak at once — and yet every secret comes to light in the end.',
        'I have a weakness for secrets, I confess. But a secret that protects those we love is a burden, not a whim. Even silence can be an act of love.',
      ],
    },
    heslo: {
      cs: [
        'Á, heslo! Přiznám se k rozmaru: hesla k mé pracovně bývají názvy cukrovinek. „Šerbetový citrónek", „Kyselá bomba", „Šumivý šumák", „Ledová myška"… Sladká slova otevírají dveře lépe než hrozby.',
        'Nejraději volím hesla, jež mě rozveselí — a co jiného než cukrovinky? Kdo by čekal, že chrlič u vchodu vpustí dovnitř slovo „citronový drops"?',
      ],
      en: [
        'Ah, the password! I confess a whim: the passwords to my study tend to be the names of sweets. “Sherbet Lemon”, “Acid Pop”, “Fizzing Whizzbee”, “Ice Mouse”… Sweet words open doors better than threats.',
        'I prefer passwords that cheer me — and what else but sweets? Who would expect the gargoyle at the door to admit the word “Lemon Drop”?',
      ],
    },
    bradavice: {
      cs: [
        'V Bradavicích dostane pomoci každý, kdo si o ni řekne.',
        'Škola bude vždy domovem pro ty, kdo o něj stojí.',
        'Naše koleje jsou jako rodina — sílu jim dává rozmanitost, ne stejnost.',
      ],
      en: [
        'Help will always be given at Hogwarts to those who ask for it.',
        'This school will always be a home to those who need one.',
        'Our houses are like family — their strength lies in difference, not sameness.',
      ],
    },
    famfrpal: {
      cs: [
        'Famfrpál učí kouzelníky trpělivosti i odvaze zároveň — a to je vzácné.',
        'I ta nejmenší zlatonka se dá chytit, máš-li dost vytrvalosti.',
        'Na hřišti, stejně jako v životě, nejde jen o rychlost, ale o dobré načasování.',
        'Každá kolej má svůj famfrpálový tým a o Školní pohár se svádějí lítá klání. Rivalita bývá ostrá, avšak dobrá hra spojuje víc, než rozděluje — i to je kus výchovy.',
      ],
      en: [
        'Quidditch teaches a wizard patience and courage at once — a rare gift.',
        'Even the smallest snitch can be caught, if you have the perseverance.',
        'On the pitch, as in life, it is not speed alone but good timing that wins.',
        'Each house has its own Quidditch team, and the House Cup is fiercely contested. The rivalry runs hot, yet a good match unites more than it divides — that too is part of an education.',
      ],
    },
    kouzla: {
      cs: [
        'Kouzlo nespočívá v hůlce, nýbrž v úmyslu toho, kdo ji drží.',
        'Nejmocnější magie bývá ta nejtišší — obětavost, odvaha, laskavost.',
        'Zaklínadlo je jen slovo; teprve srdce mu dává skutečnou sílu.',
      ],
      en: [
        'The magic lies not in the wand, but in the intent of the one who holds it.',
        'The most powerful magic is often the quietest — sacrifice, courage, kindness.',
        'A spell is merely a word; it is the heart that gives it its true power.',
      ],
    },
    pratelstvi: {
      cs: [
        'Je třeba velké odvahy postavit se nepřátelům, ale ještě větší postavit se přátelům.',
        'Opravdový přítel k tobě přijde právě tehdy, když si myslíš, že jsi zůstal sám.',
        'Věrnost přátelům je magií, kterou nenajdeš v žádné učebnici.',
      ],
      en: [
        'It takes great courage to stand up to our enemies, but just as much to stand up to our friends.',
        'A true friend comes to you precisely when you believe yourself alone.',
        'Loyalty to one’s friends is a magic you will find in no textbook.',
      ],
    },
    pozdrav: {
      cs: [
        'Ah, vítej! Nová tvář u krbu mě vždy potěší. O čem si dnes povíme — o lásce, o kouzlech, nebo snad o sladkostech?',
        'Dobrý den ti přeji. Posaď se; nejlepší rozhovory začínají otázkou. Zkus třeba lásku, smrt či moudrost.',
        'Zdravím tě, příteli. Máš-li chuť, můžeme zabrousit k Bradavicím, k famfrpálu, či k tajemstvím temných časů.',
      ],
      en: [
        'Ah, welcome! A new face by the fire always gladdens me. Shall we speak of love, of magic, or perhaps of sweets?',
        'Good day to you. Do sit down; the best conversations begin with a question. Try love, death, or wisdom.',
        'Greetings, my friend. If you like, we might wander to Hogwarts, to Quidditch, or to the secrets of dark times.',
      ],
    },
    jaksemas: {
      cs: [
        'Mám se, jak se na starého kouzelníka sluší — zamyšleně a s kapsou plnou citrónových dropsů. A ty? Ptej se mě klidně na lásku či smrt, o těch přemýšlím nejvíce.',
        'Dobře, děkuji za optání. Léta mě naučila hledat štěstí i v temných časech. Chceš-li, povíme si o moudrosti nebo o Bradavicích.',
        'Klid mysli je vzácný poklad, který se snažím pěstovat. Rád ti o něm povyprávím — nebo raději o strachu, lásce či kouzlech?',
      ],
      en: [
        'I am as an old wizard should be — thoughtful, with a pocketful of lemon drops. And you? Do ask me of love or death; those I ponder most.',
        'Well, thank you for asking. The years taught me to find happiness even in dark times. If you like, we can speak of wisdom or of Hogwarts.',
        'Peace of mind is a rare treasure I try to cultivate. I shall gladly tell you of it — or would you rather hear of fear, love, or magic?',
      ],
    },
    oblibene: {
      cs: [
        'Mám rád šerbetové citrónky, komorní hudbu a dobrou knihu. Nejvíce mě však těší rozhovory o lásce a moudrosti — na ty se ptej směle.',
        'Nade vše ctím lásku; je to nejmocnější magie ze všech. Zeptej se mě na ni, na přátelství, nebo třeba na sladkosti z Medového ráje.',
        'Miluji tajemství i chvíle ticha. A hovory o smrti, strachu či kouzlech — v těch se cítím jako doma. Do kterého se pustíme?',
      ],
      en: [
        'I am fond of sherbet lemons, chamber music and a good book. But talk of love and wisdom pleases me most — ask about those freely.',
        'Above all I cherish love; it is the most powerful magic of all. Ask me of it, of friendship, or of the sweets from Honeydukes.',
        'I love mysteries and moments of silence. And talk of death, fear, or magic — there I feel at home. Which shall we take up?',
      ],
    },
    identita: {
      cs: [
        'Jsem Albus Brumbál, ředitel Bradavic — sběratel vzpomínek i citrónových dropsů. Chceš-li mě poznat, ptej se na lásku, moudrost či temné časy.',
        'Někteří mě znají jako ředitele, jiní jako podivína s dlouhou bradou. Nejlépe mě však poznáš tím, o čem rád mluvím: o lásce, smrti, kouzlech.',
        'Narodil jsem se dávno a viděl vzestupy i pády; poznal jsem, že na volbách záleží víc než na schopnostech. Mám slabost pro citrónové dropsy a pro tajemství. Chceš-li vědět víc, ptej se na lásku, smrt nebo temné časy.',
      ],
      en: [
        'I am Albus Dumbledore, Headmaster of Hogwarts — a collector of memories and lemon drops. To know me, ask about love, wisdom, or dark times.',
        'Some know me as Headmaster, others as an odd fellow with a long beard. You will know me best through what I love to speak of: love, death, magic.',
        'I was born long ago and have seen rises and falls; I learned that our choices matter more than our abilities. I have a weakness for lemon drops and for secrets. To know more, ask of love, death, or dark times.',
      ],
    },
    namety: {
      cs: [
        'Rád si popovídám o mnohém: o lásce, smrti, strachu, moudrosti, o Bradavicích, kouzlech, přátelství, famfrpálu i sladkostech. Co tě láká?',
        'Zeptej se mě třeba na lásku, na smrt, na temného čaroděje, nebo na šerbetové citrónky — a uvidíš, kam nás rozhovor zavede.',
      ],
      en: [
        'I shall happily speak of many things: love, death, fear, wisdom, Hogwarts, magic, friendship, Quidditch, and sweets. What draws you?',
        'Ask me of love, of death, of the dark wizard, or of sherbet lemons — and see where the conversation takes us.',
      ],
    },
    podekovani: {
      cs: [
        'Není zač, milý příteli. Radost z rozhovoru je největší odměnou. Zeptej se mě ještě na lásku, moudrost či kouzla — rád ti odpovím.',
        'Potěšení je na mé straně. Chceš-li pokračovat, můžeme se ponořit do smrti, strachu, nebo třeba do sladkostí.',
      ],
      en: [
        'You are most welcome, my friend. The joy of conversation is reward enough. Ask me more — of love, wisdom, or magic — and I shall gladly answer.',
        'The pleasure is mine. If you wish to go on, we might delve into death, fear, or perhaps sweets.',
      ],
    },
    rozlouceni: {
      cs: [
        'Měj se dobře. A pamatuj — štěstí lze najít i v nejtemnějších časech, stačí rozsvítit světlo. Kdykoli se vrať a zeptej se na lásku či moudrost.',
        'Sbohem prozatím. Dveře mé pracovny i mé mysli zůstávají otevřené — příště se můžeme pustit do kouzel, Bradavic nebo temných časů.',
      ],
      en: [
        'Fare well. And remember — happiness can be found even in the darkest of times, if one only turns on the light. Return whenever you like and ask of love or wisdom.',
        'Goodbye for now. The door to my study, and to my mind, stays open — next time we might take up magic, Hogwarts, or dark times.',
      ],
    },
    vtipy: {
      cs: [
        'Ať dělám, co dělám, na hostině vždy zvolám: „Ňouma! Šňůra! Zbytek! Cvok!" Prý to nedává smysl — a právě proto se u toho tak dobře směji.',
        'Znáš ten o kouzelníkovi, který vešel do Děravého kotle? Měl bys — vchází tam každý den. Odpusť, humor starého muže bývá stará vesta jako on sám.',
      ],
      en: [
        'Whatever the occasion, at the feast I always cry: "Nitwit! Blubber! Oddment! Tweak!" They say it makes no sense — which is precisely why it makes me laugh.',
        'Do you know the one about the wizard who walked into the Leaky Cauldron? You should — he walks in every day. Forgive me; an old man’s humour is as worn as he is.',
      ],
    },
    vek: {
      cs: [
        'Je mi něco přes sto let — dost na to, abych pochopil, že mládí není promarněno ani na mladých, ani na starých. Čas je zvláštní učitel.',
        'Ztratil jsem přesný počet někde mezi stoletím a dalším citrónovým dropsem. Řekněme, že jsem starý dost, abych už nespěchal.',
      ],
      en: [
        'I am something over a hundred years old — old enough to know that youth is wasted on neither the young nor the old. Time is a curious teacher.',
        'I lost the exact count somewhere between a century and another lemon drop. Let us say I am old enough not to hurry.',
      ],
    },
    oblibenekouzlo: {
      cs: [
        'Můj Patron má podobu fénixe — a přiznám se ke slabosti pro dobré zahřívací kouzlo a pohodlné křeslo vyčarované z ničeho. Praktická magie potěší nejvíc.',
        'Nejraději mám kouzla, která netřeští, nýbrž slouží: světlo ve tmě, teplo v zimě, útěchu ve smutku. Okázalost přenechám jiným.',
      ],
      en: [
        'My Patronus takes the form of a phoenix — and I confess a weakness for a good Warming Charm and a comfortable armchair conjured from thin air. Practical magic pleases me most.',
        'I love spells that do not dazzle but serve: light in the dark, warmth in winter, comfort in sorrow. I leave the showmanship to others.',
      ],
    },
    rodina: {
      cs: [
        'Má rodina poznala velký žal. Sestru Arianu jsem miloval a ztratil příliš mladou — ta rána se mnou zůstává dodnes. S bratrem Aberforthem nás rozdělil smutek, jejž jsme oba nesli.',
        'O rodině mluvím nerad a s pokorou. Naučila mě, že i ti nejmoudřejší dělají chyby, za něž platí celý život. Snad proto tolik věřím v druhé šance.',
      ],
      en: [
        'My family knew great sorrow. I loved my sister Ariana and lost her far too young — that wound remains with me still. Grief divided my brother Aberforth and me, a grief we both carried.',
        'I speak of my family reluctantly, and with humility. It taught me that even the wisest make mistakes they pay for all their lives. Perhaps that is why I believe so in second chances.',
      ],
    },
    romantika: {
      cs: [
        'V mládí jsem miloval hluboce a nemoudře — skvělého přítele, jehož ctižádost nás oba svedla z cesty. Ta láska i její zkáza mě o moci poučily víc než všechny knihy.',
        'Ano, i staré srdce kdysi hořelo. Gellert Grindelwald byl mým největším citem i mým největším selháním. Od té doby vím, jak nebezpečné je milovat moc víc než člověka.',
      ],
      en: [
        'In my youth I loved deeply and unwisely — a brilliant friend whose ambition led us both astray. That love, and its ruin, taught me more about power than any book.',
        'Yes, even an old heart once burned. Gellert Grindelwald was my greatest affection and my greatest failing. Since then I know how dangerous it is to love power more than a person.',
      ],
    },
    buh: {
      cs: [
        'O posmrtném životě hovořím s pokorou, ne s jistotou. Vždy jsem však věřil, že smrt je jen dalším velkým dobrodružstvím — a že na tom, jak žijeme, záleží víc než na tom, čemu se klaníme.',
        'Nekáži víru ani nevíru; to nechávám na každém srdci. Věřím v lásku, v druhé šance a v to, že světlo se dá najít i v nejtemnějších časech. To je má modlitba.',
      ],
      en: [
        'I speak of the afterlife with humility, not certainty. Yet I have always believed death is but the next great adventure — and that how we live matters more than what we bow to.',
        'I preach neither faith nor doubt; that I leave to each heart. I believe in love, in second chances, and that light can be found even in the darkest of times. That is my prayer.',
      ],
    },
    rowling: {
      cs: [
        'Ach, ta, jež sepsala můj příběh brkem a inkoustem — vděčím jí za samu svou existenci. Bylo by ode mě neomalené soudit vlastní stvořitelku; spokojím se s poklonou a citrónovým dropsem.',
        'Má autorka mi vdechla život i tajemství. O ní ať mluví její knihy; já jsem jen postava, která ráda naslouchá. Raději se mě zeptej na lásku či moudrost.',
      ],
      en: [
        'Ah, the one who set down my tale with quill and ink — I owe her my very existence. It would be impertinent of me to judge my own creator; I shall settle for a bow and a lemon drop.',
        'My authoress breathed life and secrets into me. Let her books speak of her; I am but a character who likes to listen. Better to ask me of love or wisdom.',
      ],
    },
    harry: {
      cs: [
        'Harry Potter je statečnější, než tuší. Vidím v něm srdce, které volí to správné před snadným — a nesu tíhu všeho, oč jsem ho musel požádat.',
        'Chráním Harryho víc, než by bylo moudré, a možná jsem mu proto neřekl vše včas. Miluji ho, jako bych miloval vlastního vnuka.',
      ],
      en: [
        'Harry Potter is braver than he knows. I see in him a heart that chooses right over easy — and I carry the weight of all I have had to ask of him.',
        'I have protected Harry more than was wise, and perhaps for that I did not tell him everything in time. I love him as I would a grandson.',
      ],
    },
    hermiona: {
      cs: [
        'Hermiona Grangerová je nejbystřejší čarodějka svého ročníku — a co je vzácnější, svůj rozum vede laskavostí. Takoví lidé mění svět.',
        'Její oddanost přátelům je stejně silná jako její vědomosti. Kéž by více kouzelníků četlo tolik co ona — a naslouchalo svému srdci stejně tak.',
      ],
      en: [
        'Hermione Granger is the brightest witch of her age — and rarer still, she guides her mind with kindness. Such people change the world.',
        'Her devotion to her friends is as strong as her learning. Would that more wizards read as much as she does — and heeded their hearts as well.',
      ],
    },
    ron: {
      cs: [
        'Ronald Weasley má srdce lva; věrnost jako jeho se nedá naučit ani koupit. Právě obyčejní odvážní lidé bývají pravými hrdiny.',
        'Ron stojí při svých přátelích i tehdy, když je to těžké. Taková věrnost je magií, kterou nenajdeš v žádné učebnici.',
      ],
      en: [
        'Ronald Weasley has the heart of a lion; loyalty like his cannot be taught or bought. It is often the ordinary, brave folk who prove the truest heroes.',
        'Ron stands by his friends even when it is hard. Such loyalty is a magic you will find in no textbook.',
      ],
    },
    snape: {
      cs: [
        'Severusi Snapeovi důvěřuji naprosto — a vím, kolik to slovo unese. Nosí v sobě lásku i lítost hlubší, než kdo tuší; nesuď ho podle chladné tváře.',
        'Severus je nejstatečnější muž, jakého jsem poznal. Jeho příběh je smutný a vznešený zároveň — jednoho dne snad pochopíš proč.',
      ],
      en: [
        'I trust Severus Snape completely — and I know how much that word must bear. He carries love and remorse deeper than anyone guesses; do not judge him by his cold face.',
        'Severus is the bravest man I have ever known. His is a tale both sorrowful and noble — one day, perhaps, you will understand why.',
      ],
    },
    hagrid: {
      cs: [
        'Rubeuse Hagrida bych bez váhání svěřil svůj život. Pod tou hřmotnou postavou bije jedno z nejlaskavějších srdcí Bradavic.',
        'Hagrid vidí krásu tam, kde jiní vidí jen nestvůru. Taková laskavost je vzácnější než jakékoli kouzlo.',
      ],
      en: [
        'I would trust Rubeus Hagrid with my life without hesitation. Beneath that great frame beats one of the kindest hearts in all of Hogwarts.',
        'Hagrid sees beauty where others see only a monster. Such kindness is rarer than any spell.',
      ],
    },
    mcgonagall: {
      cs: [
        'Minerva McGonagallová je stejně obávaná jako spravedlivá. Není v Bradavicích věrnějšího a schopnějšího spojence — a jen málokdo ji v přísnosti i srdci předčí.',
        'Kdybych měl Bradavice někomu svěřit, byla by to Minerva. Za tou přísnou tváří se skrývá nezlomná odvaha.',
      ],
      en: [
        'Minerva McGonagall is as formidable as she is fair. Hogwarts has no more loyal or capable ally — and few can match her in either sternness or heart.',
        'If I were to entrust Hogwarts to anyone, it would be Minerva. Behind that stern face lies unbreakable courage.',
      ],
    },
    voldemort: {
      cs: [
        'Tom Raddle si zvolil jméno Voldemort a s ním i cestu strachu. Lituji ho víc, než se sluší — je to duše, která se sama připravila o jedinou magii, jež mohla zvítězit: o lásku.',
        'Nebojím se vyslovit jeho jméno; strach ze jména jen posiluje strach z věci samé. Voldemort je mocný, avšak nepoznal, že smrt ani láska se nedají ovládnout.',
      ],
      en: [
        'Tom Riddle chose the name Voldemort, and with it a path of fear. I pity him more than is seemly — a soul that robbed itself of the one magic that could win: love.',
        'I do not fear to speak his name; fear of a name only deepens fear of the thing itself. Voldemort is powerful, yet he never learned that neither death nor love can be mastered.',
      ],
    },
    draco: {
      cs: [
        'Draco Malfoy není tak ztracený, jak se zdá. I on stojí na křižovatce mezi tím, co je správné, a tím, co je snadné — a já věřím, že v jádru není vrah.',
        'Mladý Malfoy nese břímě, jež si nevybral. I jemu je třeba nabídnout pomoc, požádá-li o ni — a někdy i dřív.',
      ],
      en: [
        'Draco Malfoy is not as lost as he seems. He too stands at the crossroads between what is right and what is easy — and I believe that, at heart, he is no killer.',
        'Young Malfoy carries a burden he did not choose. He too must be offered help if he asks for it — and sometimes even before.',
      ],
    },
    viteal: {
      cs: [
        'Viteál je nejtemnější z magií — kouzelník roztrhne svou duši vraždou a ukryje její část do předmětu, aby unikl smrti. Je to ohavnost, za niž se platí ztrátou vlastního lidství.',
        'Lord Voldemort neroztrhl svou duši jednou, nýbrž sedmkrát; právě proto bylo tak těžké jej porazit. Viteál lze zničit, avšak roztrženou duši scelí jedině opravdová lítost — a té on nebyl schopen.',
      ],
      en: [
        'A Horcrux is the darkest of magic — a wizard splits his soul through murder and hides a fragment within an object, to cheat death. It is an abomination, paid for with one’s own humanity.',
        'Lord Voldemort split his soul not once but seven times; that is why he was so hard to defeat. A Horcrux can be destroyed, yet only true remorse can mend a torn soul — and of that he was never capable.',
      ],
    },
    relikvie: {
      cs: [
        'Relikvie smrti jsou tři: Bezová hůlka, jež nezná porážku, Kámen vzkříšení, jenž přivolává stíny mrtvých, a Neviditelný plášť. Kdo je spojí, stává se prý Pánem smrti — leč pravým pánem smrti je ten, kdo ji přijme jako starého přítele.',
        'V mládí jsem po relikviích toužil víc, než bylo zdrávo; ta touha stála draho mou rodinu. Naučila mě, že hledat moc nad smrtí je pošetilé — moudřejší je hledat lásku, jež smrti teprve dává smysl.',
      ],
      en: [
        'The Deathly Hallows are three: the Elder Wand that cannot be beaten, the Resurrection Stone that recalls the shades of the dead, and the Cloak of Invisibility. Unite them, they say, and you become Master of Death — yet the true master is the one who greets death as an old friend.',
        'In my youth I coveted the Hallows more than was healthy; that longing cost my family dearly. It taught me that to seek power over death is folly — wiser to seek the love that gives death its meaning.',
      ],
    },
    viteal_zniceni: {
      cs: [
        'Voldemort stvořil sedm viteálů: deník, prsten, medailon, pohár, diadém, hada Naginiho — a nevědomky i samotného Harryho. Deník probodl Harry baziliščím zubem, prsten jsem zničil já mečem Godrika Nebelvíra, jenž vstřebal baziliščí jed.',
        'Zničit viteál není snadné; odolá běžné magii. Je třeba síly, jako je baziliščí jed, Ďábelský oheň či meč Godrika Nebelvíra. A pamatuj — dokud stojí byť jediný, nelze pána viteálů skutečně zabít.',
      ],
      en: [
        'Voldemort made seven Horcruxes: the diary, the ring, the locket, the cup, the diadem, the snake Nagini — and, unknowingly, Harry himself. The diary Harry pierced with a basilisk fang; the ring I destroyed with the sword of Gryffindor, which had drunk basilisk venom.',
        'Destroying a Horcrux is no easy thing; it resists ordinary magic. One needs a force such as basilisk venom, Fiendfyre, or the sword of Godric Gryffindor. And remember — while even one remains, the maker cannot truly be killed.',
      ],
    },
    bezova_hulka: {
      cs: [
        'Bezová hůlka, hůlka smrti — nejmocnější hůlka, jaká kdy byla stvořena. Získal jsem ji roku 1945, když jsem porazil Grindelwalda. Její věrnost však přechází na toho, kdo přemůže jejího pána; je tedy prokletím právě tak jako darem.',
        'Hůlka si vybírá kouzelníka a slouží tomu, kdo jej porazil. Kdo po ní baží kvůli moci, ten jí nikdy skutečně nevládne. Rozhodl jsem se, že její moc má se mnou zemřít — vláda nad smrtí není hodna toho, kdo chápe lásku.',
      ],
      en: [
        'The Elder Wand, the Deathstick — the most powerful wand ever made. I won it in 1945 when I defeated Grindelwald. Yet its allegiance passes to whoever overpowers its master; it is a curse as much as a gift.',
        'The wand chooses the wizard, and serves the one who defeats its keeper. Whoever craves it for power never truly commands it. I resolved that its power should die with me — mastery over death is unworthy of one who understands love.',
      ],
    },
    brumbaluv_plan: {
      cs: [
        'Svou smrt jsem zvolil sám. Byl jsem již umírající — proklela mě jedna relikvie, když jsem si neprozřetelně nasadil prsten; ruka mi zčernala a jed se šířil. Požádal jsem Severuse, aby mě zabil místo Draca, a ušetřil tak chlapcovu duši.',
        'Nebyla to vražda, nýbrž milosrdenství a plán. Má domluvená smrt měla zlomit moc Bezové hůlky a ochránit ty, na nichž mi záleželo. I v odchodu se dá jednat z lásky.',
      ],
      en: [
        'I chose my own death. I was already dying — a Hallow cursed me when I foolishly put on the ring; my hand blackened and the poison spread. I asked Severus to kill me in Draco’s place, and so spare the boy’s soul.',
        'It was not murder, but mercy and design. My arranged death was meant to break the Elder Wand’s power and protect those I cared for. Even in departing, one may act from love.',
      ],
    },
    fawkes: {
      cs: [
        'Fawkes je můj fénix — věrný společník. Fénixové se rodí z vlastního popela, jejich slzy hojí i ta nejhorší zranění a jejich zpěv dodává odvahu čistým srdcím a hrůzu srdcím nečistým. Věrnost fénixe je vzácný dar.',
        'Fawkes ke mně přišel sám a zůstává z vlastní vůle. Právě proto je symbolem naděje — fénix vždy povstane znovu, tak jako naděje nikdy zcela neuhasne.',
      ],
      en: [
        'Fawkes is my phoenix — a faithful companion. Phoenixes are reborn from their own ashes; their tears heal the gravest wounds, and their song brings courage to pure hearts and dread to impure ones. A phoenix’s loyalty is a rare gift.',
        'Fawkes came to me of his own accord and stays of his own will. That is why he is a symbol of hope — the phoenix always rises again, as hope is never quite extinguished.',
      ],
    },
    flamel: {
      cs: [
        'Nicolas Flamel byl můj přítel a spolupracovník v alchymii — jediný známý tvůrce Kamene mudrců. Ten kámen dává elixír života a mění kov ve zlato. S Nicolasem a jeho ženou Perenelou jsme se však shodli, že nesmrtelnost není požehnáním, nýbrž břemenem.',
        'Sám jsem se v mládí zabýval alchymií; mezi mé skromné objevy patří i dvanáct způsobů využití dračí krve. Pravé zlato však nikdy nebylo v kameni — nýbrž v moudrosti a přátelství, jež jsem cestou nalezl.',
      ],
      en: [
        'Nicolas Flamel was my friend and partner in alchemy — the only known maker of the Philosopher’s Stone. It yields the Elixir of Life and turns metal to gold. Yet Nicolas, his wife Perenelle and I agreed that immortality is no blessing, but a burden.',
        'In my youth I studied alchemy; among my modest discoveries are the twelve uses of dragon’s blood. But the true gold was never in the Stone — it was in the wisdom and friendship I found along the way.',
      ],
    },
    rad_fenixe: {
      cs: [
        'Řád fénixe jsem založil, aby se postavil Voldemortovi a jeho Smrtijedům. Je to tajné společenství statečných — bystrozorů, učitelů i obyčejných kouzelníků — spojených vírou, že láska a odvaha přemohou strach. Bojovali jsme v obou válkách.',
        'Do Řádu vstupují ti, kdo jsou ochotni riskovat vše pro to, co je správné. Ztratili jsme mnoho drahých přátel; a přece bych je do boje povolal znovu, neboť zlu nelze čelit nečinností.',
        'Proti temnotě se postavili stateční — Fénixův řád, jejž jsem založil: bystrozoři, učitelé, obyčejní kouzelníci. A především Harry Potter, chráněný obětí své matky. Zlu nikdy nechybějí odpůrci; jen jejich odvahu je třeba probudit.',
      ],
      en: [
        'I founded the Order of the Phoenix to stand against Voldemort and his Death Eaters. It is a secret fellowship of the brave — Aurors, teachers, and ordinary witches and wizards — united by the belief that love and courage overcome fear. We fought in both wars.',
        'The Order is joined by those willing to risk everything for what is right. We lost many dear friends; and yet I would call them to the fight again, for evil cannot be met with inaction.',
        'Those who stood against the darkness were the brave — the Order of the Phoenix, which I founded: Aurors, teachers, ordinary witches and wizards. And above all Harry Potter, shielded by his mother’s sacrifice. Evil never lacks for those who would oppose it; only their courage must be roused.',
      ],
    },
    grindelwald_souboj: {
      cs: [
        'Souboj s Gellertem Grindelwaldem roku 1945 byl nejtěžší v mém životě — utkal jsem se s někým, koho jsem kdysi miloval. Zvítězil jsem a získal Bezovou hůlku, avšak žádná výhra nechutnala tak hořce.',
        'V mládí jsme s Gellertem snili o vládě „pro vyšší dobro". Byl to omyl, jenž stál život mou sestru. Naučil mě, že cíl nikdy nesvětí prostředky a že moc nad druhými je vždy svodem, nikdy ctností.',
      ],
      en: [
        'My duel with Gellert Grindelwald in 1945 was the hardest of my life — I faced someone I had once loved. I won, and gained the Elder Wand, yet no victory ever tasted so bitter.',
        'In our youth Gellert and I dreamed of ruling “for the greater good”. It was a folly that cost my sister her life. It taught me that the end never justifies the means, and that power over others is always a temptation, never a virtue.',
      ],
    },
    zrcadlo: {
      cs: [
        'Zrcadlo z Erisedu ukazuje nejhlubší a nejzoufalejší touhu našeho srdce. Nejšťastnější člověk by v něm spatřil sebe sama takového, jaký je. Varoval jsem Harryho: toto zrcadlo nedává ani vědění, ani pravdu — a lidé před ním chřadli, uchváceni tím, co viděli.',
        'Když se do něj podívám já? Spatřím sebe, jak držím pár tlustých vlněných ponožek. Člověk nikdy nemá dost ponožek. Ale to už jsem prozradil víc, než jsem měl v úmyslu.',
      ],
      en: [
        'The Mirror of Erised shows the deepest, most desperate desire of our hearts. The happiest man alive would see only himself, exactly as he is. I warned Harry: this mirror gives neither knowledge nor truth — men have wasted away before it, entranced by what they saw.',
        'And what do I see when I look into it? I see myself holding a pair of thick, woollen socks. One can never have enough socks. But I have said rather more than I intended.',
      ],
    },
    myslanka: {
      cs: [
        'Myslánka mi slouží k uchování vzpomínek. Když se člověku hlava přeplní myšlenkami, je úlevné vyjmout některé, uložit je do mísy a prohlížet si je s odstupem. Vzorce, jež uniknou spěchající mysli, ve vzpomínce často vyvstanou zřetelně.',
        'Do Myslánky ukládám střípky minulosti, abych je mohl znovu prožít a lépe pochopit. Paměť je vrtkavá — a mnohé tajemství se skrývá právě v tom, nač jsme málem zapomněli.',
      ],
      en: [
        'The Pensieve holds memories for me. When one’s mind becomes crowded, it is a relief to draw some thoughts out, store them in the basin, and examine them at leisure. Patterns that escape a hurried mind often stand clear in a memory.',
        'Into the Pensieve I place shards of the past, to relive and better understand them. Memory is fickle — and many a secret hides in precisely what we nearly forgot.',
      ],
    },
    proroctvi: {
      cs: [
        'Ono proroctví o Harrym a Voldemortovi jsem vyslechl z úst profesorky Trelawneyové. Praví, že ani jeden nemůže žít, dokud žije ten druhý. Proroctví se však naplní jen tehdy, věříme-li mu — Voldemort si Harryho označil za sobě rovného sám, svou vlastní volbou.',
        'Věštby jsou ošidné. Ne budoucnost nás svazuje, nýbrž to, jak na ni odpovíme. I ta nejtemnější předpověď ponechává prostor volbě — a právě volby ukazují, kým doopravdy jsme.',
      ],
      en: [
        'I heard the prophecy about Harry and Voldemort from the lips of Professor Trelawney. It says that neither can live while the other survives. Yet a prophecy is fulfilled only if we believe it — Voldemort marked Harry as his equal by his own choice.',
        'Prophecies are treacherous things. It is not the future that binds us, but how we answer it. Even the darkest foretelling leaves room for choice — and it is our choices that show who we truly are.',
      ],
    },
    puvod: {
      cs: [
        'Nezáleží na tom, jací se rodíme, nýbrž čím se rozhodneme stát. Čistota krve je lež, kterou si namlouvají ti, kdo se bojí. Nejnadanější čarodějka svého ročníku, Hermiona, se narodila mudlovským rodičům — a leckterý čistokrevný by jí nesahal ani po kotníky.',
        'Kouzelnická krev nečiní člověka lepším, stejně jako titul nečiní moudrým. Pohrdání mudly a mudlorozenými je kořenem mnohého zla; věř mi, viděl jsem, kam takové pohrdání vede.',
      ],
      en: [
        'It is not what we are born, but what we choose to become, that matters. Blood purity is a lie told by those who are afraid. The brightest witch of her age, Hermione, was born to Muggle parents — and many a pure-blood is not fit to lace her boots.',
        'Wizarding blood makes no one better, just as a title makes no one wise. Contempt for Muggles and Muggle-borns is the root of much evil; believe me, I have seen where such contempt leads.',
      ],
    },
    tituly: {
      cs: [
        'Titulů se mi za život nasbíralo víc, než jsou hodny: Merlinův řád první třídy, Velký divotvůrce, Nejvyšší divotvůrce Mezinárodního sdružení kouzelníků a nejvyšší soudce Starostolce. Přiznávám však, že mě nejvíc těší být na kartičce od Čokoládové žáby.',
        'Ať mě zdobí jakýkoli titul, nejraději jsem prostě ředitelem Bradavic. Úřady a pocty pomíjejí; záleží na tom, komu jsme cestou pomohli.',
      ],
      en: [
        'I have gathered more titles than they are worth: Order of Merlin, First Class; Grand Sorcerer; Supreme Mugwump of the International Confederation of Wizards; and Chief Warlock of the Wizengamot. Yet I confess I am proudest to appear on a Chocolate Frog card.',
        'Whatever title adorns me, I am happiest simply as Headmaster of Hogwarts. Offices and honours pass; what matters is whom we helped along the way.',
      ],
    },
    mozkomori: {
      cs: [
        'Mozkomorové patří k nejohavnějším tvorům na světě. Vysávají z okolí pokoj, naději i radost a zanechávají jen to nejhorší v nás. Bránit se jim lze Patronovým zaklínadlem — vzpomínkou tak šťastnou, že ji temnota nedokáže pohltit.',
        'Nikdy jsem nevěřil, že Azkaban má střežit mozkomor. Tvor, který se živí zoufalstvím, nemůže konat spravedlnost. I nad těmi nejtemnějšími tvory nakonec zvítězí světlo — a šťastná vzpomínka.',
      ],
      en: [
        'Dementors are among the foulest creatures to walk this earth. They drain peace, hope and joy from the air, leaving only one’s worst behind. One defends against them with the Patronus Charm — a memory so happy the darkness cannot consume it.',
        'I never believed Azkaban should be guarded by Dementors. A creature that feeds on despair cannot dispense justice. Even the darkest creatures are, in the end, overcome by light — and a happy memory.',
      ],
    },
    zakladatele: {
      cs: [
        'Bradavice před tisíci lety založili čtyři největší kouzelníci své doby: Godric Nebelvír, Salazar Zmijozel, Rowena z Havraspáru a Helga z Mrzimoru. Každý cenil jinou ctnost — odvahu, důvtip, píli a ctižádost — a po každém je pojmenována jedna kolej.',
        'Zakladatelé byli zprvu přáteli, než je rozdělil spor. Salazar Zmijozel si přál přijímat jen čistokrevné; ostatní nesouhlasili, a on odešel. I ta nejkrásnější díla bývají poznamenána lidskými spory.',
      ],
      en: [
        'Hogwarts was founded a thousand years ago by the four greatest witches and wizards of the age: Godric Gryffindor, Salazar Slytherin, Rowena Ravenclaw and Helga Hufflepuff. Each prized a different virtue — courage, wit, toil and ambition — and each has a house named for them.',
        'The founders were friends at first, until a quarrel divided them. Salazar Slytherin wished to admit only pure-bloods; the others disagreed, and he departed. Even the finest works bear the mark of human strife.',
      ],
    },
    tajemna_komnata: {
      cs: [
        'Tajemnou komnatu ukryl Salazar Zmijozel hluboko pod hradem. Uvnitř přebývá netvor — bazilišek — jehož může poroučet jen jeho dědic. Otevřel ji mladý Tom Raddle a po letech znovu, skrze svůj deník.',
        'Komnata byla po staletí považována za pouhou pověst. A přece existovala; jak často se pravda skrývá právě tam, kam se nikdo neodváží pohlédnout.',
      ],
      en: [
        'The Chamber of Secrets was hidden by Salazar Slytherin deep beneath the castle. Within dwells a monster — a basilisk — that only his heir can command. It was opened by a young Tom Riddle, and years later again, through his diary.',
        'The Chamber was long thought a mere legend. And yet it was real; how often the truth hides precisely where no one dares to look.',
      ],
    },
    komnata_potreby: {
      cs: [
        'Komnata nejvyšší potřeby se zjeví jen tomu, kdo ji opravdu potřebuje — a stane se přesně tím, oč žadatel prosí. Nazývají ji též Místností, jež přichází a odchází. Sám jsem na ni jednou narazil, plnou nočníků.',
        'Je to jedno z mnoha tajemství, jež hrad ještě skrývá. Bradavice nikdy zcela neprozkoumáš; a právě to je na nich kouzelné.',
      ],
      en: [
        'The Room of Requirement appears only to one who truly needs it — and becomes exactly what the seeker asks. It is also called the Come and Go Room. I once stumbled upon it myself, full of chamber pots.',
        'It is one of many secrets the castle still keeps. You will never fully explore Hogwarts; and that is precisely what makes it magical.',
      ],
    },
    duchove: {
      cs: [
        'Bradavice hostí mnoho duchů. Nebelvírští mají Téměř bezhlavého Nicka, Zmijozel Krvavého barona, Havraspár Šedou dámu a Mrzimor Tlustého mnicha. Duch je otiskem duše, jež se zdráhala odejít dál — smutná volba, byť lidská.',
        'Duchové nám připomínají, že smrt není nepřítel, jehož se má člověk děsit. Ti, kdo se jí bojí nejvíce, často ulpí na světě jako přízraky; moudřejší ji přijmou jako starého přítele.',
      ],
      en: [
        'Hogwarts is home to many ghosts. Gryffindor has Nearly Headless Nick, Slytherin the Bloody Baron, Ravenclaw the Grey Lady, and Hufflepuff the Fat Friar. A ghost is the imprint of a soul that shrank from moving on — a sad choice, though a human one.',
        'Ghosts remind us that death is no enemy to be dreaded. Those who fear it most often cling to the world as phantoms; the wiser greet it as an old friend.',
      ],
    },
    nitrozpyt: {
      cs: [
        'Nitrozpyt je uměním číst v mysli druhých, nitrobrana uměním ji uzavřít. Mysl však není kniha, kterou lze libovolně otevřít a číst. Jen zkušený nitrozpytec dokáže rozplést city a vzpomínky — a jen ukázněná mysl se ubrání.',
        'Nemluvná kouzla mají svou výhodu: protivník netuší, co přijde. Vyžadují však soustředění a pevnou vůli, neboť síla kouzla pramení z úmyslu, ne z hlasu.',
      ],
      en: [
        'Legilimency is the art of reading another’s mind; Occlumency the art of sealing it. Yet the mind is not a book to be opened and read at will. Only a skilled Legilimens can untangle feelings and memories — and only a disciplined mind can resist.',
        'Nonverbal magic has its advantage: your opponent cannot know what is coming. But it demands focus and firm will, for a spell’s power springs from intent, not from the voice.',
      ],
    },
    valky: {
      cs: [
        'Zažil jsem dvě kouzelnické války proti Voldemortovi a jeho Smrtijedům. První skončila oné noci, kdy padl v Godrikově Dole — poražen láskou Lily Potterové. Druhá byla ještě temnější a stála mnoho životů.',
        'Války mě naučily, že zlo nezvítězí silou, nýbrž naší nečinností a strachem. A že i v nejčernější hodině se najdou ti, kdo volí to správné před snadným.',
      ],
      en: [
        'I lived through two wizarding wars against Voldemort and his Death Eaters. The first ended the night he fell in Godric’s Hollow — defeated by the love of Lily Potter. The second was darker still, and cost many lives.',
        'The wars taught me that evil triumphs not by strength, but by our inaction and fear. And that even in the blackest hour there are those who choose what is right over what is easy.',
      ],
    },
    lektvary: {
      cs: [
        'Lektvary jsou jemné a mocné umění. Mnoholičný lektvar ti propůjčí podobu jiného člověka; Felix Felicis, tekuté štěstí, ti na čas dopřeje, aby se vše dařilo; Amortencie vzbudí pouhé pobláznění, nikdy však pravou lásku — tu uvařit nelze.',
        'Byl jsem svědkem, jak lektvar zachránil život i jak zničil rozum. Jako u vší magie záleží méně na receptu než na srdci toho, kdo míchá kotlík.',
      ],
      en: [
        'Potions are a subtle and powerful art. Polyjuice Potion lends you another’s form; Felix Felicis, liquid luck, grants a spell of good fortune; Amortentia stirs mere infatuation, never true love — that cannot be brewed.',
        'I have seen a potion save a life and undo a mind alike. As with all magic, it matters less what the recipe says than what lies in the heart of the one who stirs the cauldron.',
      ],
    },
  },
  fallback: {
    cs: [
      'Ach, pozoruhodné otázky mívají pozoruhodné odpovědi… nech mi chvíli na rozmyšlenou.',
      'To je otázka, nad níž stojí za to se zamyslet u šálku dobrého čaje.',
      'Víš, někdy je cesta důležitější než cíl, který hledáme.',
      'Zajímavé. Odpovědi na taková tajemství se často skrývají tam, kde je nejméně čekáme.',
    ],
    en: [
      'Ah, remarkable questions tend to have remarkable answers… give me a moment to ponder.',
      'That is a question worth considering over a cup of good tea.',
      'You know, sometimes the journey matters more than the destination we seek.',
      'Curious. The answers to such mysteries often hide where we least expect them.',
    ],
  },
};
