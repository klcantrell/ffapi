import { ApolloServer, gql } from 'apollo-server-express'
import { getAllCharacters, getCharacter } from './dynamodb';

const typeDefs = gql`
  type Query {
    characters: [Character]!
  }

  type Character {
    id: Int
    name: String
    game: String
    hometown: String
    weapon: String
  }
`;

const resolvers = {
  Query: {
    characters: () => getAllCharacters()
  }
}

export default new ApolloServer({ typeDefs, resolvers });