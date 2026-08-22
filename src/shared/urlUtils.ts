/**
 * Before it parses anything, the URL parser removes ASCII tab, LF and CR from
 * *anywhere* in the string, then strips the whitespace around what is left. The
 * checks below must look at that normalised form, or they judge a different string
 * than the one the browser will fetch: `/\t/evil.example/x` does not start with
 * `//`, yet the browser resolves it to `//evil.example/x` — a cross-origin request
 * from the guard whose whole job is to prevent one.
 *
 * `trim` is the stricter half of the pair: it leaves the other C0 controls the
 * parser would have stripped, so a value like `\x01//host/x` fails `new URL` and is
 * rejected rather than let through. Erring towards rejection is the safe direction.
 * @see https://url.spec.whatwg.org/#concept-basic-url-parser
 */
const IGNORED_BY_URL_PARSER = /[\t\n\r]/g;

function asTheParserSeesIt(value: string): string {
  return value.replace(IGNORED_BY_URL_PARSER, '').trim();
}

/**
 * Character photos are URLs handed to us by the HP API, i.e. untrusted input that
 * ends up in a DOM sink (`img.src`). Only two shapes are ever legitimate here: an
 * absolute https URL (the API's third-party image hosts) and a same-origin
 * absolute path (our local fixtures). Everything else — `javascript:`, `data:`,
 * plain http, protocol-relative — is dropped before it can reach the DOM.
 */
export function isSafeImageUrl(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const url = asTheParserSeesIt(value);

  // Same-origin absolute path, but never a protocol-relative `//host/…` URL.
  if (url.startsWith('/')) {
    return !url.startsWith('//');
  }

  // An empty string lands here too: `new URL('')` throws, so it is rejected below.
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}
