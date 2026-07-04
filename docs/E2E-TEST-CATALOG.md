# E2E test katalog

> Automaticky generováno z Playwright test.step. Obnovení: `npm run docs:test-catalog`

## Smoke (@smoke)

### S1 — menu page loads with game cards and footer
**Soubor:** `tests/smoke/menu.spec.ts`

- **Given** uživatel otevře hlavní menu
- **Then** stránka je v češtině a zobrazí čtyři herní karty
- **Then** footer obsahuje odkaz Buy Me a Coffee a nadpis stránky

### S2 — navigation from menu to each game
**Soubor:** `tests/smoke/menu.spec.ts`

- **Given** uživatel je na hlavním menu
- **When** uživatel klikne na kartu hry guess-character-name/
- **Then** otevře se správná hra s viditelným nadpisem
- **Given** uživatel je na hlavním menu
- **When** uživatel klikne na kartu hry guess-house/
- **Then** otevře se správná hra s viditelným nadpisem
- **Given** uživatel je na hlavním menu
- **When** uživatel klikne na kartu hry guess-spell/
- **Then** otevře se správná hra s viditelným nadpisem
- **Given** uživatel je na hlavním menu
- **When** uživatel klikne na kartu hry who-is-on-photo/
- **Then** otevře se správná hra s viditelným nadpisem

### S3 — /guess-house/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /guess-house/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S3 — /guess-character-name/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /guess-character-name/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S3 — /guess-spell/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /guess-spell/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S3 — /who-is-on-photo/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /who-is-on-photo/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S4 — shared scripts load without critical console errors
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** uživatel postupně navštíví všechny čtyři hry
- **Then** v konzoli se neobjeví kritické chyby

### S5 — back link returns to menu
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra Hádej postavu je načtená
- **When** uživatel klikne na odkaz zpět do menu
- **Then** zobrazí se hlavní menu se čtyřmi kartami her

## Critical (@critical)

### G1 — new game resets state
**Soubor:** `tests/critical/hangman-character.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru uhádnutím slova „Albus“
- **When** uživatel spustí novou hru
- **Then** stav hry se resetuje — modal zmizí, životy jsou plné, žádné písmeno není odhalené

### H1 — win by guessing all letters
**Soubor:** `tests/critical/hangman-character.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **Then** slovo má pět písmen v jedné skupině
- **When** uživatel postupně uhádne písmena a, l, b, u, s
- **Then** zobrazí se výherní modal s odpovědí „Albus“

### H2 — win spell hangman game
**Soubor:** `tests/critical/hangman-spell.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se slovem „Lumos“
- **Then** zobrazí se výzva k hádání zaklínadla
- **When** uživatel uhádne všechna písmena zaklínadla Lumos
- **Then** zobrazí se výherní modal se správným zaklínadlem

### N1 — menu → game → back → another game
**Soubor:** `tests/critical/navigation.spec.ts`

- **Given** API je mockované a uživatel je na hlavním menu
- **When** uživatel přejde do hry Hádej postavu
- **When** uživatel se vrátí zpět do menu
- **Then** zobrazí se menu se čtyřmi kartami
- **When** uživatel přejde do hry Hádej kolej
- **Then** hra Hádej kolej se načte a je hratelná

### Q1 — correct house answer increases score and starts new round
**Soubor:** `tests/critical/guess-house.spec.ts`

- **Given** hra Hádej kolej je načtená s mockovanými postavami
- **When** uživatel vybere správnou kolej zobrazené postavy
- **Then** skóre se zvýší a spustí se nové kolo

### Q2 — correct name answer increases score
**Soubor:** `tests/critical/who-is-on-photo.spec.ts`

- **Given** hra Kdo je na fotce je načtená s mockovanými postavami
- **When** uživatel vybere správné jméno postavy na fotce
- **Then** skóre se zvýší na 1

## Edge (@edge)

### E01 — invalid input shows error message
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel odešle prázdný vstup
- **Then** zobrazí se chybová hláška o platném písmenu
- **When** uživatel odešle číslici
- **Then** zobrazí se stejná chybová hláška

### E02 — duplicate letter shows error
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel poprvé uhádne písmeno q
- **Then** zobrazí se chybová hláška
- **When** uživatel znovu uhádne písmeno q
- **Then** zobrazí se hláška, že písmeno už bylo hádáno

### E03 — Enter key submits guess
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel zadá písmeno a a stiskne Enter
- **Then** tip je úspěšný

### E04 — win via Enter on last letter keeps modal open
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel uhádne poslední písmeno s klávesou Enter
- **Then** zobrazí se výherní modal

### E04 — losing all lives shows defeat modal with answer
**Soubor:** `tests/edge/hangman-lose.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel minul všech deset životů
- **Then** zobrazí se proherní modal s odpovědí a seznamem špatných písmen

