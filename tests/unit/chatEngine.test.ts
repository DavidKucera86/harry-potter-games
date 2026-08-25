import { describe, expect, it } from 'vitest';
import {
  FOLLOW_UP_COUNT,
  MAX_NICKNAME_LENGTH,
  TOPIC_PRIORITY,
  detectTopics,
  normalizeText,
  resolveReply,
  suggestFollowUps,
  validateNickname,
  type ChatCharacter,
  type FollowUpRegistry,
  type TopicRegistry,
} from '../../src/shared/chatEngine.ts';

const topics: TopicRegistry = {
  laska: { deferrable: true, keywords: { cs: ['lásk', 'cit'], en: ['love', 'heart'] } },
  smrt: { deferrable: true, keywords: { cs: ['smrt', 'umír'], en: ['death', 'dying'] } },
  rodina: { deferrable: false, keywords: { cs: ['rodin', 'bratr'], en: ['family'] } },
  deepLove: { deferrable: true, keywords: { cs: ['láska je oběť'], en: ['love is sacrifice'] } },
  pozdrav: {
    deferrable: false,
    priority: TOPIC_PRIORITY.PHATIC,
    keywords: { cs: ['dobrý večer'], en: ['good evening'] },
  },
  jaksemas: {
    deferrable: false,
    priority: TOPIC_PRIORITY.SMALL_TALK,
    keywords: { cs: ['jak se máš'], en: ['how are you'] },
  },
};

const sage: ChatCharacter = {
  id: 'sage',
  name: { cs: 'Mudrc', en: 'Sage' },
  title: { cs: 'Zkušební mudrc', en: 'Test Sage' },
  deferral: {
    cs: (source, quote) => `Nevím. ${source}: „${quote}"`,
    en: (source, quote) => `I don't know. ${source}: “${quote}”`,
  },
  quotes: {
    general: { cs: ['Obecná moudrost.'], en: ['General wisdom.'] },
    laska: { cs: ['Láska je mocná.', 'Cit rozhoduje.'], en: ['Love is powerful.', 'Feeling decides.'] },
    smrt: { cs: ['Smrt je dobrodružství.'], en: ['Death is an adventure.'] },
    rodina: { cs: ['Má rodina je má.'], en: ['My family is mine.'] },
    deepLove: { cs: ['Nejhlubší pravda.'], en: ['The deepest truth.'] },
    pozdrav: { cs: ['Dobrý večer.'], en: ['Good evening.'] },
    jaksemas: { cs: ['Daří se mi dobře.'], en: ['I am well.'] },
  },
  fallback: { cs: ['Zvláštní otázka…'], en: ['A curious question…'] },
};

const pupil: ChatCharacter = {
  id: 'pupil',
  name: { cs: 'Žák', en: 'Pupil' },
  title: { cs: 'Zkušební žák', en: 'Test Pupil' },
  deferral: {
    cs: (source, quote) => `To nevím, ale ${source} říká: „${quote}"`,
    en: (source, quote) => `I don't know, but ${source} says: “${quote}”`,
  },
  quotes: {
    general: { cs: ['Hmm.'], en: ['Hmm.'] },
    laska: { cs: ['Láska? Netuším.'], en: ['Love? Dunno.'] },
  },
  fallback: { cs: ['Netuším.'], en: ['No idea.'] },
};

/**
 * Knows nothing about `smrt`, and stands *before* the character who does. Without it
 * every deferral test asks a roster whose first candidate is already the right answer,
 * which is a search that never has to search.
 */
const novice: ChatCharacter = {
  id: 'novice',
  name: { cs: 'Nováček', en: 'Novice' },
  title: { cs: 'Zkušební nováček', en: 'Test Novice' },
  deferral: {
    cs: (source, quote) => `Ptej se jinde. ${source}: „${quote}"`,
    en: (source, quote) => `Ask elsewhere. ${source}: “${quote}”`,
  },
  quotes: {
    general: { cs: ['Nevím.'], en: ['Dunno.'] },
  },
  fallback: { cs: ['Nevím.'], en: ['Dunno.'] },
};

/**
 * Two shapes the fixtures never had: a topic bucket that exists but is empty, and no
 * `general` pool at all. Both are reachable — a character may be written with a bucket
 * later emptied, and `general` is optional — and both change which pool answers.
 */
