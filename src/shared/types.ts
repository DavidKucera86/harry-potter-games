export type Character = {
  id: string;
  name: string;
  house: string;
  image: string;
};

export type Spell = {
  name: string;
};

export type ModalLine = {
  label?: string;
  value?: string | number;
  text?: string;
  gap?: boolean;
};

export type MessageType = 'info' | 'success' | 'error';

export type HangmanStrings = {
  guessPrompt: string;
  invalidLetter: string;
  letterAlreadyGuessed: (letter: string) => string;
  correct: (letter: string) => string;
  wrong: (letter: string) => string;
  winTitle: string;
  loseTitle: string;
  winLabel: string;
  loseLabel: string;
  scoreLabel: string;
  noWrongLetters: string;
  wrongLettersLabel: string;
};

export type HangmanConfig = {
  fetchFn: () => Promise<unknown>;
  transform: (data: unknown) => string[];
  loadingText: string;
  loadError: string;
  fetchTimeoutError?: string;
  emptyError: string;
  logLabel: string;
  strings: HangmanStrings;
};

export type QuizLastAnswer = Record<string, string>;

export type QuizConfig = {
  transform: (data: Character[]) => Character[];
  minCount?: number;
  emptyError: string;
  prompt: string;
  buildLastAnswer: (character: Character) => QuizLastAnswer;
  getCorrectMessage: (character: Character) => string;
  getWrongMessage: (character: Character) => string;
  buildModalLines: (lastAnswer: QuizLastAnswer, score: number) => ModalLine[];
  bindExtraEvents?: (this: QuizGameLike) => void;
  onBeforeStartNewGame?: (this: QuizGameLike) => void;
};

export type QuizGameLike = {
  failedImageIds?: Set<string>;
  imageErrorCount?: number;
  photoLoadTimeoutId?: ReturnType<typeof setTimeout> | null;
  photoEl?: HTMLImageElement | null;
  clearPhotoLoadTimeout?: () => void;
  handleImageError?: () => void;
};

export type LoadGameDataOptions<T, R> = {
  fetchFn: () => Promise<T>;
  transform: (data: T) => R[];
  minCount?: number;
  emptyError: string;
  logLabel: string;
  assign: (items: R[]) => void;
  onError?: (error: unknown) => void;
};

declare global {
  interface Window {
    __HP_FETCH_TIMEOUT_MS?: number;
  }
}

export {};
