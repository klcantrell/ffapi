import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ApolloServer, gql } from 'apollo-server-express'

import dynamodb from './dynamodb';

const app = express();
const mapper = new DataMapper({ client: dynamodb });

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
    characters: async () => {
      let data = [];
      const iterator = mapper.scan(CharacterModel);
      for await (const record of iterator) {
        data.push(record);
      }
      return data;
    }
  }
}

const gqlServer = new ApolloServer({ typeDefs, resolvers });
gqlServer.applyMiddleware({ app });

@table('ff_characters')
class CharacterModel {
  @hashKey()
  id?: number;

  @attribute()
  name?: string;

  @attribute()
  game?: string;

  @attribute()
  hometown?: string;

  @attribute()
  weapon?: string;
}

app.get('/characters', async (req, res) => {
  let data = [];
  const iterator = mapper.scan(CharacterModel);
  for await (const record of iterator) {
    data.push(record);
  }
  res.send({ data });
});

app.get('/characters/:id', async (req, res) => {
  const characterId = req.params.id;
  const toGet = new CharacterModel();
  toGet.id = characterId;
  const data = await mapper.get(toGet);
  res.send({ data })
});

const server = awsServerlessExpress.createServer(app);

export const main = (event: any, context: any) =>
  awsServerlessExpress.proxy(server, event, context);
