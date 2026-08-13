import { test, expect } from '@playwright/test';
import { given, then, when } from '../helpers/gwt';
import { CSP, SECURITY_HEADERS } from '../../scripts/security-headers.mjs';

// `npx serve` sends no security headers, so the header assertions only make
// sense against the real artifact (nginx image / Netlify), i.e. the production
// target used by `npm run test:docker` and the post-deploy smoke job. The meta
// copy of the CSP is checked everywhere.
const isProduction = process.env.PLAYWRIGHT_TARGET === 'production';

const pages = [
  { id: 'E60.02', route: '/' },
  { id: 'E60.03', route: '/guess-character-name/' },
  { id: 'E60.04', route: '/guess-house/' },
  { id: 'E60.05', route: '/guess-spell/' },
  { id: 'E60.06', route: '/who-is-on-photo/' },
  { id: 'E60.07', route: '/rock-paper-scissors/' },
  { id: 'E60.08', route: '/chat-with-character/' },
];

test.describe('Security headers @edge', () => {
  test('E60.01: server posílá všechny bezpečnostní hlavičky', { tag: '@edge' }, async ({ page }) => {
    test.skip(!isProduction, 'npx serve bezpečnostní hlavičky neposílá — kontroluje se jen proti reálnému artefaktu');

    let headers: Record<string, string> = {};

    await when('si vyžádám úvodní stránku', async () => {
      const response = await page.request.get('/');
      expect(response.status()).toBe(200);
      headers = response.headers();
    });

    await then('odpověď nese každou hlavičku ze sdíleného zdroje pravdy', async () => {
      for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
        expect(headers[name.toLowerCase()], name).toBe(value);
      }
    });
  });

  for (const { id, route } of pages) {
    test(`${id}: ${route} má CSP i v meta tagu`, { tag: '@edge' }, async ({ page }) => {
      await given(`stránka ${route} je načtená`, async () => {
        await page.goto(route);
      });

      await then('meta CSP odpovídá sdílenému zdroji pravdy', async () => {
        const content = await page.getAttribute(
          'meta[http-equiv="Content-Security-Policy"]',
          'content',
        );
        expect(content).toBe(CSP);
      });
    });
  }

  test('E60.09: CSP zablokuje vložený inline skript', { tag: '@edge' }, async ({ page }) => {
    await given('úvodní stránka je načtená', async () => {
      await page.goto('/');
    });

    await when('se do stránky pokusí vložit inline skript', async () => {
      await page
        .addScriptTag({ content: 'window.__cspBypassed = true;' })
        .catch(() => { /* CSP odmítne skript — přesně to čekáme */ });
    });

    await then('skript se nespustí', async () => {
      expect(await page.evaluate(() => '__cspBypassed' in window)).toBe(false);
    });
  });
});
