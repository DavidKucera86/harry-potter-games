// Combining marks left behind by canonical decomposition: 'ě' becomes 'e' + caron, so
// dropping the caron leaves the base letter a player can actually type.
const COMBINING_MARKS = /\p{Mn}/gu;

/**
 * Strips the accent off a letter so the whole Czech alphabet is reachable from an ASCII
 * keyboard. Unicode's own decomposition data does this, and it covers the letters the HP
 * API brings along — `Zoë`, `Fleur` — which a hand-written Czech table did not: those
 * were auto-revealed instead of guessable.
 *
 * Letters with no canonical decomposition (`ß`, `ł`, `æ`) come back unchanged and stay
 * un-guessable, the same as before.
 */
export function normalizeLetter(char: string): string {
  return char.toLowerCase().normalize('NFD').replace(COMBINING_MARKS, '');
}

export function getWordLetters(word: string): string[] {
  return word.split('').filter(ch => ch !== ' ');
}

export function isGuessableLetter(char: string): boolean {
  const normalized = normalizeLetter(char);
  return /^[a-z]$/.test(normalized);
}

export function getAutoRevealedLetters(word: string): Set<string> {
  const revealed = new Set<string>();
  for (const ch of getWordLetters(word)) {
    if (!isGuessableLetter(ch)) {
      revealed.add(normalizeLetter(ch));
    }
  }
  return revealed;
}
