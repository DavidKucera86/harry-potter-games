# E2E test katalog

> Automaticky generováno z Playwright test.step. Obnovení: `npm run docs:test-catalog`

## Smoke (@smoke)

### S01.01 — menu page loads with game cards and footer
**Soubor:** `tests/smoke/menu.spec.ts`

- **Given** uživatel otevře hlavní menu
- **Then** stránka je v češtině a zobrazí šest herních karet
- **Then** footer obsahuje odkaz Buy Me a Coffee a nadpis stránky

### S02.01 — navigation from menu to each game
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
- **Given** uživatel je na hlavním menu
- **When** uživatel klikne na kartu hry rock-paper-scissors/
- **Then** otevře se správná hra s viditelným nadpisem
- **Given** uživatel je na hlavním menu
- **When** uživatel klikne na kartu hry chat-with-character/
- **Then** otevře se správná hra s viditelným nadpisem

### S03.01 — /guess-character-name/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /guess-character-name/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S03.02 — /guess-spell/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /guess-spell/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S03.03 — /guess-house/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /guess-house/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S03.04 — /who-is-on-photo/ loads and becomes playable
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra na adrese /who-is-on-photo/ je načtená s mockovanými daty
- **Then** hra je hratelná se skrytým loading overlay a deseti životy

### S04.01 — shared scripts load without critical console errors
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** uživatel postupně navštíví všechny hry
- **Then** v konzoli se neobjeví kritické chyby

### S05.01 — back link returns to menu
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra Hádej postavu je načtená
- **When** uživatel klikne na odkaz zpět do menu
- **Then** zobrazí se hlavní menu se šesti kartami her

### S06.01 — /rock-paper-scissors/ loads with a fresh scoreboard and three moves
**Soubor:** `tests/smoke/games-load.spec.ts`

- **Given** hra Kámen–nůžky–papír je načtená s mockovanými daty
- **Then** hra nabízí tři tahy a skóre je 0:0

## Critical (@critical)

### G01.01 — new game resets state
**Soubor:** `tests/critical/hangman-character.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru uhádnutím slova „Albus“
- **When** uživatel spustí novou hru
- **Then** stav hry se resetuje — modal zmizí, životy jsou plné, žádné písmeno není odhalené

### H01.01 — win by guessing all letters
**Soubor:** `tests/critical/hangman-character.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **Then** slovo má pět písmen v jedné skupině
- **When** uživatel postupně uhádne písmena a, l, b, u, s
- **Then** zobrazí se výherní modal s odpovědí „Albus“

