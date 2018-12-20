import { ApolloServer, gql } from 'apollo-server-express';
import * as ffService from './dynamodb';

export const typeDefs = gql`
  union GameUnion = GameInfo | Game

  type Query {
    characters(id: Int): [Character]!
    games(id: Int): [Game]!
  }

  type Character {
    id: Int
    name: String
    game: GameUnion
    hometown: String
    weapon: String
  }

  type GameInfo {
    id: Int
    name: String
  }

  type Game {
    id: Int
    name: String
    release_date: String
  }
`;

export const resolvers = {
  GameUnion: {
    __resolveType(obj) {
      if (obj.release_date) {
        return 'Game';
      }
      return 'GameInfo';
    },
  },
  Query: {
    async characters(_, { id }, { ffService }, info) {
      const characterData = id
        ? await ffService.getCharacter(id)
        : await ffService.getAllCharacters();
      const queryGameSelection = info.fieldNodes[0].selectionSet.selections.find(
        selection => {
          return selection.name && selection.name.value === 'game';
        }
      );
      if (queryGameSelection) {
        const nestedGameQuery = queryGameSelection.selectionSet.selections.find(
          selection => {
            return (
              selection.typeCondition &&
              selection.typeCondition.name &&
              selection.typeCondition.name.value === 'Game'
            );
          }
        );
        if (nestedGameQuery) {
          const characterWithGameData = characterData.map(async character => {
            const [gameData] = await ffService.getGame(character.game.id);
            return {
              ...character,
              game: gameData,
            };
          });
          return characterWithGameData;
        }
      }
      return characterData;
    },
    async games(_, { id }, { ffService }) {
      return id ? ffService.getGame(id) : ffService.getAllGames();
    },
  },
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  context: { ffService },
});
