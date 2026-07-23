import { describe, expect, it, vi } from 'vitest';
import { BaseGame } from '../../src/shared/BaseGame.ts';
import { setupHangmanDom } from './helpers/domFixture.ts';

describe('BaseGame', () => {
  it('renderHearts reflects remaining lives', () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    game.lives = 7;
    game.renderHearts();
    expect(document.querySelectorAll('#hearts .heart.lost')).toHaveLength(3);
  });

  it('fillModalLines renders text safely', () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    game.fillModalLines([{ label: 'Answer', value: '<script>alert(1)</script>' }]);
    expect(document.querySelector('#modalText .highlight')?.textContent)
      .toBe('<script>alert(1)</script>');
  });

  it('pickFromDeck returns null when deck is empty', () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    game.resetDeck([]);
    expect(game.pickFromDeck()).toBeNull();
  });

  it('openModal and closeModal toggle aria state', () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    game.openModal();
    expect(document.getElementById('overlay')?.classList.contains('visible')).toBe(true);
    game.closeModal();
    expect(document.getElementById('overlay')?.classList.contains('visible')).toBe(false);
  });

  it('loadGameData assigns items on success', async () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    let assigned: string[] = [];
    const result = await game.loadGameData({
      fetchFn: async () => [{ name: 'Albus' }],
      transform: data => (data as { name: string }[]).map(item => item.name),
      emptyError: 'empty',
      logLabel: 'test',
      assign: items => { assigned = items; },
    });
    expect(result).toBe(true);
    expect(assigned).toEqual(['Albus']);
  });

  it('loadGameData returns false on error', async () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    const onError = vi.fn();
    const result = await game.loadGameData({
      fetchFn: async () => { throw new Error('fail'); },
      transform: data => data as string[],
      emptyError: 'empty',
      logLabel: 'test',
      assign: () => {},
      onError,
    });
    expect(result).toBe(false);
    expect(onError).toHaveBeenCalled();
  });

  it('loadGameData de-duplicates concurrent loads (rate-limit guard)', async () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    let calls = 0;
    const options = {
      fetchFn: async () => {
        calls++;
        await new Promise(resolve => setTimeout(resolve, 10));
        return [{ name: 'Albus' }];
      },
      transform: (data: unknown) => (data as { name: string }[]).map(item => item.name),
      emptyError: 'empty',
      logLabel: 'test',
      assign: () => {},
    };

    const [first, second] = await Promise.all([
      game.loadGameData(options),
      game.loadGameData(options),
    ]);

    // Both callers get the same result, but the network was hit only once.
    expect(calls).toBe(1);
    expect(first).toBe(true);
    expect(second).toBe(true);
  });

  it('loadGameData throttles rapid repeat loads within the cooldown', async () => {
    setupHangmanDom();
    const game = new BaseGame<string>();
    let calls = 0;
    const options = {
      fetchFn: async () => {
        calls++;
        return [{ name: 'Albus' }];
      },
      transform: (data: unknown) => (data as { name: string }[]).map(item => item.name),
      emptyError: 'empty',
      logLabel: 'test',
      assign: () => {},
    };

    await game.loadGameData(options);
    const throttled = await game.loadGameData(options);

    // A second load fired right away is declined instead of hitting the API again.
    expect(calls).toBe(1);
    expect(throttled).toBe(false);
  });
});
