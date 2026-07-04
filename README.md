# Harry Potter Games

Sada jednoduchých browser her ze světa Harryho Pottera. Data z [HP API](https://hp-api.onrender.com/).

## Hry

| Hra | Popis |
|---|---|
| [Hádej jméno postavy](guess-character-name/) | Hangman — uhodni jméno postavy písmeno po písmenu |
| [Hádej kolej postavy](guess-house/) | Vyber správnou Bradavickou kolej ke jménu postavy |
| [Hádej zaklínadlo](guess-spell/) | Hangman — uhodni zaklínadlo |
| [Kdo je na fotce?](who-is-on-photo/) | Podívej se na fotku a vyber správné jméno |

## Spuštění lokálně

Otevři [`index.html`](index.html) v prohlížeči, nebo spusť libovolný statický server v kořeni repozitáře.

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
| `tests/` | Vitest unit + Playwright E2E (+ visual snapshoty) |

**Poznámka:** Složka `shared/` obsahuje jak statické soubory (CSS, fixtures, templates), tak generované `.js` moduly. Generované soubory odpovídají `src/shared/` a `src/guess-*/`.

## Tech stack

- **Zdrojový kód:** TypeScript v `src/` (ES modules, OOP třídy)
- **Build:** `npm run build` = HTML ze šablon + kompilace TS → JS (esbuild)
- **Deploy artefakty:** generované `*.js` a `index.html` soubory v kořeni (commitované)
- **i18n:** čeština + angličtina (`src/shared/i18n/`), přepínač ve footeru, `?lang=en|cs`
- **PWA:** service worker (`shared/sw.js`) s network-first pro HTML a cache-first pro assety, update banner, offline cache
- **Prefetch:** menu stránka na pozadí stáhne postavy a kouzla do session cache (`prefetchGameData.js`)
- **Sdílené moduly** (kompilované do `shared/`):
  - `config.js` — globální konfigurace (životy, API URL, cache verze, retry)
  - `dataProvider.js` — načítání dat s cache v `sessionStorage` a retry logikou
  - `BaseGame.js` — společná logika her (životy, modal, loader, balíček postav)
  - `QuizGame.js` — sdílená logika kvízových her (kolej, fotka)
  - `HangmanGame.js` — sdílená hangman logika pro postavy i zaklínadla
  - `wordUtils.js`, `hangmanUtils.js`, `deckUtils.js` — utility
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

Ověří, že `npm run build` neprodukuje necommitnuté změny v generovaných souborech. Pre-commit hook (`simple-git-hooks`) spouští `verify:build`, `lint` a `typecheck` automaticky.

## Sdílená cache dat

`dataProvider.js` ukládá odpovědi z HP API do `sessionStorage` (TTL 1 hodina, verze cache v `GAME_CONFIG.CACHE_VERSION`). První hra v prohlížečové session stáhne data z API, další hry je načtou z cache bez nového network requestu. Při chybě serveru (5xx) se request automaticky opakuje až 3×.

**Bump cache:** změň `APP_VERSION` v [`src/shared/config.ts`](src/shared/config.ts) — invaliduje sessionStorage cache (`CACHE_VERSION`) i service worker cache (`SW_CACHE_NAME`), pak spusť `npm run build`.

## Testování

Playwright end-to-end testy a Vitest unit testy pokrývají všechny 4 hry. Pro běžný vývoj stačí spouštět testy **lokálně a ručně před pushem** do gitu. GitHub Actions a Netlify secrets jsou **volitelné** — potřebuješ je jen pro plně automatický deploy pipeline.

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
| `@visual` | Visual regression screenshoty (V01–V05) |

### Test catalog (E2E edge ID)

| ID | Soubor | Popis |
|---|---|---|
| E01–E03 | hangman-input | Validace vstupu hangmanu |
| E04 | hangman-lose | Prohra hangmanu |
| E05, E29 | hangman-word-wrap | Zalamování slov |
| E06 | hangman-diacritics | Diakritika |
| E07–E09 | quiz-lose | Prohra kvízů |
| E10–E11 | api-failure | Recovery po API chybě |
| E12 | session-cache | Session cache dat |
| E13 | hangman-special-chars | Auto-odhalení speciálních znaků |
| E14 | photo-image-error | Rozbitá fotka |
| E15–E17 | deck-uniqueness | Unikátnost balíčku |
| E18–E20 | modal-accessibility | Přístupnost modalu |
| E21 | duplicate-names | Kvíz podle ID |
| E22 | hangman-duplicate-names | Deduplikace jmen |
| E23–E24 | fetch-timeout | Timeout a retry |
| E25 | xss-safe-dom | XSS bezpečnost |
| E26 | api-retry | Retry 5xx |
| E27 | photo-all-broken | Všechny fotky rozbité |
| E28 | offline-fallback | Fallback fixtures |
| E30–E31 | quiz-mobile | Mobilní kvízy |
| E32–E38 | hangman-mobile | Mobilní hangman |
| E39–E42 | a11y | Axe accessibility |
| E43 | i18n | Konzistence statických textů po přepnutí jazyka |
| E44–E45 | pwa-offline | Service worker a offline hra |
| E46–E47 | sw-update | Update banner a network-first HTML |
| E48 | sw-update | Prefetch dat na menu (session cache) |
| E49 | a11y | Axe scan menu stránky |
| E50–E52 | i18n | `?lang=en`, dynamický feedback a modal po přepnutí jazyka |
| V01–V05 | visual/screenshots | Visual regression snapshoty |

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
3. **Post-deploy** — menu smoke testy S1 + S2 proti produkční URL (`tests/smoke/menu.spec.ts`, `--workers=1`)

Při selhání v CI se do GitHub Actions nahraje Playwright HTML report včetně trace (Artifacts → stáhnout → `npx playwright show-report playwright-report`).

Pro plně automatický deploy je potřeba v Netlify vypnout paralelní auto-deploy z GitHub hooku, aby deploy probíhal jen z GHA po úspěšných pre-deploy testech.
