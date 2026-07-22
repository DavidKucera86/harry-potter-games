import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const templatesDir = join(root, 'shared/templates');

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

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
  title,
  styles,
  bodyTemplate,
  bodyVars = {},
  includeScript = true,
  includeModal = true,
  versionComment = false,
  manifestHref,
  initLocaleScript,
}) {
  const head = replacePlaceholders(readPartial('head.html'), {
    TITLE: title,
    STYLES: stylesToHtml(styles),
    MANIFEST_HREF: manifestHref,
  });

  let body = replacePlaceholders(bodyTemplate, {
    ...partials,
    ...bodyVars,
  });

  // Sub-pages live one directory below the root; mirror the initLocale prefix
  // so the footer link resolves to the root-level Klódo-Metr share card.
  const rootPrefix = initLocaleScript.startsWith('../') ? '../' : '';
  const footer = replacePlaceholders(readPartial('footer.html'), {
    INIT_LOCALE_SCRIPT: initLocaleScript,
    KLODO_CARD_HREF: `${rootPrefix}klodo-metr.png`,
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

  writeFileSync(join(root, output), html);
  console.log(`Built ${output}`);
}

const pages = [
  {
    output: 'index.html',
    title: 'Harry Potter Games',
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
    title: 'Hádej kolej — Harry Potter Games',
    styles: ['../shared/common.css'],
    bodyTemplate: readBody('quiz-house.html'),
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
  {
    output: 'who-is-on-photo/index.html',
    title: 'Kdo je na fotce? — Harry Potter Games',
    styles: ['../shared/common.css'],
    bodyTemplate: readBody('quiz-photo.html'),
    manifestHref: '/manifest.webmanifest',
    initLocaleScript: '../shared/initLocale.js',
  },
  {
    output: 'guess-character-name/index.html',
    title: 'Hádej postavu — Harry Potter Games',
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
    title: 'Hádej zaklínadlo — Harry Potter Games',
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

for (const page of pages) {
  buildPage(page);
}

console.log(`Version: ${version}`);
