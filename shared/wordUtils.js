function dedupeWords(words) {
  const byKey = /* @__PURE__ */ new Map();
  for (const word of words) {
    const key = word.toLowerCase();
    const existing = byKey.get(key);
    if (!existing || word.length > existing.length) {
      byKey.set(key, word);
    }
  }
  return [...byKey.values()];
}
function filterMinLength(words, minLength) {
  return words.filter((w) => w.length >= minLength);
}
function prepareHangmanWords(words, minLength) {
  return filterMinLength(dedupeWords(words), minLength);
}
export {
  dedupeWords,
  filterMinLength,
  prepareHangmanWords
};
//# sourceMappingURL=wordUtils.js.map
