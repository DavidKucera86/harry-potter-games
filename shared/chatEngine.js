const MAX_NICKNAME_LENGTH = 32;
const COMBINING_MARKS = /[̀-ͯ]/g;
function normalizeText(text) {
  return text.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase().trim();
}
function bestMatchLength(haystack, stems) {
  let best = 0;
  for (const stem of stems) {
    const normalized = normalizeText(stem);
    if (normalized && haystack.includes(normalized) && normalized.length > best) {
      best = normalized.length;
    }
  }
  return best;
}
function pickRandom(list, random) {
  return list[Math.floor(random() * list.length)];
}
function toExcludeSet(exclude) {
  if (Array.isArray(exclude)) return new Set(exclude);
  return new Set(exclude !== void 0 ? [exclude] : []);
}
function pickFrom(candidates, excluded, random) {
  const filtered = candidates.filter((reply) => !excluded.has(reply));
  const pool = filtered.length > 0 ? filtered : candidates;
  return pickRandom(pool, random);
}
function detectTopics(text, registry, locale) {
  const haystack = normalizeText(text);
  return Object.entries(registry).filter(([, def]) => bestMatchLength(haystack, def.keywords[locale] ?? []) > 0).map(([id]) => id);
}
function matchTopic(haystack, registry, locale, random) {
  const scored = Object.entries(registry).map(([id, def]) => ({ id, length: bestMatchLength(haystack, def.keywords[locale] ?? []) })).filter((entry) => entry.length > 0);
  if (scored.length === 0) {
    return null;
  }
  const maxLength = Math.max(...scored.map((entry) => entry.length));
  const mostSpecific = scored.filter((entry) => entry.length === maxLength);
  return pickRandom(mostSpecific, random).id;
}
function resolveReply(text, speaker, roster, registry, locale, options = {}) {
  const random = options.random ?? Math.random;
  const excluded = toExcludeSet(options.exclude);
  const haystack = normalizeText(text);
  const topic = matchTopic(haystack, registry, locale, random);
  if (topic) {
    const own = speaker.quotes[topic]?.[locale];
    if (own && own.length > 0) {
      return pickFrom(own, excluded, random);
    }
    if (registry[topic].deferrable) {
      const source = roster.find(
        (character) => character.id !== speaker.id && (character.quotes[topic]?.[locale]?.length ?? 0) > 0
      );
      if (source) {
        const quote = pickFrom(source.quotes[topic][locale], excluded, random);
        return speaker.deferral[locale](source.name[locale], quote);
      }
    }
  }
  const fallbackPool = [
    ...speaker.quotes.general?.[locale] ?? [],
    ...speaker.fallback[locale]
  ];
  return pickFrom(fallbackPool, excluded, random);
}
function validateNickname(raw) {
  const value = raw.trim();
  if (value.length === 0) {
    return { ok: false, reason: "empty" };
  }
  if (value.length > MAX_NICKNAME_LENGTH) {
    return { ok: false, reason: "tooLong" };
  }
  return { ok: true, value };
}
export {
  MAX_NICKNAME_LENGTH,
  detectTopics,
  normalizeText,
  resolveReply,
  validateNickname
};
