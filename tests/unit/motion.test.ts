import { afterEach, describe, expect, it } from 'vitest';
import { prefersReducedMotion } from '../../src/shared/motion.ts';

const originalMatchMedia = window.matchMedia;

function stubMatchMedia(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('prefers-reduced-motion: reduce') ? reduce : false,
    media: query,
  })) as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('prefersReducedMotion', () => {
  it('is true when the user asks to reduce motion', () => {
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('is false when the user does not ask to reduce motion', () => {
    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it('is false when matchMedia is unavailable', () => {
    // @ts-expect-error — simulate an environment without matchMedia
    window.matchMedia = undefined;
    expect(prefersReducedMotion()).toBe(false);
  });
});
