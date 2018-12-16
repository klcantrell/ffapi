import { ApolloServer, gql } from 'apollo-server-express'
import { getAllCharacters, getCharacter, getGame, getAllGames } from './dynamodb';

interface IQueryArgs {
  id: number;
}

interface IParent {}

const typeDefs = gql`
  type Query {
    characters(id: Int): [Character]!
    games(id: Int): [Game]!
  }

  type Character {
    id: Int
    name: String
    game: String
    hometown: String
    weapon: String
  }

  type Game {
    id: Int
    name: String
    release_date: String
  }
`;

const resolvers = {
  Query: {
    characters: (_: IParent, { id }: IQueryArgs) => {
      return id ? getCharacter(id) : getAllCharacters();
    },
    games: (_: IParent, { id }: IQueryArgs) => {
      return id ? getGame(id) : getAllGames();
    }
  }
}

export default new ApolloServer({ typeDefs, resolvers });