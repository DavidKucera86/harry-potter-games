import { describe, expect, it } from 'vitest';
import { dumbledore } from '../../src/chat-with-character/data/dumbledore.ts';
import { TOPICS } from '../../src/chat-with-character/data/topics.ts';
import { detectTopics, resolveReply } from '../../src/shared/chatEngine.ts';

const locales = ['cs', 'en'] as const;

describe('dumbledore data integrity', () => {
  it('every registry topic has non-empty keywords in both locales', () => {
    for (const [topic, def] of Object.entries(TOPICS)) {
      for (const locale of locales) {
        expect(def.keywords[locale].length, `keywords for "${topic}" (${locale})`).toBeGreaterThan(0);
      }
    }
  });

  it('every quoted topic exists in the shared registry with non-empty lines', () => {
    for (const [topic, byLocale] of Object.entries(dumbledore.quotes)) {
      if (topic === 'general') continue;
      expect(TOPICS[topic], `topic "${topic}" missing from registry`).toBeDefined();
      for (const locale of locales) {
        expect(byLocale[locale].length, `quotes for "${topic}" (${locale})`).toBeGreaterThan(0);
      }
    }
  });

  it('always has general and fallback lines in both locales', () => {
    for (const locale of locales) {
      expect(dumbledore.quotes.general[locale].length).toBeGreaterThan(0);
      expect(dumbledore.fallback[locale].length).toBeGreaterThan(0);
    }
  });
});

