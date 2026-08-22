const IGNORED_BY_URL_PARSER = /[\t\n\r]/g;
function asTheParserSeesIt(value) {
  return value.replace(IGNORED_BY_URL_PARSER, "").trim();
}
function isSafeImageUrl(value) {
  if (typeof value !== "string") {
    return false;
  }
  const url = asTheParserSeesIt(value);
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
