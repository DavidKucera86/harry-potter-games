import { describe, expect, it, vi } from 'vitest';
import { GAME_CONFIG } from '../../src/shared/config.ts';
import { QuizGame } from '../../src/shared/QuizGame.ts';
import type { Character, QuizConfig } from '../../src/shared/types.ts';
import { setupQuizDom } from './helpers/domFixture.ts';

const mockFetch = (data: unknown) => vi.fn(async () => ({
  ok: true,
  json: async () => data,
}));

class TestQuizGame extends QuizGame {
  renderRound() {
    this.currentCharacter = this.characters[0] ?? null;
    if (!this.choicesEl || !this.currentCharacter) return;
    this.choicesEl.replaceChildren();
    const correct = document.createElement('button');
    correct.textContent = 'Correct';
    correct.addEventListener('click', () => this.handleChoice(true, correct));
    const wrong = document.createElement('button');
    wrong.textContent = 'Wrong';
    wrong.addEventListener('click', () => this.handleChoice(false, wrong));
    this.choicesEl.append(correct, wrong);
  }
}

const characters: Character[] = [
  { id: '1', name: 'Harry', house: 'Gryffindor', image: 'https://example.com/h.png' },
  { id: '2', name: 'Draco', house: 'Slytherin', image: 'https://example.com/d.png' },
  { id: '3', name: 'Luna', house: 'Ravenclaw', image: 'https://example.com/l.png' },
  { id: '4', name: 'Cedric', house: 'Hufflepuff', image: 'https://example.com/c.png' },
];

function createConfig(): QuizConfig {
  return {
    transform: data => data,
    resolvePrompt: () => 'Pick one',
    resolveEmptyError: () => 'Not enough',
    buildLastAnswer: character => ({ name: character.name }),
    getCorrectMessage: character => `Correct ${character.name}`,
    getWrongMessage: character => `Wrong ${character.name}`,
    buildModalLines: (lastAnswer, score) => [
      { label: 'Score', value: score },
      { label: 'Name', value: lastAnswer.name },
    ],
  };
}

async function waitForReady(game: QuizGame) {
  await vi.waitFor(() => {
    expect(game.isReady).toBe(true);
  });
}

describe('QuizGame', () => {
  it('increments score on correct answer', async () => {
    vi.useFakeTimers();
    setupQuizDom();
    vi.stubGlobal('fetch', mockFetch(characters));

    const game = new TestQuizGame(createConfig());
    await waitForReady(game);

    const correct = document.querySelector('#choices button') as HTMLButtonElement;
    correct.click();
    await vi.advanceTimersByTimeAsync(GAME_CONFIG.ROUND_DELAY_MS + 10);

    expect(game.score).toBe(1);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('ends game after losing all lives', async () => {
    vi.useFakeTimers();
    setupQuizDom();
    vi.stubGlobal('fetch', mockFetch(characters));

    const game = new TestQuizGame(createConfig());
    await waitForReady(game);
    game.lives = 1;

    const wrong = document.querySelectorAll('#choices button')[1] as HTMLButtonElement;
    wrong.click();
    await vi.advanceTimersByTimeAsync(GAME_CONFIG.ROUND_DELAY_MS + 10);

    expect(game.gameOver).toBe(true);
    expect(document.getElementById('overlay')?.classList.contains('visible')).toBe(true);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});
