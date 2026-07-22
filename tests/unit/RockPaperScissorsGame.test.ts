import { afterEach, describe, expect, it, vi } from 'vitest';
import { RockPaperScissorsGame } from '../../src/rock-paper-scissors/RockPaperScissorsGame.ts';
import { GAME_CONFIG } from '../../src/shared/config.ts';
import { setupRpsDom } from './helpers/domFixture.ts';

const characters = [
  { id: '1', name: 'Harry', house: 'Gryffindor', image: 'https://example.com/h.png' },
  { id: '2', name: 'Draco', house: 'Slytherin', image: 'https://example.com/d.png' },
  { id: '3', name: 'Luna', house: 'Ravenclaw', image: 'https://example.com/l.png' },
];

const mockFetch = (data: unknown) => vi.fn(async () => ({
  ok: true,
  json: async () => data,
}));

// With Math.random() === 0 the opponent always throws 'rock'.
async function newReadyGame() {
  setupRpsDom();
  vi.stubGlobal('fetch', mockFetch(characters));
  const game = new RockPaperScissorsGame();
  await vi.waitFor(() => {
    expect(game.isReady).toBe(true);
  });
  return game;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('RockPaperScissorsGame', () => {
  it('becomes ready and renders three move buttons', async () => {
    const game = await newReadyGame();
    expect(game.movesEl?.querySelectorAll('button')).toHaveLength(3);
    expect(game.getMessageType()).toBe('info');
  });

  it('scores a win when the player beats the opponent', async () => {
    const game = await newReadyGame();
    vi.spyOn(Math, 'random').mockReturnValue(0); // opponent -> rock

    game.handleMove('paper'); // paper beats rock

    expect(game.playerWins).toBe(1);
    expect(game.opponentWins).toBe(0);
    expect(game.getMessageType()).toBe('success');
    expect(game.revealEl?.hasAttribute('hidden')).toBe(false);
    expect(game.playerScoreEl?.textContent).toBe('1');
  });

  it('gives the round to the opponent when the player loses', async () => {
    const game = await newReadyGame();
    vi.spyOn(Math, 'random').mockReturnValue(0); // opponent -> rock

    game.handleMove('scissors'); // scissors lose to rock

    expect(game.playerWins).toBe(0);
    expect(game.opponentWins).toBe(1);
    expect(game.getMessageType()).toBe('error');
  });

  it('leaves the score unchanged on a tie', async () => {
    const game = await newReadyGame();
    vi.spyOn(Math, 'random').mockReturnValue(0); // opponent -> rock

    game.handleMove('rock'); // rock ties rock

    expect(game.playerWins).toBe(0);
    expect(game.opponentWins).toBe(0);
    expect(game.getMessageType()).toBe('info');
  });

  it('schedules the match end once a side reaches the win target', async () => {
    const game = await newReadyGame();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    game.playerWins = GAME_CONFIG.WINS_TO_MATCH - 1;

    game.handleMove('paper');

    expect(game.playerWins).toBe(GAME_CONFIG.WINS_TO_MATCH);
    expect(game.roundTimeoutId).not.toBeNull();
    expect(game.gameOver).toBe(false);
  });

  it('opens the win modal when the match ends in a win', async () => {
    const game = await newReadyGame();
    game.currentOpponent = characters[0];
    game.playerWins = GAME_CONFIG.WINS_TO_MATCH;

    game.endMatch(true);

    expect(game.gameOver).toBe(true);
    expect(game.isModalOpen()).toBe(true);
    expect(game.modalIcon?.textContent).toBe('🏆');
    expect(game.modalTitle?.textContent).toBeTruthy();
  });

  it('ignores moves after the match is over', async () => {
    const game = await newReadyGame();
    game.gameOver = true;

    game.handleMove('paper');

    expect(game.playerWins).toBe(0);
  });
});
