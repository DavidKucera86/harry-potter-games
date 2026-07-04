const DIACRITIC_MAP = {
  "\xE1": "a",
  "\u010D": "c",
  "\u010F": "d",
  "\xE9": "e",
  "\u011B": "e",
  "\xED": "i",
  "\u0148": "n",
  "\xF3": "o",
  "\u0159": "r",
  "\u0161": "s",
  "\u0165": "t",
  "\xFA": "u",
  "\u016F": "u",
  "\xFD": "y",
  "\u017E": "z"
};
function normalizeLetter(char) {
  const lower = char.toLowerCase();
  return DIACRITIC_MAP[lower] || lower;
}
function getWordLetters(word) {
  return word.split("").filter((ch) => ch !== " ");
}
function isGuessableLetter(char) {
  const normalized = normalizeLetter(char);
  return /^[a-z]$/.test(normalized);
}
function getAutoRevealedLetters(word) {
  const revealed = /* @__PURE__ */ new Set();
  for (const ch of getWordLetters(word)) {
    if (!isGuessableLetter(ch)) {
      revealed.add(normalizeLetter(ch));
    }
  }
  return revealed;
}
export {
  getAutoRevealedLetters,
  getWordLetters,
  isGuessableLetter,
  normalizeLetter
};
//# sourceMappingURL=hangmanUtils.js.map
