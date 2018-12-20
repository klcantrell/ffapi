import { makeExecutableSchema, gql } from 'apollo-server-express';
import { graphql } from 'graphql';

import { typeDefs, resolvers } from './gqlServer.ts';
import * as ffMockService from './__mocks__/dynamodb';

const allCharactersTestCase = {
  id: 'All Characters',
  query: gql`
    query {
      characters {
        id
        name
        game {
          ... on GameInfo {
            id
            name
          }
        }
        hometown
        weapon
      }
    }
  `,
  variables: {},
  context: { ffService: ffMockService },
  expected: ffMockService.CHARACTERS_MOCK,
};

describe('gql test cases', () => {
  const cases = [allCharactersTestCase];
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  cases.forEach(testCase => {
    const { id, query, variables, context, expected } = testCase;
    it(`query ${id}`, async done => {
      const result = await graphql(schema, query, null, context, variables);
      expect(result).toEqual(expected);
      done();
    });
  });
});
