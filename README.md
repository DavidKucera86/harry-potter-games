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

## Tech stack

- HTML, CSS, vanilla JavaScript (ES modules, OOP třídy)
- Sdílené moduly v `shared/`:
  - `config.js` — globální konfigurace (životy, API URL, cache verze, retry)
  - `dataProvider.js` — načítání dat s cache v `sessionStorage` a retry logikou
  - `BaseGame.js` — společná logika her (životy, modal, loader, balíček postav)
  - `HangmanGame.js` — sdílená hangman logika pro postavy i zaklínadla
  - `hangmanUtils.js` — utility pro hangman hry (diakritika, auto-odhalení speciálních znaků)
  - `deckUtils.js` — shuffle a výběr z balíčku
- Sdílené styly v `shared/common.css` a `shared/styles/hangman.css`
- Bez build stepu a bez runtime externích knihoven

## Sdílená cache dat

`dataProvider.js` ukládá odpovědi z HP API do `sessionStorage` (TTL 1 hodina, verze cache v `GAME_CONFIG.CACHE_VERSION`). První hra v prohlížečové session stáhne data z API, další hry je načtou z cache bez nového network requestu. Při chybě serveru (5xx) se request automaticky opakuje až 3×.

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

1. Vitest spustí unit testy (`hangmanUtils`, `deckUtils`)
2. Playwright spustí lokální server (`npx serve . -l 4173`)
3. Provede celou testovací sadu (smoke + critical + edge + a11y)
3. HP API je mockované — testy nepotřebují internet ani live API
4. Při úspěchu můžeš pushnout
5. Při failu viz níže „Co dělat, když test spadne“

**Poznámka:** Nepotřebuješ nastavovat GitHub secrets ani Netlify tokeny — to platí jen pro volitelné CI.

### Volitelné příkazy

| Příkaz | Účel |
|---|---|
| `npm run test:unit` | Jen Vitest unit testy |
| `npm run test:e2e` | Jen Playwright E2E testy |
| `npm run test:ui` | Playwright UI mode — debug jednotlivých testů |
| `npx playwright test --grep @smoke` | Jen smoke testy (rychlejší kontrola) |
| `npx playwright test --grep @critical` | Jen happy-path scénáře |
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
| `@edge` | Edge cases (validace, prohra, cache, XSS, speciální znaky, a11y, API retry, …) |

### CI pipeline (volitelné)

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) se spouští **automaticky jen** při pushi na `main` (pokud je nasazen). Vyžaduje GitHub secrets (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `NETLIFY_SITE_URL`) — **pro lokální testování je nepotřebuješ**.

Průběh:

1. **Pre-deploy** — celá testovací sada proti localhost
2. **Deploy** — Netlify CLI
3. **Post-deploy** — celá sada proti produkční URL

Při selhání v CI se do GitHub Actions nahraje Playwright HTML report včetně trace (Artifacts → stáhnout → `npx playwright show-report playwright-report`).

Pro plně automatický deploy je potřeba v Netlify vypnout paralelní auto-deploy z GitHub hooku, aby deploy probíhal jen z GHA po úspěšných pre-deploy testech.
