import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const templatesDir = join(root, 'shared/templates');

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

// Production origin for canonical / Open Graph / sitemap URLs. Overridable per
// environment; defaults to the Netlify production site. No trailing slash.
const SITE_URL = (process.env.SITE_URL ?? 'https://harry-potter-games.netlify.app').replace(/\/$/, '');
const OG_IMAGE = `${SITE_URL}/shared/og-image.png`;

function readPartial(name) {
  return readFileSync(join(templatesDir, 'partials', name), 'utf8');
}

function readBody(name) {
  return readFileSync(join(templatesDir, 'bodies', name), 'utf8');
}

const partials = {
  LOADING_OVERLAY: readPartial('loading-overlay.html'),
  STATUS_BAR_QUIZ: readPartial('status-bar-quiz.html'),
  STATUS_BAR_HANGMAN: readPartial('status-bar-hangman.html'),
  MODAL: readPartial('modal.html'),
  SKIP_LINK: readPartial('skip-link.html'),
  SW_UPDATE_BANNER: readPartial('sw-update-banner.html'),
};

function stylesToHtml(styles) {
  return styles.map(href => `  <link rel="stylesheet" href="${href}">`).join('\n');
}

function replacePlaceholders(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

function buildPage({
  output,
  route,
  title,
  description,
  styles,
  bodyTemplate,
  bodyVars = {},
  includeScript = true,
  includeModal = true,
  versionComment = false,
  manifestHref,
  initLocaleScript,
}) {
  const canonical = `${SITE_URL}${route}`;
  const head = replacePlaceholders(readPartial('head.html'), {
    TITLE: title,
    DESCRIPTION: description,
    CANONICAL: canonical,
    OG_IMAGE,
    STYLES: stylesToHtml(styles),
    MANIFEST_HREF: manifestHref,
  });

  let body = replacePlaceholders(bodyTemplate, {
    ...partials,
    ...bodyVars,
  });

  const footer = replacePlaceholders(readPartial('footer.html'), {
    INIT_LOCALE_SCRIPT: initLocaleScript,
  });

  const modal = includeModal ? partials.MODAL : '';
  const script = includeScript ? '\n  <script type="module" src="script.js"></script>' : '';
  const versionLine = versionComment ? `\n<!-- HP Games version: ${version} -->` : '';

  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
${head}</head>
<body>
${partials.SKIP_LINK}${partials.SW_UPDATE_BANNER}${body}${modal}${footer}${script}
</body>
</html>${versionLine}
`;

  const outputPath = join(root, output);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
  console.log(`Built ${output}`);
}

const pages = [
  {
    output: 'index.html',
    route: '/',
    title: 'Harry Potter Games',
    description: 'Sada českých browser her ze světa Harryho Pottera — hádej postavy, koleje a zaklínadla, hraj kámen–nůžky–papír nebo si popovídej s postavou. Data z HP API.',
    styles: ['shared/common.css'],
    bodyTemplate: readBody('menu.html'),
    includeScript: false,
    includeModal: false,
    versionComment: true,
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: 'shared/initLocale.js',
  },
  {
    output: 'guess-house/index.html',
    route: '/guess-house/',
    title: 'Hádej kolej — Harry Potter Games',
    description: 'Kvíz z Bradavic: ke jménu postavy z Harryho Pottera vyber správnou kolej ze čtyř možností. Máš 10 životů.',
    styles: ['../shared/common.css'],
    bodyTemplate: readBody('quiz-house.html'),
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
  {
    output: 'who-is-on-photo/index.html',
    route: '/who-is-on-photo/',
    title: 'Kdo je na fotce? — Harry Potter Games',
    description: 'Poznáš postavu z Harryho Pottera podle fotky? Vyber správné jméno ze čtyř možností. Máš 10 životů.',
    styles: ['../shared/common.css'],
    bodyTemplate: readBody('quiz-photo.html'),
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
  {
    output: 'rock-paper-scissors/index.html',
    route: '/rock-paper-scissors/',
    title: 'Kámen, nůžky, papír — Harry Potter Games',
    description: 'Zahraj si kámen, nůžky, papír proti postavám z Bradavic. Kdo první získá pět výher, bere zápas.',
    styles: ['../shared/common.css'],
    bodyTemplate: readBody('duel-rps.html'),
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
  {
    output: 'chat-with-character/index.html',
    route: '/chat-with-character/',
    title: 'Chat s postavou — Harry Potter Games',
    description: 'Popovídej si s postavou ze světa Harryho Pottera. Zadej přezdívku, vyber postavu a dej se do řeči (zatím Brumbál).',
    styles: ['../shared/common.css', '../shared/styles/chat.css'],
    bodyTemplate: readBody('chat.html'),
    includeModal: false,
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
  {
    output: 'guess-character-name/index.html',
    route: '/guess-character-name/',
    title: 'Hádej postavu — Harry Potter Games',
    description: 'Hangman ze světa Harryho Pottera — uhodni jméno postavy písmeno po písmenu. Máš 10 životů.',
    styles: ['../shared/common.css', '../shared/styles/hangman.css'],
    bodyTemplate: readBody('hangman.html'),
    bodyVars: {
      H1_KEY: 'hangmanCharacterTitle',
      H1: 'Hádej postavu z Harryho Pottera',
      HEADER_DESC_KEY: 'hangmanCharacterDesc',
      HEADER_DESC: 'Uhodni jméno postavy písmeno po písmenu. Máš 10 životů.',
      INITIAL_MESSAGE_KEY: 'hangmanCharacterInitial',
      INITIAL_MESSAGE: 'Hádej písmeno ve jménu postavy…',
    },
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
  {
    output: 'guess-spell/index.html',
    route: '/guess-spell/',
    title: 'Hádej zaklínadlo — Harry Potter Games',
    description: 'Hangman ze světa Harryho Pottera — uhodni zaklínadlo písmeno po písmenu. Máš 10 životů.',
    styles: ['../shared/common.css', '../shared/styles/hangman.css'],
    bodyTemplate: readBody('hangman.html'),
    bodyVars: {
      H1_KEY: 'hangmanSpellTitle',
      H1: 'Hádej zaklínadlo',
      HEADER_DESC_KEY: 'hangmanSpellDesc',
      HEADER_DESC: 'Uhodni zaklínadlo písmeno po písmenu. Máš 10 životů.',
      INITIAL_MESSAGE_KEY: 'hangmanSpellInitial',
      INITIAL_MESSAGE: 'Hádej písmeno v zaklínadle…',
    },
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
];

function buildRobots() {
  const content = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  writeFileSync(join(root, 'robots.txt'), content);
  console.log('Built robots.txt');
}

// No <lastmod> on purpose: it would change every build and defeat verify:build.
function buildSitemap(routes) {
  const urls = routes
    .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`)
    .join('\n');
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  writeFileSync(join(root, 'sitemap.xml'), content);
  console.log('Built sitemap.xml');
}

for (const page of pages) {
  buildPage(page);
}

buildRobots();
buildSitemap(pages.map((page) => page.route));

console.log(`Version: ${version}`);
