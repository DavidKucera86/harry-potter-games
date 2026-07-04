import fs from 'node:fs';
import path from 'node:path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';

type GwtStep = {
  kind: 'Given' | 'When' | 'Then';
  text: string;
};

type CatalogEntry = {
  title: string;
  tag: string;
  file: string;
  steps: GwtStep[];
};

const SECTION_ORDER = ['@smoke', '@critical', '@edge', '@visual'] as const;
const SECTION_LABELS: Record<(typeof SECTION_ORDER)[number], string> = {
  '@smoke': 'Smoke (@smoke)',
  '@critical': 'Critical (@critical)',
  '@edge': 'Edge (@edge)',
  '@visual': 'Visual (@visual)',
};

function parseGwtStep(title: string): GwtStep | null {
  const match = title.match(/^(Given|When|Then):\s*(.+)$/);
  if (!match) return null;
  return { kind: match[1] as GwtStep['kind'], text: match[2] };
}

function extractTag(test: TestCase): string {
  for (const tag of SECTION_ORDER) {
    if (test.tags.includes(tag)) return tag;
  }
  return '@edge';
}

function extractTestId(title: string): string {
  const match = title.match(/^([A-Z]\d+[a-z]?|\d+):/);
  if (match) return match[1];
  const dynamicMatch = title.match(/^(E\d+):/);
  if (dynamicMatch) return dynamicMatch[1];
  return title;
}

function compareEntries(a: CatalogEntry, b: CatalogEntry): number {
  const idA = extractTestId(a.title);
  const idB = extractTestId(b.title);

  const numA = idA.match(/^([A-Z])(\d+)/);
  const numB = idB.match(/^([A-Z])(\d+)/);

  if (numA && numB) {
    if (numA[1] !== numB[1]) {
      return numA[1].localeCompare(numB[1]);
    }
    return Number(numA[2]) - Number(numB[2]);
  }

  return a.title.localeCompare(b.title);
}

function collectGwtSteps(steps: TestStep[]): GwtStep[] {
  const collected: GwtStep[] = [];

  const walk = (stepList: TestStep[]) => {
    for (const step of stepList) {
      const parsed = parseGwtStep(step.title);
      if (parsed) {
        collected.push(parsed);
      }
      if (step.steps.length > 0) {
        walk(step.steps);
      }
    }
  };

  walk(steps);
  return collected;
}

function formatEntry(entry: CatalogEntry): string {
  const heading = entry.title.replace(/^[^:]+:\s*/, '');
  const id = extractTestId(entry.title);
  const lines = [
    `### ${id} — ${heading}`,
    `**Soubor:** \`${entry.file}\``,
    '',
  ];

  for (const step of entry.steps) {
    lines.push(`- **${step.kind}** ${step.text}`);
  }

  lines.push('');
  return lines.join('\n');
}

function renderMarkdown(entries: CatalogEntry[]): string {
  const grouped = new Map<string, CatalogEntry[]>();

  for (const entry of entries) {
    const list = grouped.get(entry.tag) ?? [];
    list.push(entry);
    grouped.set(entry.tag, list);
  }

  const lines = [
    '# E2E test katalog',
    '',
    '> Automaticky generováno z Playwright test.step. Obnovení: `npm run docs:test-catalog`',
    '',
  ];

  for (const tag of SECTION_ORDER) {
    const sectionEntries = grouped.get(tag);
    if (!sectionEntries || sectionEntries.length === 0) continue;

    sectionEntries.sort(compareEntries);
    lines.push(`## ${SECTION_LABELS[tag]}`, '');
    for (const entry of sectionEntries) {
      lines.push(formatEntry(entry));
    }
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

class GwtCatalogReporter implements Reporter {
  private entries: CatalogEntry[] = [];
  private outputPath = '';
  private rootDir = '';

  onBegin(config: FullConfig) {
    const projectRoot = path.dirname(config.configFile ?? process.cwd());
    this.rootDir = projectRoot;
    this.outputPath = path.join(projectRoot, 'docs/E2E-TEST-CATALOG.md');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const steps = collectGwtSteps(result.steps);
    if (steps.length === 0) return;

    const file = path.relative(this.rootDir, test.location.file).replace(/\\/g, '/');

    this.entries.push({
      title: test.title,
      tag: extractTag(test),
      file: file.startsWith('tests/') ? file : `tests/${file}`,
      steps,
    });
  }

  onEnd(result: FullResult) {
    if (this.entries.length === 0) {
      console.warn('[gwt-catalog-reporter] No GWT steps collected — catalog not written.');
      return;
    }

    fs.mkdirSync(path.dirname(this.outputPath), { recursive: true });
    fs.writeFileSync(this.outputPath, renderMarkdown(this.entries), 'utf8');
    console.log(`[gwt-catalog-reporter] Wrote ${this.entries.length} tests to ${this.outputPath}`);

    if (result.status !== 'passed') {
      console.warn('[gwt-catalog-reporter] Test run did not pass — catalog may be incomplete.');
    }
  }
}

export default GwtCatalogReporter;
