# Exploratory charty

Automatizovaná E2E suita je pevný scénář. Časem se kolem něj začne vyvíjet — testuje se
proti němu, ne skrz něj. Exploratory sezení chodí tam, kam skript nechodí.

**Jak to funguje:** vezmi **další chartu v rotaci**, dej si na ni 30 minut, hraj podle ní a
zapiš do logu. Rotace je záměrná — opakovat pořád tu samou chartu má stejný problém jako
opakovat pořád tu samou sadu testů.

App se spouští **jen v Dockeru** (`docker compose up --build`, viz CLAUDE.md).

Metodika: skilly `pesticide-paradox-mitigation` a `test-oracles-hiccupps`.
Orákula: [ORACLES.md](ORACLES.md).

## Rotace chart

| # | Charta | Na co se dívat |
|---|---|---|
| 1 | **Chybové stavy** | Vypni síť uprostřed načítání. Nech API vrátit nesmysl. Rozbij obrázek. Vidí hráč něco srozumitelného, nebo prázdno? |
| 2 | **Jen klávesnice** | Odlož myš. Projdi menu → hru → modal → zpět. Je fokus vždy vidět? Dá se z modalu odejít? *(Známá mezera: hangman nemá keyboard-only E2E.)* |
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
| _(zatím žádné sezení)_ | | | | | |
