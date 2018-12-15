import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';

import gqlServer from './gqlServer';
import { getAllCharacters, getCharacter } from './dynamodb';

const app = express();
gqlServer.applyMiddleware({ app });

app.get('/characters', async (req, res) => {
  const data = await getAllCharacters();
  res.send({ data });
});

app.get('/characters/:id', async (req, res) => {
  const data = await getCharacter(req.params.id);
  res.send({ data });
});

const server = awsServerlessExpress.createServer(app);

export const main = (event: any, context: any) =>
  awsServerlessExpress.proxy(server, event, context);
