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
| Uživatel bez myši | [tests/edge/keyboard-only.spec.ts](../tests/edge/keyboard-only.spec.ts) — axe na tohle neodpoví, čte DOM, neovládá stránku |
| Uživatel na mobilu | `quiz-mobile.spec.ts`, `hangman-mobile.spec.ts`, `chat-mobile.spec.ts` |
| Uživatel s pomalou/žádnou sítí | `fetch-timeout.spec.ts`, `api-retry.spec.ts`, `offline-fallback.spec.ts`, `pwa-offline.spec.ts` |
| Uživatel citlivý na pohyb | `src/shared/motion.ts` + `tests/unit/motion.test.ts` |
| Uživatel, který mluví anglicky | `i18n.spec.ts`, `tests/unit/i18n-parity.test.ts` |
| Nescriptované chování | [EXPLORATORY-CHARTERS.md](EXPLORATORY-CHARTERS.md) |

**Mezera:** *(zavřeno 2026-08-25)* hangman se ovládá klávesnicí, ale suita ho hrála myší.
Zavřeno `E61.01`, které projde menu → hru → modal → zpět bez jediného kliknutí a u každé
zastávky ověří, že je fokus vidět.

## P — Product (vnitřní konzistence)

Šest her sdílí `BaseGame`, takže stejný pojem se musí chovat všude stejně. Duplikovaná
hodnota je v pořádku jen tehdy, když něco selže, jakmile se rozejde.

| Artefakt | Vynuceno kde |
|---|---|
| CSP ve třech kopiích (`netlify.toml`, `docker/nginx.conf`, `<meta>`) vs. `scripts/security-headers.mjs` | [tests/unit/security-headers.test.ts](../tests/unit/security-headers.test.ts) — **vzorové P-orákulum**, podle něj modeluj další |
| `cs.ts` a `en.ts` jako dvě kopie jedné struktury | [tests/unit/i18n-parity.test.ts](../tests/unit/i18n-parity.test.ts) — stejné klíče, stejné typy, žádný prázdný string, žádný zapomenutý překlad |
| Seznam rout ve čtyřech kopiích: `sitemap.xml`, README, `sw.ts` precache, Dockerfile `COPY` | `brand-consistency.test.ts` — porovnává obousměrně, takže spadne i na routě navíc |
| Chování životů, modalu, balíčku napříč hrami | `BaseGame.test.ts` + per-game testy |

**Mezera:** *(zavřeno 2026-08-25)* Dockerfile `COPY` list dlouho kontroloval až `npm run test:docker`, tedy build kontejneru daleko za PR gate. Teď je čtvrtou hlídanou kopií v `brand-consistency.test.ts`, porovnávanou obousměrně.

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
| Unicode canonical decomposition (NFD) — jaké je základní písmeno pod diakritikou | [src/shared/hangmanUtils.ts](../src/shared/hangmanUtils.ts), [tests/unit/hangmanUtils.test.ts](../tests/unit/hangmanUtils.test.ts), [tests/edge/hangman-diacritics.spec.ts](../tests/edge/hangman-diacritics.spec.ts) |
| WHATWG URL Standard — co parser zahazuje, než URL vůbec začne parsovat | [tests/unit/urlUtils.test.ts](../tests/unit/urlUtils.test.ts), [tests/unit/properties.test.ts](../tests/unit/properties.test.ts), [tests/edge/xss-safe-dom.spec.ts](../tests/edge/xss-safe-dom.spec.ts) (E25.02) |
| Web App Manifest | `tests/unit/brand-consistency.test.ts` |
| Sitemap / robots protokol | `tests/edge/seo.spec.ts` |

---

## Log nálezů z orákul

