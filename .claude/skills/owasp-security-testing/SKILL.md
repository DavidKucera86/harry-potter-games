---
name: owasp-security-testing
description: Security review and security test planning for this repo, using OWASP Top 10, OWASP API Security Top 10, WSTG and ASVS as one checklist, scoped to what actually applies to a static browser-game site. Use it whenever reviewing code, a diff, a PR or a new page for vulnerabilities, writing security test cases, checking CSP / security headers / XSS / untrusted API data / service worker caching / supply chain, or when asked for a security checklist or "is this safe".
---

# OWASP security testing (this repo)

A combined OWASP checklist, scoped to the reality of this project: a **static
browser-game site** with no backend, no server code, no accounts, no cookies, no
sessions and no API of its own. It is served as static files (Netlify in production,
nginx in the Docker image) and reads a public, keyless third-party API.

That scope decides most of the answers up front. Applying the generic OWASP list
verbatim here produces false findings ("check BOLA on `/orders/:id`") — use the
applicability matrix first, then work only the sections that apply.

## How to use this skill

1. Decide what is under review: a diff/PR, a new page/game, a dependency change, or
   the whole repo.
2. Read the **applicability matrix** and skip everything marked N/A — but state in the
   output *that* it was skipped and why, so coverage stays auditable.
3. Walk every **applicable** section below in order. For each item either write a
   concrete test case, or record a finding with severity and a suggested fix.
4. Report using the output format at the bottom. Target level is **ASVS L1** — the app
   stores no PII, no credentials and no tokens, so L2/L3 criteria are out of scope.
5. Anything that touches the CSP, the headers, the service worker, input handling or
   dependencies also needs `npm test` and `npm run test:docker` green before a PR
   (see [CLAUDE.md](../../../CLAUDE.md)).

## Applicability matrix

### OWASP Top 10 (web)

| # | Category | Applies here? |
|---|---|---|
| A01 | Broken Access Control | **N/A** — no server, no accounts, no per-user data. Every byte served is public by design. |
| A02 | Cryptographic Failures | **Partial** — no secrets or PII to protect; only TLS/transport config (HSTS) is in scope. |
| A03 | Injection | **Applies** — DOM XSS via untrusted API data is the main injection risk. No SQL/OS/LDAP anywhere. |
| A04 | Insecure Design | **Partial** — no password reset/login flows; what remains is client-side flood protection (see Rate limiting). |
| A05 | Security Misconfiguration | **Applies** — CSP and security headers exist in three places and must not drift. |
| A06 | Vulnerable and Outdated Components | **Applies** — build-time dependency risk (zero runtime dependencies by design). |
| A07 | Identification and Authentication Failures | **N/A** — no authentication of any kind. |
| A08 | Software and Data Integrity Failures | **Applies** — CI/CD pipeline and service worker cache integrity. |
| A09 | Security Logging and Monitoring Failures | **N/A / accepted** — static hosting, no server logs we own, nothing sensitive to audit. |
| A10 | SSRF | **N/A** — no server to forge requests from. |

### OWASP API Security Top 10

The project **exposes no API**. API1–API6, API7 and API9 are N/A: there are no objects,
no object properties, no functions, no business flows, no versioned endpoints and no
server-side request handling of our own.

| # | Category | Applies here? |
|---|---|---|
| API4 | Unrestricted Resource Consumption | **Partial, inverted** — we are the *client*; the concern is our UI flooding the third-party API. See Rate limiting. |
| API8 | Security Misconfiguration | **Applies** — response headers on the static assets. |
| API10 | Unsafe Consumption of APIs | **Applies** — the HP API response is untrusted input and must be shape-validated before use. |

### WSTG categories worth structuring tests around

Information Gathering, Configuration & Deployment Management, Input Validation,
Error Handling, Client-Side Testing. The rest (Identity, Authentication, Authorization,
Session Management) has no counterpart in this codebase.

## Applicable checklist

### 1. CSP and security headers (A05 / API8)

The policy is defined once in [scripts/security-headers.mjs](../../../scripts/security-headers.mjs)
and reaches the browser through three channels that must stay identical:

- [netlify.toml](../../../netlify.toml) — production response headers
- [docker/nginx.conf](../../../docker/nginx.conf) — the Docker/nginx image on port 4173
- [shared/templates/partials/head.html](../../../shared/templates/partials/head.html) —
  `<meta http-equiv>` copy injected at build time, so the policy also holds when the
  files are served by something that sends no headers

Check:

- [ ] Drift between the three copies — guarded by
      [tests/unit/security-headers.test.ts](../../../tests/unit/security-headers.test.ts).
- [ ] Headers actually served — guarded by
      [tests/edge/security-headers.spec.ts](../../../tests/edge/security-headers.spec.ts)
      (asserts real headers under `PLAYWRIGHT_TARGET=production`, the `<meta>` copy otherwise).
