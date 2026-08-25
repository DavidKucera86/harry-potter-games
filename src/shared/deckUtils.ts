/**
 * The source of randomness is a parameter so tests can drive an exact sequence rather
 * than stub the global — the same shape as `randomMove` in rpsUtils.ts. Callers in the
 * app leave it alone and get `Math.random`.
 */
export function shuffle<T>(array: T[], random: () => number = Math.random): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickFromRemaining<T>(
  remainingItems: T[],
  filterFn?: (item: T) => boolean,
  random: () => number = Math.random,
): { item: T | null; index: number } {
  const eligibleIndices: number[] = [];
  for (let i = 0; i < remainingItems.length; i++) {
    if (!filterFn || filterFn(remainingItems[i])) {
      eligibleIndices.push(i);
    }
  }

  if (eligibleIndices.length === 0) {
    return { item: null, index: -1 };
  }

  const index = eligibleIndices[Math.floor(random() * eligibleIndices.length)];
  return { item: remainingItems[index], index };
}
