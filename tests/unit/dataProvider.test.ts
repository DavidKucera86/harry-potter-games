import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchTimeoutError, getCharacters } from '../../src/shared/dataProvider.ts';
import { GAME_CONFIG } from '../../src/shared/config.ts';

function createAbortError() {
  const error = new Error('The operation was aborted');
  error.name = 'AbortError';
  return error;
}

function mockSessionStorage() {
  const storage = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    clear: () => storage.clear(),
  });
  storage.clear();
  return storage;
}

describe('fetchWithRetry timeout handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSessionStorage();
    vi.stubGlobal('window', { __HP_FETCH_TIMEOUT_MS: 10 });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('retries after timeout and succeeds on a later attempt', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', vi.fn(async () => {
      attempts++;
      if (attempts < 3) {
        throw createAbortError();
      }
      return {
        ok: true,
        json: async () => [{ id: '1', name: 'Albus' }],
      };
    }));

    const promise = getCharacters();
    await vi.runAllTimersAsync();
    const data = await promise;

    expect(attempts).toBe(3);
    expect(data).toEqual([{ id: '1', name: 'Albus' }]);
  });

  it('falls back to fixtures after all timeout attempts fail', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => {
      if (String(url).includes('/api/characters')) {
        throw createAbortError();
      }
      return {
        ok: true,
        json: async () => [{ id: '99', name: 'Fallback Hero' }],
      };
    }));

    const promise = getCharacters();
    await vi.runAllTimersAsync();
    const data = await promise;

    expect(data).toEqual([{ id: '99', name: 'Fallback Hero' }]);
  });

  it('throws FetchTimeoutError when API times out and fallback fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => {
      if (String(url).includes('/api/characters')) {
        throw createAbortError();
      }
      return { ok: false, status: 500 };
    }));

    let caught: unknown;
    const promise = getCharacters().then(
      () => { throw new Error('Expected rejection'); },
      (error: unknown) => { caught = error; },
    );
    await vi.runAllTimersAsync();
    await promise;

    expect(caught).toBeInstanceOf(FetchTimeoutError);
  });
});

describe('fetchWithRetry 5xx handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSessionStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('retries server errors up to API_RETRIES', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', vi.fn(async () => {
      attempts++;
      if (attempts < GAME_CONFIG.API_RETRIES) {
        return { ok: false, status: 500 };
      }
      return {
        ok: true,
        json: async () => [{ id: '1', name: 'Albus' }],
      };
    }));

    const promise = getCharacters();
    await vi.runAllTimersAsync();
    const data = await promise;

    expect(attempts).toBe(GAME_CONFIG.API_RETRIES);
    expect(data).toEqual([{ id: '1', name: 'Albus' }]);
  });
});

describe('fetchWithRetry 4xx handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSessionStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not retry client (4xx) errors and falls back immediately', async () => {
    let apiAttempts = 0;
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => {
      if (String(url).includes('/api/characters')) {
        apiAttempts++;
        return { ok: false, status: 404 };
      }
      return {
        ok: true,
        json: async () => [{ id: '99', name: 'Fallback Hero' }],
      };
    }));

    const promise = getCharacters();
    await vi.runAllTimersAsync();
    const data = await promise;

    expect(apiAttempts).toBe(1);
    expect(data).toEqual([{ id: '99', name: 'Fallback Hero' }]);
  });
});
