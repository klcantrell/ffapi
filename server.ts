import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';

const app = express();

app.get('/', (req, res) => {
  res.send('sup!');
});

const server = awsServerlessExpress.createServer(app);

export const main = (event: any, context: any) =>
  awsServerlessExpress.proxy(server, event, context);
