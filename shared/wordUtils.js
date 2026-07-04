export function dedupeWords(words) {
  const byKey = new Map();
  for (const word of words) {
    const key = word.toLowerCase();
    const existing = byKey.get(key);
    if (!existing || word.length > existing.length) {
      byKey.set(key, word);
    }
  }
  return [...byKey.values()];
}

export function filterMinLength(words, minLength) {
  return words.filter(w => w.length >= minLength);
}

export function prepareHangmanWords(words, minLength) {
  return filterMinLength(dedupeWords(words), minLength);
}
