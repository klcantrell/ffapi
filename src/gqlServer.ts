import { ApolloServer, gql } from 'apollo-server-express'
import { getAllCharacters, getCharacter } from './dynamodb';

interface ICharacterArgs {
  id: number;
}

interface IParent {}

const typeDefs = gql`
  type Query {
    characters(id: Int): [Character]!
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
    characters: (_: IParent, { id }: ICharacterArgs) => {
      if (id) {
        return getCharacter(id);
      }
      return getAllCharacters();
    }
  }
}

export default new ApolloServer({ typeDefs, resolvers });