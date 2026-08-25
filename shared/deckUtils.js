function shuffle(array, random = Math.random) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function pickFromRemaining(remainingItems, filterFn, random = Math.random) {
  const eligibleIndices = [];
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
export {
  pickFromRemaining,
  shuffle
};