### E05 — lose via Enter on last wrong letter keeps modal open
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel minul poslední život stiskem Enter
- **Then** zobrazí se proherní modal

### E05 — words wrap as whole units with preserved spaces
**Soubor:** `tests/edge/hangman-word-wrap.spec.ts`

- **Given** hra je načtená s dlouhým jménem „Nearly Headless Nick“ na mobilním viewportu
- **Then** slova se zalamují po celých slovech bez horizontálního přetečení

### E06 — normalized letter reveals accented character
**Soubor:** `tests/edge/hangman-diacritics.spec.ts`

- **Given** hra je načtená s postavou „Bélby“
- **When** uživatel uhádne písmeno e bez diakritiky
- **Then** odhalí se písmeno É

### E06 — win spell via Enter on last letter keeps modal open
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se slovem „Lumos“
- **When** uživatel uhádne poslední písmeno s klávesou Enter
- **Then** zobrazí se výherní modal

### E07 — guess-house shows defeat modal after 10 wrong answers
**Soubor:** `tests/edge/quiz-lose.spec.ts`

- **Given** hra Hádej kolej je načtená
- **When** uživatel desetkrát odpoví špatně
- **Then** zobrazí se proherní modal se správnou kolejí

### E08 — who-is-on-photo shows defeat modal after 10 wrong answers
**Soubor:** `tests/edge/quiz-lose.spec.ts`

- **Given** hra Kdo je na fotce je načtená
- **When** uživatel desetkrát odpoví špatně
- **Then** zobrazí se proherní modal s poslední postavou

### E09 — quiz always shows four choices including correct answer
**Soubor:** `tests/edge/quiz-lose.spec.ts`

- **Given** hra Hádej kolej je načtená
- **Then** kvíz zobrazí čtyři možnosti včetně správné odpovědi

### E10 — hangman shows error and recovers on new game
**Soubor:** `tests/edge/api-failure.spec.ts`

- **Given** API i fallback selhávají při načtení hangman hry
- **Then** zobrazí se chybová hláška a tlačítko nové hry je aktivní
- **When** API se obnoví a uživatel spustí novou hru
- **Then** hra se načte a je hratelná

### E11 — guess-house shows error and recovers on new game
**Soubor:** `tests/edge/api-failure.spec.ts`

- **Given** API i fallback selhávají při načtení kvízu Hádej kolej
- **Then** zobrazí se chybová hláška
- **When** API se obnoví a uživatel spustí novou hru
- **Then** kvíz se načte a je hratelný

### E12 — second game reuses cached characters without new API request
**Soubor:** `tests/edge/session-cache.spec.ts`

- **Given** API postav je mockované a první hra načte data
- **Then** proběhne právě jeden API request
- **When** uživatel přejde do druhé hry ve stejné session
- **Then** data se načtou z cache bez dalšího API requestu

### E13 — auto-revealed apostrophe allows winning
**Soubor:** `tests/edge/hangman-special-chars.spec.ts`

- **Given** hra je načtená s postavou „O'Brien“
- **Then** apostrof je automaticky odhalený
- **When** uživatel uhádne zbývající písmena
- **Then** zobrazí se výherní modal s odpovědí O'Brien

### E14 — broken image does not crash the game
**Soubor:** `tests/edge/photo-image-error.spec.ts`

- **Given** kvíz Kdo je na fotce je načtený s jednou rozbitou fotkou
- **Then** hra zůstane hratelná se čtyřmi možnostmi

### E15 — no duplicate characters within a deck cycle
**Soubor:** `tests/edge/deck-uniqueness.spec.ts`

- **Given** hra Hádej kolej je načtená s náhodným balíčkem postav
- **When** uživatel odehraje tři kola
- **Then** v každém kole se objeví jiná postava

### E16 — no duplicate hangman character names within a deck cycle
**Soubor:** `tests/edge/deck-uniqueness.spec.ts`

