import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';

import gqlServer from './gqlServer';
import {
  getAllCharacters,
  getCharacter,
  getAllGames,
  getGame,
} from './dynamodb';

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

app.get('/games', async (req, res) => {
  const data = await getAllGames();
  res.send({ data });
});

app.get('/games/:id', async (req, res) => {
  const data = await getGame(req.params.id);
  res.send({ data });
});

const server = awsServerlessExpress.createServer(app);

export const main = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);

export { app };
