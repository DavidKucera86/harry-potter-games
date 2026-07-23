import { describe, expect, it } from 'vitest';
import {
  MAX_NICKNAME_LENGTH,
  detectTopics,
  normalizeText,
  resolveReply,
  validateNickname,
  type ChatCharacter,
  type TopicRegistry,
} from '../../src/shared/chatEngine.ts';

const topics: TopicRegistry = {
  laska: { deferrable: true, keywords: { cs: ['lásk', 'cit'], en: ['love', 'heart'] } },
  smrt: { deferrable: true, keywords: { cs: ['smrt', 'umír'], en: ['death', 'dying'] } },
  rodina: { deferrable: false, keywords: { cs: ['rodin', 'bratr'], en: ['family'] } },
  deepLove: { deferrable: true, keywords: { cs: ['láska je oběť'], en: ['love is sacrifice'] } },
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
  it('returns a quote from the matched topic bucket', () => {
    const reply = resolveReply('Řekni mi o smrti', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toBe('Smrt je dobrodružství.');
  });

  it('falls back to general or fallback when no topic matches', () => {
    const pool = [...sage.quotes.general.cs, ...sage.fallback.cs];
    const reply = resolveReply('Nic konkrétního', sage, roster, topics, 'cs', { random: () => 0 });
    expect(pool).toContain(reply);
  });

  it('avoids repeating the excluded (previous) reply when alternatives exist', () => {
    const reply = resolveReply('Mluvme o lásky', sage, roster, topics, 'cs', {
      random: () => 0,
      exclude: 'Láska je mocná.',
    });
    expect(reply).toBe('Cit rozhoduje.');
  });

  it('avoids repeating any of several recent replies passed as an array', () => {
    const reply = resolveReply('Mluvme o lásky', sage, roster, topics, 'cs', {
      random: () => 0,
      exclude: ['Láska je mocná.', 'something else'],
    });
    expect(reply).toBe('Cit rozhoduje.');
  });

  it('still returns a reply when the only candidate equals the excluded one', () => {
    const reply = resolveReply('Řekni mi o smrti', sage, roster, topics, 'cs', {
      random: () => 0,
      exclude: 'Smrt je dobrodružství.',
    });
    expect(reply).toBe('Smrt je dobrodružství.');
  });

  it('uses the requested locale', () => {
    const reply = resolveReply('Tell me about death', sage, roster, topics, 'en', { random: () => 0 });
    expect(reply).toBe('Death is an adventure.');
  });

  it('prefers the topic matched by the most specific (longest) keyword', () => {
    // "láska je oběť" matches both `laska` (lásk) and `deepLove`; the longer
    // keyword wins, so the deepLove bucket is used.
    const reply = resolveReply('řekni mi: láska je oběť', sage, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toBe('Nejhlubší pravda.');
  });
});

describe('resolveReply — cross-character deferral', () => {
  it('answers a deferrable topic from another character, framed in the speaker’s voice', () => {
    // Pupil has no `smrt` quote; smrt is deferrable, so it relays Sage's.
    const reply = resolveReply('Řekni mi o smrti', pupil, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toBe('To nevím, ale Mudrc říká: „Smrt je dobrodružství."');
  });

  it('answers a deferrable topic in the speaker’s own voice when they know it', () => {
    const reply = resolveReply('Mluvme o lásky', pupil, roster, topics, 'cs', { random: () => 0 });
    expect(reply).toBe('Láska? Netuším.');
  });

  it('never relays a non-deferrable (personal) topic — falls back instead', () => {
    // Pupil has no `rodina` quote and rodina is NOT deferrable; must not borrow Sage's family.
    const reply = resolveReply('Máš rodinu nebo bratra?', pupil, roster, topics, 'cs', { random: () => 0 });
    const pool = [...pupil.quotes.general.cs, ...pupil.fallback.cs];
    expect(pool).toContain(reply);
    expect(reply).not.toContain('Mudrc');
    expect(reply).not.toContain('rodina je má');
  });

  it('does not defer to itself — a lone character falls back', () => {
    const reply = resolveReply('Řekni mi o smrti', pupil, [pupil], topics, 'cs', { random: () => 0 });
    const pool = [...pupil.quotes.general.cs, ...pupil.fallback.cs];
    expect(pool).toContain(reply);
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
