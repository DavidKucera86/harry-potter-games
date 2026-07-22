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

## Common commands

```bash
npm run build        # regenerate JS + HTML (run after editing src/, then commit output)
npm run lint         # eslint src/ tests/
npm run typecheck    # tsc for src + tests
npm run test:unit    # vitest
npm test             # vitest + playwright (E2E needs a served app / webServer)
npm run verify:build # fail if generated files are out of sync with src/
```

The pre-commit hook runs `verify:build`, `lint`, `typecheck`, and regenerates the E2E
test catalog. Always `npm run build` and commit the generated artifacts alongside `src/`
changes.
