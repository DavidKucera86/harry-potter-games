function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function pickFromRemaining(remainingItems, filterFn) {
  const eligibleIndices = [];
  for (let i = 0; i < remainingItems.length; i++) {
    if (!filterFn || filterFn(remainingItems[i])) {
      eligibleIndices.push(i);
    }
  }
  if (eligibleIndices.length === 0) {
    return { item: null, index: -1 };
  }
  const index = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
  return { item: remainingItems[index], index };
}
export {
  pickFromRemaining,
  shuffle
};
