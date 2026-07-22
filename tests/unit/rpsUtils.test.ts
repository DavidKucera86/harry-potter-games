import { describe, expect, it, vi } from 'vitest';
import { RPS_MOVES, randomMove, resolveRps } from '../../src/shared/rpsUtils.ts';

describe('resolveRps', () => {
  it('is a tie when both play the same move', () => {
    for (const move of RPS_MOVES) {
      expect(resolveRps(move, move)).toBe('tie');
    }
  });

  it('resolves every winning combination for the player', () => {
    expect(resolveRps('rock', 'scissors')).toBe('win');
    expect(resolveRps('paper', 'rock')).toBe('win');
    expect(resolveRps('scissors', 'paper')).toBe('win');
  });

  it('resolves every losing combination for the player', () => {
    expect(resolveRps('scissors', 'rock')).toBe('lose');
    expect(resolveRps('rock', 'paper')).toBe('lose');
    expect(resolveRps('paper', 'scissors')).toBe('lose');
  });
});

describe('randomMove', () => {
  it('returns the first move for random close to 0', () => {
    expect(randomMove(() => 0)).toBe('rock');
  });

  it('returns the last move for random close to 1', () => {
    expect(randomMove(() => 0.999)).toBe('scissors');
  });

  it('always returns a valid move', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(RPS_MOVES).toContain(randomMove());
    spy.mockRestore();
  });
});
