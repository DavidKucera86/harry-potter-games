import { describe, expect, it, vi } from 'vitest';
import { HangmanGame } from '../../src/shared/HangmanGame.ts';
import { setupHangmanDom } from './helpers/domFixture.ts';

function createHangmanGame(words = ['albus']) {
  setupHangmanDom();
  return new HangmanGame({
    fetchFn: async () => words.map(name => ({ name })),
    transform: data => (data as { name: string }[]).map(item => item.name),
    resolveLoadingText: () => 'Loading',
    resolveLoadError: () => 'Load error',
    resolveEmptyError: () => 'Empty deck',
    logLabel: 'test',
    resolveStrings: () => ({
      guessPrompt: 'Guess',
      invalidLetter: 'Invalid',
      letterAlreadyGuessed: (letter) => `Duplicate ${letter}`,
      correct: (letter) => `Correct ${letter}`,
      wrong: (letter) => `Wrong ${letter}`,
      winTitle: 'Win',
      loseTitle: 'Lose',
      winLabel: 'Win',
      loseLabel: 'Lose',
      scoreLabel: 'Score',
      noWrongLetters: '—',
      wrongLettersLabel: 'Wrong',
    }),
  });
}

async function waitForReady(game: HangmanGame) {
  await vi.waitFor(() => {
    expect(game.isReady).toBe(true);
  });
}

async function flushAnimationFrames(count = 2) {
  for (let i = 0; i < count; i++) {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
}

describe('HangmanGame', () => {
  it('guessLetter rejects invalid input', async () => {
    const game = createHangmanGame();
    await waitForReady(game);
    game.guessLetter('1');
    expect(document.getElementById('message')?.textContent).toBe('Invalid');
  });

  it('guessLetter wins when word is complete', async () => {
    const game = createHangmanGame(['ab']);
    await waitForReady(game);
    game.guessLetter('a');
    game.guessLetter('b');
    expect(game.gameOver).toBe(true);
    expect(document.getElementById('modalTitle')?.textContent).toBe('Win');
  });

  it('Enter on winning letter keeps modal visible', async () => {
    const game = createHangmanGame(['ab']);
    await waitForReady(game);
    game.guessLetter('a');

    const input = document.getElementById('letterInput') as HTMLInputElement;
    input.value = 'b';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

    await flushAnimationFrames();

    expect(game.gameOver).toBe(true);
    expect(game.score).toBe(1);
    expect(document.getElementById('overlay')?.classList.contains('visible')).toBe(true);
    expect(document.getElementById('modalTitle')?.textContent).toBe('Win');
    expect(game.currentWord).toBe('ab');
  });

  it('auto-reveals special characters', async () => {
    const game = createHangmanGame(["o'b"]);
    await waitForReady(game);
    expect(document.querySelectorAll('#wordDisplay .letter-slot.revealed').length).toBeGreaterThan(0);
  });

  it('shows empty deck error when pickFromDeck returns null', async () => {
    const game = createHangmanGame(['albus']);
    await waitForReady(game);
    game.words = [];
    game.deckSource = [];
    game.remainingItems = [];
    game.isReady = true;
    await game.startNewGame();
    expect(document.getElementById('message')?.textContent).toBe('Empty deck');
  });
});
