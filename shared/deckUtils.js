export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickFromRemaining(remainingItems, filterFn) {
  const pool = filterFn
    ? remainingItems.filter(filterFn)
    : remainingItems;

  if (pool.length === 0) {
    return { item: null, index: -1 };
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  const index = remainingItems.indexOf(picked);
  return { item: picked, index };
}
