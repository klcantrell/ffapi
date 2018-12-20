import { ApolloServer, gql } from 'apollo-server-express';
import * as ffService from './dynamodb';

interface IObjParam {
  release_date: string;
}

interface IArgsParam {
  id: number;
}

interface IContextParam {
  ffService: {
    getAllCharacters: Function;
    getCharacter: Function;
    getAllGames: Function;
    getGame: Function;
  };
}

interface IInfoParam {
  fieldNodes: Array<{ selectionSet: { selections: any } }>;
}

interface IUnusedParams {}

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
      { id }: IArgsParam,
      { ffService }: IContextParam,
      info: IInfoParam
    ) {
      const characterData = id
        ? await ffService.getCharacter(id)
        : await ffService.getAllCharacters();
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
          const characterWithGameData = characterData.map(
            async (character: any) => {
              const [gameData] = await ffService.getGame(character.game.id);
              return {
                ...character,
                game: gameData,
              };
            }
          );
          return characterWithGameData;
        }
      }
      return characterData;
    },
    async games(
      _: IUnusedParams,
      { id }: IArgsParam,
      { ffService }: IContextParam
    ) {
      return id ? ffService.getGame(id) : ffService.getAllGames();
    },
  },
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  context: { ffService },
});
