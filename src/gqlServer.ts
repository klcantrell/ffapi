import { ApolloServer, gql } from 'apollo-server-express'
import { getAllCharacters, getCharacter } from './dynamodb';

interface ICharacter {
  id: number;
}

interface IParent {}

const typeDefs = gql`
  type Query {
    characters: [Character]!
    character(id: Int!): Character
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
    characters: () => getAllCharacters(),
    character: (_: IParent, { id }: ICharacter) => {
      return getCharacter(id);
    }
  }
}

export default new ApolloServer({ typeDefs, resolvers });