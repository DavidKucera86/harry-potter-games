# Harry Potter Games

Sada jednoduchých browser her ze světa Harryho Pottera. Data z [HP API](https://hp-api.onrender.com/).

## Hry

| Hra | Popis |
|---|---|
| [Hádej jméno postavy](guess-character-name/) | Hangman — uhodni jméno postavy písmeno po písmenu |
| [Hádej kolej postavy](guess-house/) | Vyber správnou Bradavickou kolej ke jménu postavy |
| [Hádej zaklínadlo](guess-spell/) | Hangman — uhodni zaklínadlo |
| [Kdo je na fotce?](who-is-on-photo/) | Podívej se na fotku a vyber správné jméno |
| [Kámen, nůžky, papír](rock-paper-scissors/) | Utkej se v kámen–nůžky–papír proti postavám z Bradavic; kdo první získá pět výher, bere zápas |

## Spuštění lokálně — vždy přes Docker

App se spouští **výhradně v Dockeru** (žádné otevírání `index.html` napřímo ani ad-hoc
statické servery). Multi-stage build ([Dockerfile](Dockerfile)) v prvním kroku spustí
`npm run build` na `node:22-alpine`, ve druhém servíruje statický výstup přes nginx na
portu **4173** ([docker/nginx.conf](docker/nginx.conf) zrcadlí produkční security headers
z [netlify.toml](netlify.toml)):

```bash
docker compose up --build      # build + servírování na http://127.0.0.1:4173
docker compose down            # stop
```

Port 4173 je zvolen záměrně — odpovídá base URL pro Playwright, takže E2E míří na stejnou
adresu bez ohledu na to, zda běží kontejner nebo vestavěný server.

> Toolchain (`build`, `lint`, `typecheck`) a unit testy (`vitest`) běží na hostu jako
> obvykle — pravidlo o Dockeru se týká *spouštění appky*, ne nástrojů.

## Deploy na Netlify

1. Repozitář je propojen s Netlify (publish directory: `.`, viz `netlify.toml`).
2. Kořenová URL zobrazí menu her.
3. Jednotlivé hry jsou na `/guess-character-name/`, `/guess-house/` atd.

## Struktura repozitáře

| Cesta | Účel |
|---|---|
| `src/` | **TypeScript zdroj** — edituj zde |
| `shared/*.js`, `shared/i18n/` | **Generovaný JS** z `npm run build:js` — commituj po buildu |
| `index.html`, `guess-*/index.html` | **Generované HTML** z `npm run build:html` — commituj po buildu |
| `shared/templates/` | HTML šablony (vstup pro build:html) |
| `shared/styles/`, `shared/fixtures/` | Statické assety (CSS, JSON fixtures) |
| `scripts/build-klodo-card.mjs` | Generátor Klódo-Metr kartičky do patičky (viz níže) |
| `klodo-metr.png` | **Generovaná** Klódo-Metr kartička — přegeneruje se před každým commitem |
| `tests/` | Vitest unit + Playwright E2E (+ visual snapshoty) |

**Poznámka:** Složka `shared/` obsahuje jak statické soubory (CSS, fixtures, templates), tak generované `.js` moduly. Generované soubory odpovídají `src/shared/` a `src/guess-*/`.

## Tech stack

- **Zdrojový kód:** TypeScript v `src/` (ES modules, OOP třídy)
- **Build:** `npm run build` = HTML ze šablon + kompilace TS → JS (esbuild)
- **Deploy artefakty:** generované `*.js` a `index.html` soubory v kořeni (commitované)
- **i18n:** čeština + angličtina (`src/shared/i18n/`), přepínač ve footeru, `?lang=en|cs`
- **Klódo-Metr kartička:** patička odkazuje na `klodo-metr.png` — sdílenou kartičku z [Klódo-Metr](https://github.com/vibecoding-akademie/klodo-metr). Přegeneruje se před každým commitem (`npm run klodo:card`); publikují se **jen agregátní sekce** (hero s délkou v cm a levelem, žebříček levelů, „co to je v reálu" a odznaky) — panel s projekty a útratou se vynechává, takže názvy projektů ani útrata ven nejdou. Generace je fail-soft — když ccusage není dostupné, ponechá poslední kartičku a commit nezablokuje.
- **PWA:** service worker (`shared/sw.js`) s network-first pro HTML a cache-first pro assety, update banner, offline cache
- **Prefetch:** menu stránka na pozadí stáhne postavy a kouzla do session cache (`prefetchGameData.js`)
- **Sdílené moduly** (kompilované do `shared/`):
  - `config.js` — globální konfigurace (životy, API URL, cache verze, retry)
  - `dataProvider.js` — načítání dat s cache v `sessionStorage` a retry logikou
  - `BaseGame.js` — společná logika her (životy, modal, loader, balíček postav)
  - `QuizGame.js` — sdílená logika kvízových her (kolej, fotka)
  - `HangmanGame.js` — sdílená hangman logika pro postavy i zaklínadla
  - `wordUtils.js`, `hangmanUtils.js`, `deckUtils.js`, `rpsUtils.js` — utility
  - `i18n/index.js` — lokalizace UI textů
- **Styly:** `shared/common.css` je entry point importující moduly v `shared/styles/` (+ `hangman.css` pro hangman hry)
- **HTML generátor** (`npm run build:html`) ze šablon v `shared/templates/`
- **Testování:** Vitest (unit) + Playwright (E2E), ESLint a TypeScript kontrola pro `src/` i `tests/`

## Build a úpravy kódu

```bash
npm run build        # build:html + build:js
npm run build:html   # jen HTML ze šablon
npm run build:js     # jen kompilace TypeScriptu z src/ do shared/ a her
npm run typecheck    # TypeScript kontrola src/ (tsconfig.json) a tests/ (tsconfig.tests.json)
npm run lint         # ESLint pro src/ a tests/
npm test             # build + lint + typecheck + unit + E2E
```

Lokální debug sourcemap: `SOURCEMAP=1 npm run build:js` (`.map` soubory jsou v `.gitignore`).

Po úpravě šablony nebo TypeScriptu spusť `npm run build` a commitni vygenerované soubory.

## Úprava HTML

HTML stránky se generují ze šablon v `shared/templates/`. Po úpravě šablony spusť:

```bash
npm run build:html
```

Vygenerované soubory (`index.html`, `guess-*/index.html`, …) commituj do repozitáře — `npm test` spouští build automaticky přes `pretest` hook.

### Před commitem

```bash
npm run verify:build
```

Ověří, že `npm run build` neprodukuje necommitnuté změny v generovaných souborech. Pre-commit hook (`simple-git-hooks`) automaticky spouští `verify:build`, `lint`, `typecheck`, regeneraci [E2E test katalogu](docs/E2E-TEST-CATALOG.md) a regeneraci + re-stage Klódo-Metr kartičky (`klodo-metr.png`).

## Sdílená cache dat

`dataProvider.js` ukládá odpovědi z HP API do `sessionStorage` (TTL 1 hodina, verze cache v `GAME_CONFIG.CACHE_VERSION`). První hra v prohlížečové session stáhne data z API, další hry je načtou z cache bez nového network requestu. Při chybě serveru (5xx) se request automaticky opakuje až 3×.

**Bump cache:** změň `APP_VERSION` v [`src/shared/config.ts`](src/shared/config.ts) — invaliduje sessionStorage cache (`CACHE_VERSION`) i service worker cache (`SW_CACHE_NAME`), pak spusť `npm run build`.

## Testování

Playwright end-to-end testy a Vitest unit testy pokrývají všech 5 her. Pro běžný vývoj stačí spouštět testy **lokálně a ručně před pushem** do gitu. GitHub Actions a Netlify secrets jsou **volitelné** — potřebuješ je jen pro plně automatický deploy pipeline.

### Požadavky

- Node.js 18+ (doporučeno 22)
- npm
- Chromium pro Playwright (instaluje se jedním příkazem níže)

### První spuštění (jednorázově)

V kořeni repozitáře (`harry-potter-games/`):

```bash
npm ci
npx playwright install chromium
```

### Doporučený postup před pushem

```bash
npm test
```

Co se stane:

1. `npm run build` — HTML + JS
2. `npm run lint` + `npm run typecheck`
3. Vitest spustí unit testy (utility, dataProvider, BaseGame, HangmanGame, QuizGame, GuessHouseGame, i18n)
4. Playwright spustí lokální server (`npx serve . -l 4173`)
5. Provede celou testovací sadu (smoke + critical + edge + a11y + visual)
6. HP API je mockované — testy nepotřebují internet ani live API
7. Při úspěchu můžeš pushnout
8. Při failu viz níže „Co dělat, když test spadne“

**Poznámka:** Nepotřebuješ nastavovat GitHub secrets ani Netlify tokeny — to platí jen pro volitelné CI.

### Volitelné příkazy

| Příkaz | Účel |
|---|---|
| `npm run test:unit` | Jen Vitest unit testy |
| `npm run test:e2e` | Jen Playwright E2E testy |
| `npm run test:ui` | Playwright UI mode — debug jednotlivých testů |
| `npm run docs:test-catalog` | Vygeneruje [E2E test katalog](docs/E2E-TEST-CATALOG.md) ve stylu Given-When-Then |
| `npm run klodo:card` | Přegeneruje Klódo-Metr kartičku v patičce (`klodo-metr.png`) |
| `npx playwright test --grep @smoke` | Jen smoke testy (rychlejší kontrola) |
| `npx playwright test --grep @critical` | Jen happy-path scénáře |
| `npx playwright test --grep @visual` | Visual regression screenshoty |
| `npx playwright test tests/visual --update-snapshots` | Aktualizace baseline PNG (generuj na Linuxu/CI) |
| `npx playwright test tests/critical/hangman-character.spec.ts` | Jeden testovací soubor |
| `PLAYWRIGHT_BASE_URL=https://your-site.netlify.app npm run test:production` | Proti live URL (po deployi) |

### Co dělat, když test spadne

```bash
npx playwright show-report
```

Otevře HTML report v prohlížeči. U failed testu klikni na **Trace** — otevře se Trace Viewer (timeline, screenshoty, síť). Alternativa:

```bash
npx playwright show-trace test-results/.../trace.zip
```

### Priorita testů

| Tag | Popis |
|---|---|
| `@smoke` | Základní dostupnost stránek a her |
| `@critical` | Hlavní happy-path scénáře |
| `@edge` | Edge cases (validace, prohra, cache, XSS, speciální znaky, a11y, API retry, i18n, PWA, …) |
| `@visual` | Visual regression screenshoty (V01.01–V05.01) |

### Test catalog (E2E ID)

Formát ID: `{Prefix}{NN}.{NN}` — base číslo a index vždy 2 cifry, index od `.01`. Duplicity stejného base ID mají `.02`, `.03`, …

Plný popis všech E2E scénářů ve stylu **Given-When-Then** je v [docs/E2E-TEST-CATALOG.md](docs/E2E-TEST-CATALOG.md). Při commitu se automaticky přegeneruje (pre-commit hook); ručně: `npm run docs:test-catalog`.

| ID | Soubor | Popis |
|---|---|---|
| S01.01–S02.01, S04.01–S05.01 | smoke/ | Smoke testy menu, navigace, skripty, zpět |
| S03.01–S03.04 | smoke/games-load | Načtení každé ze 4 her |
| G01.01, H01.01–H02.01, N01.01, Q01.01–Q02.01 | critical/ | Happy-path scénáře |
| E01.01–E03.01 | hangman-input | Validace vstupu hangmanu |
| E04.01–E04.02 | hangman-input, hangman-lose | Enter win / prohra hangmanu |
| E05.01–E05.02, E29.01 | hangman-input, hangman-word-wrap | Enter lose / zalamování slov |
| E06.01–E06.02 | hangman-diacritics, hangman-input | Diakritika / Enter spell win |
| E07.01–E09.01 | quiz-lose | Prohra kvízů |
| E10.01–E11.01 | api-failure | Recovery po API chybě |
| E12.01 | session-cache | Session cache dat |
| E13.01 | hangman-special-chars | Auto-odhalení speciálních znaků |
| E14.01 | photo-image-error | Rozbitá fotka |
| E15.01–E17.01 | deck-uniqueness | Unikátnost balíčku |
| E18.01–E20.01 | modal-accessibility | Přístupnost modalu |
| E21.01 | duplicate-names | Kvíz podle ID |
| E22.01 | hangman-duplicate-names | Deduplikace jmen |
| E23.01–E24.01 | fetch-timeout | Timeout a retry |
| E25.01 | xss-safe-dom | XSS bezpečnost |
| E26.01 | api-retry | Retry 5xx |
| E27.01 | photo-all-broken | Všechny fotky rozbité |
| E28.01 | offline-fallback | Fallback fixtures |
| E30.01–E31.01 | quiz-mobile | Mobilní kvízy |
| E32.01–E38.01 | hangman-mobile | Mobilní hangman |
| E39.01–E42.01 | a11y | Axe accessibility her |
| E43.01–E43.10 | i18n | Konzistence statických textů po přepnutí jazyka |
| E44.01–E45.01 | pwa-offline | Service worker a offline hra |
| E46.01–E48.01 | sw-update | Update banner, network-first HTML, prefetch |
| E49.01 | a11y | Axe scan menu stránky |
| E50.01–E52.01 | i18n | `?lang=en`, dynamický feedback a modal po přepnutí jazyka |
| V01.01–V05.01 | visual/screenshots | Visual regression snapshoty |

### Visual regression

Baseline PNG jsou v `tests/visual/screenshots.spec.ts-snapshots/`. Po změně UI/CSS spusť na Linuxu (stejné prostředí jako CI):

```bash
npx playwright test tests/visual --update-snapshots
```

Visual testy se nespouští proti produkci (`PLAYWRIGHT_TARGET=production`).

### CI pipeline (volitelné)

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) se spouští **automaticky jen** při pushi na `main` (pokud je nasazen). Vyžaduje GitHub secrets (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `NETLIFY_SITE_URL`) — **pro lokální testování je nepotřebuješ**.

Průběh:

1. **Pre-deploy** — `verify:build`, `typecheck`, celá testovací sada proti localhost (~83 testů včetně visual)
2. **Deploy** — Netlify CLI
3. **Post-deploy** — menu smoke testy S01.01 + S02.01 proti produkční URL (`tests/smoke/menu.spec.ts`, `--workers=1`)

Při selhání v CI se do GitHub Actions nahraje Playwright HTML report včetně trace (Artifacts → stáhnout → `npx playwright show-report playwright-report`).

Pro plně automatický deploy je potřeba v Netlify vypnout paralelní auto-deploy z GitHub hooku, aby deploy probíhal jen z GHA po úspěšných pre-deploy testech.