- **Given** hra Hádej postavu je načtená s třemi unikátními jmény
- **When** uživatel vyhraje tři kola hangmanu
- **Then** v každém kole se objeví jiné jméno

### E17 — no duplicate hangman spells within a deck cycle
**Soubor:** `tests/edge/deck-uniqueness.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se třemi unikátními zaklínadly
- **When** uživatel vyhraje tři kola hangmanu
- **Then** v každém kole se objeví jiné zaklínadlo

### E18 — modal has dialog semantics and traps focus
**Soubor:** `tests/edge/modal-accessibility.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru
- **Then** modal má správné ARIA atributy a zachycený focus

### E19 — Escape closes modal and starts new game
**Soubor:** `tests/edge/modal-accessibility.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru a stiskne Escape
- **Then** modal se zavře a spustí se nová hra

### E20 — modal button starts new game
**Soubor:** `tests/edge/modal-accessibility.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru a klikne na tlačítko v modalu
- **Then** modal se zavře a hra pokračuje

### E21 — photo quiz matches by id not name
**Soubor:** `tests/edge/duplicate-names.spec.ts`

- **Given** kvíz je načtený se dvěma postavami Tom Riddle s různými ID
- **When** uživatel vybere špatného Toma Riddle podle jména
- **Then** odpověď je vyhodnocena jako chybná

### E22 — dedupes duplicate character names in deck
**Soubor:** `tests/edge/hangman-duplicate-names.spec.ts`

- **Given** hra je načtená se dvěma postavami se stejným jménem Tom Riddle
- **Then** počet slotů odpovídá délce deduplikovaného jména

### E23 — hangman shows timeout error and recovers on new game
**Soubor:** `tests/edge/fetch-timeout.spec.ts`

- **Given** API request visí a fallback selže
- **Then** zobrazí se chybová hláška o timeoutu
- **When** timeout se prodlouží, API se obnoví a uživatel spustí novou hru
- **Then** hra se načte a je hratelná

### E24 — retries hung requests and loads on later attempt
**Soubor:** `tests/edge/fetch-timeout.spec.ts`

- **Given** první dva API requesty visí a třetí uspěje
- **Then** hra se načte po třetím pokusu

### E25 — malicious character name is rendered as text in modal
**Soubor:** `tests/edge/xss-safe-dom.spec.ts`

- **Given** hra je načtená s postavou obsahující XSS payload v názvu
- **When** uživatel prohraje hru
- **Then** payload je v modalu zobrazen jako text a nespustí se alert

### E26 — retries after server errors and eventually loads
**Soubor:** `tests/edge/api-retry.spec.ts`

- **Given** API vrací 5xx chyby první dva pokusy
- **Then** hra se načte po třetím pokusu
- **When** uživatel spustí novou hru
- **Then** hra zůstane hratelná

### E27 — all broken images show error instead of looping
**Soubor:** `tests/edge/photo-all-broken.spec.ts`

- **Given** všechny fotky v kvízu jsou neplatné
- **Then** zobrazí se chybová hláška místo nekonečné smyčky

### E28 — game loads from local fixture when API fails
**Soubor:** `tests/edge/offline-fallback.spec.ts`

- **Given** API selže a hra Hádej kolej se načte z lokálního fixture
- **Then** hra je hratelná s daty z fallback fixture