### H02.01 — win spell hangman game
**Soubor:** `tests/critical/hangman-spell.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se slovem „Lumos“
- **Then** zobrazí se výzva k hádání zaklínadla
- **When** uživatel uhádne všechna písmena zaklínadla Lumos
- **Then** zobrazí se výherní modal se správným zaklínadlem

### N01.01 — menu → game → back → another game
**Soubor:** `tests/critical/navigation.spec.ts`

- **Given** API je mockované a uživatel je na hlavním menu
- **When** uživatel přejde do hry Hádej postavu
- **When** uživatel se vrátí zpět do menu
- **Then** zobrazí se menu se šesti kartami
- **When** uživatel přejde do hry Hádej kolej
- **Then** hra Hádej kolej se načte a je hratelná

### Q01.01 — correct house answer increases score and starts new round
**Soubor:** `tests/critical/guess-house.spec.ts`

- **Given** hra Hádej kolej je načtená s mockovanými postavami
- **When** uživatel vybere správnou kolej zobrazené postavy
- **Then** skóre se zvýší a spustí se nové kolo

### Q02.01 — correct name answer increases score
**Soubor:** `tests/critical/who-is-on-photo.spec.ts`

- **Given** hra Kdo je na fotce je načtená s mockovanými postavami
- **When** uživatel vybere správné jméno postavy na fotce
- **Then** skóre se zvýší na 1

### Q03.01 — winning a round increases the player score
**Soubor:** `tests/critical/rock-paper-scissors.spec.ts`

- **Given** hra Kámen–nůžky–papír je načtená a soupeř hází kámen
- **When** hráč zahraje papír
- **Then** skóre hráče se zvýší na 1 a odhalí se souboj

### Q03.02 — losing a round increases the opponent score
**Soubor:** `tests/critical/rock-paper-scissors.spec.ts`

- **Given** hra Kámen–nůžky–papír je načtená a soupeř hází kámen
- **When** hráč zahraje nůžky
- **Then** skóre soupeře se zvýší na 1

### Q03.03 — first to the win target wins the match
**Soubor:** `tests/critical/rock-paper-scissors.spec.ts`

- **Given** hra Kámen–nůžky–papír je načtená a soupeř hází kámen
- **When** hráč vyhraje potřebný počet kol
- **Then** otevře se vítězný modal zápasu odkotvený nad dolní polovinou fotky

### Q03.04 — the same opponent stays until the match is decided
**Soubor:** `tests/critical/rock-paper-scissors.spec.ts`

- **Given** hra Kámen–nůžky–papír je načtená a soupeř hází kámen
- **When** hráč odehraje první kolo
- **Then** druhé kolo má stále stejného soupeře i fotku

### Q03.05 — the scoreboard stays on a single row on a narrow viewport
**Soubor:** `tests/critical/rock-paper-scissors.spec.ts`

- **Given** hra je načtená na úzkém mobilním viewportu
- **Then** obě strany skóre jsou na stejném řádku

### Q06.01 — entering a nickname and picking Dumbledore opens the chat with a greeting
**Soubor:** `tests/critical/chat-with-character.spec.ts`

- **Given** hra Chat s postavou je načtená
- **When** hráč zadá přezdívku a vybere Brumbála
- **Then** otevře se chat s Brumbálem a uvítací hláškou obsahující přezdívku

### Q06.02 — a message with a known keyword gets a themed reply
**Soubor:** `tests/critical/chat-with-character.spec.ts`

- **Given** hráč je v chatu s Brumbálem
- **When** hráč napíše zprávu o smrti
- **Then** jeho zpráva i odpověď Brumbála se objeví v konverzaci

## Edge (@edge)

### E01.01 — invalid input shows error message
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel odešle prázdný vstup
- **Then** zobrazí se chybová hláška o platném písmenu
- **When** uživatel odešle číslici
- **Then** zobrazí se stejná chybová hláška

### E02.01 — duplicate letter shows error
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel poprvé uhádne písmeno q
- **Then** zobrazí se chybová hláška
- **When** uživatel znovu uhádne písmeno q
- **Then** zobrazí se hláška, že písmeno už bylo hádáno

### E03.01 — Enter key submits guess
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel zadá písmeno a a stiskne Enter
- **Then** tip je úspěšný

### E04.01 — win via Enter on last letter keeps modal open
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel uhádne poslední písmeno s klávesou Enter
- **Then** zobrazí se výherní modal

### E04.02 — losing all lives shows defeat modal with answer
**Soubor:** `tests/edge/hangman-lose.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel minul všech deset životů
- **Then** zobrazí se proherní modal s odpovědí a seznamem špatných písmen

### E05.01 — lose via Enter on last wrong letter keeps modal open
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel minul poslední život stiskem Enter
- **Then** zobrazí se proherní modal

### E05.02 — words wrap as whole units with preserved spaces
**Soubor:** `tests/edge/hangman-word-wrap.spec.ts`

- **Given** hra je načtená s dlouhým jménem „Nearly Headless Nick“ na mobilním viewportu
- **Then** slova se zalamují po celých slovech bez horizontálního přetečení

### E06.01 — normalized letter reveals accented character
**Soubor:** `tests/edge/hangman-diacritics.spec.ts`

- **Given** hra je načtená s postavou „Bélby“
- **When** uživatel uhádne písmeno e bez diakritiky
- **Then** odhalí se písmeno É

