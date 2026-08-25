import { describe, expect, it, vi } from 'vitest';
import { pickFromRemaining, shuffle } from '../../src/shared/deckUtils.ts';

/** Feeds a fixed sequence of values to the code under test, then repeats the last one. */
const rngFrom = (values: number[]) => {
  let call = 0;
  return () => values[Math.min(call++, values.length - 1)];
};

describe('shuffle', () => {
  // Fisher-Yates is uniform: with a fair source, every permutation is reachable. That is
  // the property worth asserting — a shuffle that returns its input unchanged still
  // satisfies "same elements, same length", which is all the other tests here check.
  it('can reach every permutation of the deck', () => {
    const seen = new Set<string>();
    for (const first of [0, 0.4, 0.9]) {
      for (const second of [0, 0.9]) {
        seen.add(shuffle(['a', 'b', 'c'], rngFrom([first, second])).join(''));
      }
    }
    expect([...seen].sort()).toEqual(['abc', 'acb', 'bac', 'bca', 'cab', 'cba']);
  });

  // One draw per element beyond the first — what makes Fisher-Yates linear, and the only
  // thing that tells an off-by-one in the loop bounds from a swap that does nothing.
  it.each([2, 3, 5, 9])('draws exactly one random number per element after the first (%i)', (size) => {
    let draws = 0;
    const counting = () => {
      draws += 1;
      return 0.5;
    };
    shuffle(Array.from({ length: size }, (_, i) => i), counting);
    expect(draws).toBe(size - 1);
  });

  it('draws nothing for a deck too short to reorder', () => {
    let draws = 0;
    const counting = () => {
      draws += 1;
      return 0.5;
    };
    expect(shuffle([], counting)).toEqual([]);
    expect(shuffle(['only'], counting)).toEqual(['only']);
    expect(draws).toBe(0);
  });

  it('returns a permutation with the same elements', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle(input);

    expect(result).toHaveLength(4);
    expect(result.sort()).toEqual(input.sort());
    expect(input).toEqual(['a', 'b', 'c', 'd']);
    randomSpy.mockRestore();
  });
});

describe('pickFromRemaining', () => {
  it('picks an item from the pool', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const remaining = ['a', 'b', 'c'];
    const { item, index } = pickFromRemaining(remaining);

    expect(item).toBe('a');
    expect(index).toBe(0);
    randomSpy.mockRestore();
  });

  it('respects filterFn', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const remaining = [
      { id: '1', name: 'broken' },
      { id: '2', name: 'ok' },
    ];
    const { item } = pickFromRemaining(remaining, entry => entry.id === '2');

    expect(item).toEqual({ id: '2', name: 'ok' });
    randomSpy.mockRestore();
  });

  // The `* length` in the index calculation is what spreads picks across the pool. Mutate
  // it and every pick collapses onto the first eligible item — the deck stops dealing.
  it('reaches the first and the last eligible item', () => {
    const remaining = ['a', 'b', 'c', 'd'];
    expect(pickFromRemaining(remaining, undefined, () => 0)).toEqual({ item: 'a', index: 0 });
    expect(pickFromRemaining(remaining, undefined, () => 0.999)).toEqual({ item: 'd', index: 3 });
  });

  it('reaches the first and the last item the filter left in', () => {
    const remaining = ['skip', 'a', 'skip', 'b', 'skip'];
    const keep = (entry: string) => entry !== 'skip';
    expect(pickFromRemaining(remaining, keep, () => 0)).toEqual({ item: 'a', index: 1 });
    expect(pickFromRemaining(remaining, keep, () => 0.999)).toEqual({ item: 'b', index: 3 });
  });

  it('returns null when pool is empty', () => {
    const { item, index } = pickFromRemaining(['a'], () => false);
    expect(item).toBeNull();
    expect(index).toBe(-1);
  });
});
