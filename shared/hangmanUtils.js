const DIACRITIC_MAP = {
  'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e',
  'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's',
  'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
};

export function normalizeLetter(char) {
  const lower = char.toLowerCase();
  return DIACRITIC_MAP[lower] || lower;
}

export function getWordLetters(word) {
  return word.split('').filter(ch => ch !== ' ');
}

export function isGuessableLetter(char) {
  const normalized = normalizeLetter(char);
  return /^[a-z]$/.test(normalized);
}

export function getAutoRevealedLetters(word) {
  const revealed = new Set();
  for (const ch of getWordLetters(word)) {
    if (!isGuessableLetter(ch)) {
      revealed.add(normalizeLetter(ch));
    }
  }
  return revealed;
}
