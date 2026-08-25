import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cs } from '../../src/shared/i18n/locales/cs.ts';

/**
 * Image oracle (HICCUPPS — see docs/ORACLES.md).
 *
 * The product writes the same facts down in several independent places. Its name lives
 * in the manifest and in every generated page title; its route list lives in the sitemap,
 * the README table, the service worker precache list and the Dockerfile COPY list. None
 * of them is derived from the others, so any one can go stale on its own — and a stale
 * one stays invisible until someone installs the PWA, shares a link, reads the README
 * expecting it to be true, or opens a game in the container and gets a 404.
 *
 * The same pattern as tests/unit/security-headers.test.ts, which does this for the CSP:
 * duplicated values are fine as long as something fails when they diverge.
 */
const root = process.cwd();
const read = (relativePath: string) => readFileSync(join(root, relativePath), 'utf8');

const PRODUCT_NAME = 'Harry Potter Games';

/** Games, as the routes the site actually ships. Kept in one place on purpose. */
const GAME_ROUTES = [
  'guess-character-name',
  'guess-house',
  'guess-spell',
  'who-is-on-photo',
  'rock-paper-scissors',
  'chat-with-character',
];

const manifest = JSON.parse(read('manifest.webmanifest')) as {
  name: string;
  short_name: string;
  description: string;
  lang: string;
  start_url: string;
  icons: { src: string }[];
};

describe('the product calls itself the same thing everywhere', () => {
  it('uses the product name in the manifest and the menu title', () => {
    expect(manifest.name).toBe(PRODUCT_NAME);
    expect(cs.pages.menuTitle).toBe(PRODUCT_NAME);
  });

  it('ends every generated page title with the product name', () => {
    for (const route of GAME_ROUTES) {
      const title = read(`${route}/index.html`).match(/<title>([^<]*)<\/title>/)?.[1];
      expect(title, `${route}/index.html has no <title>`).toBeDefined();
      expect(title, `${route} title does not carry the product name`).toContain(
        PRODUCT_NAME,
      );
    }
    expect(read('index.html')).toContain(`<title>${PRODUCT_NAME}</title>`);
  });
});

describe('the manifest is a valid install descriptor', () => {
  it('declares the fields a browser needs to offer installation', () => {
    expect(manifest.short_name.length).toBeGreaterThan(0);
    expect(manifest.short_name.length).toBeLessThanOrEqual(12); // home-screen label
    expect(manifest.description.trim()).not.toBe('');
    expect(manifest.start_url).toBe('/');
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it('declares the locale the site actually defaults to', () => {
    expect(manifest.lang).toBe('cs');
    expect(read('index.html')).toMatch(/<html[^>]*\blang="cs"/);
  });
});

describe('the route list agrees with itself', () => {
  it('lists every game in the sitemap', () => {
    const sitemap = read('sitemap.xml');
    for (const route of GAME_ROUTES) {
      expect(sitemap, `sitemap.xml is missing /${route}/`).toContain(`/${route}/`);
    }
    // The menu page itself, plus one entry per game, and nothing orphaned.
    expect([...sitemap.matchAll(/<loc>/g)]).toHaveLength(GAME_ROUTES.length + 1);
  });

  it('lists every game in the README table', () => {
    const readme = read('README.md');
    for (const route of GAME_ROUTES) {
      expect(readme, `README does not link to ${route}/`).toContain(`](${route}/)`);
    }
  });

  it('precaches every game route in the service worker', () => {
    // A route missing here works online and 404s offline — the one failure mode the
    // PWA promise is supposed to rule out.
    const sw = read('src/shared/sw.ts');
    for (const route of GAME_ROUTES) {
      expect(sw, `sw.ts does not precache /${route}/`).toContain(`/${route}/`);
    }
  });

  it('ships every game route in the runtime image, and nothing else', () => {
    // A route missing here 404s in the container while every serve-based test passes —
    // the chat game shipped that way once. Until now only `npm run test:docker` caught
    // it, which is a container build away from the PR gate.
    const copied = [...read('Dockerfile').matchAll(/^COPY --from=build \/app\/(\S+) \.\/\1$/gm)]
      .map(([, route]) => route)
      .filter((route) => route !== 'shared');

    expect([...copied].sort()).toEqual([...GAME_ROUTES].sort());
  });
});
