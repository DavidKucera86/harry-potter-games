# Testovací orákula (HICCUPPS)

**Orákulum** je to, podle čeho poznáš, že pozorované chování je špatně. Bez něj se nedá
testovat — dá se jen spustit kód a dívat se, že nespadl.

Assert, který opisuje implementaci, je **nulové orákulum**: projde, zvedne pokrytí a nikdy
neselže ze správného důvodu, protože zakóduje chybu spolu s funkcí. Proto tenhle registr
existuje — u každého písmene říká, *který skutečný artefakt* v repu to orákulum ztělesňuje
a co ho vynucuje.

Metodika: skill `test-oracles-hiccupps`. Stav suity: [SUITE-HEALTH.md](SUITE-HEALTH.md).

> **Pravidlo:** nález se nehlásí bez uvedení písmene orákula, které ho odhalilo.
> „Vypadá to špatně" není nález.

Chyba = **porušení konzistence** s jedním z osmi orákul.

---

## H — History (jak se to chovalo dřív)

| Artefakt (zdroj pravdy) | Vynuceno kde |
|---|---|
| Commitnuté generované artefakty (`shared/*.js`, `*/index.html`, `sitemap.xml`, `robots.txt`) | [scripts/verify-build.mjs](../scripts/verify-build.mjs) — `git diff` proti buildu; pre-commit hook i CI |
| 7 baseline PNG v `tests/visual/screenshots.spec.ts-snapshots/` | `tests/visual/screenshots.spec.ts`, `maxDiffPixelRatio: 0.01` |
| [E2E-TEST-CATALOG.md](E2E-TEST-CATALOG.md) — popis chování ve stylu Given-When-Then | CI: `PLAYWRIGHT_CATALOG=1` regeneruje, `git diff --exit-code` selže při driftu |
| `APP_VERSION` v [src/shared/config.ts](../src/shared/config.ts) | ručně — bump invaliduje sessionStorage i SW cache |

**Mezera:** vizuální baseline pokrývají 7 obrazovek; stavy uprostřed hry (rozehraný hangman,
otevřený modal na mobilu) baseline nemají.

## I — Image (jak produkt vypadá a jak si říká)

| Artefakt | Vynuceno kde |
|---|---|
| Název produktu napříč `manifest.webmanifest`, `<title>` všech stránek, `pages.menuTitle` | [tests/unit/brand-consistency.test.ts](../tests/unit/brand-consistency.test.ts) |
| Install deskriptor PWA (`short_name` ≤ 12 znaků, `description`, `start_url`, ikony) | tamtéž |
| `shared/og-image.png`, favicony, `store-assets/` | vizuální snapshoty jen částečně |

**Mezera:** náhledový obrázek pro sdílení (`og-image.png`) nemá žádný test; kdyby
zmizel, pozná se to až podle rozbitého náhledu na sociální síti.

## C — Comparable products (srovnatelný produkt)

Referenčním produktem je **HP API sama** — `shared/fixtures/*.json` je její zmražená kopie.

| Artefakt | Vynuceno kde |
|---|---|
| Tvar odpovědi HP API | `parseCharacters` / `parseSpells` v [src/shared/dataProvider.ts](../src/shared/dataProvider.ts) — zero-trust validace za běhu |
| Drift mezi živou API a fixtures | [.github/workflows/oracle-hp-api.yml](../.github/workflows/oracle-hp-api.yml) — týdně, **zakládá issue, neblokuje deploy** |

**Mezera:** fixtures jsou z 2026-07-04. Rotovat čtvrtletně — statická fixture je přesně to,
na co se kód „naučí" projít.

## C — Claims (co o produktu tvrdíme)

| Artefakt | Vynuceno kde |
|---|---|
| README: počet témat chatu, „nejméně čtyři varianty", „tři navazující otázky", „pět výher" | [tests/unit/claims.test.ts](../tests/unit/claims.test.ts) — čísla z prózy se čtou přímo z README a porovnávají s `TOPICS`, `FOLLOW_UP_COUNT`, `GAME_CONFIG` |
| README tabulka her vs. skutečné routy | tamtéž + `brand-consistency.test.ts` |
| CLAUDE.md invarianty obsahu chatu | `tests/unit/dumbledore.test.ts`, `tests/unit/followUps.test.ts` |

Když tenhle test zčervená, **nejdřív rozhodni, která strana je špatně** — README může být
zastaralé, nebo kód tiše změnil chování.

## U — Users' expectations (očekávání uživatele)

Skuteční uživatelé nejsou k dispozici, takže se používají zástupné signály:

