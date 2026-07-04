/** Formát: S03.02 — base a index vždy 2 cifry, index od 1 */
export function testId(prefix: string, base: number, index: number): string {
  return `${prefix}${String(base).padStart(2, '0')}.${String(index).padStart(2, '0')}`;
}
