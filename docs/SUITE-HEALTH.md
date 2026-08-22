# Zdraví testovací suity

Pesticide paradox je **trend**, ne stav — suita neztrácí schopnost chytat chyby naráz, ale
postupně, jak se kód přizpůsobuje přesně těm testům, které existují. Bez téhle tabulky se to
nedá měřit.

Doplňuj čtvrtletně, nebo po každém větším zásahu do testů. Metodika: skill
`pesticide-paradox-mitigation`; orákula: [ORACLES.md](ORACLES.md).

## Trend

| Datum | Unit testů | E2E testů | Coverage (stmt/br) | Mutation score | Nejstarší nedotčený test | Stáří fixtures | Exploratory sezení |
|---|---|---|---|---|---|---|---|
| 2026-08-22 | 1049 | 97 | 87,74 / 78,67 | 84,97 % | — | 7 týdnů | 0 |

Příkazy: `npm run test:coverage` · `npm run test:mutation` · `git log -1 --format=%ci -- <soubor>`

## Přeživší mutanti — to-do list

Přeživší mutant je místo, kde by se kód dal změnit a **žádný test by si toho nevšiml**.
Není to chyba sama o sobě; je to díra, kterou by chyba prošla. Neřeš je hromadně — ber je
podle hodnoty modulu.

| Modul | Score | Přeživších | Poznámka |
|---|---|---|---|
| `wordUtils.ts` | 100,00 % | 0 | Vyřešeno 2026-08-22 — viz níže |
| `rpsUtils.ts` | 95,00 % | 1 | Malá doména, vyčerpávající tabulka; zbytek je nejspíš ekvivalentní mutant |
| `urlUtils.ts` | 89,29 % | 3 | Bezpečnostně citlivé (DOM sink) — **další na řadě** |
| `chatEngine.ts` | 87,27 % | 18 | Největší modul; 3 mutanti bez pokrytí vůbec |
| `deckUtils.ts` | 81,25 % | 6 | `shuffle` bere globální `Math.random`; injektovatelný RNG by část z nich zabil |
| `hangmanUtils.ts` | 62,50 % | 15 | **Nejhorší poměr** — 15 přeživších na 40 řádků kódu. Nejvyšší hodnota za nejmíň práce |

## Log nálezů

### 2026-08-22 — první běh mutation testingu

Dva přeživší v `dedupeWords`, oba potvrzené jako reálné netestované chování:

1. **`word.length > existing.length` → `false` přežil.** Větev vypadá nedosažitelně, protože
   dva ASCII řetězce se stejným `toLowerCase()` klíčem mají stejnou délku. Unicode to boří:
   `'İ'.toLowerCase()` jsou dvě code units (`i` + kombinující tečka), takže obě varianty
   spadnou pod jeden klíč s různou délkou a ta větev rozhoduje, která přežije.
2. **`toLowerCase()` → `toUpperCase()` přežil.** Nejsou zaměnitelné: uppercasing složí `'ß'`
   na `'SS'`, takže by německé jméno a jeho přepis splynuly v jeden záznam a jeden by
   z balíčku zmizel.

Typ mezery (technika, ne symptom): **chybějící unicode ekvivalenční třída.** Testy pokrývaly
jen ASCII, přestože hra běží v češtině a jména tahá z cizího API. Zabito dvěma testy;
zároveň odstraněn duplicitní `it()`, který měl byte-identický assert s tím vedle sebe —
dvě jména pro jeden test case, tedy nulová dodatečná ochrana.
