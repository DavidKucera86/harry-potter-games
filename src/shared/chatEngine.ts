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
 * Weight used when several topics match one message; compared *before* keyword
 * length, so conversational filler never drowns out a real question ("Dobrý
 * večer, kdo je Fawkes?" is about Fawkes). Opt-in per topic — it must not be
 * derived from `deferrable`, whose personal group also holds very specific
 * topics such as a character's favourite spell.
 */
export const TOPIC_PRIORITY = {
  /** Greetings, thanks, farewells, being hailed by name — always yields. */
  PHATIC: -2,
  /** Small talk — answered only when nothing more substantial was asked. */
  SMALL_TALK: -1,
  /** Implicit default for every topic that does not declare one. */
  NORMAL: 0,
} as const;

/**
 * A topic in the shared world taxonomy. `keywords` are the word *stems* that
 * trigger it (matched as substrings on a diacritics-stripped form, so inflected
 * forms match). `deferrable` marks world/lore/opinion topics one character may
 * relay from another; personal topics (family, age, one's own name…) are not
 * deferrable and are answered only from the speaker's own quotes. `priority`
 * defaults to {@link TOPIC_PRIORITY}.NORMAL.
 */
export interface TopicDef {
  keywords: LocalizedList;
  deferrable: boolean;
  priority?: number;
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

/**
 * A resolved reply together with the topic that produced it. `topic` is null
 * whenever the general/fallback pool answered — including when a topic matched
 * but the speaker had nothing to say about it — so follow-up suggestions never
 * promise depth the character cannot deliver.
 */
export interface ChatResponse {
  text: string;
  topic: string | null;
}

/** How many follow-up questions are offered after a reply. */
export const FOLLOW_UP_COUNT = 3;

/**
 * Suggested next questions: a bespoke set for the topics players actually dig
 * into, plus a shared default pool used for every other topic and for the
 * opening of a conversation.
 */
export interface FollowUpRegistry {
  default: LocalizedList;
  byTopic: Record<string, LocalizedList>;
}

type SuggestOptions = PickOptions & {
  /** How many questions to offer; defaults to {@link FOLLOW_UP_COUNT}. */
  count?: number;
};

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
 * Picks the single best-matching topic for `text`: the highest {@link
 * TOPIC_PRIORITY}, and within it the one hit by the *most specific* (longest)
 * keyword — so "temný pán" resolves to Voldemort rather than the broader "temn"
 * fear topic, and a greeting never outranks the question next to it. Ties are
 * broken with `random`. Returns null when nothing matches.
 */
function matchTopic(
  haystack: string,
  registry: TopicRegistry,
  locale: Locale,
  random: () => number,
): string | null {
  const scored = Object.entries(registry)
    .map(([id, def]) => ({
      id,
      length: bestMatchLength(haystack, def.keywords[locale] ?? []),
      priority: def.priority ?? TOPIC_PRIORITY.NORMAL,
    }))
    .filter(entry => entry.length > 0);

  if (scored.length === 0) {
    return null;
  }

  const maxPriority = Math.max(...scored.map(entry => entry.priority));
  const preferred = scored.filter(entry => entry.priority === maxPriority);
  const maxLength = Math.max(...preferred.map(entry => entry.length));
  const mostSpecific = preferred.filter(entry => entry.length === maxLength);
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
): ChatResponse {
  const random = options.random ?? Math.random;
  const excluded = toExcludeSet(options.exclude);
  const haystack = normalizeText(text);
  const topic = matchTopic(haystack, registry, locale, random);

  if (topic) {
    const own = speaker.quotes[topic]?.[locale];
    if (own && own.length > 0) {
      return { text: pickFrom(own, excluded, random), topic };
    }

    if (registry[topic].deferrable) {
      const source = roster.find(
        character =>
          character.id !== speaker.id && (character.quotes[topic]?.[locale]?.length ?? 0) > 0,
      );
      if (source) {
        const quote = pickFrom(source.quotes[topic][locale], excluded, random);
        return { text: speaker.deferral[locale](source.name[locale], quote), topic };
      }
    }
  }

  const fallbackPool = [
    ...(speaker.quotes.general?.[locale] ?? []),
    ...speaker.fallback[locale],
  ];
  return { text: pickFrom(fallbackPool, excluded, random), topic: null };
}

/**
 * Picks up to `count` distinct follow-up questions for `topic`: its bespoke set
 * first, topped up from the default pool. Questions in `exclude` (compared on
 * the normalized form, so a hand-typed variant counts too) are skipped, and the
 * exclusion is relaxed only if it would otherwise leave the player with an
 * empty or short row of suggestions.
 */
export function suggestFollowUps(
  topic: string | null,
  followUps: FollowUpRegistry,
  locale: Locale,
  options: SuggestOptions = {},
): string[] {
  const count = options.count ?? FOLLOW_UP_COUNT;
  const random = options.random ?? Math.random;
  const excluded = new Set([...toExcludeSet(options.exclude)].map(normalizeText));

  const bespoke = (topic !== null ? followUps.byTopic[topic]?.[locale] : undefined) ?? [];
  const generic = followUps.default[locale];
  const picked: string[] = [];

  const take = (candidates: string[]): void => {
    const remaining = candidates.filter(question => !picked.includes(question));
    while (picked.length < count && remaining.length > 0) {
      picked.push(...remaining.splice(Math.floor(random() * remaining.length), 1));
    }
  };

  // Bespoke questions are drawn first — mixing both pools into one draw would
  // bury a topic's own three questions under the ten generic ones, and the row
  // would show a tailored question barely once in three.
  const allowed = (questions: string[]): string[] =>
    questions.filter(question => !excluded.has(normalizeText(question)));

  take(allowed(bespoke));
  take(allowed(generic));
  take(bespoke);
  take(generic);

  return picked;
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
