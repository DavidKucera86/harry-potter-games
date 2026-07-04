import { test, expect, type Page } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  waitForQuizReady,
  guessLetters,
  expectModalOpen,
} from '../helpers/hangman';
import { given, then } from '../helpers/gwt';

const isProduction = (process.env.PLAYWRIGHT_TARGET ?? 'local') === 'production';

const VISUAL_TEST_FONTS_CSS = `
*, *::before, *::after {
  font-family: "DejaVu Sans", "Liberation Sans", Arial, sans-serif !important;
}
`;

async function setupVisualTestRoutes(page: Page) {
  await page.route('**/shared/visual-test-fonts.css', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'text/css',
      body: VISUAL_TEST_FONTS_CSS,
    });
  });
}

async function stabilizeVisualRendering(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/shared/visual-test-fonts.css';
        link.onload = () => resolve();
        link.onerror = () => reject(new Error('Failed to load visual test fonts'));
        document.head.appendChild(link);
      }),
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test.describe('Visual regression @visual', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(isProduction, 'Visual tests run only against local build');
    await given('viewport je nastaven na 1280×720 a fonty jsou stabilizované', async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await setupVisualTestRoutes(page);
    });
  });

  test('V01.01: menu page layout', { tag: '@visual' }, async ({ page }) => {
    await given('uživatel otevře hlavní menu', async () => {
      await page.goto('/');
      await stabilizeVisualRendering(page);
    });

    await then('screenshot mřížky her odpovídá baseline', async () => {
      await expect(page.locator('#main-content .game-grid')).toHaveScreenshot('menu-game-grid.png');
    });
  });

  test('V02.01: hangman ready state', { tag: '@visual' }, async ({ page }) => {
    await given('hra Hádej postavu je ve stavu připraveno ke hře', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
      await stabilizeVisualRendering(page);
    });

    await then('screenshot herního kontejneru odpovídá baseline', async () => {
      await expect(page.locator('.game-container')).toHaveScreenshot('hangman-ready.png');
    });
  });

  test('V03.01: quiz house ready state', { tag: '@visual' }, async ({ page }) => {
    await given('hra Hádej kolej je ve stavu připraveno ke hře', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/guess-house/');
      await waitForQuizReady(page);
      await stabilizeVisualRendering(page);
    });

    await then('screenshot herního kontejneru odpovídá baseline', async () => {
      await expect(page.locator('.game-container')).toHaveScreenshot('quiz-house-ready.png');
    });
  });

  test('V04.01: photo quiz ready state', { tag: '@visual' }, async ({ page }) => {
    await given('hra Kdo je na fotce je ve stavu připraveno ke hře', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/who-is-on-photo/');
      await waitForQuizReady(page);
      await stabilizeVisualRendering(page);
    });

    await then('screenshot herního kontejneru odpovídá baseline', async () => {
      await expect(page.locator('.game-container')).toHaveScreenshot('photo-quiz-ready.png');
    });
  });

  test('V05.01: hangman lose modal', { tag: '@visual' }, async ({ page }) => {
    await given('uživatel prohraje hangman hru', async () => {
      await setupGameMocks(page, {
        characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
      await guessLetters(page, ['q', 'w', 'e', 'r', 't', 'y', 'i', 'o', 'p', 'd']);
      await expectModalOpen(page, 'Došly životy!');
      await stabilizeVisualRendering(page);
    });

    await then('screenshot proherního modalu odpovídá baseline', async () => {
      await expect(page.locator('#overlay')).toHaveScreenshot('hangman-lose-modal.png');
    });
  });
});
