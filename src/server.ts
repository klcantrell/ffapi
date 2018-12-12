import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import dynamodb from './dynamodb';

const app = express();
const mapper = new DataMapper({ client: dynamodb });

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

  @attribute()
  type?: string;
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