- [ ] A new external origin (image host, API, font) requires widening the matching
      directive (`img-src` / `connect-src`) — and widening it is a finding to justify,
      not a formality.
- [ ] `script-src 'self'` stays free of `'unsafe-inline'` / `'unsafe-eval'`; no inline
      `<script>` or `onclick=` attributes in templates.
- [ ] `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'` remain.

Accepted risk: `img-src` allows any `https:` host, because character photos come from
third-party hosts the HP API can change at any time. Narrowing it to an allowlist would
break the games on an upstream change; the `img.src` validation below is the
compensating control.

### 2. DOM XSS and untrusted API data (A03 / API10)

Everything rendered comes from a third-party API and must be treated as hostile.

- [ ] No `innerHTML` / `outerHTML` / `insertAdjacentHTML` / `document.write` / `eval` /
      `new Function` anywhere in `src/`. Build DOM with `textContent` and
      `createElement` — covered by
      [tests/edge/xss-safe-dom.spec.ts](../../../tests/edge/xss-safe-dom.spec.ts).
- [ ] Any URL taken from API data is validated before it reaches a DOM sink —
      `isSafeImageUrl` in [src/shared/urlUtils.ts](../../../src/shared/urlUtils.ts)
      before `img.src`. New sinks (`href`, `srcset`, `style`) need the same treatment.
- [ ] API responses are shape-validated at runtime, not just cast, in
      [src/shared/dataProvider.ts](../../../src/shared/dataProvider.ts); malformed
      entries are dropped and an empty result falls back to the local fixtures.
- [ ] Data read back from `sessionStorage` goes through the same validation — cache
      contents are not more trustworthy than the response that filled them.
- [ ] User-typed input (chat nickname/message, hangman letter) is length-capped and
      validated (`validateNickname` in
      [src/shared/chatEngine.ts](../../../src/shared/chatEngine.ts)).

### 3. Service worker and PWA cache (A08)

[src/shared/sw.ts](../../../src/shared/sw.ts):

- [ ] The fetch handler still bails out on non-`GET` and on cross-origin requests — an
      API or image response must never enter the cache.
- [ ] `PRECACHE_URLS` lists only our own same-origin static assets, and a new
      route/asset was added to it *and* to the Dockerfile `COPY` list.
- [ ] `APP_VERSION` was bumped when cached assets changed, so `activate` purges the old
      cache.

### 4. Zero Trust fetch path (A04 / API10)

[src/shared/dataProvider.ts](../../../src/shared/dataProvider.ts) +
[src/shared/config.ts](../../../src/shared/config.ts):

- [ ] Per-attempt `AbortController` timeout is intact (`FETCH_TIMEOUT_MS`).
- [ ] Retries are bounded (`API_RETRIES`) with backoff, and 4xx does **not** retry.
- [ ] The fixture fallback still works with the API fully offline
      ([tests/edge/offline-fallback.spec.ts](../../../tests/edge/offline-fallback.spec.ts)).
- [ ] Errors are handled explicitly and surface as a localised message, never as a raw
      stack trace or unhandled rejection.

### 5. Rate limiting: don't let the UI flood the network (API4)

- [ ] In-round answer controls lock via `setControlsEnabled(false)` as soon as a choice
      is made.
- [ ] Any new network-triggering button reuses the in-flight guard plus
      `NEW_GAME_COOLDOWN_MS` cooldown in `BaseGame.loadGameData`
      ([src/shared/BaseGame.ts](../../../src/shared/BaseGame.ts)) instead of calling
      `fetchWithRetry` directly.

### 6. Supply chain (A06 / A08)

- [ ] Zero runtime dependencies — anything added under `dependencies` is a finding
      unless argued for explicitly.
- [ ] `package-lock.json` is committed; installs use `npm ci`.
- [ ] `npm run audit` (`npm audit --audit-level=high`) is clean; it also runs in the
      `pre_deploy_tests` job in
      [.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml).
- [ ] No secrets in the repo, in generated artifacts or in the Docker image. Deploy
      credentials live only in GitHub Actions secrets.

### 7. Client-side storage and outbound links (WSTG client-side)

- [ ] `localStorage` holds only the locale, validated against an allowlist in
      [src/shared/i18n/index.ts](../../../src/shared/i18n/index.ts); `sessionStorage`
      holds only the API cache. No PII, no tokens.
- [ ] Every storage access stays wrapped in `try/catch` (private mode / quota).
- [ ] External links carry `rel="noopener noreferrer"`.
- [ ] No `postMessage` listeners, no third-party scripts, no analytics.

## Output format

Report per category, keeping skipped categories visible:

| Category | Test case / finding | Status | Severity | Notes |
|---|---|---|---|---|
| A05 Headers | CSP identical in all three copies | pass | — | `tests/unit/security-headers.test.ts` |
| A01 Access Control | — | N/A | — | No backend, no accounts |

Status is `pass` / `fail` / `untested` / `N/A`. Severity only on `fail`. Target: ASVS L1.
