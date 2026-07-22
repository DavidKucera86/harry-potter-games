import { describe, expect, it, vi } from 'vitest';
import { GuessHouseGame } from '../../src/guess-house/GuessHouseGame.ts';
import { setupQuizDom } from './helpers/domFixture.ts';

const mockFetch = (data: unknown) => vi.fn(async () => ({
  ok: true,
  json: async () => data,
}));

const characters = [
  { id: '1', name: 'Harry', house: 'Gryffindor', image: 'https://example.com/h.png' },
  { id: '2', name: 'Draco', house: 'Slytherin', image: 'https://example.com/d.png' },
  { id: '3', name: 'Luna', house: 'Ravenclaw', image: 'https://example.com/l.png' },
  { id: '4', name: 'Cedric', house: 'Hufflepuff', image: 'https://example.com/c.png' },
];

async function waitForReady(game: GuessHouseGame) {
  await vi.waitFor(() => {
    expect(game.isReady).toBe(true);
  });
}

describe('GuessHouseGame', () => {
  it('renderRound shows character name and four house choices including correct house', async () => {
    setupQuizDom();
    vi.stubGlobal('fetch', mockFetch(characters));

    const game = new GuessHouseGame();
    await waitForReady(game);
    game.renderRound();

    expect(game.currentCharacter).not.toBeNull();
    expect(document.getElementById('characterName')?.textContent).toBe(game.currentCharacter!.name);

    const buttons = Array.from(document.querySelectorAll('#choices button'));
    expect(buttons).toHaveLength(4);

    const labels = buttons.map((btn) => btn.textContent);
    for (const label of labels) {
      expect(GuessHouseGame.HOUSES as readonly string[]).toContain(label);
    }
    expect(labels).toContain(game.currentCharacter!.house);

    vi.unstubAllGlobals();
  });

  it('filters out characters without a valid Hogwarts house', async () => {
    setupQuizDom();
    vi.stubGlobal('fetch', mockFetch([
      ...characters,
      { id: '5', name: 'Unknown', house: '', image: 'https://example.com/u.png' },
    ]));

    const game = new GuessHouseGame();
    await waitForReady(game);

    expect(game.characters).toHaveLength(4);
    expect(game.characters.every((c) => GuessHouseGame.HOUSES.includes(c.house as typeof GuessHouseGame.HOUSES[number]))).toBe(true);

    vi.unstubAllGlobals();
  });
});