| Datum | Orákulum | Nález |
|---|---|---|
| 2026-08-22 | **P — Product** | `rock-paper-scissors` úplně chyběl v precache listu service workeru, přestože Dockerfile ji kopíruje a PWA slibuje offline hru. Odhalil `brand-consistency.test.ts` porovnáním tří kopií seznamu rout. `pwa-offline.spec.ts` to minul, protože testuje offline vždy jen `/guess-character-name/` — jedna hra ze šesti. Opraveno + bump `APP_VERSION` na 9. |
| 2026-08-22 | **P — Product** | `i18n-parity.test.ts` vytáhl tři klíče identické v cs i en. Po prohlédnutí legitimní (em dash, název značky, název produktu) → allowlist. Test udělal, co má: vytáhl je k rozhodnutí místo domýšlení. |
| 2026-08-22 | **P — Purpose** | První měření Lighthouse: performance / accessibility / seo 100, best-practices 96. Prahy zpřísněny z odhadu na naměřené hodnoty. |
| 2026-08-22 | **S — Standards** | Best-practices drželo na 96 jediné: `frame-ancestors` se v `<meta>` CSP podle specifikace ignoruje a váže se jen jako HTTP hlavička. **Není to díra** — hlavičku posílá `netlify.toml` i `docker/nginx.conf`. Zvažovalo se rozdělit CSP na dvě varianty (meta bez direktivy), ale to by z jednoho zdroje pravdy o bezpečnostní politice udělalo dva — horší obchod než jedna neškodná hláška v konzoli. **Rozhodnutí: CSP zůstává jedna.** Audit `errors-in-console` se přeskakuje v `lighthouserc.json` (přes `skipAudits`, ne přes aserci — skóre kategorie počítá Lighthouse sám) a ten signál převzal posílený `S04.01`. Ověřeno lokálně proti Docker image: všechny čtyři kategorie 100. |
| 2026-08-22 | **U — Users** | `S04.01` hlídal konzoli obráceně: chytal jen texty obsahující `ReferenceError`, `Failed to load` nebo `is not defined`, takže běžný `TypeError: Cannot read properties of undefined` prošel. Přepsáno na deny-by-default s pojmenovaným allowlistem. Sonda napříč všemi šesti hrami našla jedinou distinktní chybu (tu CSP hlášku), takže obrácení filtru nic nerozbilo — a ověřeno, že test umí zčervenat. |
| 2026-08-22 | **S — Standards** | `isSafeImageUrl` rozhodovalo nad surovým řetězcem, zatímco WHATWG URL parser zahazuje ASCII tab/LF/CR kdekoli v URL, ještě než ji začne parsovat. `/<TAB>/evil.example/pwn.png` tedy nezačínalo na `//`, prošlo stráží proti protocol-relative URL a v prohlížeči se z něj stalo `https://evil.example/pwn.png` v `img.src`. CSP to nechytí — `img-src` musí povolovat `https:` kvůli obrázkovým hostům HP API. Odhalil to přeživší mutant `value.trim()` → `value` z backlogu v [SUITE-HEALTH.md](SUITE-HEALTH.md); ve sporu s **C — Claims** (doc komentář modulu i sekce Security v CLAUDE.md tvrdily, že protocol-relative se zahazuje). Opraveno normalizací vstupu do podoby, kterou vidí parser. |
| 2026-08-22 | **P — Purpose** | `DIACRITIC_MAP` v šibenici znala jen českou diakritiku, ale slova chodí z anglicko-francouzské HP API. `ë`, `ï`, `â`, `ü` v tabulce nebyly, takže se nestaly neuhodnutelnými — staly se **automaticky odhalenými**: `Zoë` dostal hráč zčásti prozrazené na startu a psaní `e` na to písmeno netrefilo. Odhalilo to 15 přeživších mutantů v [SUITE-HEALTH.md](SUITE-HEALTH.md), všech patnáct na hodnotách té tabulky. Tabulka nahrazena Unicode kanonickou dekompozicí (**S — Standards**), která reprodukuje všech 15 řádků přesně a cizí diakritiku zvládne taky. Ověřeno v prohlížeči: `E06.03` na staré implementaci padá. |
| 2026-08-25 | **P — Product** | Dockerfile `COPY` list byl jedinou kopií seznamu rout, kterou nehlídal žádný unit test — chybějící routa se poznala až po buildu kontejneru, což je přesně to, jak kdysi propadla chat hra. Doplněno do `brand-consistency.test.ts` jako čtvrtá hlídaná kopie, a to **obousměrně**: spadne i na routě, kterou Dockerfile kopíruje a nic jiného o ní neví. Ověřeno oběma směry na upraveném Dockerfilu. Při té příležitosti se ukázalo, že [SUITE-HEALTH.md](SUITE-HEALTH.md) tvrdila, že tenhle test už `COPY` porovnává — nikdy to nebyla pravda. Tvrzení opraveno; nález nehlásí test, ale čtení vlastní dokumentace. |
| 2026-08-25 | **P — Purpose** | `shuffle` v balíčku měl šest přeživších mutantů a všechny ve stejné skrýši: žádná aserce netvrdila, že funkce něco **změní**. Smazané tělo cyklu i `Math.random() * (i + 1)` → `/` vrátí nezměněný vstup, což pořád splňuje *stejné prvky, stejná délka, vstup nezmutovaný* — jediné, co property testy ověřovaly. Zelená property nad funkcí, která nedělá nic. Nahrazeno dosažitelností všech permutací (Fisher-Yates je uniformní) a počtem tahů z generátoru (přesně `n − 1`), zdroj náhody injektovaný jako v `rpsUtils.ts`. |
| 2026-08-25 | **C — Claims** | Doc komentář `suggestFollowUps` slibuje, že se vyloučení už položených otázek uvolní, aby hráč nedostal prázdnou nebo krátkou řadu. Ten slib plní dva řádky a oba šlo smazat se zelenou suitou — test na ten scénář existoval, ale tvrdil jen *„vrátily se tři různé otázky"*, což platí i pod oběma mutanty. Bez `take(bespoke)` se řada dolije z generického fondu a téma přijde o vlastní otázky; bez `take(generic)` jde krátké téma zkrátka. Nové testy se ptají na **původ** otázek, ne na jejich počet. |
| 2026-08-25 | **P — Product** | Předávání repliky od jiné postavy testoval vždy roster `[sage, pupil]`, kde byla správná odpověď prvním kandidátem — `find`, který uspěje napoprvé, neodliší funkční hledání od rozbitého. Pět mutantů (predikát na `true`, `> 0` na `>= 0`, `&&` na `||`, dvakrát zahozený optional chaining) tím prošlo. Přidána postava, která stojí **před** znalcem tématu a sama o něm neví nic. Zobecněně: fixture pro test vyhledávání musí obsahovat záznam, který se má přeskočit, a ten musí být vpředu. |
| 2026-08-25 | **S — Standards** | WCAG 2.1.1 (Keyboard) nemělo v repu **žádné** orákulum. axe ho nezachytí — je to statická analýza DOM, ne ovládání stránky — a suita sahala v každé hře po myši. Mezeru měly zapsanou nezávisle dvě místa: `U — Users` v tomhle souboru a charta #2. `E61.01` projde celou cestu z charty bez kliknutí. Cestou vyšlo najevo, že hangman fokusuje vstupní pole sám, ale jen za `(hover: hover) and (pointer: fine)` — první verze testu k poli tabovala, a tím od něj odcházela. Test to teď tvrdí, místo aby s tím závodil. |
| 2026-08-25 | **P — Purpose** | Exploratory charta #1: při API requestu, který nikdy neodpoví, sedí hráč **48 s na spinneru** bez vysvětlení — 3 pokusy × 15 s timeout + 2 × 1 s prodleva, naměřeno proti Docker buildu. Pak se hra korektně zotaví z lokálních fixtures, které byly instantně k dispozici celou tu dobu. Účel produktu je *rychlá hra pro děti na mobilu*; `fetch-timeout.spec.ts` ověřuje, že se hra nakonec vzpamatuje, a je zelený — kolik toho hráč mezitím vydrží, se neptá nikdo. Nález, ne oprava: kratší timeout, dřívější sáhnutí po fixtures nebo průběžná hláška jsou produktové rozhodnutí. |
