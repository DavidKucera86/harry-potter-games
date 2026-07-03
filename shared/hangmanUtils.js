function normalizeLetter(char) {
  const map = {
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e',
    'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's',
    'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z'
  };
  const lower = char.toLowerCase();
  return map[lower] || lower;
}

function getWordLetters(word) {
  return word.split('').filter(ch => ch !== ' ');
}
