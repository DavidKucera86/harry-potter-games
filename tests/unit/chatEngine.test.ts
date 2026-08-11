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

const roster = [sage, pupil];

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
