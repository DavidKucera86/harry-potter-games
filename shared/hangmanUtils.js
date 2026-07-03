export function normalizeLetter(char) {
  const map = {
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e',
    'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's',
    'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
  };
  const lower = char.toLowerCase();
  return map[lower] || lower;
}

export function isGuessableChar(ch) {
  return /^[a-z]$/.test(normalizeLetter(ch));
}

export function getGuessableLetters(word) {
  return word.split('').filter(isGuessableChar);
}
