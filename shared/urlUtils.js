function isSafeImageUrl(value) {
  if (typeof value !== "string") {
    return false;
  }
  const url = value.trim();
  if (!url) {
    return false;
  }
  if (url.startsWith("/")) {
    return !url.startsWith("//");
  }
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}
export {
  isSafeImageUrl
};
