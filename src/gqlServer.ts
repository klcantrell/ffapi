import { ApolloServer, gql } from 'apollo-server-express';
import {
  getAllCharacters,
  getCharacter,
  getGame,
  getAllGames,
} from './dynamodb';

interface IQueryArgs {
  id: number;
}

interface IUnusedParams {}

interface IInfoParam {
  fieldNodes: Array<{ selectionSet: { selections: any } }>;
}

interface IObjParam {
  release_date: string;
}

const typeDefs = gql`
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

const resolvers = {
  GameUnion: {
    __resolveType(obj: IObjParam) {
      if (obj.release_date) {
        return 'Game';
      }
      return 'GameInfo';
    },
  },
  Query: {
    async characters(
      _: IUnusedParams,
      { id }: IQueryArgs,
      __: IUnusedParams,
      info: IInfoParam
    ) {
      const characterData = id
        ? await getCharacter(id)
        : await getAllCharacters();
      const queryGameSelection = info.fieldNodes[0].selectionSet.selections.find(
        (selection: any) => {
          return selection.name && selection.name.value === 'game';
        }
      );
      if (queryGameSelection) {
        const nestedGameQuery = queryGameSelection.selectionSet.selections.find(
          (selection: any) => {
            return (
              selection.typeCondition &&
              selection.typeCondition.name &&
              selection.typeCondition.name.value === 'Game'
            );
          }
        );
        if (nestedGameQuery) {
          const characterWithGameData = characterData.map(async character => {
            const [gameData] = await getGame(character.game.id);
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
    async games(
      _: IUnusedParams,
      { id }: IQueryArgs,
      __: IUnusedParams,
      info: IInfoParam
    ) {
      return id ? getGame(id) : getAllGames();
    },
  },
};

export default new ApolloServer({ typeDefs, resolvers });