const hermit: ChatCharacter = {
  id: 'hermit',
  name: { cs: 'Poustevník', en: 'Hermit' },
  title: { cs: 'Zkušební poustevník', en: 'Test Hermit' },
  deferral: {
    cs: (source, quote) => `Slyšel jsem od ${source}: „${quote}"`,
    en: (source, quote) => `I heard from ${source}: “${quote}”`,
  },
  quotes: {
    // Empty on purpose: present, but with nothing to say.
    laska: { cs: [], en: [] },
  },
  fallback: { cs: ['Mlčím.'], en: ['I stay silent.'] },
};

const roster = [sage, pupil];
const rosterWithNovice = [novice, sage, pupil];

describe('normalizeText', () => {
  it('lowercases and strips Czech diacritics', () => {
    expect(normalizeText('LÁSKA a Smrt')).toBe('laska a smrt');
    expect(normalizeText('Řeřicha ŽÍŽALA')).toBe('rericha zizala');
  });

  it('trims and collapses to a comparable form', () => {
    expect(normalizeText('  Ěščřžý  ')).toBe('escrzy');
  });
});

describe('detectTopics', () => {
  it('matches an inflected Czech word via its stem', () => {
    expect(detectTopics('Povídej mi o lásky a citech', topics, 'cs')).toContain('laska');
  });

  it('matches regardless of diacritics and case', () => {
    expect(detectTopics('Bojim se SMRTI', topics, 'cs')).toContain('smrt');
  });

  it('matches English keywords for the en locale', () => {
    expect(detectTopics('Tell me about death', topics, 'en')).toContain('smrt');
  });

  it('returns an empty list when nothing matches', () => {
    expect(detectTopics('Jaké je počasí?', topics, 'cs')).toEqual([]);
  });

  it('does not match a different locale keyword set', () => {
    expect(detectTopics('death', topics, 'cs')).toEqual([]);
  });
});

