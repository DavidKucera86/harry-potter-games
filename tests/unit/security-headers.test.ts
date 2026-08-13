import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CSP, META_CSP_HEADER, SECURITY_HEADERS } from '../../scripts/security-headers.mjs';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(join(root, relativePath), 'utf8');
}

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Reads `  Name = "value"` out of netlify.toml. */
function netlifyHeader(toml: string, name: string): string | undefined {
  const match = toml.match(new RegExp(`^\\s*${name}\\s*=\\s*"([^"]*)"`, 'm'));
  return match?.[1];
}

/** Reads `add_header Name "value" always;` out of nginx.conf. */
function nginxHeader(conf: string, name: string): string | undefined {
  const match = conf.match(new RegExp(`^\\s*add_header\\s+${name}\\s+"([^"]*)"`, 'm'));
  return match?.[1];
}

/** Reads the CSP out of a `<meta http-equiv="Content-Security-Policy" content="…">` tag. */
function metaCsp(html: string): string | undefined {
  const match = html.match(
    /<meta http-equiv="Content-Security-Policy" content="([^"]*)">/,
  );
  return match?.[1];
}

const generatedPages = [
  'index.html',
  'guess-house/index.html',
  'guess-character-name/index.html',
  'guess-spell/index.html',
  'who-is-on-photo/index.html',
  'rock-paper-scissors/index.html',
  'chat-with-character/index.html',
];

describe('security headers stay in sync with the single source of truth', () => {
  const headerNames = Object.keys(SECURITY_HEADERS);

  it('declares the Content-Security-Policy among the shared headers', () => {
    expect(headerNames).toContain(META_CSP_HEADER);
    expect(SECURITY_HEADERS[META_CSP_HEADER]).toBe(CSP);
  });

  it('netlify.toml serves every shared header verbatim', () => {
    const toml = read('netlify.toml');
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(netlifyHeader(toml, name), `netlify.toml: ${name}`).toBe(value);
    }
  });

  it('docker/nginx.conf mirrors every shared header verbatim', () => {
    const conf = read('docker/nginx.conf');
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(nginxHeader(conf, name), `nginx.conf: ${name}`).toBe(value);
    }
  });

  it('the head template carries the CSP as a meta tag', () => {
    // The template keeps the placeholder; the build injects the real policy.
    expect(read('shared/templates/partials/head.html')).toContain('{{CSP}}');
  });

  it.each(generatedPages)('%s ships the same CSP in a meta tag', (page) => {
    expect(metaCsp(read(page))).toBe(CSP);
  });
});

describe('the policy itself stays strict', () => {
  const directives = new Map(
    CSP.split(';')
      .map(normalize)
      .filter(Boolean)
      .map((directive) => {
        const [name, ...values] = directive.split(' ');
        return [name, values] as const;
      }),
  );

  it('blocks inline and eval-based scripts', () => {
    expect(directives.get('script-src')).toEqual(["'self'"]);
    expect(CSP).not.toContain('unsafe-inline');
    expect(CSP).not.toContain('unsafe-eval');
  });

  it('keeps the framing, base and form escape hatches shut', () => {
    expect(directives.get('frame-ancestors')).toEqual(["'none'"]);
    expect(directives.get('base-uri')).toEqual(["'self'"]);
    expect(directives.get('form-action')).toEqual(["'self'"]);
    expect(directives.get('default-src')).toEqual(["'self'"]);
  });

  it('only allows the HP API as a network destination', () => {
    expect(directives.get('connect-src')).toEqual(["'self'", 'https://hp-api.onrender.com']);
  });
});
