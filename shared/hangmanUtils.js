export function normalizeLetter(char) {
  return char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function getWordLetters(word) {
  return word.split('').filter(ch => ch !== ' ');
}
