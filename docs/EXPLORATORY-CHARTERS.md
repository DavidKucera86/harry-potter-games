# Exploratory charty

Automatizovaná E2E suita je pevný scénář. Časem se kolem něj začne vyvíjet — testuje se
proti němu, ne skrz něj. Exploratory sezení chodí tam, kam skript nechodí.

**Jak to funguje:** vezmi **další chartu v rotaci**, dej si na ni 30 minut, hraj podle ní a
zapiš do logu. Rotace je záměrná — opakovat pořád tu samou chartu má stejný problém jako
opakovat pořád tu samou sadu testů.

**Kdo sezení odehrál, patří do logu.** Sezení z 2026-08-25 odehrál agent skriptovanými
sondami nad Docker buildem, ne člověk u obrazovky. Chybové stavy se tak proklepat dají —
sonda umí zabít síť přesně uprostřed požadavku, což ruka nesvede — ale **není to náhrada
za lidské sezení**: agent viděl jen to, na co se zeptal, nevšiml si ničeho periferně a
nemá netrpělivost, která u charty #1 rozhoduje. Naopak: ten 48sekundový nález vznikl až
tím, že sonda čekala dál, než by čekal člověk. Obojí má v rotaci místo.

App se spouští **jen v Dockeru** (`docker compose up --build`, viz CLAUDE.md).

Metodika: skilly `pesticide-paradox-mitigation` a `test-oracles-hiccupps`.
Orákula: [ORACLES.md](ORACLES.md).

## Rotace chart

| # | Charta | Na co se dívat |
|---|---|---|
| 1 | **Chybové stavy** | Vypni síť uprostřed načítání. Nech API vrátit nesmysl. Rozbij obrázek. Vidí hráč něco srozumitelného, nebo prázdno? |
| 2 | **Jen klávesnice** | Odlož myš. Projdi menu → hru → modal → zpět. Je fokus vždy vidět? Dá se z modalu odejít? *(Dřívější mezera „hangman nemá keyboard-only E2E" zavřena 2026-08-25 testem `E61.01` — charta teď hledá to, co skript nepokrývá: ostatní hry, přepnutí jazyka fokusem, návrat z modalu jinam než tlačítkem.)* |
| 3 | **Pomalá síť a offline** | DevTools throttling na 3G, pak letadlový režim. Funguje offline **každá** z šesti her, ne jen ta první? |
| 4 | **Přepnutí jazyka uprostřed hry** | Rozehraj, přepni cs↔en, pokračuj. Přeloží se i to, co už je na obrazovce? Modal? Hlášky? |
| 5 | **Spam a dvojkliky** | Mačkej „Nová hra" a odpovědi tak rychle, jak to jde. Poteče záplava requestů? Započítá se odpověď dvakrát? |
| 6 | **Back button a historie** | Zpět uprostřed hry, dopředu, reload, otevření hry přímo z URL. Sedí stav? |
| 7 | **Extrémní vstupy** | Přezdívka na 32 znaků, emoji, RTL text, samá diakritika, samé mezery. Dlouhá jména postav v hangmanu. |
| 8 | **Reduced motion a zoom** | Zapni `prefers-reduced-motion`. Zoom na 200 %. Rozpadne se layout? Zůstane něco nedostupné? |

Po chartě 8 se začíná znovu od 1 — ale s aktuálním buildem, takže to není totéž sezení.

## Log sezení

Poslední sloupec je ten podstatný. Bez něj je to deník, ne zpětná vazba: typ mezery
v *technice* je vstup pro post-incident krok v pesticide skillu, a když se stejný typ
opakuje, je to signál investovat do té techniky plošně.

| Datum | Charta | Build | Nález | Orákulum | Typ mezery v technice |
|---|---|---|---|---|---|
| 2026-08-25 | #1 Chybové stavy | `cc1f76a` (Docker) | **Při requestu, který nikdy neodpoví, sedí hráč 48 s na spinneru** bez jediného slova vysvětlení. Naměřeno, nedopočítáno: 3 pokusy × 15 s timeout + 2 × 1 s prodleva. Pak se hra korektně zotaví z lokálních fixtures a je hratelná — jenže ty fixtures jsou lokální a instantní celou tu dobu. | **P — Purpose** | **Test ověřil zotavení, ne dobu čekání.** `fetch-timeout.spec.ts` tvrdí, že se hra nakonec vzpamatuje, a je zelený. Kolik toho hráč mezitím vydrží, se neptá nikdo. *Opraveno 2026-08-25: `API_TOTAL_BUDGET_MS` strop na celé načtení, přeměřeno proti Docker buildu na 15,1 s.* |
