export function dedupeWords(words: string[]): string[] {
  const byKey = new Map<string, string>();
  for (const word of words) {
    const key = word.toLowerCase();
    const existing = byKey.get(key);
    if (!existing || word.length > existing.length) {
      byKey.set(key, word);
    }
  }
  return [...byKey.values()];
}

export function filterMinLength(words: string[], minLength: number): string[] {
  return words.filter(w => w.length >= minLength);
}

export function prepareHangmanWords(words: string[], minLength: number): string[] {
  return filterMinLength(dedupeWords(words), minLength);
}