describe('resolveReply — own quotes', () => {
  it('returns a quote from the matched topic bucket, with the topic it came from', () => {
    const reply = resolveReply('Řekni mi o smrti', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toEqual({ text: 'Smrt je dobrodružství.', topic: 'smrt' });
  });

  it('falls back to general or fallback when no topic matches, reporting a null topic', () => {
    const pool = [...sage.quotes.general.cs, ...sage.fallback.cs];
    const reply = resolveReply('Nic konkrétního', sage, roster, topics, 'cs', { random: () => 0 });
    expect(pool).toContain(reply.text);
    expect(reply.topic).toBeNull();
  });

  it('reports a null topic when the matched topic has no quote to answer with', () => {
    // Pupil knows no `rodina` quote and rodina is not deferrable — the fallback
    // pool answers, so suggestions must not promise depth on that topic.
    const reply = resolveReply('Máš rodinu?', pupil, roster, topics, 'cs', { random: () => 0 });
    expect(reply.topic).toBeNull();
  });

  it('skips a character who has nothing on the topic and keeps looking', () => {
    // Novice comes first and knows no `smrt`. Reaching for him — or trusting the roster
    // order — hands the deferral template a quote that does not exist.
    const reply = resolveReply('Řekni mi o smrti', pupil, rosterWithNovice, topics, 'cs', {
      random: () => 0,
    });
    expect(reply).toEqual({
      text: 'To nevím, ale Mudrc říká: „Smrt je dobrodružství."',
      topic: 'smrt',
    });
  });

  it('answers from its own fallback when nobody in the roster knows the topic', () => {
    const reply = resolveReply('Řekni mi o smrti', novice, [novice], topics, 'cs', {
      random: () => 0,
    });
    expect([...novice.quotes.general.cs, ...novice.fallback.cs]).toContain(reply.text);
    expect(reply.topic).toBeNull();
  });

  it('reaches the last quote in a bucket, not only the first', () => {
    // `random() * pool.length` is what spreads the pick. Mutate the `*` and every
    // player hears the same first line for a topic, forever.
    const first = resolveReply('Co je láska?', sage, roster, topics, 'cs', { random: () => 0 });
    const last = resolveReply('Co je láska?', sage, roster, topics, 'cs', { random: () => 0.999 });
    expect(first.text).toBe(sage.quotes.laska.cs[0]);
    expect(last.text).toBe(sage.quotes.laska.cs[sage.quotes.laska.cs.length - 1]);
    expect(first.text).not.toBe(last.text);
  });

  it('treats an empty topic bucket as nothing to say, not as an answer', () => {
    // `own` is truthy here — an empty array is — so only the length check stands
    // between the player and a pick from an empty pool.
    const reply = resolveReply('Co je láska?', hermit, [hermit, sage], topics, 'cs', {
      random: () => 0,
    });
    // The topic matched and the bucket is empty, so the answer comes from the roster —
    // relayed, not picked out of nothing.
    expect(reply).toEqual({
      text: 'Slyšel jsem od Mudrc: „Láska je mocná."',
      topic: 'laska',
    });
  });

  it('answers from the fallback alone when the speaker has no general pool', () => {
    // `quotes.general` is optional. Without the guard this spreads `undefined` into the
    // pool and the pick lands on nothing.
    const reply = resolveReply('Něco úplně jiného', hermit, [hermit], topics, 'cs', {
      random: () => 0,
    });
    expect(reply).toEqual({ text: 'Mlčím.', topic: null });
  });

  it('avoids repeating the excluded (previous) reply when alternatives exist', () => {
    const reply = resolveReply('Mluvme o lásky', sage, roster, topics, 'cs', {
      random: () => 0,
      exclude: 'Láska je mocná.',
    });
    expect(reply.text).toBe('Cit rozhoduje.');
  });

  it('avoids repeating any of several recent replies passed as an array', () => {
    const reply = resolveReply('Mluvme o lásky', sage, roster, topics, 'cs', {
      random: () => 0,
      exclude: ['Láska je mocná.', 'something else'],
    });
    expect(reply.text).toBe('Cit rozhoduje.');
  });

  it('still returns a reply when the only candidate equals the excluded one', () => {
    const reply = resolveReply('Řekni mi o smrti', sage, roster, topics, 'cs', {
      random: () => 0,
      exclude: 'Smrt je dobrodružství.',
    });
    expect(reply.text).toBe('Smrt je dobrodružství.');
  });

  it('uses the requested locale', () => {
    const reply = resolveReply('Tell me about death', sage, roster, topics, 'en', { random: () => 0 });
    expect(reply.text).toBe('Death is an adventure.');
  });

  it('prefers the topic matched by the most specific (longest) keyword', () => {
    // "láska je oběť" matches both `laska` (lásk) and `deepLove`; the longer
    // keyword wins, so the deepLove bucket is used.
    const reply = resolveReply('řekni mi: láska je oběť', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toEqual({ text: 'Nejhlubší pravda.', topic: 'deepLove' });
  });
});

describe('resolveReply — topic priority', () => {
  it('lets a substantive question beat a phatic greeting in the same message', () => {
    // "dobrý večer" (11 chars) is longer than "cit" (3), so keyword length alone
    // would answer the greeting and drop the actual question.
    const reply = resolveReply('Dobrý večer, co je cit?', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply.topic).toBe('laska');
  });

  it('lets small talk beat a phatic greeting', () => {
    const reply = resolveReply('Dobrý večer, jak se máš?', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply.topic).toBe('jaksemas');
  });

  it('still answers a phatic message when nothing more substantial was asked', () => {
    const reply = resolveReply('Dobrý večer!', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toEqual({ text: 'Dobrý večer.', topic: 'pozdrav' });
  });

  it('falls back to the longest keyword within the same priority', () => {
    const reply = resolveReply('Dobrý večer, jak se máš? A co cit?', sage, roster, topics, 'cs', {
      random: () => 0,
    });
    // Both `laska` and `jaksemas` match, but only `jaksemas` is de-prioritised.
    expect(reply.topic).toBe('laska');
  });

  it('treats a topic without an explicit priority as normal', () => {
    const reply = resolveReply('Bojím se smrti a citů', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply.topic).toBe('smrt');
  });
});

describe('resolveReply — cross-character deferral', () => {
  it('answers a deferrable topic from another character, framed in the speaker’s voice', () => {
    // Pupil has no `smrt` quote; smrt is deferrable, so it relays Sage's.
    const reply = resolveReply('Řekni mi o smrti', pupil, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toEqual({ text: 'To nevím, ale Mudrc říká: „Smrt je dobrodružství."', topic: 'smrt' });
  });

  it('answers a deferrable topic in the speaker’s own voice when they know it', () => {
    const reply = resolveReply('Mluvme o lásky', pupil, roster, topics, 'cs', { random: () => 0 });
    expect(reply.text).toBe('Láska? Netuším.');
  });

  it('never relays a non-deferrable (personal) topic — falls back instead', () => {
    // Pupil has no `rodina` quote and rodina is NOT deferrable; must not borrow Sage's family.
    const reply = resolveReply('Máš rodinu nebo bratra?', pupil, roster, topics, 'cs', { random: () => 0 });
    const pool = [...pupil.quotes.general.cs, ...pupil.fallback.cs];
    expect(pool).toContain(reply.text);
    expect(reply.text).not.toContain('Mudrc');
    expect(reply.text).not.toContain('rodina je má');
  });

  it('does not defer to itself — a lone character falls back', () => {
    const reply = resolveReply('Řekni mi o smrti', pupil, [pupil], topics, 'cs', { random: () => 0 });
    const pool = [...pupil.quotes.general.cs, ...pupil.fallback.cs];
    expect(pool).toContain(reply.text);
  });
});

const followUps: FollowUpRegistry = {
  default: {
    cs: ['Co je smrt?', 'Kdo je Fawkes?', 'Máš rodinu?', 'Co je láska?'],
    en: ['What is death?', 'Who is Fawkes?', 'Do you have a family?', 'What is love?'],
  },
  byTopic: {
    laska: {
      cs: ['Je láska oběť?', 'Proč láska chrání?', 'Cítil jsi lásku?'],
      en: ['Is love sacrifice?', 'Why does love protect?', 'Have you felt love?'],
    },
    smrt: { cs: ['Bojíš se smrti?'], en: ['Do you fear death?'] },
  },
};

describe('suggestFollowUps', () => {
  it('offers the bespoke set of a topic that has one', () => {
    const questions = suggestFollowUps('laska', followUps, 'cs', { random: () => 0 });
    expect(questions).toEqual(followUps.byTopic.laska.cs);
  });

  it('always draws the bespoke set before the default pool', () => {
    // `random: () => 0` alone would not catch a shared draw: with the two pools
    // merged, a topic's own questions surface in barely a third of the row.
    for (const value of [0, 0.25, 0.5, 0.75, 0.99]) {
      const questions = suggestFollowUps('laska', followUps, 'cs', { random: () => value });
      expect([...questions].sort()).toEqual([...followUps.byTopic.laska.cs].sort());
    }
  });

  it('falls back to the default pool for a null topic', () => {
    const questions = suggestFollowUps(null, followUps, 'cs', { random: () => 0 });
    expect(questions).toEqual(['Co je smrt?', 'Kdo je Fawkes?', 'Máš rodinu?']);
  });

  it('falls back to the default pool for a topic with no bespoke set', () => {
    const questions = suggestFollowUps('rodina', followUps, 'cs', { random: () => 0 });
    expect(questions).toHaveLength(FOLLOW_UP_COUNT);
    questions.forEach(question => expect(followUps.default.cs).toContain(question));
  });

  it('tops a short bespoke set up from the default pool', () => {
    const questions = suggestFollowUps('smrt', followUps, 'cs', { random: () => 0 });
    expect(questions[0]).toBe('Bojíš se smrti?');
    expect(questions).toHaveLength(FOLLOW_UP_COUNT);
    expect(new Set(questions).size).toBe(FOLLOW_UP_COUNT);
  });

  it('uses the requested locale', () => {
    expect(suggestFollowUps('laska', followUps, 'en', { random: () => 0 })).toEqual(
      followUps.byTopic.laska.en,
    );
  });

  it('never offers a question the player already asked', () => {
    const questions = suggestFollowUps('laska', followUps, 'cs', {
      random: () => 0,
      exclude: ['Je láska oběť?'],
    });
    expect(questions).not.toContain('Je láska oběť?');
    expect(questions).toHaveLength(FOLLOW_UP_COUNT);
  });

  it('accepts a single exclusion as a plain string, not only as an array', () => {
    // The signature is `string | string[]`, and every test so far passed an array —
    // so the string branch could return anything at all and nobody would notice.
    const questions = suggestFollowUps('laska', followUps, 'cs', {
      random: () => 0,
      exclude: 'Je láska oběť?',
    });
    expect(questions).not.toContain('Je láska oběť?');
    expect(questions).toHaveLength(FOLLOW_UP_COUNT);
  });

  it('compares exclusions without case or diacritics', () => {
    const questions = suggestFollowUps('laska', followUps, 'cs', {
      random: () => 0,
      exclude: ['  JE LASKA OBET?  '],
    });
    expect(questions).not.toContain('Je láska oběť?');
  });

  it('still offers a full set when every question was already asked', () => {
    const questions = suggestFollowUps('laska', followUps, 'cs', {
      random: () => 0,
      exclude: [...followUps.byTopic.laska.cs, ...followUps.default.cs],
    });
    expect(questions).toHaveLength(FOLLOW_UP_COUNT);
    expect(new Set(questions).size).toBe(FOLLOW_UP_COUNT);
  });

  // Relaxing the exclusion must not also relax the ordering. Both of the unfiltered
  // top-ups are load-bearing, and asserting only the row's length cannot tell them
  // apart: drop either one and the player still gets three questions.
  it('keeps the topic its own questions even once every one was already asked', () => {
    const questions = suggestFollowUps('laska', followUps, 'cs', {
      random: () => 0,
      exclude: [...followUps.byTopic.laska.cs, ...followUps.default.cs],
    });
    // Without the bespoke top-up the row silently turns generic — the dead end the
    // per-topic sets exist to prevent (see the content invariants in CLAUDE.md).
    expect([...questions].sort()).toEqual([...followUps.byTopic.laska.cs].sort());
  });

  it('tops a short bespoke set up from the default pool even once every one was asked', () => {
    const questions = suggestFollowUps('smrt', followUps, 'cs', {
      random: () => 0,
      exclude: [...followUps.byTopic.smrt.cs, ...followUps.default.cs],
    });
    // 'smrt' owns a single question, so without the generic top-up the row goes short —
    // and a short row is exactly what the doc comment promises never to hand the player.
    expect(questions).toHaveLength(FOLLOW_UP_COUNT);
    expect(questions[0]).toBe('Bojíš se smrti?');
    expect(questions.slice(1).every(q => followUps.default.cs.includes(q))).toBe(true);
  });

  it('draws follow-ups from across the pool, not always the first one left', () => {
    // `random() * remaining.length` is what spreads the draw. Mutate the `*` and every
    // round offers the same three questions in the same order, for every player.
    const first = suggestFollowUps(null, followUps, 'cs', { count: 1, random: () => 0 });
    const last = suggestFollowUps(null, followUps, 'cs', { count: 1, random: () => 0.999 });
    expect(first).toEqual([followUps.default.cs[0]]);
    expect(last).toEqual([followUps.default.cs[followUps.default.cs.length - 1]]);
  });

  it('honours an explicit count', () => {
    expect(suggestFollowUps(null, followUps, 'cs', { count: 2, random: () => 0 })).toHaveLength(2);
  });

  it('returns fewer than requested only when the registry cannot supply more', () => {
    const sparse: FollowUpRegistry = { default: { cs: ['Jediná otázka?'], en: ['Only one?'] }, byTopic: {} };
    expect(suggestFollowUps(null, sparse, 'cs', { random: () => 0 })).toEqual(['Jediná otázka?']);
  });
});

describe('validateNickname', () => {
  it('accepts a trimmed non-empty nickname', () => {
    expect(validateNickname('  Harry  ')).toEqual({ ok: true, value: 'Harry' });
  });

  it('rejects an empty or whitespace-only nickname', () => {
    expect(validateNickname('')).toEqual({ ok: false, reason: 'empty' });
    expect(validateNickname('   ')).toEqual({ ok: false, reason: 'empty' });
  });

  it('rejects a nickname longer than the maximum', () => {
    const tooLong = 'x'.repeat(MAX_NICKNAME_LENGTH + 1);
    expect(validateNickname(tooLong)).toEqual({ ok: false, reason: 'tooLong' });
  });

  it('accepts a nickname exactly at the maximum length', () => {
    const exact = 'x'.repeat(MAX_NICKNAME_LENGTH);
    expect(validateNickname(exact)).toEqual({ ok: true, value: exact });
  });
});
