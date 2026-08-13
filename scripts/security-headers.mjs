/**
 * Single source of truth for the production security headers.
 *
 * The policy has to reach the browser through three channels that cannot import
 * from each other: netlify.toml (production), docker/nginx.conf (the container)
 * and a <meta http-equiv> tag in every page (so it also holds when the files are
 * served by something that sends no headers at all). The meta copy is injected
 * here at build time by build-html.mjs; the two config files are checked against
 * these constants by tests/unit/security-headers.test.ts, so drift fails the
 * suite instead of silently weakening one of the three.
 */

/** Only <meta http-equiv> can carry the CSP; the other headers are response-only. */
export const META_CSP_HEADER = 'Content-Security-Policy';

export const CSP = [
  "default-src 'self'",
  // Character photos come from third-party hosts the HP API can change at any
  // time, so the host cannot be pinned; unsafe URLs are filtered in urlUtils.ts.
  "img-src 'self' https: data:",
  "connect-src 'self' https://hp-api.onrender.com",
  "style-src 'self'",
  "script-src 'self'",
  "worker-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ') + ';';

export const SECURITY_HEADERS = {
  [META_CSP_HEADER]: CSP,
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // No `preload`: that would commit the apex domain to HTTPS-only for every
  // subdomain, which is not ours to decide from this repo.
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cross-Origin-Opener-Policy': 'same-origin',
};
