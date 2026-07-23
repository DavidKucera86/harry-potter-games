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
- `shared/*.js`, `guess-*/script.js`, `who-is-on-photo/script.js`,
  `rock-paper-scissors/script.js`, `*/index.html` — **generated** by `npm run build`.
  Never hand-edit; rebuild and commit the output.
- `shared/templates/`, `shared/styles/`, `shared/fixtures/` — static assets (build inputs).
- `tests/` — Vitest unit + Playwright E2E (critical/edge/smoke/visual/a11y).

### Architecture

`BaseGame` (shared modal, lives, deck, focus-trap, i18n) →
`QuizGame` / `HangmanGame` → per-game subclasses. Games that don't fit the quiz/hangman
shape (e.g. `rock-paper-scissors`) extend `BaseGame` directly. Each game page has a class
module plus a thin `script.ts` bootstrap that instantiates it (e.g.
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
- **Keep this file (CLAUDE.md) current** — CLAUDE.md is the working contract for this
  repo and must describe reality, not intentions. Update it *in the same change* whenever
  work touches something it documents — the security posture, the SEO / responsiveness /
  accessibility rules, the architecture, the route lists (Dockerfile `COPY`, `sw.ts`
  precache), the command list, or the test layout. This is continuous, not a one-off:
  if while working you find a rule here that is inaccurate or stale, fix it immediately
  rather than leaving it. Before opening a PR, re-read the sections your change touched
  and confirm they still match the code, config, and test suite.

## Security

Security is not a feature you add later — it is a property every change must preserve.
The baseline below already exists in the codebase; keep it intact and extend it.

- **Secrets** — never commit secrets. There are none in the repo today and it must stay
  that way: no API keys, tokens, or `.env` files, and nothing secret baked into the
  generated artifacts. The HP API is public and keyless — do not add credentials to it.
  Deploy secrets (`NETLIFY_*`) live only in GitHub Actions secrets.
- **Dependencies / supply chain** — the app ships **zero runtime dependencies** on
  purpose; everything under `dependencies` at runtime is our own code. Do not add a
  runtime dependency without a strong reason. Keep `package-lock.json` committed, install
  with `npm ci`, and run `npm audit` before adding or upgrading any package.
- **Security headers & CSP** — the production headers (Content-Security-Policy,
  Permissions-Policy, X-Content-Type-Options, Referrer-Policy) are defined in
  [netlify.toml](netlify.toml) and **mirrored verbatim** in
  [docker/nginx.conf](docker/nginx.conf); the CSP is also inlined via `<meta>` in
  [shared/templates/partials/head.html](shared/templates/partials/head.html). These three
  must not drift apart — change all of them together. The CSP is strict
  (`default-src 'self'`, no inline/remote scripts, `frame-ancestors 'none'`); a new
  external origin (image host, API) requires widening the matching directive
  (`img-src` / `connect-src`) or the browser will block it.
- **Service worker / PWA** — the service worker only ever caches our own same-origin
  static assets (see the `PRECACHE_URLS` list and the same-origin guard in
  [src/shared/sw.ts](src/shared/sw.ts)); never cache cross-origin or user-specific
  responses. New routes/assets must be added to both the Dockerfile `COPY` list and the
  `sw.ts` precache list.
- **Zero Trust — validate input and API responses** — see the Zero Trust principle above.
  Validate the *shape* of every API response (not just handle the error), keep the
  timeout / retry / fixture-fallback path intact, and build DOM with
  `textContent` / `createElement` — never `innerHTML` from untrusted strings. This is
  covered by tests (e.g. [tests/edge/xss-safe-dom.spec.ts](tests/edge/xss-safe-dom.spec.ts)).
- **Rate limiting — don't let the UI flood the network** — user actions that reach the
  network must be guarded against rapid repeats. In-round answer controls are locked via
  `setControlsEnabled(false)` the moment a choice is made; data loads are de-duplicated
  by an in-flight guard plus a short cooldown in `BaseGame.loadGameData` (see
  `NEW_GAME_COOLDOWN_MS` in [src/shared/config.ts](src/shared/config.ts)) so hammering
  "New game" / retry while the API is failing cannot spawn a storm of `fetchWithRetry`
  calls. Any new network-triggering button must reuse this guard, not bypass it.
- **Security review before a PR** — a security-sensitive change (headers, CSP, input
  handling, dependencies, service worker) should get a security pass — run the
  `/security-review` skill in addition to `npm test`.

## SEO, responsiveness & accessibility

Every feature and every PR must verify all three of these — they are non-negotiable, on
the same footing as tests. When adding or changing a page, walk this checklist:

- **SEO** — every page has a unique, descriptive `<title>` **and**
  `<meta name="description">`, a `<link rel="canonical">`, and Open Graph / Twitter card
  tags (`og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`). These are
  emitted from [shared/templates/partials/head.html](shared/templates/partials/head.html)
  with per-page values in [scripts/build-html.mjs](scripts/build-html.mjs). Keep
  `robots.txt` and `sitemap.xml` current — **a new page means a new `<url>` entry in
  `sitemap.xml`**. Absolute URLs are built from `SITE_URL` (env-overridable) in the build
  script.
- **Responsiveness** — pages must work from small mobile widths up. Keep the
  `width=device-width` viewport meta, use fluid layouts, and give every new page mobile
  E2E coverage (follow [tests/edge/quiz-mobile.spec.ts](tests/edge/quiz-mobile.spec.ts) /
  [tests/edge/hangman-mobile.spec.ts](tests/edge/hangman-mobile.spec.ts)) and a `@visual`
  snapshot.
- **Accessibility** — pages must pass axe with no violations
  ([tests/edge/a11y.spec.ts](tests/edge/a11y.spec.ts)). Preserve the patterns already in
  place: a skip link, `aria-live` regions for status/messages, a keyboard focus-trap in
  modals ([src/shared/BaseGame.ts](src/shared/BaseGame.ts)), a correct `lang` attribute
  that follows the active locale, labelled controls, and respect for
  `prefers-reduced-motion`. Never convey state by colour alone.

## Git workflow — feature branch + incremental commits

Every new feature or fix gets its own branch and is built up in small, cohesive
commits — never commit straight to `main`, and never save everything for one giant
commit at the end.

- **Branch first.** Before starting any new functionality or bug fix, create a fresh
  branch off `main`. Follow the existing naming convention: `feat/<kebab-desc>` for
  features, `fix/<kebab-desc>` for fixes, `chore/<kebab-desc>` for chores/maintenance
  (e.g. `feat/chat-with-character`, `fix/data-provider-4xx-no-retry`).
- **Commit incrementally.** As soon as a piece of work forms a cohesive, self-contained
  increment (a passing unit of behaviour, a doc update, a build wiring step), commit it
  with a clear message. Prefer several small, reviewable commits that each leave the tree
  in a sensible state over one sprawling commit. Keep unrelated changes in separate
  commits.
- The pre-commit hook (`verify:build`, `lint`, `typecheck`, catalog regen) runs on every
  commit, so each increment stays green; the full-suite / PR rules below still gate the
  branch before it is opened as a pull request.

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

> **Stop Docker before running E2E.** Playwright's `webServer` uses
> `reuseExistingServer: true`, so if a `docker compose up` container is still bound to
> port 4173 it will test against the *old* image instead of your freshly built files —
> silently producing stale, misleading results. Run `docker compose down` before
> `npm test` / `npm run test:e2e` so Playwright starts its own server from the current
> build.

CI also gates this: the `Deploy` workflow runs `pre_deploy_tests` (which calls
`npm test`) on every `pull_request` targeting `main`, and the deploy job is skipped for
PR events. Running `npm test` locally first is still required — it catches failures
before the PR exists instead of waiting on a red CI run.

### Also run the full E2E against the Docker image before a feature is "done"

`npm test` runs Playwright against `npx serve .` (the repo root) — that does **not**
exercise the real deployed artifact. So before declaring a feature done / before a PR,
also run the suite against the actual nginx image:

```bash
npm run test:docker   # docker compose up --build -d -> wait -> test:production -> down
```

This is the authoritative "does the real artifact work" gate. It catches
packaging/serving bugs `serve` can't — e.g. a game dir missing from the Dockerfile
`COPY` list (a real bug the chat game hit: the page 404'd in the container while every
serve-based test passed), or nginx routing/header differences.

> `test:docker` builds the image from the **committed** working tree, so `npm run build`
> and commit generated artifacts first. It tears the container down at the end.
> **Caveat:** `@visual` snapshots are skipped in production mode — keep covering those
> with the serve-based `npm test`. When adding a new game/page, remember both the
> Dockerfile `COPY` list and the `sw.ts` precache list enumerate routes and must be updated.

## Common commands

```bash
npm run build        # regenerate JS + HTML (run after editing src/, then commit output)
npm run lint         # eslint src/ tests/
npm run typecheck    # tsc for src + tests
npm run test:unit    # vitest
npm test             # vitest + playwright (E2E against `npx serve`, incl. @visual)
npm run test:docker  # full E2E against the built Docker image (nginx); @visual skipped
npm run verify:build # fail if generated files are out of sync with src/
```

The pre-commit hook runs `verify:build`, `lint`, `typecheck`, and regenerates the E2E
test catalog. Always `npm run build` and commit the generated artifacts alongside
`src/` changes.
