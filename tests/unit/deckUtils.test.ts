import { describe, expect, it, vi } from 'vitest';
import { pickFromRemaining, shuffle } from '../../src/shared/deckUtils.ts';

describe('shuffle', () => {
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

  it('returns null when pool is empty', () => {
    const { item, index } = pickFromRemaining(['a'], () => false);
    expect(item).toBeNull();
    expect(index).toBe(-1);
  });
});
