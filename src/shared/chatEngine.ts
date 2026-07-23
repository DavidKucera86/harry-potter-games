import type { Locale } from './i18n/index.js';

/** Maximum length of a player's nickname (characters). */
export const MAX_NICKNAME_LENGTH = 32;

/** A piece of text available in both supported locales. */
export type LocalizedText = Record<Locale, string>;

/** A list of strings (keyword stems or quotes) available in both locales. */
export type LocalizedList = Record<Locale, string[]>;

/** A framing for a relayed answer, in the speaker's own voice, per locale. */
export type DeferralTemplate = Record<Locale, (source: string, quote: string) => string>;

/**
 * A topic in the shared world taxonomy. `keywords` are the word *stems* that
 * trigger it (matched as substrings on a diacritics-stripped form, so inflected
 * forms match). `deferrable` marks world/lore/opinion topics one character may
 * relay from another; personal topics (family, age, one's own name…) are not
 * deferrable and are answered only from the speaker's own quotes.
 */
export interface TopicDef {
  keywords: LocalizedList;
  deferrable: boolean;
}

export type TopicRegistry = Record<string, TopicDef>;

/**
 * A rule-based chat character. `quotes` maps a topic id (from the shared
 * {@link TopicRegistry}) to that character's replies; the optional `general`
 * bucket feeds the no-match fallback. There is no LLM — replies are canned,
 * picked by keyword match, so trust nothing about the input.
 */
export interface ChatCharacter {
  id: string;
  name: LocalizedText;
  title: LocalizedText;
  quotes: Record<string, LocalizedList>;
  fallback: LocalizedList;
  /** Frames a quote relayed from another character ("I don't know, but … said …"). */
  deferral: DeferralTemplate;
}

export type NicknameValidation =
  | { ok: true; value: string }
  | { ok: false; reason: 'empty' | 'tooLong' };

type PickOptions = {
  /** Injectable RNG for deterministic tests; defaults to Math.random. */
  random?: () => number;
  /** Recent reply(ies) to avoid repeating when alternatives exist. */
  exclude?: string | string[];
};

/** Combining diacritical marks (U+0300–U+036F), left over after NFD decomposition. */
const COMBINING_MARKS = /[̀-ͯ]/g;

/** Lowercases text and strips diacritics so matching survives accents/case. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .trim();
}

/** Length of the longest keyword stem that appears in `haystack` (0 if none). */
function bestMatchLength(haystack: string, stems: string[]): number {
  let best = 0;
  for (const stem of stems) {
    const normalized = normalizeText(stem);
    if (normalized && haystack.includes(normalized) && normalized.length > best) {
      best = normalized.length;
    }
  }
  return best;
}

function pickRandom<T>(list: T[], random: () => number): T {
  return list[Math.floor(random() * list.length)];
}

function toExcludeSet(exclude?: string | string[]): Set<string> {
  if (Array.isArray(exclude)) return new Set(exclude);
  return new Set(exclude !== undefined ? [exclude] : []);
}

function pickFrom(candidates: string[], excluded: Set<string>, random: () => number): string {
  const filtered = candidates.filter(reply => !excluded.has(reply));
  const pool = filtered.length > 0 ? filtered : candidates;
  return pickRandom(pool, random);
}

/**
 * Returns the topic ids whose keyword stems appear in `text` for the given
 * locale, in registry order. Substring-based on normalized forms, so inflected
 * words like "smrti" still match the stem "smrt".
 */
export function detectTopics(
  text: string,
  registry: TopicRegistry,
  locale: Locale,
): string[] {
  const haystack = normalizeText(text);

  return Object.entries(registry)
    .filter(([, def]) => bestMatchLength(haystack, def.keywords[locale] ?? []) > 0)
    .map(([id]) => id);
}

/**
 * Picks the single best-matching topic for `text`: the one hit by the *most
 * specific* (longest) keyword, so "temný pán" resolves to Voldemort rather than
 * the broader "temn" fear topic. Ties are broken with `random`. Returns null
 * when nothing matches.
 */
function matchTopic(
  haystack: string,
  registry: TopicRegistry,
  locale: Locale,
  random: () => number,
): string | null {
  const scored = Object.entries(registry)
    .map(([id, def]) => ({ id, length: bestMatchLength(haystack, def.keywords[locale] ?? []) }))
    .filter(entry => entry.length > 0);

  if (scored.length === 0) {
    return null;
  }

  const maxLength = Math.max(...scored.map(entry => entry.length));
  const mostSpecific = scored.filter(entry => entry.length === maxLength);
  return pickRandom(mostSpecific, random).id;
}

/**
 * Resolves a reply for `text` spoken by `speaker`, drawing on the shared topic
 * taxonomy and, when the speaker has nothing to say on a *deferrable* topic, on
 * another character in `roster` (relayed via the speaker's deferral template).
 *
 * Order: the speaker's own quote → a deferred quote from the first other
 * character that knows the topic → the speaker's general/fallback pool. Avoids
 * repeating anything in `exclude` when an alternative exists.
 */
export function resolveReply(
  text: string,
  speaker: ChatCharacter,
  roster: readonly ChatCharacter[],
  registry: TopicRegistry,
  locale: Locale,
  options: PickOptions = {},
): string {
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
        character =>
          character.id !== speaker.id && (character.quotes[topic]?.[locale]?.length ?? 0) > 0,
      );
      if (source) {
        const quote = pickFrom(source.quotes[topic][locale], excluded, random);
        return speaker.deferral[locale](source.name[locale], quote);
      }
    }
  }

  const fallbackPool = [
    ...(speaker.quotes.general?.[locale] ?? []),
    ...speaker.fallback[locale],
  ];
  return pickFrom(fallbackPool, excluded, random);
}

/** Validates and trims a nickname. Rendering is always via textContent, so
 * this only guards emptiness and length — no HTML sanitisation is needed. */
export function validateNickname(raw: string): NicknameValidation {
  const value = raw.trim();
  if (value.length === 0) {
    return { ok: false, reason: 'empty' };
  }
  if (value.length > MAX_NICKNAME_LENGTH) {
    return { ok: false, reason: 'tooLong' };
  }
  return { ok: true, value };
}
