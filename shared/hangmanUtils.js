const COMBINING_MARKS = /\p{Mn}/gu;
function normalizeLetter(char) {
  return char.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "");
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
