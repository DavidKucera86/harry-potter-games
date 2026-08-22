## Co se mění a proč

<!-- Jedna dvě věty. Odkaz na issue, pokud existuje. -->

## Testy

- [ ] `npm test` proběhl zeleně (build + lint + typecheck + vitest + Playwright)
- [ ] `npm run test:docker` proběhl zeleně — reálný nginx artefakt, ne `serve`
- [ ] Nové chování má test (TDD: nejdřív červený)

## Orákula (HICCUPPS)

U každého písmene buď **artefakt**, který změnu hlídá, nebo `N/A` + důvod.
Viz [docs/ORACLES.md](../docs/ORACLES.md) a skill `test-oracles-hiccupps`.
Nález bez uvedeného písmene není nález.

- [ ] **H** — History: generované artefakty, snapshoty a E2E katalog regenerované *a prohlédnuté*
- [ ] **I** — Image: název, tón a popis konzistentní všude, kde se objevují
- [ ] **C** — Comparable: chování HP API / předchozí verze
- [ ] **C** — Claims: čísla a tvrzení v README a CLAUDE.md pořád platí
- [ ] **U** — Users: klávesnice, čtečka, pomalá síť, offline, mobil, reduced-motion, druhý jazyk
- [ ] **P** — Product: stejný pojem se chová stejně ve všech šesti hrách; žádná duplikace bez zdroje pravdy
- [ ] **P** — Purpose: rychlá, offline fungující, dohledatelná hra na mobilu
- [ ] **S** — Standards: WCAG 2.2 AA, CSP, OWASP/ASVS L1 (skill `owasp-security-testing`)

## Dokumentace

- [ ] README odpovídá realitě (běh, build, seznam her, struktura, skripty, katalog, deploy)
- [ ] CLAUDE.md odpovídá realitě (security, architektura, seznamy rout, příkazy, testy)
