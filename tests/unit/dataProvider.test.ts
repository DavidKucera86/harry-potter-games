import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchTimeoutError, getCharacters, getSpells } from '../../src/shared/dataProvider.ts';
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

  // A connection that hangs rather than fails costs a full timeout per attempt, so
  // retrying it three times spends three timeouts before the player sees anything —
  // measured at 48 s against the Docker build (exploratory charter #1). Retries are
  // there for a flaky connection, which fails fast and still gets all of them.
  it('stops retrying once the total budget is spent, instead of paying a timeout per attempt', async () => {
    vi.stubGlobal('window', { __HP_FETCH_TIMEOUT_MS: 10, __HP_API_BUDGET_MS: 1500 });

    let attempts = 0;
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => {
      if (String(url).includes('/api/characters')) {
        attempts++;
        throw createAbortError();
      }
      return { ok: true, json: async () => [{ id: '9', name: 'Fixture Albus' }] };
    }));

    const promise = getCharacters();
    await vi.runAllTimersAsync();
    await promise;

    // Exactly two: the first retry sleeps 1 s and fits, the second would sleep 2 s and
    // does not. `toBeLessThan(API_RETRIES)` would also accept 1, which is a different
    // bug — abandoning a flaky connection after one failure.
    expect(attempts).toBe(2);
  });

  // The clamp on a single attempt is the only line that shortens a *hanging* load, and
  // a mock that throws synchronously never exercises it: the budget gets spent by the
  // retry sleeps instead. This one really hangs until its signal aborts.
  it('never lets one attempt outlive the budget when the connection hangs', async () => {
    vi.stubGlobal('window', { __HP_FETCH_TIMEOUT_MS: 10_000, __HP_API_BUDGET_MS: 400 });

    const attemptDurations: number[] = [];
    vi.stubGlobal('fetch', vi.fn((url: string | URL | Request, init?: { signal?: AbortSignal }) => {
      if (!String(url).includes('/api/characters')) {
        return Promise.resolve({ ok: true, json: async () => [{ id: '9', name: 'Fixture Albus' }] });
      }
      const startedAt = Date.now();
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          attemptDurations.push(Date.now() - startedAt);
          reject(createAbortError());
        });
      });
    }));

    const promise = getCharacters();
    await vi.runAllTimersAsync();
    await promise;

    expect(attemptDurations).toHaveLength(1);
    // Without the clamp the attempt would run for the full 10 s per-attempt timeout.
    expect(attemptDurations[0]).toBeLessThanOrEqual(400);
  });

  // The fixtures are same-origin and normally instant, but on a first visit with a
  // hanging network — before the service worker has precached them — nothing bounded
  // this leg, so the budget above bought nothing.
  it('bounds the fixture fallback too, so a hung fixture cannot hang the load', async () => {
    vi.stubGlobal('window', {
      __HP_FETCH_TIMEOUT_MS: 10,
      __HP_API_BUDGET_MS: 50,
      __HP_FIXTURE_TIMEOUT_MS: 300,
    });

    let fixtureAborted = false;
    vi.stubGlobal('fetch', vi.fn((url: string | URL | Request, init?: { signal?: AbortSignal }) => {
      if (String(url).includes('/api/characters')) {
        return Promise.reject(createAbortError());
      }
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          fixtureAborted = true;
          reject(createAbortError());
        });
      });
    }));

    // Deliberately not awaited: without the bound this never settles, and awaiting it
    // would hang the test instead of failing it. The abort is the observable that says
    // the bound fired, so it is what decides.
    const settled = getCharacters().then(() => 'resolved', () => 'rejected');
    await vi.runAllTimersAsync();

    expect(fixtureAborted).toBe(true);
    await expect(settled).resolves.toBe('rejected');
  });

  it('still spends every attempt on a connection that fails fast', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', vi.fn(async () => {
      attempts++;
      if (attempts < GAME_CONFIG.API_RETRIES) {
        throw createAbortError();
      }
      return { ok: true, json: async () => [{ id: '1', name: 'Albus' }] };
    }));

    const promise = getCharacters();
    await vi.runAllTimersAsync();
    await promise;

    expect(attempts).toBe(GAME_CONFIG.API_RETRIES);
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

describe('API response shape validation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSessionStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const withApiPayload = (payload: unknown) => vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => {
    if (String(url).includes('/api/characters')) {
      return { ok: true, json: async () => payload };
    }
    return { ok: true, json: async () => [{ id: '99', name: 'Fallback Hero' }] };
  }));

  async function resolveCharacters() {
    const promise = getCharacters();
    await vi.runAllTimersAsync();
    return promise;
  }

  it.each([
    ['an object instead of an array', { characters: [] }],
    ['a bare string', 'not json'],
    ['null', null],
  ])('falls back to fixtures when the API returns %s', async (_label, payload) => {
    withApiPayload(payload);
    expect(await resolveCharacters()).toEqual([{ id: '99', name: 'Fallback Hero' }]);
  });

  it('drops entries that are not shaped like a character', async () => {
    withApiPayload([
      null,
      42,
      'Albus',
      { id: 1, name: 'Numeric id' },
      { id: '2', name: 42 },
      { id: '3', name: 'Harry', house: 'Gryffindor', image: 'https://hp.local/h.png' },
      { id: '4', name: 'Ron', house: ['Gryffindor'], image: 'https://hp.local/r.png' },
    ]);

    expect(await resolveCharacters()).toEqual([
      { id: '3', name: 'Harry', house: 'Gryffindor', image: 'https://hp.local/h.png' },
    ]);
  });

  it('falls back to fixtures when no entry survives validation', async () => {
    withApiPayload([null, { id: 1 }, { name: '' }]);
    expect(await resolveCharacters()).toEqual([{ id: '99', name: 'Fallback Hero' }]);
  });

  it('ignores a cached payload that no longer has a valid shape', async () => {
    const storage = mockSessionStorage();
    storage.set(
      `${GAME_CONFIG.CACHE_KEYS.CHARACTERS}-v${GAME_CONFIG.CACHE_VERSION}`,
      JSON.stringify({ data: { poisoned: true }, timestamp: Date.now() }),
    );
    withApiPayload([{ id: '7', name: 'Fresh', house: 'Ravenclaw', image: 'https://hp.local/f.png' }]);

    expect(await resolveCharacters()).toEqual([
      { id: '7', name: 'Fresh', house: 'Ravenclaw', image: 'https://hp.local/f.png' },
    ]);
  });
});

describe('spell response shape validation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSessionStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('keeps only spells with a usable name', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [{ name: 'Lumos' }, { name: '' }, { name: 7 }, {}, null],
    })));

    const promise = getSpells();
    await vi.runAllTimersAsync();

    expect(await promise).toEqual([{ name: 'Lumos' }]);
  });
});