### E06.02 — win spell via Enter on last letter keeps modal open
**Soubor:** `tests/edge/hangman-input.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se slovem „Lumos“
- **When** uživatel uhádne poslední písmeno s klávesou Enter
- **Then** zobrazí se výherní modal

### E07.01 — guess-house shows defeat modal after 10 wrong answers
**Soubor:** `tests/edge/quiz-lose.spec.ts`

- **Given** hra Hádej kolej je načtená
- **When** uživatel desetkrát odpoví špatně
- **Then** zobrazí se proherní modal se správnou kolejí

### E08.01 — who-is-on-photo shows defeat modal after 10 wrong answers
**Soubor:** `tests/edge/quiz-lose.spec.ts`

- **Given** hra Kdo je na fotce je načtená
- **When** uživatel desetkrát odpoví špatně
- **Then** zobrazí se proherní modal s poslední postavou

### E09.01 — quiz always shows four choices including correct answer
**Soubor:** `tests/edge/quiz-lose.spec.ts`

- **Given** hra Hádej kolej je načtená
- **Then** kvíz zobrazí čtyři možnosti včetně správné odpovědi

### E10.01 — hangman shows error and recovers on new game
**Soubor:** `tests/edge/api-failure.spec.ts`

- **Given** API i fallback selhávají při načtení hangman hry
- **Then** zobrazí se chybová hláška a tlačítko nové hry je aktivní
- **When** API se obnoví a uživatel spustí novou hru
- **Then** hra se načte a je hratelná

### E11.01 — guess-house shows error and recovers on new game
**Soubor:** `tests/edge/api-failure.spec.ts`

- **Given** API i fallback selhávají při načtení kvízu Hádej kolej
- **Then** zobrazí se chybová hláška
- **When** API se obnoví a uživatel spustí novou hru
- **Then** kvíz se načte a je hratelný

### E12.01 — second game reuses cached characters without new API request
**Soubor:** `tests/edge/session-cache.spec.ts`

- **Given** API postav je mockované a první hra načte data
- **Then** proběhne právě jeden API request
- **When** uživatel přejde do druhé hry ve stejné session
- **Then** data se načtou z cache bez dalšího API requestu

### E13.01 — auto-revealed apostrophe allows winning
**Soubor:** `tests/edge/hangman-special-chars.spec.ts`

- **Given** hra je načtená s postavou „O'Brien“
- **Then** apostrof je automaticky odhalený
- **When** uživatel uhádne zbývající písmena
- **Then** zobrazí se výherní modal s odpovědí O'Brien

### E14.01 — broken image does not crash the game
**Soubor:** `tests/edge/photo-image-error.spec.ts`

- **Given** kvíz Kdo je na fotce je načtený s jednou rozbitou fotkou
- **Then** hra zůstane hratelná se čtyřmi možnostmi

### E15.01 — no duplicate characters within a deck cycle
**Soubor:** `tests/edge/deck-uniqueness.spec.ts`

- **Given** hra Hádej kolej je načtená s náhodným balíčkem postav
- **When** uživatel odehraje tři kola
- **Then** v každém kole se objeví jiná postava

### E16.01 — no duplicate hangman character names within a deck cycle
**Soubor:** `tests/edge/deck-uniqueness.spec.ts`

- **Given** hra Hádej postavu je načtená s třemi unikátními jmény
- **When** uživatel vyhraje tři kola hangmanu
- **Then** v každém kole se objeví jiné jméno

### E17.01 — no duplicate hangman spells within a deck cycle
**Soubor:** `tests/edge/deck-uniqueness.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se třemi unikátními zaklínadly
- **When** uživatel vyhraje tři kola hangmanu
- **Then** v každém kole se objeví jiné zaklínadlo

### E18.01 — modal has dialog semantics and traps focus
**Soubor:** `tests/edge/modal-accessibility.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru
- **Then** modal má správné ARIA atributy a zachycený focus

### E19.01 — Escape closes modal and starts new game
**Soubor:** `tests/edge/modal-accessibility.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru a stiskne Escape
- **Then** modal se zavře a spustí se nová hra

### E20.01 — modal button starts new game
**Soubor:** `tests/edge/modal-accessibility.spec.ts`

- **Given** hra Hádej postavu je načtená s mockovanou postavou „Albus“
- **When** uživatel vyhraje hru a klikne na tlačítko v modalu
- **Then** modal se zavře a hra pokračuje

### E21.01 — photo quiz matches by id not name
**Soubor:** `tests/edge/duplicate-names.spec.ts`

- **Given** kvíz je načtený se dvěma postavami Tom Riddle s různými ID
- **When** uživatel vybere špatného Toma Riddle podle jména
- **Then** odpověď je vyhodnocena jako chybná

### E22.01 — dedupes duplicate character names in deck
**Soubor:** `tests/edge/hangman-duplicate-names.spec.ts`

- **Given** hra je načtená se dvěma postavami se stejným jménem Tom Riddle
- **Then** počet slotů odpovídá délce deduplikovaného jména

### E23.01 — hangman shows timeout error and recovers on new game
**Soubor:** `tests/edge/fetch-timeout.spec.ts`

- **Given** API request visí a fallback selže
- **Then** zobrazí se chybová hláška o timeoutu
- **When** timeout se prodlouží, API se obnoví a uživatel spustí novou hru
- **Then** hra se načte a je hratelná

### E24.01 — retries hung requests and loads on later attempt
**Soubor:** `tests/edge/fetch-timeout.spec.ts`

- **Given** první dva API requesty visí a třetí uspěje
- **Then** hra se načte po třetím pokusu

