import { Character } from './api';

export const quizCharacters: Character[] = [
  { id: '3', name: 'Harry Potter', house: 'Gryffindor', image: 'https://hp-api.local/harry.png' },
  { id: '5', name: 'Ron Weasley', house: 'Gryffindor', image: 'https://hp-api.local/ron.png' },
  { id: '6', name: 'Hermione Granger', house: 'Gryffindor', image: 'https://hp-api.local/hermione.png' },
  { id: '7', name: 'Draco Malfoy', house: 'Slytherin', image: 'https://hp-api.local/draco.png' },
];

export const houseByName: Record<string, string> = {
  'Harry Potter': 'Gryffindor',
  'Ron Weasley': 'Gryffindor',
  'Hermione Granger': 'Gryffindor',
  'Draco Malfoy': 'Slytherin',
};