### E29 — letter slots have uniform width across word groups
**Soubor:** `tests/edge/hangman-word-wrap.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se slovem „Expecto Patronum“ na mobilním viewportu
- **Then** sloty písmen mají jednotnou šířku ve všech skupinách slov

### E30 — guess-house renders four choices on mobile
**Soubor:** `tests/edge/quiz-mobile.spec.ts`

- **Given** hra Hádej kolej je načtená na mobilním viewportu
- **Then** kvíz zobrazí čtyři možnosti
- **When** uživatel vybere správnou kolej
- **Then** odpověď je úspěšná

### E31 — who-is-on-photo renders photo and choices on mobile
**Soubor:** `tests/edge/quiz-mobile.spec.ts`

- **Given** hra Kdo je na fotce je načtená na mobilním viewportu
- **Then** zobrazí se fotka se čtyřmi možnostmi a správným alt textem

### E32 — character long name fits without horizontal overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s dlouhým jménem na mobilním viewportu
- **Then** rozhraní se vejde bez horizontálního přetečení

### E33 — character long single word fits without overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s dlouhým jednoslovným jménem
- **Then** slovo se zobrazí ve dvou skupinách bez přetečení

### E34 — spell long word fits without horizontal overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená s dlouhým slovem Expelliarmus
- **Then** zaklínadlo se vejde bez horizontálního přetečení

### E35 — input and guess button fully visible on mobile
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená na mobilním viewportu
- **Then** vstup a tlačítko Hádat jsou plně viditelné

### E36 — short viewport with focused input has no horizontal overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená na krátkém mobilním viewportu se zaměřeným vstupem
- **Then** rozhraní nemá horizontální přetečení

### E37 — short word has readable slot size on mobile
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s krátkým slovem Severus na mobilu
- **Then** sloty písmen mají čitelnou minimální velikost

### E38 — short word has larger slot size on desktop
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s krátkým slovem Severus na desktopu
- **Then** sloty písmen mají větší velikost než na mobilu

### E39 — /guess-character-name/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /guess-character-name/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E40 — /guess-spell/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /guess-spell/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E41 — /guess-house/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /guess-house/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E42 — /who-is-on-photo/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /who-is-on-photo/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E43 — / — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka / je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /guess-character-name/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-character-name/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /guess-spell/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-spell/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /guess-house/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-house/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — / — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka / je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /who-is-on-photo/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /who-is-on-photo/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /guess-character-name/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-character-name/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /guess-spell/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-spell/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /guess-house/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-house/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43 — /who-is-on-photo/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /who-is-on-photo/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E44 — game remains playable offline after initial load
**Soubor:** `tests/edge/pwa-offline.spec.ts`

- **Given** hra je načtená a service worker je aktivní
- **When** prohlížeč přejde do offline režimu a uživatel spustí novou hru
- **Then** hra zůstane hratelná

### E45 — service worker registers successfully
**Soubor:** `tests/edge/pwa-offline.spec.ts`

- **Given** uživatel otevře hlavní menu
- **Then** service worker se úspěšně zaregistruje

### E46 — update banner appears after SW update message
**Soubor:** `tests/edge/sw-update.spec.ts`

- **Given** service worker je registrovaný na hlavní stránce
- **When** service worker pošle zprávu o aktualizaci
- **Then** zobrazí se banner s tlačítkem pro reload

### E47 — HTML navigation uses network-first content
**Soubor:** `tests/edge/sw-update.spec.ts`

- **Given** service worker je registrovaný
- **When** uživatel naviguje na index.html a síť vrátí nový obsah
- **Then** zobrazí se obsah ze sítě, ne z cache

### E48 — menu prefetch warms cache before entering game
**Soubor:** `tests/edge/sw-update.spec.ts`

- **Given** menu prefetch načte data postav do session cache
- **When** uživatel přejde do hry Hádej kolej
- **Then** počet API volání se nezvýší oproti prefetchi

### E49 — menu page has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** uživatel otevře hlavní menu
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E50 — ?lang=en loads page directly in English
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** uživatel otevře hru s parametrem ?lang=en
- **Then** stránka je v angličtině a texty jsou konzistentní

### E51 — hangman feedback message updates after locale switch
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** hra je načtená a uživatel uhodne špatné písmeno
- **When** uživatel přepne jazyk na angličtinu
- **Then** feedback zpráva se přepne do angličtiny

### E52 — lose modal title updates after locale switch
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** uživatel prohraje hangman hru
- **When** uživatel přepne jazyk na angličtinu
- **Then** titulek modalu se přepne do angličtiny

## Visual (@visual)

### V01 — menu page layout
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** uživatel otevře hlavní menu
- **Then** screenshot mřížky her odpovídá baseline

### V02 — hangman ready state
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** hra Hádej postavu je ve stavu připraveno ke hře
- **Then** screenshot herního kontejneru odpovídá baseline

### V03 — quiz house ready state
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** hra Hádej kolej je ve stavu připraveno ke hře
- **Then** screenshot herního kontejneru odpovídá baseline

### V04 — photo quiz ready state
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** hra Kdo je na fotce je ve stavu připraveno ke hře
- **Then** screenshot herního kontejneru odpovídá baseline

### V05 — hangman lose modal
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** uživatel prohraje hangman hru
- **Then** screenshot proherního modalu odpovídá baseline