describe('dumbledore small talk', () => {
  const cases = [
    { text: 'Ahoj, Brumbále!', locale: 'cs', topic: 'pozdrav' },
    { text: 'Jak se máš?', locale: 'cs', topic: 'jaksemas' },
    { text: 'Co je nového?', locale: 'cs', topic: 'jaksemas' },
    { text: 'Co máš rád?', locale: 'cs', topic: 'oblibene' },
    { text: 'Kdo jsi?', locale: 'cs', topic: 'identita' },
    { text: 'Napiš mi něco o sobě', locale: 'cs', topic: 'identita' },
    { text: 'Řekni mi něco o sobě', locale: 'cs', topic: 'identita' },
    { text: 'O čem si můžeme povídat?', locale: 'cs', topic: 'namety' },
    { text: 'Díky moc!', locale: 'cs', topic: 'podekovani' },
    { text: 'Nashledanou', locale: 'cs', topic: 'rozlouceni' },
    { text: 'Měj se', locale: 'cs', topic: 'rozlouceni' },
    { text: 'Hello there', locale: 'en', topic: 'pozdrav' },
    { text: 'How are you?', locale: 'en', topic: 'jaksemas' },
    { text: 'What do you like?', locale: 'en', topic: 'oblibene' },
    { text: 'Tell me about yourself', locale: 'en', topic: 'identita' },
    { text: 'What can we talk about?', locale: 'en', topic: 'namety' },
    { text: 'Thank you', locale: 'en', topic: 'podekovani' },
    { text: 'Goodbye', locale: 'en', topic: 'rozlouceni' },
  ] as const;

  it.each(cases)('detects "$text" as topic "$topic"', ({ text, locale, topic }) => {
    expect(detectTopics(text, TOPICS, locale)).toContain(topic);
  });

  const topicCases = [
    { text: 'Řekni mi nějaký vtip', locale: 'cs', topic: 'vtipy' },
    { text: 'Kolik ti je let?', locale: 'cs', topic: 'vek' },
    { text: 'Máš nějakou rodinu?', locale: 'cs', topic: 'rodina' },
    { text: 'Byl jsi někdy zamilovaný?', locale: 'cs', topic: 'romantika' },
    { text: 'Věříš v Boha?', locale: 'cs', topic: 'buh' },
    { text: 'Co si myslíš o Rowlingové?', locale: 'cs', topic: 'rowling' },
    { text: 'Co si myslíš o Harrym?', locale: 'cs', topic: 'harry' },
    { text: 'A Hermiona?', locale: 'cs', topic: 'hermiona' },
    { text: 'Co Snape?', locale: 'cs', topic: 'snape' },
    { text: 'Věříš Voldemortovi?', locale: 'cs', topic: 'voldemort' },
    { text: 'Tell me a joke', locale: 'en', topic: 'vtipy' },
    { text: 'How old are you?', locale: 'en', topic: 'vek' },
    { text: 'Did you ever love anyone?', locale: 'en', topic: 'romantika' },
    { text: 'Do you believe in God?', locale: 'en', topic: 'buh' },
    { text: 'What about Severus Snape?', locale: 'en', topic: 'snape' },
    { text: 'Co jsou viteály?', locale: 'cs', topic: 'viteal' },
    { text: 'Řekni mi o viteálech', locale: 'cs', topic: 'viteal' },
    { text: 'Pověz mi o relikviích smrti', locale: 'cs', topic: 'relikvie' },
    { text: 'Kdo je pánem smrti?', locale: 'cs', topic: 'relikvie' },
    { text: 'Co je Bezová hůlka?', locale: 'cs', topic: 'bezova_hulka' },
    { text: 'What is a Horcrux?', locale: 'en', topic: 'viteal' },
    { text: 'Tell me about the Deathly Hallows', locale: 'en', topic: 'relikvie' },
    { text: 'Jak se ničí viteály?', locale: 'cs', topic: 'viteal_zniceni' },
    { text: 'Kdo zničil které viteály?', locale: 'cs', topic: 'viteal_zniceni' },
    { text: 'What is the Elder Wand?', locale: 'en', topic: 'bezova_hulka' },
    { text: 'Komu patří Bezová hůlka?', locale: 'cs', topic: 'bezova_hulka' },
    { text: 'Proč tě zabil Snape?', locale: 'cs', topic: 'brumbaluv_plan' },
    { text: 'Co se stalo s tvou rukou?', locale: 'cs', topic: 'brumbaluv_plan' },
    { text: 'Kdo je Fawkes?', locale: 'cs', topic: 'fawkes' },
    { text: 'Co je Nicolas Flamel?', locale: 'cs', topic: 'flamel' },
    { text: 'Řekni mi o Kameni mudrců', locale: 'cs', topic: 'flamel' },
    { text: 'Co je Řád fénixe?', locale: 'cs', topic: 'rad_fenixe' },
    { text: 'Jaký byl souboj s Grindelwaldem?', locale: 'cs', topic: 'grindelwald_souboj' },
    { text: 'Co je Zrcadlo z Erisedu?', locale: 'cs', topic: 'zrcadlo' },
    { text: 'K čemu slouží Myslánka?', locale: 'cs', topic: 'myslanka' },
    { text: 'Znáš to proroctví o Harrym?', locale: 'cs', topic: 'proroctvi' },
    { text: 'Záleží na čistotě krve?', locale: 'cs', topic: 'puvod' },
    { text: 'Jaké máš tituly?', locale: 'cs', topic: 'tituly' },
    { text: 'Co jsou mozkomorové?', locale: 'cs', topic: 'mozkomori' },
    { text: 'What is the Mirror of Erised?', locale: 'en', topic: 'zrcadlo' },
    { text: 'Tell me about the prophecy', locale: 'en', topic: 'proroctvi' },
    { text: 'What about Dementors?', locale: 'en', topic: 'mozkomori' },
    { text: 'Kdo byli zakladatelé Bradavic?', locale: 'cs', topic: 'zakladatele' },
    { text: 'Kdo byl Salazar Zmijozel?', locale: 'cs', topic: 'zakladatele' },
    { text: 'Co je Tajemná komnata?', locale: 'cs', topic: 'tajemna_komnata' },
    { text: 'Co je Komnata nejvyšší potřeby?', locale: 'cs', topic: 'komnata_potreby' },
    { text: 'Jací duchové žijí v Bradavicích?', locale: 'cs', topic: 'duchove' },
    { text: 'Co je nitrozpyt?', locale: 'cs', topic: 'nitrozpyt' },
    { text: 'Jaké byly kouzelnické války?', locale: 'cs', topic: 'valky' },
    { text: 'Kdo jsou Smrtijedi?', locale: 'cs', topic: 'valky' },
    { text: 'Co je Mnoholičný lektvar?', locale: 'cs', topic: 'lektvary' },
    { text: 'Co je Felix Felicis?', locale: 'cs', topic: 'lektvary' },
    { text: 'Tell me about the founders', locale: 'en', topic: 'zakladatele' },
    { text: 'What is the Chamber of Secrets?', locale: 'en', topic: 'tajemna_komnata' },
    { text: 'What is the Room of Requirement?', locale: 'en', topic: 'komnata_potreby' },
    { text: 'What is Occlumency?', locale: 'en', topic: 'nitrozpyt' },
    { text: 'Jaké cukrovinky mi doporučíš?', locale: 'cs', topic: 'sladkosti' },
    { text: 'Jak se připraví šerbetový citronek?', locale: 'cs', topic: 'sladkosti' },
    { text: 'Máš rád čokoládové žáby?', locale: 'cs', topic: 'sladkosti' },
    { text: 'Jaká máš tajemství?', locale: 'cs', topic: 'tajemstvi' },
    { text: 'Co přede mnou skrýváš?', locale: 'cs', topic: 'tajemstvi' },
    { text: 'What secrets do you keep?', locale: 'en', topic: 'tajemstvi' },
    { text: 'A jak zní to heslo?', locale: 'cs', topic: 'heslo' },
    { text: 'Jaké máš heslo do pracovny?', locale: 'cs', topic: 'heslo' },
    { text: 'What is the password?', locale: 'en', topic: 'heslo' },
    { text: 'temné časy', locale: 'cs', topic: 'temne_casy' },
    { text: 'Pověz mi o temných časech', locale: 'cs', topic: 'temne_casy' },
    { text: 'Tell me about the dark times', locale: 'en', topic: 'temne_casy' },
    { text: 'Kdo se postavili temnotě?', locale: 'cs', topic: 'rad_fenixe' },
    { text: 'Kdo bojoval proti Voldemortovi?', locale: 'cs', topic: 'rad_fenixe' },
    { text: 'Who stood against the darkness?', locale: 'en', topic: 'rad_fenixe' },
  ] as const;

  it.each(topicCases)('detects "$text" as topic "$topic"', ({ text, locale, topic }) => {
    expect(detectTopics(text, TOPICS, locale)).toContain(topic);
  });

  it('resolves "oblíbené kouzlo" to the favourite-spell topic, not generic magic or likes', () => {
    const reply = resolveReply('Jaké je tvé oblíbené kouzlo?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.oblibenekouzlo.cs).toContain(reply);
  });

  it('resolves "relikvie smrti" to the Hallows topic, not the generic death topic', () => {
    const reply = resolveReply('Pověz mi o relikviích smrti', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.relikvie.cs).toContain(reply);
  });

  it('resolves "souboj s Grindelwaldem" to the duel topic, not the romance topic', () => {
    const reply = resolveReply('Jaký byl souboj s Grindelwaldem?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.grindelwald_souboj.cs).toContain(reply);
  });

  it('resolves "Řád fénixe" to the Order topic, not the Fawkes topic', () => {
    const reply = resolveReply('Co je Řád fénixe?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.rad_fenixe.cs).toContain(reply);
  });

  it('resolves "jak zničit viteál" to the destruction topic, not the general Horcrux topic', () => {
    const reply = resolveReply('Jak se ničí viteály?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.viteal_zniceni.cs).toContain(reply);
  });

  it('resolves "Mnoholičný lektvar" to the specific-potions topic, not generic magic', () => {
    const reply = resolveReply('Co je Mnoholičný lektvar?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.lektvary.cs).toContain(reply);
  });

  it('resolves "Salazar Zmijozel" to the founders topic, not the generic Hogwarts topic', () => {
    const reply = resolveReply('Kdo byl Salazar Zmijozel?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.zakladatele.cs).toContain(reply);
  });

  it('resolves "temné časy" to the dark-times topic, not the generic fear topic', () => {
    const reply = resolveReply('temné časy', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.temne_casy.cs).toContain(reply);
  });

  it('resolves "kdo se postavil temnotě" to the Order topic, not the generic fear topic', () => {
    const reply = resolveReply('Kdo se postavili temnotě?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.rad_fenixe.cs).toContain(reply);
  });

  it('answers small talk from the topic bucket, not from the generic fallback', () => {
    const reply = resolveReply('Jak se máš?', dumbledore, [dumbledore], TOPICS, 'cs', { random: () => 0 });
    expect(dumbledore.quotes.jaksemas.cs).toContain(reply);
    expect(dumbledore.fallback.cs).not.toContain(reply);
  });
});
