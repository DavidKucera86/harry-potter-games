import type { ChatCharacter } from '../../shared/chatEngine.js';
import { dumbledore } from './dumbledore.js';

export { TOPICS } from './topics.js';

/**
 * Roster of chat characters. Order is also the *source priority* for deferrals:
 * when a character cannot answer a deferrable topic, the reply is relayed from
 * the first character here that knows it. Dumbledore, the sage, comes first.
 * Adding a character means dropping a data module in here.
 */
export const CHAT_CHARACTERS: ChatCharacter[] = [dumbledore];

export function getChatCharacter(id: string): ChatCharacter | undefined {
  return CHAT_CHARACTERS.find(character => character.id === id);
}
