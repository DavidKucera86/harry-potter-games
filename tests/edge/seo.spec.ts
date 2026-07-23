import { test, expect } from '@playwright/test';
import { given, then } from '../helpers/gwt';

const pages = [
  { id: 'E55.01', route: '/' },
  { id: 'E55.02', route: '/guess-character-name/' },
  { id: 'E55.03', route: '/guess-house/' },
  { id: 'E55.04', route: '/guess-spell/' },
  { id: 'E55.05', route: '/who-is-on-photo/' },
  { id: 'E55.06', route: '/rock-paper-scissors/' },
  { id: 'E55.07', route: '/chat-with-character/' },
];

const icons = [
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/shared/og-image.png',
];

test.describe('SEO metadata @edge', () => {
  for (const { id, route } of pages) {
    test(`${id}: ${route} exposes description, canonical, Open Graph and favicons`, { tag: '@edge' }, async ({ page }) => {
      await given(`stránka ${route} je načtená`, async () => {
        await page.goto(route);
      });

      await then('má nezanedbatelný meta popisek', async () => {
        const description = await page.getAttribute('meta[name="description"]', 'content');
        expect(description?.trim().length ?? 0).toBeGreaterThan(30);
      });

      await then('má absolutní canonical URL pro tuto stránku', async () => {
        const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
        expect(canonical).toMatch(/^https:\/\/.+/);
        expect(canonical?.endsWith(route)).toBe(true);
      });

      await then('má Open Graph a Twitter card tagy', async () => {
        expect(await page.getAttribute('meta[property="og:title"]', 'content')).toBeTruthy();
        expect(await page.getAttribute('meta[property="og:description"]', 'content')).toBeTruthy();
        expect(await page.getAttribute('meta[property="og:image"]', 'content')).toMatch(/^https:\/\/.+\.png$/);
        expect(await page.getAttribute('meta[name="twitter:card"]', 'content')).toBe('summary_large_image');
      });

      await then('má favicon i apple-touch ikonu', async () => {
        expect(await page.getAttribute('link[rel="icon"][href="/favicon.ico"]', 'href')).toBe('/favicon.ico');
        expect(await page.getAttribute('link[rel="apple-touch-icon"]', 'href')).toBe('/apple-touch-icon.png');
      });
    });
  }

  test('E55.08: robots.txt, sitemap.xml and icon assets are served', { tag: '@edge' }, async ({ page }) => {
    await then('robots.txt odkazuje na sitemapu', async () => {
      const res = await page.request.get('/robots.txt');
      expect(res.status()).toBe(200);
      expect(await res.text()).toContain('Sitemap:');
    });

    await then('sitemap.xml obsahuje všechny stránky', async () => {
      const res = await page.request.get('/sitemap.xml');
      expect(res.status()).toBe(200);
      const xml = await res.text();
      for (const { route } of pages) {
        expect(xml).toContain(`${route}</loc>`);
      }
    });

    await then('ikony a OG obrázek jsou dostupné', async () => {
      for (const asset of icons) {
        const res = await page.request.get(asset);
        expect(res.status(), asset).toBe(200);
      }
    });
  });
});
