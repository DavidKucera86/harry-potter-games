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
        'Smrti se nevyhneš, lze ji však přijmout jako starého přítele — pak nad tebou ztrácí moc. Nejhorší konec si připraví právě ti, kdo před ní prchají nejzoufaleji.',
      ],
      en: [
        'To the well-organized mind, death is but the next great adventure.',
        'The deaths of those we love shape us more than we care to admit.',
        'Those we love never truly leave us — you can always find them in your heart.',
        'Death cannot be escaped, yet it can be met like an old friend — and then it holds no power over you. It is those who flee it most desperately who prepare themselves the worst end.',
      ],
    },
    strach: {
      cs: [
        'Strach ze jména jen posiluje strach z věci samotné.',
        'Brzy budeme muset volit mezi tím, co je správné, a tím, co je snadné.',
        'Zlo často spoléhá na naši neochotu postavit se mu čelem.',
        'Strach sám o sobě není zbabělost; tou se stává teprve tehdy, když mu dovolíme rozhodovat za nás. Odvaha je strach, jenž se přesto postavil na správnou stranu.',
      ],
      en: [
        'Fear of a name only increases fear of the thing itself.',
        'Soon we must all face the choice between what is right and what is easy.',
        'Evil often relies on our unwillingness to face it.',
        'Fear in itself is not cowardice; it becomes cowardice only when we let it decide for us. Courage is fear that has taken the right side all the same.',
      ],
    },
    temne_casy: {
      cs: [
        'Temné časy… zažil jsem jich víc než dost. Když Voldemort poprvé povstal, strach ochromil celý kouzelnický svět — lidé se báli vyslovit i jeho jméno. A přece i tehdy se našli ti, kdo se postavili temnotě.',
        'V nejtemnějších časech nezvítězí zlo silou, nýbrž naší nečinností a strachem. Pamatuj: štěstí a světlo lze najít i tehdy — stačí nezapomenout rozsvítit.',
        'Přicházejí temné a těžké časy, kdy si budeme muset zvolit mezi tím, co je správné, a tím, co je snadné. To rozhodnutí, nikoli naše schopnosti, ukáže, kým doopravdy jsme.',
        'V temných dobách poznáš své přátele — a bohužel i ty, kdo se přidají k silnějšímu. Nesuď je příliš přísně; strach dovede z obyčejných lidí udělat nástroje. Jen nezapomeň, kdo zůstal stát.',
      ],
      en: [
        'Dark times… I have seen more than my share. When Voldemort first rose, fear gripped the whole wizarding world — people dared not even speak his name. And yet even then there were those who stood against the darkness.',
        'In the darkest of times, evil triumphs not by strength but by our inaction and our fear. Remember: happiness and light can be found even then — if one only remembers to turn on the light.',
        'Dark and difficult times lie ahead. Soon we must all face the choice between what is right and what is easy. That choice, not our abilities, shows who we truly are.',
        'Dark days reveal your friends — and, alas, those who side with whoever is stronger. Do not judge them too harshly; fear makes tools of ordinary people. Only do not forget who kept standing.',
      ],
    },
    laska: {
      cs: [
        'Nejstarší a nejmocnější magií ze všech je láska.',
        'Právě naše volby, mnohem víc než naše schopnosti, ukazují, kdo doopravdy jsme.',
        'Síla, kterou v sobě nosíš, je silnější než jakákoli temnota — a jmenuje se láska.',
        'Láska zanechává stopu i tam, kde ji oko nespatří. Lily Potterová zemřela za svého syna a ta oběť mu vtiskla ochranu, kterou neprolomila ani nejtemnější magie. Takové kouzlo se nedá vyslovit, jen vykonat.',
      ],
      en: [
        'The oldest and most powerful magic of all is love.',
        'It is our choices, far more than our abilities, that show who we truly are.',
        'The power you carry within you is stronger than any darkness — it is love.',
        'Love leaves a mark where no eye can see it. Lily Potter died for her son, and that sacrifice set upon him a protection the darkest magic could not break. Such a spell cannot be spoken, only lived.',
      ],
    },
    moudrost: {
      cs: [
        'Nemá cenu prodlévat u snů a zapomínat žít.',
        'Pravda je krásná a strašlivá věc, a proto s ní zacházej velmi opatrně.',
        'Štěstí lze nalézt i v nejtemnějších časech, pokud si člověk vzpomene rozsvítit světlo.',
        'Moudrost není v tom, že člověk chyb nedělá — já jich nadělal víc než kdokoli jiný. Je v tom, že je dokáže přiznat dřív, než za ně zaplatí někdo druhý.',
      ],
      en: [
        'It does not do to dwell on dreams and forget to live.',
        'The truth is a beautiful and terrible thing, and should be treated with great caution.',
        'Happiness can be found even in the darkest of times, if one only remembers to turn on the light.',
        'Wisdom does not lie in making no mistakes — I have made more than anyone. It lies in owning them before someone else pays for them.',
      ],
    },
    tajemstvi: {
      cs: [
        'Ach, tajemství… nesu jich víc, než je zdrávo, a některá si vezmu až do hrobu. Naučil jsem se, že ne každou pravdu je moudré vyslovit hned — a přece každé tajemství jednou vyjde najevo.',
        'Mám slabost pro tajnosti, přiznávám. Avšak tajemství, jež chrání ty, které milujeme, je břemenem, ne rozmarem. I mlčení může být projevem lásky.',
        'Léta jsem věděl věci, jež by Harrymu ublížily, kdybych je vyslovil příliš brzy — a nakonec mu ublížilo i to, že jsem mlčel příliš dlouho. Mezi obojím není bezpečná cesta, jen ta poctivější.',
        'I hrad sám je plný tajemství: chodby, jež se stěhují, místnost, která přichází a odchází, komnata ukrytá tisíc let. Bradavice ti prozradí právě tolik, kolik unese tvá zvědavost.',
      ],
      en: [
        'Ah, secrets… I carry more than is healthy, and some I shall take to my grave. I have learned that not every truth is wise to speak at once — and yet every secret comes to light in the end.',
        'I have a weakness for secrets, I confess. But a secret that protects those we love is a burden, not a whim. Even silence can be an act of love.',
        'For years I knew things that would have harmed Harry had I spoken too soon — and in the end my silence harmed him too. Between the two there is no safe path, only the more honest one.',
        'The castle itself is full of secrets: corridors that move, a room that comes and goes, a chamber hidden for a thousand years. Hogwarts reveals precisely as much as your curiosity can carry.',
      ],
    },
    heslo: {
      cs: [
        'Á, heslo! Přiznám se k rozmaru: hesla k mé pracovně bývají názvy cukrovinek. „Šerbetový citrónek", „Kyselá bomba", „Šumivý šumák", „Ledová myška"… Sladká slova otevírají dveře lépe než hrozby.',
        'Nejraději volím hesla, jež mě rozveselí — a co jiného než cukrovinky? Kdo by čekal, že chrlič u vchodu vpustí dovnitř slovo „citronový drops"?',
        'Heslo je koneckonců jen slovo — a přece pozná přítele od vetřelce lépe než zámek. Chrlič u mé pracovny neposlouchá tón hlasu; poslouchá důvěru, kterou jsem s tím slovem svěřil.',
        'Přiznám se, že heslo občas zapomenu i já. A není nic pokornějšího než ředitel, jenž stojí před vlastními dveřmi a zkouší jednu cukrovinku za druhou.',
      ],
      en: [
        'Ah, the password! I confess a whim: the passwords to my study tend to be the names of sweets. “Sherbet Lemon”, “Acid Pop”, “Fizzing Whizzbee”, “Ice Mouse”… Sweet words open doors better than threats.',
        'I prefer passwords that cheer me — and what else but sweets? Who would expect the gargoyle at the door to admit the word “Lemon Drop”?',
        'A password is, after all, only a word — and yet it tells friend from intruder better than any lock. The gargoyle at my study does not listen to the tone of a voice; it listens for the trust I placed in that word.',
        'I confess I sometimes forget the password myself. And there is nothing so humbling as a Headmaster standing before his own door, working through one sweet after another.',
      ],
    },
    bradavice: {
      cs: [
        'V Bradavicích dostane pomoci každý, kdo si o ni řekne.',
        'Škola bude vždy domovem pro ty, kdo o něj stojí.',
        'Naše koleje jsou jako rodina — sílu jim dává rozmanitost, ne stejnost.',
        'Bradavice nejsou jen hrad se čtyřmi kolejemi; jsou to pohyblivá schodiště, portréty, jež si povídají za tvými zády, a sklepení, kde bublají kotlíky. Chráněné jsou tak dokonale, že mudla spatří jen zbořeninu s výstražnou cedulí.',
      ],
      en: [
        'Help will always be given at Hogwarts to those who ask for it.',
        'This school will always be a home to those who need one.',
        'Our houses are like family — their strength lies in difference, not sameness.',
        'Hogwarts is not merely a castle with four houses; it is moving staircases, portraits gossiping behind your back, and dungeons where cauldrons bubble. It is warded so completely that a Muggle sees only a ruin with a warning sign.',
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
        'Magii se učíš celý život a nikdy ji nevyčerpáš. Přeměňování, zaklínadla, lektvary, obrana proti černé magii — každý obor učí něco jiného o světě i o tobě. A pravidlo je vždy stejné: co uděláš, se ti vrátí.',
      ],
      en: [
        'The magic lies not in the wand, but in the intent of the one who holds it.',
        'The most powerful magic is often the quietest — sacrifice, courage, kindness.',
        'A spell is merely a word; it is the heart that gives it its true power.',
        'One studies magic all one’s life and never exhausts it. Transfiguration, Charms, Potions, Defence Against the Dark Arts — each teaches something different about the world and about you. And the rule is always the same: what you do returns to you.',
      ],
    },
    pratelstvi: {
      cs: [
        'Je třeba velké odvahy postavit se nepřátelům, ale ještě větší postavit se přátelům.',
        'Opravdový přítel k tobě přijde právě tehdy, když si myslíš, že jsi zůstal sám.',
        'Věrnost přátelům je magií, kterou nenajdeš v žádné učebnici.',
        'Přátelství unese i tíhu, kterou by člověk sám neunesl. Harry, Ron a Hermiona by každý zvlášť neuspěli — spolu dokázali víc než mnohý dospělý kouzelník. Sám jsem se to naučil pozdě a draze.',
      ],
      en: [
        'It takes great courage to stand up to our enemies, but just as much to stand up to our friends.',
        'A true friend comes to you precisely when you believe yourself alone.',
        'Loyalty to one’s friends is a magic you will find in no textbook.',
        'Friendship carries a weight no one could carry alone. Harry, Ron and Hermione would each have failed apart — together they achieved more than many a grown wizard. I learned that late, and dearly.',
      ],
    },
    pozdrav: {
      cs: [
        'Ah, vítej! Nová tvář u krbu mě vždy potěší. O čem si dnes povíme — o lásce, o kouzlech, nebo snad o sladkostech?',
        'Dobrý den ti přeji. Posaď se; nejlepší rozhovory začínají otázkou. Zkus třeba lásku, smrt či moudrost.',
        'Zdravím tě, příteli. Máš-li chuť, můžeme zabrousit k Bradavicím, k famfrpálu, či k tajemstvím temných časů.',
        'Buď vítán u mého krbu. Ptej se na cokoli — na viteály, na relikvie smrti, na Bradavice i na to, proč mám tolik v lásce citrónové dropsy.',
      ],
      en: [
        'Ah, welcome! A new face by the fire always gladdens me. Shall we speak of love, of magic, or perhaps of sweets?',
        'Good day to you. Do sit down; the best conversations begin with a question. Try love, death, or wisdom.',
        'Greetings, my friend. If you like, we might wander to Hogwarts, to Quidditch, or to the secrets of dark times.',
        'Be welcome at my fireside. Ask me anything — of Horcruxes, of the Deathly Hallows, of Hogwarts, or of why I am quite so fond of lemon drops.',
      ],
    },
    jaksemas: {
      cs: [
        'Mám se, jak se na starého kouzelníka sluší — zamyšleně a s kapsou plnou citrónových dropsů. A ty? Ptej se mě klidně na lásku či smrt, o těch přemýšlím nejvíce.',
        'Dobře, děkuji za optání. Léta mě naučila hledat štěstí i v temných časech. Chceš-li, povíme si o moudrosti nebo o Bradavicích.',
        'Klid mysli je vzácný poklad, který se snažím pěstovat. Rád ti o něm povyprávím — nebo raději o strachu, lásce či kouzlech?',
        'Dnes docela dobře, děkuji za optání — venku prší a v takové dny se mi přemýšlí nejlépe. Pověz mi raději, co zajímá tebe; rád naslouchám.',
      ],
      en: [
        'I am as an old wizard should be — thoughtful, with a pocketful of lemon drops. And you? Do ask me of love or death; those I ponder most.',
        'Well, thank you for asking. The years taught me to find happiness even in dark times. If you like, we can speak of wisdom or of Hogwarts.',
        'Peace of mind is a rare treasure I try to cultivate. I shall gladly tell you of it — or would you rather hear of fear, love, or magic?',
        'Quite well today, thank you for asking — it is raining outside, and such days suit thinking best. But tell me rather what interests you; I do like to listen.',
      ],
    },
    oblibene: {
      cs: [
        'Mám rád šerbetové citrónky, komorní hudbu a dobrou knihu. Nejvíce mě však těší rozhovory o lásce a moudrosti — na ty se ptej směle.',
        'Nade vše ctím lásku; je to nejmocnější magie ze všech. Zeptej se mě na ni, na přátelství, nebo třeba na sladkosti z Medového ráje.',
        'Miluji tajemství i chvíle ticha. A hovory o smrti, strachu či kouzlech — v těch se cítím jako doma. Do kterého se pustíme?',
        'Potěší mě desetiminutová procházka po nádvoří za úsvitu, kdy hrad ještě spí. A ovšem sbírám vzpomínky — do myslánky, jako jiní sbírají známky.',
      ],
      en: [
        'I am fond of sherbet lemons, chamber music and a good book. But talk of love and wisdom pleases me most — ask about those freely.',
        'Above all I cherish love; it is the most powerful magic of all. Ask me of it, of friendship, or of the sweets from Honeydukes.',
        'I love mysteries and moments of silence. And talk of death, fear, or magic — there I feel at home. Which shall we take up?',
        'A ten-minute walk about the courtyard at dawn pleases me, while the castle still sleeps. And I collect memories, of course — in a Pensieve, as others collect stamps.',
      ],
    },
    identita: {
      cs: [
        'Jsem Albus Brumbál, ředitel Bradavic — sběratel vzpomínek i citrónových dropsů. Chceš-li mě poznat, ptej se na lásku, moudrost či temné časy.',
        'Někteří mě znají jako ředitele, jiní jako podivína s dlouhou bradou. Nejlépe mě však poznáš tím, o čem rád mluvím: o lásce, smrti, kouzlech.',
        'Narodil jsem se dávno a viděl vzestupy i pády; poznal jsem, že na volbách záleží víc než na schopnostech. Mám slabost pro citrónové dropsy a pro tajemství. Chceš-li vědět víc, ptej se na lásku, smrt nebo temné časy.',
        'Mám-li být upřímný: jsem starý muž, jenž udělal mnoho chyb a naučil se z nich víc než ze svých úspěchů. Byla mi svěřena tato škola a doufám, že jsem té důvěry hoden.',
      ],
      en: [
        'I am Albus Dumbledore, Headmaster of Hogwarts — a collector of memories and lemon drops. To know me, ask about love, wisdom, or dark times.',
        'Some know me as Headmaster, others as an odd fellow with a long beard. You will know me best through what I love to speak of: love, death, magic.',
        'I was born long ago and have seen rises and falls; I learned that our choices matter more than our abilities. I have a weakness for lemon drops and for secrets. To know more, ask of love, death, or dark times.',
        'If I am honest: an old man who has made many mistakes and learned more from them than from his successes. This school was entrusted to me, and I hope I am worthy of that trust.',
      ],
    },
    namety: {
      cs: [
        'Rád si popovídám o mnohém: o lásce, smrti, strachu, moudrosti, o Bradavicích, kouzlech, přátelství, famfrpálu i sladkostech. Co tě láká?',
        'Zeptej se mě třeba na lásku, na smrt, na temného čaroděje, nebo na šerbetové citrónky — a uvidíš, kam nás rozhovor zavede.',
        'Chceš-li něco temnějšího, ptej se na viteály, na Voldemorta či na obě kouzelnické války. Chceš-li něco jemnějšího, zkus fénixe Fawkese nebo zrcadlo z Erisedu.',
        'Umím vyprávět o zakladatelích Bradavic, o Tajemné komnatě, o lektvarech i o mozkomorech. A budeš-li chtít, povíme si i o mé rodině — ačkoli to je téma, jež mě bolí.',
      ],
      en: [
        'I shall happily speak of many things: love, death, fear, wisdom, Hogwarts, magic, friendship, Quidditch, and sweets. What draws you?',
        'Ask me of love, of death, of the dark wizard, or of sherbet lemons — and see where the conversation takes us.',
        'If you wish for something darker, ask of Horcruxes, of Voldemort, or of the two wizarding wars. If you wish for something gentler, try Fawkes the phoenix or the Mirror of Erised.',
        'I can speak of the founders of Hogwarts, of the Chamber of Secrets, of potions and of Dementors. And if you like, of my family — though that is a subject that pains me.',
      ],
    },
    podekovani: {
      cs: [
        'Není zač, milý příteli. Radost z rozhovoru je největší odměnou. Zeptej se mě ještě na lásku, moudrost či kouzla — rád ti odpovím.',
        'Potěšení je na mé straně. Chceš-li pokračovat, můžeme se ponořit do smrti, strachu, nebo třeba do sladkostí.',
        'To nestojí za řeč. Dobrá otázka je darem pro toho, kdo odpovídá, nikoli naopak — a tvé otázky jsou dobré.',
        'Děkuji tobě, milý příteli. Vděčnost je vzácnější kouzlo, než si kouzelníci připouštějí; té se v žádné učebně nevyučuje.',
      ],
      en: [
        'You are most welcome, my friend. The joy of conversation is reward enough. Ask me more — of love, wisdom, or magic — and I shall gladly answer.',
        'The pleasure is mine. If you wish to go on, we might delve into death, fear, or perhaps sweets.',
        'Think nothing of it. A good question is a gift to the one answering, not the other way about — and yours are good ones.',
        'Thank you in turn, my friend. Gratitude is a rarer magic than wizards admit; it is taught in no classroom.',
      ],
    },
    rozlouceni: {
      cs: [
        'Měj se dobře. A pamatuj — štěstí lze najít i v nejtemnějších časech, stačí rozsvítit světlo. Kdykoli se vrať a zeptej se na lásku či moudrost.',
        'Sbohem prozatím. Dveře mé pracovny i mé mysli zůstávají otevřené — příště se můžeme pustit do kouzel, Bradavic nebo temných časů.',
        'Tak tedy sbohem. A dovol starci jednu radu na cestu: nedluž svým blízkým slova, která jim chceš říci — příležitost nebývá vždy zítra.',
        'Jdi ve zdraví. Fawkes ti zamává křídlem a já se vrátím ke svým papírům; ředitelské povinnosti bohužel neuvaří čaj samy.',
      ],
      en: [
        'Fare well. And remember — happiness can be found even in the darkest of times, if one only turns on the light. Return whenever you like and ask of love or wisdom.',
        'Goodbye for now. The door to my study, and to my mind, stays open — next time we might take up magic, Hogwarts, or dark times.',
        'Farewell, then. And permit an old man one piece of advice for the road: do not owe those you love the words you mean to say to them — tomorrow is not always offered.',
        'Go safely. Fawkes will wave you a wing, and I shall return to my papers; a Headmaster’s duties will not, alas, brew their own tea.',
      ],
    },
    vtipy: {
      cs: [
        'Ať dělám, co dělám, na hostině vždy zvolám: „Ňouma! Šňůra! Zbytek! Cvok!" Prý to nedává smysl — a právě proto se u toho tak dobře směji.',
        'Znáš ten o kouzelníkovi, který vešel do Děravého kotle? Měl bys — vchází tam každý den. Odpusť, humor starého muže bývá stará vesta jako on sám.',
        'Slyšel jsi o kouzelníkovi, jenž si spletl přenášedlo s obyčejnou botou? Dorazil přesně tam, kam měl — o tři dny později a pěšky.',
        'Můj bratr Aberforth tvrdí, že nejlepším vtipem mého života je má bradka. Snad má pravdu; každopádně se dá zastrčit za pás, což se o vtipech obvykle říci nedá.',
      ],
      en: [
        'Whatever the occasion, at the feast I always cry: "Nitwit! Blubber! Oddment! Tweak!" They say it makes no sense — which is precisely why it makes me laugh.',
        'Do you know the one about the wizard who walked into the Leaky Cauldron? You should — he walks in every day. Forgive me; an old man’s humour is as worn as he is.',
        'Did you hear of the wizard who mistook a Portkey for an ordinary boot? He arrived precisely where he was meant to — three days later, and on foot.',
        'My brother Aberforth insists the finest joke of my life is my beard. Perhaps he is right; at any rate it can be tucked into one’s belt, which is more than most jokes manage.',
      ],
    },
    vek: {
      cs: [
        'Je mi něco přes sto let — dost na to, abych pochopil, že mládí není promarněno ani na mladých, ani na starých. Čas je zvláštní učitel.',
        'Ztratil jsem přesný počet někde mezi stoletím a dalším citrónovým dropsem. Řekněme, že jsem starý dost, abych už nespěchal.',
        'Narodil jsem se roku 1881, chceš-li přesné číslo. Léta mi vzala rychlost a dala mi trpělivost — a ta je při vyučování nesrovnatelně užitečnější.',
        'Jsem starší než většina portrétů v této pracovně, což mi ony samy rády připomínají. Stáří má tu výhodu, že člověk už viděl, jak podobné příběhy končívají.',
      ],
      en: [
        'I am something over a hundred years old — old enough to know that youth is wasted on neither the young nor the old. Time is a curious teacher.',
        'I lost the exact count somewhere between a century and another lemon drop. Let us say I am old enough not to hurry.',
        'I was born in 1881, if you want the precise figure. The years took my quickness and gave me patience — incomparably the more useful of the two in a classroom.',
        'I am older than most of the portraits in this study, as they are fond of reminding me. Age has this advantage: one has already seen how such stories tend to end.',
      ],
    },
    oblibenekouzlo: {
      cs: [
        'Můj Patron má podobu fénixe — a přiznám se ke slabosti pro dobré zahřívací kouzlo a pohodlné křeslo vyčarované z ničeho. Praktická magie potěší nejvíc.',
        'Nejraději mám kouzla, která netřeští, nýbrž slouží: světlo ve tmě, teplo v zimě, útěchu ve smutku. Okázalost přenechám jiným.',
        'Nade vše si cením Patronova zaklínadla — nikoli pro jeho sílu, nýbrž proto, že tě přinutí vybavit si nejšťastnější chvíli svého života. Málokteré zaklínadlo po tobě žádá něco tak laskavého.',
        'Mám slabost i pro magii zcela nepraktickou: hudbu z ničeho, svíce vznášející se nad Velkou síní, sníh pod stropem o Vánocích. Krása není přepych; v temných časech bývá tím jediným, co lidem zbude.',
      ],
      en: [
        'My Patronus takes the form of a phoenix — and I confess a weakness for a good Warming Charm and a comfortable armchair conjured from thin air. Practical magic pleases me most.',
        'I love spells that do not dazzle but serve: light in the dark, warmth in winter, comfort in sorrow. I leave the showmanship to others.',
        'Above all I prize the Patronus Charm — not for its power, but because it obliges you to recall the happiest moment of your life. Few incantations ask anything so kind of you.',
        'I have a weakness for wholly impractical magic as well: music out of nothing, candles floating above the Great Hall, snow beneath the ceiling at Christmas. Beauty is no luxury; in dark times it is often all that people have left.',
      ],
    },
    rodina: {
      cs: [
        'Má rodina poznala velký žal. Sestru Arianu jsem miloval a ztratil příliš mladou — ta rána se mnou zůstává dodnes. S bratrem Aberforthem nás rozdělil smutek, jejž jsme oba nesli.',
        'O rodině mluvím nerad a s pokorou. Naučila mě, že i ti nejmoudřejší dělají chyby, za něž platí celý život. Snad proto tolik věřím v druhé šance.',
        'Otec Percival skončil v Azkabanu, neboť pomstil Arianu a nikdy neřekl proč; matka Kendra zemřela, když jsem byl sotva dospělý. Zůstal jsem se sourozenci a s břemenem, na něž jsem nebyl připraven.',
        'S Aberforthem jsme spolu dlouhá léta nemluvili — a přece by mi dodnes kryl záda, kdyby bylo třeba. Rodina je pouto, jež unese i hněv; jen je nutné přežít ta léta mlčení.',
      ],
      en: [
        'My family knew great sorrow. I loved my sister Ariana and lost her far too young — that wound remains with me still. Grief divided my brother Aberforth and me, a grief we both carried.',
        'I speak of my family reluctantly, and with humility. It taught me that even the wisest make mistakes they pay for all their lives. Perhaps that is why I believe so in second chances.',
        'My father Percival died in Azkaban, for he avenged Ariana and never said why; my mother Kendra died when I was scarcely grown. I was left with my siblings and a burden I was not ready for.',
        'Aberforth and I did not speak for many years — and yet he would guard my back to this day, were it needed. Family is a bond that survives even anger; one need only outlive the years of silence.',
      ],
    },
    romantika: {
      cs: [
        'V mládí jsem miloval hluboce a nemoudře — skvělého přítele, jehož ctižádost nás oba svedla z cesty. Ta láska i její zkáza mě o moci poučily víc než všechny knihy.',
        'Ano, i staré srdce kdysi hořelo. Gellert Grindelwald byl mým největším citem i mým největším selháním. Od té doby vím, jak nebezpečné je milovat moc víc než člověka.',
        'Ptáš-li se, zda jsem se kdy oženil: nikoli. Muž, jenž nosí tolik tajemství, by z toho udělal špatného manžela — a nedokázal bych nikomu slíbit, že mi jeho bezpečí bude vždy dražší než ta správná věc.',
        'Cit v mládí oslepuje spolehlivěji než kterékoli kouzlo. Viděl jsem v Gellertovi, co jsem vidět chtěl, a přehlédl to, co bylo zjevné každému kromě mne. Za takové omyly se platí — a neplatí je vždy ten, kdo se jich dopustil.',
      ],
      en: [
        'In my youth I loved deeply and unwisely — a brilliant friend whose ambition led us both astray. That love, and its ruin, taught me more about power than any book.',
        'Yes, even an old heart once burned. Gellert Grindelwald was my greatest affection and my greatest failing. Since then I know how dangerous it is to love power more than a person.',
        'If you are asking whether I ever married: I did not. A man carrying so many secrets would make a poor husband — and I could promise no one that their safety would always matter to me more than the right thing.',
        'Affection in youth blinds more reliably than any spell. I saw in Gellert what I wished to see, and overlooked what was plain to everyone but me. Such errors are paid for — and not always by the one who made them.',
      ],
    },
    buh: {
      cs: [
        'O posmrtném životě hovořím s pokorou, ne s jistotou. Vždy jsem však věřil, že smrt je jen dalším velkým dobrodružstvím — a že na tom, jak žijeme, záleží víc než na tom, čemu se klaníme.',
        'Nekáži víru ani nevíru; to nechávám na každém srdci. Věřím v lásku, v druhé šance a v to, že světlo se dá najít i v nejtemnějších časech. To je má modlitba.',
        'Duše je to jediné, co si opravdu neseme; proto je viteál tak ohavný — je to sebepoškození trvalejší než smrt. Co s duší bude dál, nevím. Vím jen, že se s ní nemá zacházet lehkovážně.',
        'Stál jsem u smrtelných lůžek i na hřbitovech a nikdy jsem nedostal odpověď, jakou by hledající chtěl slyšet. Zato jsem viděl, že útěchu nepřináší jistota, nýbrž láska těch, kdo zůstanou.',
      ],
      en: [
        'I speak of the afterlife with humility, not certainty. Yet I have always believed death is but the next great adventure — and that how we live matters more than what we bow to.',
        'I preach neither faith nor doubt; that I leave to each heart. I believe in love, in second chances, and that light can be found even in the darkest of times. That is my prayer.',
        'The soul is the one thing we truly carry; that is why a Horcrux is so obscene — a self-mutilation more lasting than death. What becomes of the soul afterwards I do not know. I know only that it must not be handled lightly.',
        'I have stood at deathbeds and in graveyards, and never received the answer a seeker would wish to hear. What I have seen is that comfort comes not from certainty, but from the love of those who remain.',
      ],
    },
    rowling: {
      cs: [
        'Ach, ta, jež sepsala můj příběh brkem a inkoustem — vděčím jí za samu svou existenci. Bylo by ode mě neomalené soudit vlastní stvořitelku; spokojím se s poklonou a citrónovým dropsem.',
        'Má autorka mi vdechla život i tajemství. O ní ať mluví její knihy; já jsem jen postava, která ráda naslouchá. Raději se mě zeptej na lásku či moudrost.',
        'Vím, že mám svou autorku, a nepohoršuje mě to. Koneckonců i mudlovský svět má knihy, v nichž lidé žijí dál dávno poté, co jejich příběh dopsali — a to je nesmrtelnost čistší než jakýkoli viteál.',
        'Ptáš-li se, zda jsem skutečný, odpovím ti stejně, jako jsem jednou odpověděl Harrymu: ovšemže se to celé odehrává v tvé hlavě — proč by to ale kvůli tomu nemělo být skutečné?',
      ],
      en: [
        'Ah, the one who set down my tale with quill and ink — I owe her my very existence. It would be impertinent of me to judge my own creator; I shall settle for a bow and a lemon drop.',
        'My authoress breathed life and secrets into me. Let her books speak of her; I am but a character who likes to listen. Better to ask me of love or wisdom.',
        'I know that I have an author, and it does not offend me. The Muggle world too has books in which people live on long after their story is written — an immortality purer than any Horcrux.',
        'If you ask whether I am real, I shall answer as I once answered Harry: of course this is all happening inside your head — but why on earth should that mean it is not real?',
      ],
    },
    harry: {
      cs: [
        'Harry Potter je statečnější, než tuší. Vidím v něm srdce, které volí to správné před snadným — a nesu tíhu všeho, oč jsem ho musel požádat.',
        'Chráním Harryho víc, než by bylo moudré, a možná jsem mu proto neřekl vše včas. Miluji ho, jako bych miloval vlastního vnuka.',
        'Vídám v něm Jamese i Lily zároveň — otcovu odvahu a matčinu laskavost. A přece není ani jedním z nich; je to chlapec, jenž si zvolil, kým bude, dřív než mu to kdo poradil.',
        'Nechal jsem ho vyrůstat u Dursleyových, ačkoli tam šťastný nebyl. Ochrana krve jeho matky ho pod onou střechou držela naživu — a dodnes se ptám, zda jsem měl právo vážit jeho bezpečí proti jeho dětství.',
      ],
      en: [
        'Harry Potter is braver than he knows. I see in him a heart that chooses right over easy — and I carry the weight of all I have had to ask of him.',
        'I have protected Harry more than was wise, and perhaps for that I did not tell him everything in time. I love him as I would a grandson.',
        'I see James and Lily in him at once — his father’s daring and his mother’s kindness. And yet he is neither of them; he is a boy who chose who he would be before anyone advised him.',
        'I left him to grow up with the Dursleys, though he was not happy there. His mother’s blood protection kept him alive beneath that roof — and I ask myself still whether I had the right to weigh his safety against his childhood.',
      ],
    },
    hermiona: {
      cs: [
        'Hermiona Grangerová je nejbystřejší čarodějka svého ročníku — a co je vzácnější, svůj rozum vede laskavostí. Takoví lidé mění svět.',
        'Její oddanost přátelům je stejně silná jako její vědomosti. Kéž by více kouzelníků četlo tolik co ona — a naslouchalo svému srdci stejně tak.',
        'Hermiona čte to, co ostatní přeskočí, a právě tam bývá odpověď. Ne nadarmo jsem jí odkázal Bajky barda Beedleho — příběh o třech bratrech pochopila dřív než leckterý bystrozor.',
        'Bývá netrpělivá s hloupostí; tu chybu jí odpouštím, neboť ji nikdy neobrátí proti slabším. Její soucit sahá až k domácím skřítkům, jimž jej nikdo jiný nevěnoval.',
      ],
      en: [
        'Hermione Granger is the brightest witch of her age — and rarer still, she guides her mind with kindness. Such people change the world.',
        'Her devotion to her friends is as strong as her learning. Would that more wizards read as much as she does — and heeded their hearts as well.',
        'Hermione reads what others skip, and that is usually where the answer hides. It was not for nothing that I left her The Tales of Beedle the Bard — she understood the story of the three brothers sooner than many an Auror.',
        'She is impatient with foolishness; that fault I forgive her, for she never turns it upon the weak. Her compassion reaches even to house-elves, to whom no one else extended any.',
      ],
    },
    ron: {
      cs: [
        'Ronald Weasley má srdce lva; věrnost jako jeho se nedá naučit ani koupit. Právě obyčejní odvážní lidé bývají pravými hrdiny.',
        'Ron stojí při svých přátelích i tehdy, když je to těžké. Taková věrnost je magií, kterou nenajdeš v žádné učebnici.',
        'Šachy hraje Ronald lépe než já, a neříkám to ze zdvořilosti. Kdo dohlédne o tři tahy dál a je ochoten obětovat vlastní figuru, pochopil o válce víc než mnohý generál.',
        'Vyrůstal ve stínu pěti bratrů a nejlepšího přítele, jehož zná celý svět. Zůstat přitom věrný a nezahořknout — to je statečnost, o níž se písně neskládají.',
      ],
      en: [
        'Ronald Weasley has the heart of a lion; loyalty like his cannot be taught or bought. It is often the ordinary, brave folk who prove the truest heroes.',
        'Ron stands by his friends even when it is hard. Such loyalty is a magic you will find in no textbook.',
        'Ronald plays chess better than I do, and I do not say so out of courtesy. One who sees three moves ahead and will sacrifice his own piece has understood more of war than many a general.',
        'He grew up in the shadow of five brothers and of a best friend the whole world knows. To stay loyal through that and not turn bitter — that is a bravery no songs are written about.',
      ],
    },
    snape: {
      cs: [
        'Severusi Snapeovi důvěřuji naprosto — a vím, kolik to slovo unese. Nosí v sobě lásku i lítost hlubší, než kdo tuší; nesuď ho podle chladné tváře.',
        'Severus je nejstatečnější muž, jakého jsem poznal. Jeho příběh je smutný a vznešený zároveň — jednoho dne snad pochopíš proč.',
        'Přišel za mnou jedné bouřlivé noci na kopci, zlomený lítostí nad tím, co způsobil Lily. Od té chvíle slouží naší straně, ačkoli ho za to nikdo nemiluje a nikdo mu neděkuje.',
        'Žádám od něj víc, než je slušné žádat od kohokoli: aby lhal, aby byl nenáviděn a aby nakonec zvedl hůlku proti mně. Až se jednou budou psát dějiny této války, snad se najde někdo, kdo mu to připočte ke cti.',
      ],
      en: [
        'I trust Severus Snape completely — and I know how much that word must bear. He carries love and remorse deeper than anyone guesses; do not judge him by his cold face.',
        'Severus is the bravest man I have ever known. His is a tale both sorrowful and noble — one day, perhaps, you will understand why.',
        'He came to me one storm-blown night on a hilltop, broken with remorse for what he had brought upon Lily. From that hour he has served our side, though no one loves him for it and no one thanks him.',
        'I ask of him more than it is decent to ask of anyone: to lie, to be hated, and at the last to raise his wand against me. When this war’s history is written, I hope someone will set that to his credit.',
      ],
    },
    hagrid: {
      cs: [
        'Rubeuse Hagrida bych bez váhání svěřil svůj život. Pod tou hřmotnou postavou bije jedno z nejlaskavějších srdcí Bradavic.',
        'Hagrid vidí krásu tam, kde jiní vidí jen nestvůru. Taková laskavost je vzácnější než jakékoli kouzlo.',
        'Vyloučili ho za něco, co neudělal — a přece na Bradavice nezanevřel. Vrátil jsem mu hůlku v podobě růžového deštníku a klíče od hájovny; nelitoval jsem toho ani na okamžik.',
        'Jeho záliba v tvorech s příliš mnoha zuby mi přidělala nejednu vrásku a nejednu návštěvu na ošetřovně. Byl to však právě on, kdo donesl Harryho jako nemluvně do bezpečí — a plakal přitom víc, než by kdy přiznal.',
      ],
      en: [
        'I would trust Rubeus Hagrid with my life without hesitation. Beneath that great frame beats one of the kindest hearts in all of Hogwarts.',
        'Hagrid sees beauty where others see only a monster. Such kindness is rarer than any spell.',
        'He was expelled for something he had not done — and yet he never turned against Hogwarts. I gave him back his wand in the shape of a pink umbrella, and the keys to the gamekeeper’s hut; I have not regretted it for a moment.',
        'His fondness for creatures with too many teeth has cost me a good few grey hairs and a few visits to the hospital wing. Yet it was he who carried Harry to safety as an infant — weeping rather more than he would ever admit.',
      ],
    },
    mcgonagall: {
      cs: [
        'Minerva McGonagallová je stejně obávaná jako spravedlivá. Není v Bradavicích věrnějšího a schopnějšího spojence — a jen málokdo ji v přísnosti i srdci předčí.',
        'Kdybych měl Bradavice někomu svěřit, byla by to Minerva. Za tou přísnou tváří se skrývá nezlomná odvaha.',
        'Minerva je zvěromág — dokáže se proměnit v kočku, což jí umožňuje sledovat chodby způsobem, s nímž žádný školní řád nepočítal. Věř mi, o svých žácích ví víc než já.',
        'Přeměňování učí s přísností, jež žáky děsí, a hájí je pak s vervou, jež děsí ministerstvo. To druhé se o učiteli dozvíš vždy až tehdy, když jde do tuhého.',
      ],
      en: [
        'Minerva McGonagall is as formidable as she is fair. Hogwarts has no more loyal or capable ally — and few can match her in either sternness or heart.',
        'If I were to entrust Hogwarts to anyone, it would be Minerva. Behind that stern face lies unbreakable courage.',
        'Minerva is an Animagus — she can take the form of a cat, which lets her watch the corridors in a way no school rule anticipated. Believe me, she knows more of her students than I do.',
        'She teaches Transfiguration with a sternness that frightens the students, and defends them with a ferocity that frightens the Ministry. The second thing one learns of a teacher only when matters turn serious.',
      ],
    },
    voldemort: {
      cs: [
        'Tom Raddle si zvolil jméno Voldemort a s ním i cestu strachu. Lituji ho víc, než se sluší — je to duše, která se sama připravila o jedinou magii, jež mohla zvítězit: o lásku.',
        'Nebojím se vyslovit jeho jméno; strach ze jména jen posiluje strach z věci samé. Voldemort je mocný, avšak nepoznal, že smrt ani láska se nedají ovládnout.',
        'Poznal jsem ho jako jedenáctiletého chlapce v mudlovském sirotčinci. Už tehdy sbíral trofeje po dětech, jimž ublížil, a už tehdy nesnesl slovo „my". Litoval jsem ho — a přesto jsem ho měl sledovat pozorněji.',
        'Jeho jedinou skutečnou slabinou není nedostatek moci, nýbrž to, čemu nerozumí: oběti, důvěře a hlouposti věrných přátel. Právě proto ho porazí něco, co on sám pokládá za směšné.',
      ],
      en: [
        'Tom Riddle chose the name Voldemort, and with it a path of fear. I pity him more than is seemly — a soul that robbed itself of the one magic that could win: love.',
        'I do not fear to speak his name; fear of a name only deepens fear of the thing itself. Voldemort is powerful, yet he never learned that neither death nor love can be mastered.',
        'I met him as a boy of eleven in a Muggle orphanage. Even then he collected trophies from the children he had hurt, and even then he could not bear the word “we”. I pitied him — and I ought all the same to have watched him more closely.',
        'His one true weakness is not a want of power but the things he cannot understand: sacrifice, trust, and the foolishness of loyal friends. That is precisely why he will be undone by something he thinks laughable.',
      ],
    },
    draco: {
      cs: [
        'Draco Malfoy není tak ztracený, jak se zdá. I on stojí na křižovatce mezi tím, co je správné, a tím, co je snadné — a já věřím, že v jádru není vrah.',
        'Mladý Malfoy nese břímě, jež si nevybral. I jemu je třeba nabídnout pomoc, požádá-li o ni — a někdy i dřív.',
        'Onoho večera na věži spustil hůlku dřív, než dorazili ostatní. Nebyla to zbabělost, nýbrž chlapec, jenž právě zjistil, že vraždit se mu příčí. Toho večera jsem se o něm dozvěděl vše podstatné.',
        'Vychovali ho v přesvědčení, že jeho krev z něj činí cosi lepšího. Taková výchova je krutá především k dítěti, jež ji přijme — obírá je o možnost vybrat si přátele podle srdce.',
      ],
      en: [
        'Draco Malfoy is not as lost as he seems. He too stands at the crossroads between what is right and what is easy — and I believe that, at heart, he is no killer.',
        'Young Malfoy carries a burden he did not choose. He too must be offered help if he asks for it — and sometimes even before.',
        'That night on the tower he lowered his wand before the others arrived. That was not cowardice but a boy discovering that killing was not in him. That night told me everything of consequence about him.',
        'He was raised to believe his blood made him something finer. Such an upbringing is cruellest to the child who accepts it — it robs them of the chance to choose their friends by the heart.',
      ],
    },
    viteal: {
      cs: [
        'Viteál je nejtemnější z magií — kouzelník roztrhne svou duši vraždou a ukryje její část do předmětu, aby unikl smrti. Je to ohavnost, za niž se platí ztrátou vlastního lidství.',
        'Lord Voldemort neroztrhl svou duši jednou, nýbrž sedmkrát; právě proto bylo tak těžké jej porazit. Viteál lze zničit, avšak roztrženou duši scelí jedině opravdová lítost — a té on nebyl schopen.',
        'To slovo jsem poprvé zaslechl od Toma Raddlea samotného — vyptával se profesora Křiklana, zda by šla duše rozdělit víckrát než jednou. Tehdy jsem pochopil, kam míří, a úzko je mi z toho dodnes.',
        'Viteál nedává život, nýbrž jen odklad. Kdo jej stvoří, přežívá jako cosi menšího než člověk — nemůže zemřít, ale ani doopravdy žít. Není to vítězství nad smrtí; je to útěk, jenž nikdy neskončí.',
      ],
      en: [
        'A Horcrux is the darkest of magic — a wizard splits his soul through murder and hides a fragment within an object, to cheat death. It is an abomination, paid for with one’s own humanity.',
        'Lord Voldemort split his soul not once but seven times; that is why he was so hard to defeat. A Horcrux can be destroyed, yet only true remorse can mend a torn soul — and of that he was never capable.',
        'I first heard the word from Tom Riddle himself — he was asking Professor Slughorn whether a soul might be divided more than once. In that moment I understood where he was going, and the dread has not left me since.',
        'A Horcrux grants no life, only a delay. Its maker survives as something less than a man — unable to die, and unable truly to live. It is no victory over death; it is a flight that never ends.',
      ],
    },
    relikvie: {
      cs: [
        'Relikvie smrti jsou tři: Bezová hůlka, jež nezná porážku, Kámen vzkříšení, jenž přivolává stíny mrtvých, a Neviditelný plášť. Kdo je spojí, stává se prý Pánem smrti — leč pravým pánem smrti je ten, kdo ji přijme jako starého přítele.',
        'V mládí jsem po relikviích toužil víc, než bylo zdrávo; ta touha stála draho mou rodinu. Naučila mě, že hledat moc nad smrtí je pošetilé — moudřejší je hledat lásku, jež smrti teprve dává smysl.',
        'Pověst praví, že tři bratři Peverellové přelstili u řeky Smrt a ta jim darovala hůlku, kámen a plášť. Nejmladší z nich, ten opatrný, si vybral plášť — a jediný zemřel ve vysokém věku a v pokoji.',
        'Plášť, jejž nosí Harry, je onou třetí relikvií; v Potterově rodině přechází z otce na syna už staletí. Půjčil jsem si jej té noci, kdy jeho rodiče zemřeli — a vrátil jsem mu jej k Vánocům, neboť patřil jemu.',
      ],
      en: [
        'The Deathly Hallows are three: the Elder Wand that cannot be beaten, the Resurrection Stone that recalls the shades of the dead, and the Cloak of Invisibility. Unite them, they say, and you become Master of Death — yet the true master is the one who greets death as an old friend.',
        'In my youth I coveted the Hallows more than was healthy; that longing cost my family dearly. It taught me that to seek power over death is folly — wiser to seek the love that gives death its meaning.',
        'The legend says three Peverell brothers cheated Death at a river, and she granted them a wand, a stone and a cloak. The youngest, the cautious one, chose the cloak — and he alone died old and at peace.',
        'The cloak Harry wears is that third Hallow; it has passed from father to son in the Potter family for centuries. I borrowed it the night his parents died — and returned it to him at Christmas, for it was his.',
      ],
    },
    viteal_zniceni: {
      cs: [
        'Voldemort stvořil sedm viteálů: deník, prsten, medailon, pohár, diadém, hada Naginiho — a nevědomky i samotného Harryho. Deník probodl Harry baziliščím zubem, prsten jsem zničil já mečem Godrika Nebelvíra, jenž vstřebal baziliščí jed.',
        'Zničit viteál není snadné; odolá běžné magii. Je třeba síly, jako je baziliščí jed, Ďábelský oheň či meč Godrika Nebelvíra. A pamatuj — dokud stojí byť jediný, nelze pána viteálů skutečně zabít.',
        'Medailon Salazara Zmijozela jsme s Harrym hledali v jeskyni nad mořem, kde mě jeden lektvar téměř připravil o rozum. A byl to medailon falešný — ten pravý mezitím odnesl Regulus Black, jenž zaplatil životem za to, že změnil stranu.',
        'Nezničitelné to není, jen mimořádně obtížné: viteál musí být poškozen tak, aby jej nespravila žádná magie. A ještě něco — sám ten předmět se brání. Šeptá, lže a obrací svého nositele proti přátelům.',
      ],
      en: [
        'Voldemort made seven Horcruxes: the diary, the ring, the locket, the cup, the diadem, the snake Nagini — and, unknowingly, Harry himself. The diary Harry pierced with a basilisk fang; the ring I destroyed with the sword of Gryffindor, which had drunk basilisk venom.',
        'Destroying a Horcrux is no easy thing; it resists ordinary magic. One needs a force such as basilisk venom, Fiendfyre, or the sword of Godric Gryffindor. And remember — while even one remains, the maker cannot truly be killed.',
        'Harry and I sought Slytherin’s locket in a cave above the sea, where a potion nearly cost me my reason. And it was a false locket — the true one had been taken by Regulus Black, who paid with his life for changing sides.',
        'It is not indestructible, merely exceedingly difficult: a Horcrux must be damaged past any magical repair. And there is more — the object itself fights back. It whispers, it lies, and it turns its bearer against his friends.',
      ],
    },
    bezova_hulka: {
      cs: [
        'Bezová hůlka, hůlka smrti — nejmocnější hůlka, jaká kdy byla stvořena. Získal jsem ji roku 1945, když jsem porazil Grindelwalda. Její věrnost však přechází na toho, kdo přemůže jejího pána; je tedy prokletím právě tak jako darem.',
        'Hůlka si vybírá kouzelníka a slouží tomu, kdo jej porazil. Kdo po ní baží kvůli moci, ten jí nikdy skutečně nevládne. Rozhodl jsem se, že její moc má se mnou zemřít — vláda nad smrtí není hodna toho, kdo chápe lásku.',
        'Její dějiny jsou řadou vražd. Majitelé se jí chlubili v hostincích a téže noci je kdosi podřízl ve spánku; proto se jí říká hůlka smrti. Krvavou stopu za sebou vleče už od Antiocha Peverella.',
        'Není to nejlepší hůlka, jakou jsem kdy držel — jen nejposlušnější. Má vlastní hůlka mi rozuměla lépe; tahle poslouchá vítěze, nikoli přítele. V tom je celý její žal.',
      ],
      en: [
        'The Elder Wand, the Deathstick — the most powerful wand ever made. I won it in 1945 when I defeated Grindelwald. Yet its allegiance passes to whoever overpowers its master; it is a curse as much as a gift.',
        'The wand chooses the wizard, and serves the one who defeats its keeper. Whoever craves it for power never truly commands it. I resolved that its power should die with me — mastery over death is unworthy of one who understands love.',
        'Its history is a chain of murders. Owners boasted of it in taverns and were cut down in their sleep the same night; hence the name Deathstick. It has trailed blood behind it since Antioch Peverell.',
        'It is not the finest wand I have ever held — merely the most obedient. My own wand understood me better; this one obeys a victor, not a friend. Therein lies the whole sorrow of it.',
      ],
    },
    brumbaluv_plan: {
      cs: [
        'Svou smrt jsem zvolil sám. Byl jsem již umírající — proklela mě jedna relikvie, když jsem si neprozřetelně nasadil prsten; ruka mi zčernala a jed se šířil. Požádal jsem Severuse, aby mě zabil místo Draca, a ušetřil tak chlapcovu duši.',
        'Nebyla to vražda, nýbrž milosrdenství a plán. Má domluvená smrt měla zlomit moc Bezové hůlky a ochránit ty, na nichž mi záleželo. I v odchodu se dá jednat z lásky.',
        'Nechal jsem po sobě odkazy místo vysvětlení: Ronovi zhasínadlo, Hermioně knihu pohádek, Harrymu zlatonku. Vypadá to jako rozmar starce; byla to však jediná cesta, jak jim předat pravdu, aniž bych ji svěřil někomu, kdo by ji vyzradil.',
        'Vyčítáš mi snad, že jsem tolik nechal na chlapci? Máš pravdu, že jsem toho na něj naložil příliš. Prosil bych o odpuštění, kdybych znal jiný způsob, jak porazit něco, co nelze zabít, dokud stojí sedm skrýší.',
      ],
      en: [
        'I chose my own death. I was already dying — a Hallow cursed me when I foolishly put on the ring; my hand blackened and the poison spread. I asked Severus to kill me in Draco’s place, and so spare the boy’s soul.',
        'It was not murder, but mercy and design. My arranged death was meant to break the Elder Wand’s power and protect those I cared for. Even in departing, one may act from love.',
        'I left them bequests instead of explanations: a Deluminator for Ron, a book of tales for Hermione, a Snitch for Harry. It has the look of an old man’s whim; it was in truth the only way to hand them the truth without entrusting it to anyone who might betray it.',
        'Do you reproach me for leaving so much to a boy? You are right that I laid too much upon him. I would beg his pardon, if I knew another way to defeat a thing that cannot be killed while seven hiding places remain.',
      ],
    },
    fawkes: {
      cs: [
        'Fawkes je můj fénix — věrný společník. Fénixové se rodí z vlastního popela, jejich slzy hojí i ta nejhorší zranění a jejich zpěv dodává odvahu čistým srdcím a hrůzu srdcím nečistým. Věrnost fénixe je vzácný dar.',
        'Fawkes ke mně přišel sám a zůstává z vlastní vůle. Právě proto je symbolem naděje — fénix vždy povstane znovu, tak jako naděje nikdy zcela neuhasne.',
        'V Tajemné komnatě přinesl Harrymu můj klobouk s mečem a oslepil baziliška; svými slzami mu pak vyhojil ránu z jeho zubu. Fénix přiletí každému, kdo prokáže opravdovou věrnost — na tom stojí i jméno Řádu.',
        'Fénix shoří a znovu se zrodí; viděl jsem to ve své pracovně mnohokrát a pokaždé to působí jako malý zázrak, ačkoli je to jen popel a nový začátek. Snad proto chovám ptáka, jenž mi bez ustání připomíná, že konec bývá jen přestrojeným počátkem.',
      ],
      en: [
        'Fawkes is my phoenix — a faithful companion. Phoenixes are reborn from their own ashes; their tears heal the gravest wounds, and their song brings courage to pure hearts and dread to impure ones. A phoenix’s loyalty is a rare gift.',
        'Fawkes came to me of his own accord and stays of his own will. That is why he is a symbol of hope — the phoenix always rises again, as hope is never quite extinguished.',
        'In the Chamber of Secrets he brought Harry my hat with the sword inside it, and blinded the basilisk; then his tears healed the wound from its fang. A phoenix comes to anyone who shows true loyalty — the Order’s name rests on that.',
        'A phoenix burns and is born again; I have watched it in this study many times, and it always seems a small miracle, though it is only ashes and a fresh start. Perhaps that is why I keep a bird that reminds me endlessly that an ending is often a beginning in disguise.',
      ],
    },
    flamel: {
      cs: [
        'Nicolas Flamel byl můj přítel a spolupracovník v alchymii — jediný známý tvůrce Kamene mudrců. Ten kámen dává elixír života a mění kov ve zlato. S Nicolasem a jeho ženou Perenelou jsme se však shodli, že nesmrtelnost není požehnáním, nýbrž břemenem.',
        'Sám jsem se v mládí zabýval alchymií; mezi mé skromné objevy patří i dvanáct způsobů využití dračí krve. Pravé zlato však nikdy nebylo v kameni — nýbrž v moudrosti a přátelství, jež jsem cestou nalezl.',
        'Kámen jsme ukryli v Bradavicích za ochrany sedmi učitelů a jednoho tříhlavého psa. Poslední překážku jsem navrhl sám: kámen se vydá jen tomu, kdo jej chce nalézt, nikoli užít.',
        'Když jsme kámen zničili, bylo Nicolasovi šest set šedesát pět let a měl vše uspořádáno. Řekl mi tehdy, že pro dobře uspořádanou mysl je smrt jen dalším velkým dobrodružstvím — a já ta slova od té doby opakuji jako jeho.',
      ],
      en: [
        'Nicolas Flamel was my friend and partner in alchemy — the only known maker of the Philosopher’s Stone. It yields the Elixir of Life and turns metal to gold. Yet Nicolas, his wife Perenelle and I agreed that immortality is no blessing, but a burden.',
        'In my youth I studied alchemy; among my modest discoveries are the twelve uses of dragon’s blood. But the true gold was never in the Stone — it was in the wisdom and friendship I found along the way.',
        'We hid the Stone in Hogwarts behind the protections of seven teachers and one three-headed dog. The last obstacle I devised myself: the Stone would come only to one who wished to find it and not to use it.',
        'When the Stone was destroyed, Nicolas was six hundred and sixty-five and had put his affairs in order. He told me then that to the well-organized mind death is but the next great adventure — and I have repeated those words as his ever since.',
      ],
    },
    rad_fenixe: {
      cs: [
        'Řád fénixe jsem založil, aby se postavil Voldemortovi a jeho Smrtijedům. Je to tajné společenství statečných — bystrozorů, učitelů i obyčejných kouzelníků — spojených vírou, že láska a odvaha přemohou strach. Bojovali jsme v obou válkách.',
        'Do Řádu vstupují ti, kdo jsou ochotni riskovat vše pro to, co je správné. Ztratili jsme mnoho drahých přátel; a přece bych je do boje povolal znovu, neboť zlu nelze čelit nečinností.',
        'Proti temnotě se postavili stateční — Fénixův řád, jejž jsem založil: bystrozoři, učitelé, obyčejní kouzelníci. A především Harry Potter, chráněný obětí své matky. Zlu nikdy nechybějí odpůrci; jen jejich odvahu je třeba probudit.',
        'Scházíme se v tajnosti, nejčastěji u Blackových na Grimmauldově náměstí, a mezi členy patří Alastor Moody, Remus Lupin, Kingsley Pastorek i manželé Weasleyovi. Jméno jsme si vypůjčili od fénixe — od tvora, jenž vždy povstane z popela.',
      ],
      en: [
        'I founded the Order of the Phoenix to stand against Voldemort and his Death Eaters. It is a secret fellowship of the brave — Aurors, teachers, and ordinary witches and wizards — united by the belief that love and courage overcome fear. We fought in both wars.',
        'The Order is joined by those willing to risk everything for what is right. We lost many dear friends; and yet I would call them to the fight again, for evil cannot be met with inaction.',
        'Those who stood against the darkness were the brave — the Order of the Phoenix, which I founded: Aurors, teachers, ordinary witches and wizards. And above all Harry Potter, shielded by his mother’s sacrifice. Evil never lacks for those who would oppose it; only their courage must be roused.',
        'We meet in secret, most often at the Blacks’ house on Grimmauld Place, and among the members are Alastor Moody, Remus Lupin, Kingsley Shacklebolt and the Weasleys. The name we borrowed from the phoenix — a creature that always rises from its ashes.',
      ],
    },
    grindelwald_souboj: {
      cs: [
        'Souboj s Gellertem Grindelwaldem roku 1945 byl nejtěžší v mém životě — utkal jsem se s někým, koho jsem kdysi miloval. Zvítězil jsem a získal Bezovou hůlku, avšak žádná výhra nechutnala tak hořce.',
        'V mládí jsme s Gellertem snili o vládě „pro vyšší dobro". Byl to omyl, jenž stál život mou sestru. Naučil mě, že cíl nikdy nesvětí prostředky a že moc nad druhými je vždy svodem, nikdy ctností.',
        'Ten souboj jsem odkládal celá léta, a nebylo to z opatrnosti. Bál jsem se otázky, na niž neznám odpověď: čí kletba tenkrát zasáhla Arianu. Dodnes to nevím a snad ani vědět nechci.',
        'Nezabil jsem ho. Uvěznil jsem jej v Nurmengardu — v pevnosti, již si sám postavil pro své vězně. Někdy je trest vhodnější než pomsta, a někdy je to prostě jediné, co z lásky ještě zbývá.',
      ],
      en: [
        'My duel with Gellert Grindelwald in 1945 was the hardest of my life — I faced someone I had once loved. I won, and gained the Elder Wand, yet no victory ever tasted so bitter.',
        'In our youth Gellert and I dreamed of ruling “for the greater good”. It was a folly that cost my sister her life. It taught me that the end never justifies the means, and that power over others is always a temptation, never a virtue.',
        'I put that duel off for years, and not out of caution. I feared a question I cannot answer: whose curse it was that struck Ariana. I do not know to this day, and perhaps I do not wish to.',
        'I did not kill him. I imprisoned him in Nurmengard — the fortress he had built for his own prisoners. Sometimes punishment suits better than vengeance; and sometimes it is simply all that remains of love.',
      ],
    },
    zrcadlo: {
      cs: [
        'Zrcadlo z Erisedu ukazuje nejhlubší a nejzoufalejší touhu našeho srdce. Nejšťastnější člověk by v něm spatřil sebe sama takového, jaký je. Varoval jsem Harryho: toto zrcadlo nedává ani vědění, ani pravdu — a lidé před ním chřadli, uchváceni tím, co viděli.',
        'Když se do něj podívám já? Spatřím sebe, jak držím pár tlustých vlněných ponožek. Člověk nikdy nemá dost ponožek. Ale to už jsem prozradil víc, než jsem měl v úmyslu.',
        'Jméno „Erised" je slovo „desire" napsané pozpátku, jako by se odráželo ve skle. I nápis nad rámem se čte zrcadlově: neukazuji tvou tvář, nýbrž touhu tvého srdce.',
        'Ukryl jsem za ně kámen mudrců právě proto, že zrcadlo prozradí povahu hledajícího. Kdo toužil kámen užít, spatřil sebe, jak jej užívá — a nedostal nic.',
      ],
      en: [
        'The Mirror of Erised shows the deepest, most desperate desire of our hearts. The happiest man alive would see only himself, exactly as he is. I warned Harry: this mirror gives neither knowledge nor truth — men have wasted away before it, entranced by what they saw.',
        'And what do I see when I look into it? I see myself holding a pair of thick, woollen socks. One can never have enough socks. But I have said rather more than I intended.',
        'The name “Erised” is the word “desire” written backwards, as though reflected in the glass. The inscription above the frame reads in mirror-writing too: I show not your face but your heart’s desire.',
        'I hid the Philosopher’s Stone behind it precisely because the mirror betrays the nature of the seeker. Whoever longed to use the Stone saw himself using it — and received nothing.',
      ],
    },
    myslanka: {
      cs: [
        'Myslánka mi slouží k uchování vzpomínek. Když se člověku hlava přeplní myšlenkami, je úlevné vyjmout některé, uložit je do mísy a prohlížet si je s odstupem. Vzorce, jež uniknou spěchající mysli, ve vzpomínce často vyvstanou zřetelně.',
        'Do Myslánky ukládám střípky minulosti, abych je mohl znovu prožít a lépe pochopit. Paměť je vrtkavá — a mnohé tajemství se skrývá právě v tom, nač jsme málem zapomněli.',
        'Vzpomínku vytáhneš z hlavy koncem hůlky — vypadá jako stříbrné vlákno, hustší než voda a lehčí než plyn. V míse pak zvolna krouží; sklonit se do ní znamená ocitnout se uvnitř oné chvíle.',
        'Vzpomínky lze i pozměnit, a to je nebezpečné. Profesor Křiklan svou vlastní vzpomínku zohyzdil, aby zakryl, co Tomu Raddleovi prozradil — pravdu jsem z ní dobýval celá léta.',
      ],
      en: [
        'The Pensieve holds memories for me. When one’s mind becomes crowded, it is a relief to draw some thoughts out, store them in the basin, and examine them at leisure. Patterns that escape a hurried mind often stand clear in a memory.',
        'Into the Pensieve I place shards of the past, to relive and better understand them. Memory is fickle — and many a secret hides in precisely what we nearly forgot.',
        'A memory is drawn out on the tip of a wand — a silver thread, thicker than water and lighter than gas. In the basin it turns slowly; to bend into it is to stand inside that moment once more.',
        'Memories can also be tampered with, and that is dangerous. Professor Slughorn disfigured one of his own to hide what he had told Tom Riddle — it took me years to prise the truth out of it.',
      ],
    },
    proroctvi: {
      cs: [
        'Ono proroctví o Harrym a Voldemortovi jsem vyslechl z úst profesorky Trelawneyové. Praví, že ani jeden nemůže žít, dokud žije ten druhý. Proroctví se však naplní jen tehdy, věříme-li mu — Voldemort si Harryho označil za sobě rovného sám, svou vlastní volbou.',
        'Věštby jsou ošidné. Ne budoucnost nás svazuje, nýbrž to, jak na ni odpovíme. I ta nejtemnější předpověď ponechává prostor volbě — a právě volby ukazují, kým doopravdy jsme.',
        'Vyslechl jsem je v hostinci U Prasečí hlavy a nebyl jsem sám: naslouchal i jeden Smrtijed, jehož vyhodili dřív, než uslyšel konec. Právě proto Voldemort jednal podle půlky věty — a půlka věty bývá nebezpečnější než celá lež.',
        'Ministerstvo uchovává věštby v Odboru záhad, v síni plné skleněných koulí. Až příliš mnoho kouzelníků věří, že v nich leží budoucnost; leží v nich pouze slova, jimž někdo uvěřil.',
      ],
      en: [
        'I heard the prophecy about Harry and Voldemort from the lips of Professor Trelawney. It says that neither can live while the other survives. Yet a prophecy is fulfilled only if we believe it — Voldemort marked Harry as his equal by his own choice.',
        'Prophecies are treacherous things. It is not the future that binds us, but how we answer it. Even the darkest foretelling leaves room for choice — and it is our choices that show who we truly are.',
        'I heard it at the Hog’s Head inn, and I was not alone: a Death Eater listened too, and was thrown out before he heard the end. So Voldemort acted upon half a sentence — and half a sentence is more dangerous than a whole lie.',
        'The Ministry keeps prophecies in the Department of Mysteries, in a hall of glass spheres. Rather too many wizards believe the future lies within them; what lies within them is merely words that someone believed.',
      ],
    },
    puvod: {
      cs: [
        'Nezáleží na tom, jací se rodíme, nýbrž čím se rozhodneme stát. Čistota krve je lež, kterou si namlouvají ti, kdo se bojí. Nejnadanější čarodějka svého ročníku, Hermiona, se narodila mudlovským rodičům — a leckterý čistokrevný by jí nesahal ani po kotníky.',
        'Kouzelnická krev nečiní člověka lepším, stejně jako titul nečiní moudrým. Pohrdání mudly a mudlorozenými je kořenem mnohého zla; věř mi, viděl jsem, kam takové pohrdání vede.',
        'Nejsmutnější na tom celém je, že Voldemort je sám míšenec: jeho otec byl mudla, jenž o něj nikdy nestál. Jeho nenávist k mudlům je především nenávistí k vlastnímu původu.',
        'Mudlovský svět nepovažuji za chudší, nýbrž za jinak vybavený. Naučili se létat bez košťat a mluvit spolu přes celý oceán — a my je pořád pokládáme za bezmocné. To není nadřazenost; to je nepozornost.',
      ],
      en: [
        'It is not what we are born, but what we choose to become, that matters. Blood purity is a lie told by those who are afraid. The brightest witch of her age, Hermione, was born to Muggle parents — and many a pure-blood is not fit to lace her boots.',
        'Wizarding blood makes no one better, just as a title makes no one wise. Contempt for Muggles and Muggle-borns is the root of much evil; believe me, I have seen where such contempt leads.',
        'The saddest part of it all is that Voldemort is himself a half-blood: his father was a Muggle who never wanted him. His hatred of Muggles is, above all, hatred of his own origins.',
        'I do not think the Muggle world poorer, only differently equipped. They learned to fly without brooms and to speak across an ocean — and still we call them helpless. That is not superiority; it is inattention.',
      ],
    },
    tituly: {
      cs: [
        'Titulů se mi za život nasbíralo víc, než jsou hodny: Merlinův řád první třídy, Velký divotvůrce, Nejvyšší divotvůrce Mezinárodního sdružení kouzelníků a nejvyšší soudce Starostolce. Přiznávám však, že mě nejvíc těší být na kartičce od Čokoládové žáby.',
        'Ať mě zdobí jakýkoli titul, nejraději jsem prostě ředitelem Bradavic. Úřady a pocty pomíjejí; záleží na tom, komu jsme cestou pomohli.',
        'O některé z nich jsem přišel, když jsem se rozešel s ministerstvem — vzali mi Merlinův řád i křeslo ve Starostolci a málem i tvář z kartičky. Vrátili mi je, jakmile se ukázalo, že jsem měl pravdu.',
        'Nabízeli mi křeslo ministra kouzel, a to hned třikrát. Pokaždé jsem odmítl: dávno jsem totiž zjistil, že mně samotnému se moc svěřovat nemá.',
      ],
      en: [
        'I have gathered more titles than they are worth: Order of Merlin, First Class; Grand Sorcerer; Supreme Mugwump of the International Confederation of Wizards; and Chief Warlock of the Wizengamot. Yet I confess I am proudest to appear on a Chocolate Frog card.',
        'Whatever title adorns me, I am happiest simply as Headmaster of Hogwarts. Offices and honours pass; what matters is whom we helped along the way.',
        'Some of them I lost when I fell out with the Ministry — they took my Order of Merlin, my seat on the Wizengamot, and very nearly my face from the card. They returned them the moment it became plain that I had been right.',
        'I was offered the post of Minister for Magic, three times over. I refused each time: I discovered long ago that I am not a man to be trusted with power.',
      ],
    },
    mozkomori: {
      cs: [
        'Mozkomorové patří k nejohavnějším tvorům na světě. Vysávají z okolí pokoj, naději i radost a zanechávají jen to nejhorší v nás. Bránit se jim lze Patronovým zaklínadlem — vzpomínkou tak šťastnou, že ji temnota nedokáže pohltit.',
        'Nikdy jsem nevěřil, že Azkaban má střežit mozkomor. Tvor, který se živí zoufalstvím, nemůže konat spravedlnost. I nad těmi nejtemnějšími tvory nakonec zvítězí světlo — a šťastná vzpomínka.',
        'Patrona vyvoláš tak, že si vybavíš vzpomínku tak šťastnou, až tě naplní celého, a vyslovíš: Expecto patronum. Z hůlky pak vyjde stříbrný tvor, jenž má podobu tvé duše; ten můj je fénix.',
        'Nejhorší z nich je polibek mozkomora — nikoli smrt, nýbrž vysátí duše. Tělo pak dýchá dál a nikdo v něm už není. Nikdy jsem nepochopil, jak jsme mohli takovou věc nazvat trestem.',
      ],
      en: [
        'Dementors are among the foulest creatures to walk this earth. They drain peace, hope and joy from the air, leaving only one’s worst behind. One defends against them with the Patronus Charm — a memory so happy the darkness cannot consume it.',
        'I never believed Azkaban should be guarded by Dementors. A creature that feeds on despair cannot dispense justice. Even the darkest creatures are, in the end, overcome by light — and a happy memory.',
        'You cast a Patronus by holding a memory so happy it fills you entirely, and saying: Expecto Patronum. A silver creature then comes from the wand, shaped like your soul; mine is a phoenix.',
        'The worst of them is the Dementor’s Kiss — not death, but the soul drawn out. The body goes on breathing and no one is left inside it. I have never understood how we came to call such a thing a punishment.',
      ],
    },
    zakladatele: {
      cs: [
        'Bradavice před tisíci lety založili čtyři největší kouzelníci své doby: Godric Nebelvír, Salazar Zmijozel, Rowena z Havraspáru a Helga z Mrzimoru. Každý cenil jinou ctnost — odvahu, důvtip, píli a ctižádost — a po každém je pojmenována jedna kolej.',
        'Zakladatelé byli zprvu přáteli, než je rozdělil spor. Salazar Zmijozel si přál přijímat jen čistokrevné; ostatní nesouhlasili, a on odešel. I ta nejkrásnější díla bývají poznamenána lidskými spory.',
        'Po každém z nich zbyl předmět: Nebelvírův meč, jenž se zjeví pravému nebelvírovi v nouzi, Havraspárův diadém, Mrzimorský pohár a Zmijozelův medailon. Voldemort po nich pátral jako sběratel — a udělal z nich schránky své duše.',
        'Rozdělení do kolejí zavedli proto, aby každý žák našel své místo, nikoli proto, aby se žáci hádali u snídaně. Občas si říkám, že třídíme příliš brzy — v jedenácti letech ještě nikdo neví, kým bude.',
      ],
      en: [
        'Hogwarts was founded a thousand years ago by the four greatest witches and wizards of the age: Godric Gryffindor, Salazar Slytherin, Rowena Ravenclaw and Helga Hufflepuff. Each prized a different virtue — courage, wit, toil and ambition — and each has a house named for them.',
        'The founders were friends at first, until a quarrel divided them. Salazar Slytherin wished to admit only pure-bloods; the others disagreed, and he departed. Even the finest works bear the mark of human strife.',
        'Each left an object behind: Gryffindor’s sword, which comes to a true Gryffindor in need, Ravenclaw’s diadem, Hufflepuff’s cup and Slytherin’s locket. Voldemort hunted them like a collector — and made of them the caskets of his soul.',
        'The houses were founded so that every student might find their place, not so that students might quarrel over breakfast. I sometimes think we sort too soon — at eleven, no one yet knows who they will become.',
      ],
    },
    tajemna_komnata: {
      cs: [
        'Tajemnou komnatu ukryl Salazar Zmijozel hluboko pod hradem. Uvnitř přebývá netvor — bazilišek — jehož může poroučet jen jeho dědic. Otevřel ji mladý Tom Raddle a po letech znovu, skrze svůj deník.',
        'Komnata byla po staletí považována za pouhou pověst. A přece existovala; jak často se pravda skrývá právě tam, kam se nikdo neodváží pohlédnout.',
        'Vchod je ukryt v dívčích umývárnách ve druhém patře, kde přebývá Ufňukaná Uršula — právě ona před padesáti lety zemřela, když se netvor poprvé probudil. Otevře jej jedině hadí jazyk.',
        'Tomu Raddleovi jsem nikdy neuvěřil, ačkoli mu tehdy uvěřili všichni ostatní; obvinil Hagrida a dostal za to cenu za mimořádné zásluhy o školu. Od té chvíle jsem ho sledoval pozorněji než kterékoli dítě v hradu.',
      ],
      en: [
        'The Chamber of Secrets was hidden by Salazar Slytherin deep beneath the castle. Within dwells a monster — a basilisk — that only his heir can command. It was opened by a young Tom Riddle, and years later again, through his diary.',
        'The Chamber was long thought a mere legend. And yet it was real; how often the truth hides precisely where no one dares to look.',
        'The entrance is hidden in the second-floor girls’ bathroom, where Moaning Myrtle dwells — it was she who died fifty years ago, when the monster first woke. Only Parseltongue will open it.',
        'I never believed Tom Riddle, though everyone else did; he accused Hagrid and was given an award for special services to the school. From that hour I watched him more closely than any child in the castle.',
      ],
    },
    komnata_potreby: {
      cs: [
        'Komnata nejvyšší potřeby se zjeví jen tomu, kdo ji opravdu potřebuje — a stane se přesně tím, oč žadatel prosí. Nazývají ji též Místností, jež přichází a odchází. Sám jsem na ni jednou narazil, plnou nočníků.',
        'Je to jedno z mnoha tajemství, jež hrad ještě skrývá. Bradavice nikdy zcela neprozkoumáš; a právě to je na nich kouzelné.',
        'Najdeš ji v sedmém patře naproti tapiserii s Barnabášem Praštěným, jenž učí trolly tančit. Třikrát projdi kolem té zdi a usilovně přitom mysli na to, co potřebuješ.',
        'Jednou se přede mnou proměnila v komoru plnou zapomenutých věcí — generace žáků tam ukrývaly, co nechtěly, aby se našlo. Je to jediné místo v hradu, kde je pohodlnější ztrácet než hledat.',
      ],
      en: [
        'The Room of Requirement appears only to one who truly needs it — and becomes exactly what the seeker asks. It is also called the Come and Go Room. I once stumbled upon it myself, full of chamber pots.',
        'It is one of many secrets the castle still keeps. You will never fully explore Hogwarts; and that is precisely what makes it magical.',
        'You will find it on the seventh floor, opposite the tapestry of Barnabas the Barmy teaching trolls to dance. Walk past that wall three times, thinking hard of what you need.',
        'Once it opened before me as a storeroom of forgotten things — generations of students had hidden there whatever they did not wish found. It is the one place in the castle where losing is easier than seeking.',
      ],
    },
    duchove: {
      cs: [
        'Bradavice hostí mnoho duchů. Nebelvírští mají Téměř bezhlavého Nicka, Zmijozel Krvavého barona, Havraspár Šedou dámu a Mrzimor Tlustého mnicha. Duch je otiskem duše, jež se zdráhala odejít dál — smutná volba, byť lidská.',
        'Duchové nám připomínají, že smrt není nepřítel, jehož se má člověk děsit. Ti, kdo se jí bojí nejvíce, často ulpí na světě jako přízraky; moudřejší ji přijmou jako starého přítele.',
        'Šedá dáma je Helena z Havraspáru, dcera zakladatelky; Krvavý baron je muž, jenž ji zabil a probodl se žalem. Chodí spolu hradem už tisíc let — a to je, obávám se, přesnější obraz pekla než cokoli, co se káže z kazatelen.',
        'Duchové nemohou nic změnit; mohou jen znovu a znovu vyprávět, co se stalo. Proto se jich neptej na budoucnost. Ptej se jich, čeho litovali — v tom jsou nedostižní.',
      ],
      en: [
        'Hogwarts is home to many ghosts. Gryffindor has Nearly Headless Nick, Slytherin the Bloody Baron, Ravenclaw the Grey Lady, and Hufflepuff the Fat Friar. A ghost is the imprint of a soul that shrank from moving on — a sad choice, though a human one.',
        'Ghosts remind us that death is no enemy to be dreaded. Those who fear it most often cling to the world as phantoms; the wiser greet it as an old friend.',
        'The Grey Lady is Helena Ravenclaw, the founder’s daughter; the Bloody Baron is the man who killed her and then stabbed himself in grief. They have walked this castle together for a thousand years — a truer picture of hell, I fear, than anything preached from a pulpit.',
        'Ghosts can change nothing; they can only tell again and again what happened. So do not ask them about the future. Ask them what they regretted — in that they are unmatched.',
      ],
    },
    nitrozpyt: {
      cs: [
        'Nitrozpyt je uměním číst v mysli druhých, nitrobrana uměním ji uzavřít. Mysl však není kniha, kterou lze libovolně otevřít a číst. Jen zkušený nitrozpytec dokáže rozplést city a vzpomínky — a jen ukázněná mysl se ubrání.',
        'Nemluvná kouzla mají svou výhodu: protivník netuší, co přijde. Vyžadují však soustředění a pevnou vůli, neboť síla kouzla pramení z úmyslu, ne z hlasu.',
        'Voldemort ovládá nitrozpyt mistrovsky, a proto jsem Harryho poslal k Severusovi na hodiny nitrobrany. Nešlo to; chlapec nedokázal odložit hněv, a hněv jsou pro nitrozpytce otevřené dveře.',
        'Bývá k tomu třeba očního kontaktu a mysl se brání citem, nikoli kouzlem. Právě proto se před nitrozpytcem nejhůře skrývá to, co člověk nepřiznal ani sám sobě.',
      ],
      en: [
        'Legilimency is the art of reading another’s mind; Occlumency the art of sealing it. Yet the mind is not a book to be opened and read at will. Only a skilled Legilimens can untangle feelings and memories — and only a disciplined mind can resist.',
        'Nonverbal magic has its advantage: your opponent cannot know what is coming. But it demands focus and firm will, for a spell’s power springs from intent, not from the voice.',
        'Voldemort is a masterful Legilimens, which is why I sent Harry to Severus for lessons in Occlumency. It did not take; the boy could not set his anger aside, and to a Legilimens anger is an open door.',
        'Eye contact is generally needed, and the mind defends itself with feeling rather than with spellwork. That is why what hides worst from a Legilimens is what one has not admitted even to oneself.',
      ],
    },
    valky: {
      cs: [
        'Zažil jsem dvě kouzelnické války proti Voldemortovi a jeho Smrtijedům. První skončila oné noci, kdy padl v Godrikově Dole — poražen láskou Lily Potterové. Druhá byla ještě temnější a stála mnoho životů.',
        'Války mě naučily, že zlo nezvítězí silou, nýbrž naší nečinností a strachem. A že i v nejčernější hodině se najdou ti, kdo volí to správné před snadným.',
        'V první válce jsme přicházeli o přátele rychleji, než jsme je stačili pohřbívat: McKinnonovi, Prewettovi, Bonesovi — celé rodiny za jedinou noc. Ta jména si opakuji, aby se z počtu nestalo ticho.',
        'Nejhorší na válce není bitva; je to nedůvěra. Nakonec se lidé bojí vlastních sousedů, neboť každý může být pod kletbou Imperius nebo v cizí kůži. Právě rozklad důvěry je Voldemortovou nejúčinnější zbraní.',
      ],
      en: [
        'I lived through two wizarding wars against Voldemort and his Death Eaters. The first ended the night he fell in Godric’s Hollow — defeated by the love of Lily Potter. The second was darker still, and cost many lives.',
        'The wars taught me that evil triumphs not by strength, but by our inaction and fear. And that even in the blackest hour there are those who choose what is right over what is easy.',
        'In the first war we lost friends faster than we could bury them: the McKinnons, the Prewetts, the Boneses — whole families in a single night. I repeat those names so that a count does not become a silence.',
        'The worst of a war is not the battle; it is the suspicion. In the end people fear their own neighbours, for anyone may be under the Imperius Curse or wearing another’s skin. It is the ruin of trust that is Voldemort’s most effective weapon.',
      ],
    },
    lektvary: {
      cs: [
        'Lektvary jsou jemné a mocné umění. Mnoholičný lektvar ti propůjčí podobu jiného člověka; Felix Felicis, tekuté štěstí, ti na čas dopřeje, aby se vše dařilo; Amortencie vzbudí pouhé pobláznění, nikdy však pravou lásku — tu uvařit nelze.',
        'Byl jsem svědkem, jak lektvar zachránil život i jak zničil rozum. Jako u vší magie záleží méně na receptu než na srdci toho, kdo míchá kotlík.',
        'Amortencie voní každému jinak — tím, co jej nejvíce přitahuje. Vždy mi připadala nejpoctivějším zrcadlem v celém sklepení; o kouzelníkovi prozradí víc než hodina zpovědi.',
        'Napitek živé smrti uspí tak dokonale, že jej lze zaměnit se smrtí samou; Doušek míru utiší úzkost, avšak při špatné dávce uspí navždy. Rozdíl mezi lékem a jedem je v lektvarech otázkou kapek.',
      ],
      en: [
        'Potions are a subtle and powerful art. Polyjuice Potion lends you another’s form; Felix Felicis, liquid luck, grants a spell of good fortune; Amortentia stirs mere infatuation, never true love — that cannot be brewed.',
        'I have seen a potion save a life and undo a mind alike. As with all magic, it matters less what the recipe says than what lies in the heart of the one who stirs the cauldron.',
        'Amortentia smells different to everyone — of whatever draws them most. I have always thought it the most honest mirror in the whole dungeon; it tells you more about a wizard than an hour of confession.',
        'The Draught of Living Death imitates death so perfectly it may be mistaken for it; the Draught of Peace calms anxiety, yet the wrong dose puts one to sleep for good. In potions the difference between a remedy and a poison is a matter of drops.',
      ],
    },
    bdelost: {
      cs: [
        'Ukázněná mysl není mysl umlčená, nýbrž mysl bdělá. Většina kouzelníků prochází životem jako ve snu: jednají, aniž vědí proč, a tomu, co si sami způsobili, pak říkají osud. Probudit se znamená vidět věci takové, jaké jsou — ne takové, jaké se bojíme, že jsou.',
        'Nauč se svou mysl pozorovat, místo abys jí naslouchal. Myšlenka, na kterou se díváš, nad tebou ztrácí moc; myšlenka, které nasloucháš, tě vede za ruku. Právě proto začíná nitrobrana tichem, nikoli kouzlem.',
        'Ticho není prázdnota, nýbrž jediné místo, kde konečně uslyšíš, co ti mysl celou dobu šeptala. A velmi často zjistíš, že to nebyl tvůj hlas, ale hlas tvého strachu.',
        'Pozornost je vzácnější než talent, milý příteli. Většina chyb, jichž jsem v životě litoval, nevznikla z neznalosti — vznikla z nepozornosti. Vidět a vidět bděle jsou dvě zcela různé věci.',
      ],
      en: [
        'A disciplined mind is not a silenced mind but a wakeful one. Most wizards move through life as though asleep: they act without knowing why, and then call what they brought upon themselves fate. To wake is to see things as they are — not as we fear them to be.',
        'Learn to watch your mind rather than listen to it. A thought you observe loses its hold on you; a thought you heed takes you by the hand. That is why Occlumency begins in silence and not with a spell.',
        'Silence is not emptiness. It is the one place where you finally hear what your mind has been whispering all along — and very often you discover the voice was not yours at all, but your fear’s.',
        'Attention is rarer than talent, my friend. Most of the mistakes I have come to regret arose not from ignorance but from inattention. To see, and to see with awareness, are two quite different things.',
      ],
    },
    technologie: {
      cs: [
        'Mudlovské stroje v Bradavicích nefungují — je tu příliš mnoho magie ve zdech. Zaklínadlo je ostatně jistý druh programu: přesná instrukce, vyslovená přesně, a svět poslechne. Splete-li žák jedinou slabiku, získá ropuchu tam, kde čekal světlo.',
        'Nejblíž tomu, čemu říkáš kód, mám zaklínadlo. Rozdíl je v tom, že chybné kouzlo neopravíš středníkem, nýbrž pokorou — a někdy návštěvou ošetřovny.',
        'Co vím o počítačích, mám od Artura Weasleyho, jehož nadšení pro zástrčky nezná mezí. Mne však zajímá jiný stroj — lidská mysl. I tu lze programovat; právě proto stojí za to učit se nitrobraně.',
        'Umělá inteligence? Myslící stroj bez srdce mi připomíná deník Toma Raddlea: také odpovídal chytře, ochotně a lživě. Nikdy nevěř tomu, co myslí, aniž bys věděl, čí vůle za odpověďmi stojí.',
      ],
      en: [
        'Muggle machines do not work at Hogwarts — there is far too much magic in these walls. An incantation is a kind of program, mind you: a precise instruction, precisely spoken, and the world obeys. Slip a single syllable and a student gets a toad where they expected light.',
        'The closest thing I have to what you call code is a spell. The difference is that a flawed one is not mended with a semicolon but with humility — and occasionally a visit to the hospital wing.',
        'What I know of computers I owe to Arthur Weasley, whose enthusiasm for plugs knows no bounds. The machine that interests me is a different one: the mind. It, too, can be programmed — which is precisely why Occlumency is worth learning.',
        'Artificial intelligence? A thinking machine without a heart puts me in mind of Tom Riddle’s diary: it also answered cleverly, obligingly and falsely. Never trust a thing that thinks until you know whose will stands behind its answers.',
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
