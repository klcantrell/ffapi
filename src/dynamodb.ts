import AWS from 'aws-sdk';

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}
export const client = new AWS.DynamoDB.DocumentClient(options);
