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
| 2026-08-22 | 1075 | 98 | 87,74 / 78,63 | 85,86 % | — | 7 týdnů | 0 |
| 2026-08-22 | 1125 | 99 | 87,73 / 78,58 | 90,28 % | — | 7 týdnů | 0 |

Příkazy: `npm run test:coverage` · `npm run test:mutation` · `git log -1 --format=%ci -- <soubor>`

## Přeživší mutanti — to-do list

Přeživší mutant je místo, kde by se kód dal změnit a **žádný test by si toho nevšiml**.
Není to chyba sama o sobě; je to díra, kterou by chyba prošla. Neřeš je hromadně — ber je
podle hodnoty modulu.

| Modul | Score | Přeživších | Poznámka |
|---|---|---|---|
| `wordUtils.ts` | 100,00 % | 0 | Vyřešeno 2026-08-22 — viz níže |
| `rpsUtils.ts` | 95,00 % | 1 | Malá doména, vyčerpávající tabulka; zbytek je nejspíš ekvivalentní mutant |
| `urlUtils.ts` | 100,00 % | 0 | Vyřešeno 2026-08-22 — viz níže; jeden ze tří mutantů byl reálná díra |
| `chatEngine.ts` | 87,27 % | 18 | Největší modul; **3 mutanti bez pokrytí vůbec** — kód, kterého se nedotkne žádný test. Na řadě po `deckUtils` |
| `deckUtils.ts` | 81,25 % | 6 | `shuffle` bere globální `Math.random`; injektovatelný RNG by část z nich zabil — **další na řadě**, příčina je pojmenovaná |
| `hangmanUtils.ts` | 100,00 % | 0 | Vyřešeno 2026-08-22 — viz níže; tabulka nahrazena Unicode dekompozicí |

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

### 2026-08-22 — patnáct mutantů, jedna příčina: ručně psaná tabulka místo dat, která už existují

`DIACRITIC_MAP` měla patnáct řádků a testy ověřovaly dva (`É`, `ř`). Zbylých třináct se
dalo vyprázdnit a suita zůstala zelená. Navíc: `é` je **jediný** ne-ASCII znak v celém
`shared/fixtures/` — těch třináct řádků tedy nebylo jen netestovaných, ony nebyly ani
procvičené žádnými reálnými daty v repu.

Co rozbitá položka dělá, není zřejmé z prvního pohledu: písmeno se nestane
neuhodnutelným, ale **automaticky odhaleným**. `'ů': ''` znamená, že se `ů` prozradí
zadarmo na startu a psaní `u` už ho netrefí. Tichá změna obtížnosti — přesně to, co
žádný test nehlídal.

Unicode kanonická dekompozice reprodukuje všech patnáct řádků do posledního znaku, takže
tabulka opisovala data, která standard už dodává. Odvození základního písmene místo tabulky
mutanty odstraní konstrukcí — není co mutovat — a zavře reálnou mezeru: slova chodí
z anglicko-francouzské HP API a `ë`, `ï`, `â`, `ü` v české tabulce nebyly, takže `Zoë` se
odhalilo zadarmo. Ověřeno v prohlížeči, `E06.03` na staré implementaci padá.

Orákulum: **P — Purpose** (z české klávesnice musí jít dosáhnout na každé písmeno slova,
které hra ukáže), referencí je **S — Standards** (Unicode canonical decomposition).

Typ mezery (technika, ne symptom): **příklad zastupující třídu.** Dva příklady na
patnáctiprvkovou tabulku vypadají v diffu jako pokrytí, ale chrání dva řádky z patnácti.
Kdykoli test bere jeden prvek z vyjmenované množiny, patří tam `it.each` nad celou
množinou — a expected hodnoty psané ručně, ne dopočítané tou samou funkcí, jinak assert
neověřuje nic.

Poslední dva mutanti byli jiný případ: ukotvení `^`/`$` v `/^[a-z]$/`, viditelné jen
u víceznakového vstupu. Při jejich zabíjení se ukázalo, že `HangmanGame.guessLetter` má
tentýž regex **opsaný podruhé** místo volání `isGuessableLetter` — pravidlo ve dvou
kopiích, kde rozejití nic neshodí (**P — Product**). Sjednoceno.

### 2026-08-22 — mutant na `trim()` ukázal na obcházitelnou bezpečnostní stráž

Tři přeživší v `isSafeImageUrl` a všichni na normalizaci vstupu. Dva z nich (`if (!url)`
→ smazáno / `false`) byly **ekvivalentní**: `!url` platí jen pro `''` a `new URL('')` vždy
hodí výjimku, takže ta stráž nikdy nezměnila výsledek. Mrtvý kód → smazán, ne obestavěn
testem.

Třetí — `value.trim()` → `value` — přežil proto, že žádný test nezávisel na oříznutí. Při
hledání testu, který by ho zabil, vyšlo najevo, že normalizace tam nechybí jen v testech:

**WHATWG URL parser zahazuje ASCII tab/LF/CR kdekoli v URL, ještě než ji začne parsovat.**
Stráž `!url.startsWith('//')` se ale dívala na surový řetězec, tedy na jiný text, než jaký
nakonec poletí do sítě:

```js
isSafeImageUrl('/\t/evil.example/pwn.png')             // → true, nezačíná na "//"
new URL('/\t/evil.example/pwn.png', 'https://nase')    // → https://evil.example/pwn.png
```

Otrávená odpověď HP API (nebo podvržená `sessionStorage` cache) tak dostane `img.src` na
cizí origin — únik IP a Referreru, tracking pixel v dětské hře. CSP to nechytí: `img-src`
musí povolovat `https:`, protože odtud tahá obrázky sama HP API.

Orákulum: **S — Standards** (URL Standard) ve sporu s **C — Claims** (doc komentář modulu
i sekce Security v CLAUDE.md slibovaly, že protocol-relative se zahazuje).

Typ mezery (technika, ne symptom): **rozhodování nad nenormalizovaným vstupem.** Stráž
porovnávala znak po znaku řetězec, o jehož významu rozhoduje až cizí parser. Stejná třída
chyby čeká u každé budoucí kontroly, která si sáhne na `startsWith` / `includes` nad
nedůvěryhodným vstupem místo nad jeho kanonickou podobou — proto je to pravidlo teď
v CLAUDE.md, ne jen komentář v modulu.

Zabito na třech vrstvách, protože čistá funkce sama nedokazuje, že se payload nedostane
do sítě: tabulkové unit testy, property (*žádný znak, který parser ignoruje, nesmí
z odmítnuté URL udělat přijatou*) a E2E `E25.02`, které projde celý balíček a tvrdí, že
na `evil.example` nejde **žádný** request. E25.02 záměrně nekontroluje jen první fotku —
to by prošlo pokaždé, když shuffle rozdá otrávenou postavu jako poslední.

### 2026-08-22 — orákulový test našel chybu, kterou E2E míjelo

`brand-consistency.test.ts` odhalil, že `rock-paper-scissors` chybí v precache listu
service workeru — hra se offline nenačte, přestože PWA to slibuje a Dockerfile ji kopíruje.

Typ mezery (technika, ne symptom): **E2E testuje jednu instanci místo třídy.**
`pwa-offline.spec.ts` ověřuje offline vždy jen `/guess-character-name/` — jednu hru
ze šesti, vybranou jednou a nikdy nepřehodnocenou. Kterákoli později přidaná hra tím
propadne. Opraveno na úrovni třídy: unit test porovnává všechny čtyři kopie seznamu rout
(Dockerfile `COPY`, `sw.ts`, `sitemap.xml`, README), takže příště chybějící routa
spadne bez ohledu na to, které hry se týká.

**Oprava zápisu 2026-08-22:** ta věta byla nepřesná. Test tehdy porovnával tři kopie —
`sw.ts`, `sitemap.xml` a README — Dockerfile `COPY` v něm nebyl, přestože ho tenhle
záznam jmenoval. `docs/ORACLES.md` to celou dobu vedl správně jako otevřenou mezeru
a kód držel s ORACLES. Doplněno tentýž den, viz záznam níže. Tvrzení v dokumentaci,
které nic nevynucuje, je přesně ta past, kvůli které orákulum **C — Claims** existuje —
a tenhle záznam do ní spadl sám.

### 2026-08-22 — kopie seznamu rout, kterou hlídal až build kontejneru

Dockerfile `COPY` byl jediný ze čtyř zdrojů pravdy o seznamu rout bez unit testu.
Chybějící routa se tak poznala až po `npm run test:docker` — o build kontejneru dál než
PR gate, a přesně tou cestou kdysi propadla chat hra: 404 v kontejneru, zatímco všechny
serve-based testy zelené.

Doplněno do `brand-consistency.test.ts` **obousměrně**. Jednosměrná kontrola („každá hra
je v `COPY`") by chytila chybějící routu, ale ne routu navíc — adresář, který se kopíruje
do image a nikdo jiný o něm neví. Ověřeno oběma směry na upraveném Dockerfilu.

Orákulum: **P — Product**. Nález ale nepřišel z testu, nýbrž ze čtení vlastní
dokumentace: záznam výše tvrdil, že se `COPY` porovnává, `ORACLES.md` to vedl jako
otevřenou mezeru, a kód držel s ORACLES.

Typ mezery (technika, ne symptom): **duplikát mimo dosah rychlé brány.** Duplikovaná
hodnota je v pořádku jen tehdy, když něco selže, jakmile se rozejde — ale *kdy* selže,
rozhoduje o tom, jestli je to brzda, nebo jen zpráva o už rozbitém buildu. Kopie hlídaná
až kontejnerem je prakticky nehlídaná: `test:docker` se pouští ručně před PR, ne při
každém commitu.