### E25.01 — malicious character name is rendered as text in modal
**Soubor:** `tests/edge/xss-safe-dom.spec.ts`

- **Given** hra je načtená s postavou obsahující XSS payload v názvu
- **When** uživatel prohraje hru
- **Then** payload je v modalu zobrazen jako text a nespustí se alert

### E26.01 — retries after server errors and eventually loads
**Soubor:** `tests/edge/api-retry.spec.ts`

- **Given** API vrací 5xx chyby první dva pokusy
- **Then** hra se načte po třetím pokusu
- **When** uživatel spustí novou hru
- **Then** hra zůstane hratelná

### E27.01 — all broken images show error instead of looping
**Soubor:** `tests/edge/photo-all-broken.spec.ts`

- **Given** všechny fotky v kvízu jsou neplatné
- **Then** zobrazí se chybová hláška místo nekonečné smyčky

### E28.01 — game loads from local fixture when API fails
**Soubor:** `tests/edge/offline-fallback.spec.ts`

- **Given** API selže a hra Hádej kolej se načte z lokálního fixture
- **Then** hra je hratelná s daty z fallback fixture

### E29.01 — letter slots have uniform width across word groups
**Soubor:** `tests/edge/hangman-word-wrap.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená se slovem „Expecto Patronum“ na mobilním viewportu
- **Then** sloty písmen mají jednotnou šířku ve všech skupinách slov

### E30.01 — guess-house renders four choices on mobile
**Soubor:** `tests/edge/quiz-mobile.spec.ts`

- **Given** hra Hádej kolej je načtená na mobilním viewportu
- **Then** kvíz zobrazí čtyři možnosti
- **When** uživatel vybere správnou kolej
- **Then** odpověď je úspěšná

### E31.01 — who-is-on-photo renders photo and choices on mobile
**Soubor:** `tests/edge/quiz-mobile.spec.ts`

- **Given** hra Kdo je na fotce je načtená na mobilním viewportu
- **Then** zobrazí se fotka se čtyřmi možnostmi a správným alt textem

### E32.01 — character long name fits without horizontal overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s dlouhým jménem na mobilním viewportu
- **Then** rozhraní se vejde bez horizontálního přetečení

### E33.01 — character long single word fits without overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s dlouhým jednoslovným jménem
- **Then** slovo se zobrazí ve dvou skupinách bez přetečení

### E34.01 — spell long word fits without horizontal overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra Hádej zaklínadlo je načtená s dlouhým slovem Expelliarmus
- **Then** zaklínadlo se vejde bez horizontálního přetečení

### E35.01 — input and guess button fully visible on mobile
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená na mobilním viewportu
- **Then** vstup a tlačítko Hádat jsou plně viditelné

### E36.01 — short viewport with focused input has no horizontal overflow
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená na krátkém mobilním viewportu se zaměřeným vstupem
- **Then** rozhraní nemá horizontální přetečení

### E37.01 — short word has readable slot size on mobile
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s krátkým slovem Severus na mobilu
- **Then** sloty písmen mají čitelnou minimální velikost

### E38.01 — short word has larger slot size on desktop
**Soubor:** `tests/edge/hangman-mobile.spec.ts`

- **Given** hra je načtená s krátkým slovem Severus na desktopu
- **Then** sloty písmen mají větší velikost než na mobilu

### E39.01 — /guess-character-name/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /guess-character-name/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E40.01 — /guess-spell/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /guess-spell/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E41.01 — /guess-house/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /guess-house/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E42.01 — /who-is-on-photo/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /who-is-on-photo/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E43.01 — / — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka / je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.02 — /guess-character-name/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-character-name/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.03 — /guess-spell/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-spell/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.04 — /guess-house/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-house/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.05 — /who-is-on-photo/ — po přepnutí na cs jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /who-is-on-photo/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na cs
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.06 — / — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka / je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.07 — /guess-character-name/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-character-name/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.08 — /guess-spell/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-spell/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.09 — /guess-house/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /guess-house/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E43.10 — /who-is-on-photo/ — po přepnutí na en jsou všechny statické texty konzistentní
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** stránka /who-is-on-photo/ je načtená s mockovanými daty
- **When** uživatel přepne jazyk na en
- **Then** všechny statické texty odpovídají zvolenému jazyku

### E44.01 — game remains playable offline after initial load
**Soubor:** `tests/edge/pwa-offline.spec.ts`

- **Given** hra je načtená a service worker je aktivní
- **When** prohlížeč přejde do offline režimu a uživatel spustí novou hru
- **Then** hra zůstane hratelná

### E45.01 — service worker registers successfully
**Soubor:** `tests/edge/pwa-offline.spec.ts`

- **Given** uživatel otevře hlavní menu
- **Then** service worker se úspěšně zaregistruje

### E46.01 — update banner appears after SW update message
**Soubor:** `tests/edge/sw-update.spec.ts`

- **Given** service worker je registrovaný na hlavní stránce
- **When** service worker pošle zprávu o aktualizaci
- **Then** zobrazí se banner s tlačítkem pro reload

### E47.01 — HTML navigation uses network-first content
**Soubor:** `tests/edge/sw-update.spec.ts`

- **Given** service worker je registrovaný
- **When** uživatel naviguje na index.html a síť vrátí nový obsah
- **Then** zobrazí se obsah ze sítě, ne z cache

### E48.01 — menu prefetch warms cache before entering game
**Soubor:** `tests/edge/sw-update.spec.ts`

- **Given** menu prefetch načte data postav do session cache
- **When** uživatel přejde do hry Hádej kolej
- **Then** počet API volání se nezvýší oproti prefetchi

### E49.01 — menu page has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** uživatel otevře hlavní menu
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E50.01 — ?lang=en loads page directly in English
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** uživatel otevře hru s parametrem ?lang=en
- **Then** stránka je v angličtině a texty jsou konzistentní

### E51.01 — hangman feedback message updates after locale switch
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** hra je načtená a uživatel uhodne špatné písmeno
- **When** uživatel přepne jazyk na angličtinu
- **Then** feedback zpráva se přepne do angličtiny

### E52.01 — lose modal title updates after locale switch
**Soubor:** `tests/edge/i18n.spec.ts`

- **Given** uživatel prohraje hangman hru
- **When** uživatel přepne jazyk na angličtinu
- **Then** titulek modalu se přepne do angličtiny

### E53.01 — /rock-paper-scissors/ has no serious axe violations
**Soubor:** `tests/edge/a11y.spec.ts`

- **Given** hra na adrese /rock-paper-scissors/ je načtená
- **When** proběhne axe accessibility scan
- **Then** nejsou nalezeny serious ani critical porušení

### E54.01 — an empty nickname shows an error and stays on setup
**Soubor:** `tests/edge/chat-setup.spec.ts`

- **Given** hra Chat s postavou je načtená
- **When** hráč klikne na Začít chat bez přezdívky
- **Then** zobrazí se chybová hláška a hráč zůstane na úvodní obrazovce

### E54.02 — the nickname input is capped at 32 characters
**Soubor:** `tests/edge/chat-setup.spec.ts`

- **Given** hra Chat s postavou je načtená
- **Then** input nedovolí zadat víc než 32 znaků

### E54.03 — an HTML payload in a message is rendered as literal text, not executed
**Soubor:** `tests/edge/chat-setup.spec.ts`

- **Given** hráč je v chatu s Brumbálem
- **When** hráč pošle zprávu s XSS payloadem
- **Then** payload je vykreslen jako text a nespustí se žádný skript

### E54.04 — the error field is hidden until validation fails
**Soubor:** `tests/edge/chat-setup.spec.ts`

- **Given** hra Chat s postavou je načtená
- **Then** chybové pole není na úvodní obrazovce vidět

## Visual (@visual)

### V01.01 — menu page layout
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** uživatel otevře hlavní menu
- **Then** screenshot mřížky her odpovídá baseline

### V02.01 — hangman ready state
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** hra Hádej postavu je ve stavu připraveno ke hře
- **Then** screenshot herního kontejneru odpovídá baseline

### V03.01 — quiz house ready state
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** hra Hádej kolej je ve stavu připraveno ke hře
- **Then** screenshot herního kontejneru odpovídá baseline

### V04.01 — photo quiz ready state
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** hra Kdo je na fotce je ve stavu připraveno ke hře
- **Then** screenshot herního kontejneru odpovídá baseline

### V05.01 — hangman lose modal
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** uživatel prohraje hangman hru
- **Then** screenshot proherního modalu odpovídá baseline

### V06.01 — rock-paper-scissors ready state
**Soubor:** `tests/visual/screenshots.spec.ts`

- **Given** viewport je nastaven na 1280×720 a fonty jsou stabilizované
- **Given** hra Kámen–nůžky–papír je ve stavu připraveno ke hře
- **Then** screenshot herního kontejneru odpovídá baseline