| Artefakt | Vynuceno kde |
|---|---|
| Uživatel asistivní technologie | `tests/edge/a11y.spec.ts` (axe, WCAG 2.2 AA), `modal-accessibility.spec.ts` |
| Uživatel na mobilu | `quiz-mobile.spec.ts`, `hangman-mobile.spec.ts`, `chat-mobile.spec.ts` |
| Uživatel s pomalou/žádnou sítí | `fetch-timeout.spec.ts`, `api-retry.spec.ts`, `offline-fallback.spec.ts`, `pwa-offline.spec.ts` |
| Uživatel citlivý na pohyb | `src/shared/motion.ts` + `tests/unit/motion.test.ts` |
| Uživatel, který mluví anglicky | `i18n.spec.ts`, `tests/unit/i18n-parity.test.ts` |
| Nescriptované chování | [EXPLORATORY-CHARTERS.md](EXPLORATORY-CHARTERS.md) |

**Mezera:** hangman se ovládá klávesnicí a **nemá keyboard-only E2E scénář** — hraje se
myší i v testech.

## P — Product (vnitřní konzistence)

Šest her sdílí `BaseGame`, takže stejný pojem se musí chovat všude stejně. Duplikovaná
hodnota je v pořádku jen tehdy, když něco selže, jakmile se rozejde.

| Artefakt | Vynuceno kde |
|---|---|
| CSP ve třech kopiích (`netlify.toml`, `docker/nginx.conf`, `<meta>`) vs. `scripts/security-headers.mjs` | [tests/unit/security-headers.test.ts](../tests/unit/security-headers.test.ts) — **vzorové P-orákulum**, podle něj modeluj další |
| `cs.ts` a `en.ts` jako dvě kopie jedné struktury | [tests/unit/i18n-parity.test.ts](../tests/unit/i18n-parity.test.ts) — stejné klíče, stejné typy, žádný prázdný string, žádný zapomenutý překlad |
| Seznam rout ve třech kopiích: Dockerfile `COPY`, `sw.ts` precache, `sitemap.xml` | `brand-consistency.test.ts` |
| Chování životů, modalu, balíčku napříč hrami | `BaseGame.test.ts` + per-game testy |

**Mezera:** Dockerfile `COPY` list není pokrytý testem — kontroluje ho až `npm run test:docker`.

## P — Purpose (k čemu to je)

Účel: **rychlá, offline fungující, dohledatelná hra pro děti na mobilu.** CLAUDE.md staví SEO,
responsivitu a a11y na roveň testům.

| Artefakt | Vynuceno kde |
|---|---|
| Rychlost, SEO, best practices, PWA | [lighthouserc.json](../lighthouserc.json) — Lighthouse CI na PR, mobilní preset |
| Dohledatelnost | `tests/edge/seo.spec.ts`, generovaný `sitemap.xml` / `robots.txt` |
| Offline hratelnost | `pwa-offline.spec.ts`, `sw-update.spec.ts`, precache list v `sw.ts` |

## S — Standards & statutes (standardy)

| Standard | Vynuceno kde |
|---|---|
| OWASP Top 10 / API Top 10 / ASVS L1 | **skill [`owasp-security-testing`](../.claude/skills/owasp-security-testing/SKILL.md)** — už implementované orákulum včetně odůvodněných N/A. Neopisovat, odkazovat |
| WCAG 2.2 AA | `tests/edge/a11y.spec.ts` — axe s explicitními tagy `wcag2a`…`wcag22aa` |
| CSP Level 3 | `tests/unit/security-headers.test.ts` |
| Web App Manifest | `tests/unit/brand-consistency.test.ts` |
| Sitemap / robots protokol | `tests/edge/seo.spec.ts` |

---

## Log nálezů z orákul

| Datum | Orákulum | Nález |
|---|---|---|
| 2026-08-22 | **P — Product** | `rock-paper-scissors` úplně chyběl v precache listu service workeru, přestože Dockerfile ji kopíruje a PWA slibuje offline hru. Odhalil `brand-consistency.test.ts` porovnáním tří kopií seznamu rout. `pwa-offline.spec.ts` to minul, protože testuje offline vždy jen `/guess-character-name/` — jedna hra ze šesti. Opraveno + bump `APP_VERSION` na 9. |
| 2026-08-22 | **P — Product** | `i18n-parity.test.ts` vytáhl tři klíče identické v cs i en. Po prohlédnutí legitimní (em dash, název značky, název produktu) → allowlist. Test udělal, co má: vytáhl je k rozhodnutí místo domýšlení. |
