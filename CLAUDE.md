# CLAUDE.md

Guidance for working in this repository.

## Running the app — always via Docker

**The app is always run in Docker. Do not serve it any other way** (no `npx serve`,
no opening `index.html` directly, no ad-hoc static servers). When you need to run,
preview, or smoke-test the app, use the container:

```bash
docker compose up --build      # build + serve at http://127.0.0.1:4173
docker compose down            # stop
```

The image is a multi-stage build ([Dockerfile](Dockerfile)): stage 1 runs
`npm run build` (TS → JS, HTML from templates) on `node:22-alpine`; stage 2 serves
the static payload with nginx on port **4173**. The nginx config
([docker/nginx.conf](docker/nginx.conf)) mirrors the production security headers from
[netlify.toml](netlify.toml).

Port 4173 is intentional — it matches the local/Playwright base URL, so E2E tooling
points at the same address whether the container or the built-in server is running.

> Note: unit tests (`vitest`) and the toolchain (`build`, `lint`, `typecheck`) run on
> the host as usual — the Docker rule is about *running the app*, not about tooling.

## Project shape

Static browser games (Harry Potter theme), TypeScript compiled with esbuild.
Data comes from the [HP API](https://hp-api.onrender.com/) with offline fixtures as
fallback. PWA with a service worker; deployed to Netlify via GitHub Actions.

- `src/` — **TypeScript source; edit here.**
- `shared/*.js`, `guess-*/script.js`, `who-is-on-photo/script.js`, `*/index.html` —
  **generated** by `npm run build`. Never hand-edit; rebuild and commit the output.
- `shared/templates/`, `shared/styles/`, `shared/fixtures/` — static assets (build inputs).
- `tests/` — Vitest unit + Playwright E2E (critical/edge/smoke/visual/a11y).

### Architecture

`BaseGame` (shared modal, lives, deck, focus-trap, i18n) →
`QuizGame` / `HangmanGame` → per-game subclasses. Each game page has a class module
plus a thin `script.ts` bootstrap that instantiates it (e.g.
`guess-house/GuessHouseGame.ts` + `guess-house/script.ts`). Keep this split — never
put an instantiating `new …Game()` in the same module as the class, or importing it
in a unit test triggers a real fetch at import time.

## Adding new functionality — non-negotiable principles

When adding any new feature, these principles always apply — no exceptions, no
"just this once":

- **Clean Code** — code must read like the surrounding code: small, single-purpose
  classes and functions, descriptive names, no duplication. Shared behaviour belongs in
  `BaseGame` / `QuizGame` / `HangmanGame`, not copy-pasted into a game. Dead code,
  commented-out blocks, and speculative abstractions do not get committed.
- **Test Driven Development (TDD)** — write a failing test first, then the minimum code
  to make it pass, then refactor. Every new behaviour ships with tests (Vitest unit
  and/or Playwright E2E). No feature is "done" without them, and the full suite must be
  green (see the PR rule below).
- **Zero Trust** — trust no input and no external data. Validate and sanitise all user
  input and every API response before use; assume the HP API can be slow, wrong, or
  offline (keep the timeout / retry / fixture-fallback path intact). Never build DOM
  from untrusted strings via `innerHTML` — use `textContent` / `createElement` as the
  rest of the code does. Handle errors explicitly rather than letting them surface to
  the user.
- **Keep the README current** — [README.md](README.md) is user-facing documentation and
  must stay in sync with reality. Whenever a change alters something the README
  describes — how to run/build/test the app, the list of games, the repo structure, the
  tech stack, npm scripts, the E2E catalog, or the deploy pipeline — update the README in
  the *same* change. A feature is not "done" if it leaves the README describing the old
  behaviour. When in doubt, re-read the relevant README section and confirm it still
  matches before opening the PR.

## Before opening a pull request — always run the full E2E suite

**Never open a pull request without first running the full test suite and seeing it
pass:**

```bash
npm test      # pretest (build + lint + typecheck) -> vitest unit -> Playwright E2E
```

`npm test` runs everything: the `pretest` hook (`build`, `lint`, `typecheck`), the
Vitest unit tests, and the full Playwright E2E suite (critical / edge / smoke / visual
/ a11y). All of it must be green before the PR is created. If any part fails, fix it
first — do not open the PR with a red or skipped suite.

CI also gates this: the `Deploy` workflow runs `pre_deploy_tests` (which calls
`npm test`) on every `pull_request` targeting `main`, and the deploy job is skipped for
PR events. Running `npm test` locally first is still required — it catches failures
before the PR exists instead of waiting on a red CI run.

## Klódo-Metr footer card

The footer (on every page) links to `klodo-metr.png` — the shareable "kartička"
(share card) from the community [Klódo-Metr](https://github.com/vibecoding-akademie/klodo-metr).
The card is **regenerated before every commit** and re-staged by the pre-commit hook,
so the published image always reflects current Claude Code usage.

- Only the **aggregate sections** are published — the hero (length in cm, tier,
  progress to next level), the level ladder, the real-world conversions and the badges.
  The per-project battleground (which names projects) and the explicit spend tiles are
  dropped, so project names and itemised spend are **never** committed or deployed —
  they stay on the local machine.
- Generation ([scripts/build-klodo-card.mjs](scripts/build-klodo-card.mjs), run via
  `npm run klodo:card`) downloads the upstream generator, runs it against the local
  `~/.claude` transcripts, then curates the "Souboj klódů" view down to those sections
  and screenshots it to PNG headlessly with Playwright.
- It is **fail-soft (Zero Trust)**: the generator needs the network (ccusage) and local
  usage data. On any failure the script keeps the already-committed `klodo-metr.png` and
  exits 0, so a commit is never blocked (e.g. offline).
- The footer link path is per-page (`klodo-metr.png` at the root, `../klodo-metr.png` on
  game sub-pages); the label lives in i18n under `ui.klodoMetr` (cs + en).

## Common commands

```bash
npm run build        # regenerate JS + HTML (run after editing src/, then commit output)
npm run lint         # eslint src/ tests/
npm run typecheck    # tsc for src + tests
npm run test:unit    # vitest
npm test             # vitest + playwright (E2E needs a served app / webServer)
npm run verify:build # fail if generated files are out of sync with src/
npm run klodo:card   # regenerate the footer Klódo-Metr share card (klodo-metr.png)
```

The pre-commit hook runs `verify:build`, `lint`, `typecheck`, regenerates the E2E
test catalog, and regenerates + re-stages the Klódo-Metr share card (`klodo-metr.png`).
Always `npm run build` and commit the generated artifacts alongside `src/` changes.
