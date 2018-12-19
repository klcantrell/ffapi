function getAllCharacters() {
  return Promise.resolve(CHARACTERS_MOCK);
}

export const CHARACTERS_MOCK = [
  {
    id: 1,
    name: 'Cloud Strife',
    game: {
      id: 1,
      name: 'FF7',
    },
    hometown: 'Nibelheim',
    weapon: 'Buster Sword',
  },
  {
    id: 2,
    name: 'Tifa Lockhart',
    game: {
      id: 1,
      name: 'FF7',
    },
    hometown: 'Nibelheim',
    weapon: 'Leather Gloves',
  },
];

export { getAllCharacters };
