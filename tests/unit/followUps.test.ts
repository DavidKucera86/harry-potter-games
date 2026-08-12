import { describe, expect, it } from 'vitest';
import { FOLLOW_UPS } from '../../src/chat-with-character/data/followUps.ts';
import { TOPICS } from '../../src/chat-with-character/data/topics.ts';
import { FOLLOW_UP_COUNT, detectTopics, resolveReply } from '../../src/shared/chatEngine.ts';
import { dumbledore } from '../../src/chat-with-character/data/dumbledore.ts';

const locales = ['cs', 'en'] as const;

const everyQuestion = locales.flatMap(locale => [
  ...FOLLOW_UPS.default[locale].map(question => ({ question, locale, set: 'default' })),
  ...Object.entries(FOLLOW_UPS.byTopic).flatMap(([topic, byLocale]) =>
    byLocale[locale].map(question => ({ question, locale, set: topic })),
  ),
]);

describe('follow-up question data integrity', () => {
  it('offers more default questions than one row can show, in both locales', () => {
    for (const locale of locales) {
      expect(FOLLOW_UPS.default[locale].length).toBeGreaterThan(FOLLOW_UP_COUNT);
    }
  });

  it('only keys bespoke sets by topics that exist in the registry', () => {
    for (const topic of Object.keys(FOLLOW_UPS.byTopic)) {
      expect(TOPICS[topic], `topic "${topic}" missing from registry`).toBeDefined();
    }
  });

  it('fills every bespoke set in both locales', () => {
    for (const [topic, byLocale] of Object.entries(FOLLOW_UPS.byTopic)) {
      for (const locale of locales) {
        expect(byLocale[locale].length, `questions for "${topic}" (${locale})`).toBeGreaterThanOrEqual(
          FOLLOW_UP_COUNT,
        );
      }
    }
  });

  it('never repeats a question within one set', () => {
    for (const [topic, byLocale] of Object.entries(FOLLOW_UPS.byTopic)) {
      for (const locale of locales) {
        expect(new Set(byLocale[locale]).size, `duplicate in "${topic}" (${locale})`).toBe(
          byLocale[locale].length,
        );
      }
    }
  });

  it.each(everyQuestion)('"$question" ($set/$locale) matches a topic', ({ question, locale }) => {
    expect(detectTopics(question, TOPICS, locale).length).toBeGreaterThan(0);
  });

  it.each(everyQuestion)('"$question" ($set/$locale) is answered from a topic bucket', ({ question, locale }) => {
    // A suggestion that lands in the generic fallback makes the chips feel broken.
    const reply = resolveReply(question, dumbledore, [dumbledore], TOPICS, locale, { random: () => 0 });
    expect(reply.topic).not.toBeNull();
  });
});
