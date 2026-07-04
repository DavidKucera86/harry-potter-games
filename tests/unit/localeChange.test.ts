import { describe, expect, it, vi } from 'vitest';
import { HangmanGame } from '../../src/shared/HangmanGame.ts';
import { QuizGame } from '../../src/shared/QuizGame.ts';
import { setLocale } from '../../src/shared/i18n/index.ts';
import type { Character } from '../../src/shared/types.ts';
import { setupHangmanDom, setupQuizDom } from './helpers/domFixture.ts';

function createHangmanGame() {
  setupHangmanDom();
  let prompt = 'Guess CS';
  return {
    game: new HangmanGame({
      fetchFn: async () => [{ name: 'albus' }],
      transform: data => (data as { name: string }[]).map(item => item.name),
      resolveLoadingText: () => 'Loading',
      resolveLoadError: () => 'Load error',
      resolveEmptyError: () => 'Empty deck',
      logLabel: 'test',
      resolveStrings: () => ({
        guessPrompt: prompt,
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
    }),
    setPrompt(value: string) {
      prompt = value;
    },
  };
}

class TestQuizGame extends QuizGame {
  renderRound() {
    this.currentCharacter = this.characters[0] ?? null;
    if (!this.choicesEl || !this.currentCharacter) return;
    this.choicesEl.replaceChildren();
    const btn = document.createElement('button');
    btn.textContent = 'Choice';
    this.choicesEl.append(btn);
  }
}

async function waitForReady(game: { isReady: boolean }) {
  await vi.waitFor(() => {
    expect(game.isReady).toBe(true);
  });
}

describe('locale change during active games', () => {
  it('updates hangman info prompt after locale change', async () => {
    const { game, setPrompt } = createHangmanGame();
    await waitForReady(game);

    setPrompt('Guess EN');
    setLocale('en');

    expect(document.getElementById('message')?.textContent).toBe('Guess EN');
    setLocale('cs');
  });

  it('updates quiz info prompt after locale change', async () => {
    setupQuizDom();
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [
        { id: '1', name: 'Harry', house: 'Gryffindor', image: 'https://example.com/h.png' },
        { id: '2', name: 'Draco', house: 'Slytherin', image: 'https://example.com/d.png' },
        { id: '3', name: 'Luna', house: 'Ravenclaw', image: 'https://example.com/l.png' },
        { id: '4', name: 'Cedric', house: 'Hufflepuff', image: 'https://example.com/c.png' },
      ] satisfies Character[],
    })));

    let prompt = 'Prompt CS';
    const game = new TestQuizGame({
      transform: data => data,
      resolvePrompt: () => prompt,
      resolveEmptyError: () => 'Not enough',
      buildLastAnswer: character => ({ name: character.name }),
      getCorrectMessage: character => `Correct ${character.name}`,
      getWrongMessage: character => `Wrong ${character.name}`,
      buildModalLines: (lastAnswer, score) => [
        { label: 'Score', value: score },
        { label: 'Name', value: lastAnswer.name },
      ],
    });
    await waitForReady(game);

    prompt = 'Prompt EN';
    setLocale('en');

    expect(document.getElementById('message')?.textContent).toBe('Prompt EN');
    vi.unstubAllGlobals();
    setLocale('cs');
  });
});
