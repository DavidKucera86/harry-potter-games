import { describe, expect, it, vi } from 'vitest';
import { WhoIsOnPhotoGame } from '../../src/who-is-on-photo/WhoIsOnPhotoGame.ts';
import { setupQuizDom } from './helpers/domFixture.ts';

const mockFetch = (data: unknown) => vi.fn(async () => ({
  ok: true,
  json: async () => data,
}));

const characters = [
  { id: '1', name: 'Broken', house: 'Gryffindor', image: 'https://broken.local/a.png' },
  { id: '2', name: 'Harry', house: 'Gryffindor', image: 'https://example.com/h.png' },
  { id: '3', name: 'Ron', house: 'Gryffindor', image: 'https://example.com/r.png' },
  { id: '4', name: 'Hermione', house: 'Gryffindor', image: 'https://example.com/hm.png' },
];

async function waitForReady(game: WhoIsOnPhotoGame) {
  await vi.waitFor(() => {
    expect(game.isReady).toBe(true);
  });
}

describe('WhoIsOnPhotoGame', () => {
  it('skips broken image ids and continues', async () => {
    setupQuizDom(true);
    vi.stubGlobal('fetch', mockFetch(characters));

    const game = new WhoIsOnPhotoGame();
    await waitForReady(game);

    game.currentCharacter = characters[0];
    game.handleImageError();

    expect(game.failedImageIds.has('1')).toBe(true);
    expect(game.imageErrorCount).toBe(1);
    vi.unstubAllGlobals();
  });
});
