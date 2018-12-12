import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import dynamodb from './dynamodb';

const app = express();

app.get('/characters', (req, res) => {
  const params = {
    TableName: 'ff_characters',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#game': 'game',
      '#hometown': 'hometown',
      '#weapon': 'weapon',
    },
    ProjectionExpression: '#name, #hometown, #weapon, #game',
  };
  dynamodb.scan(params, function(err, data) {
    if (err) res.send({ error: err })
    else res.send({ data });
  });
});

app.get('/characters/:id', (req, res) => {
  const characterId = req.params.id;
  const params = {
    TableName: 'ff_characters',
    Key: {
      id: {
        N: characterId
      }
    },
    AttributesToGet: [
      'name',
      'hometown',
      'weapon',
      'game',
    ],
    ConsistentRead: false,
    ReturnConsumedCapacity: 'NONE',
  };
  dynamodb.getItem(params, function(err, data) {
    if (err) res.send({ error: err })
    else res.send({ data });
  });
});

const server = awsServerlessExpress.createServer(app);

export const main = (event: any, context: any) =>
  awsServerlessExpress.proxy(server, event, context);
