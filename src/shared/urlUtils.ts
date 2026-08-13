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

  const url = value.trim();
  if (!url) {
    return false;
  }

  // Same-origin absolute path, but never a protocol-relative `//host/…` URL.
  if (url.startsWith('/')) {
    return !url.startsWith('//');
  }

  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}
