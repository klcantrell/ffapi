import AWS from 'aws-sdk';
import {
  DataMapper,
  DynamoDbSchema,
  DynamoDbTable,
} from '@aws/dynamodb-data-mapper';

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const client = new AWS.DynamoDB(options);
const mapper = new DataMapper({ client });

class CharacterModel {}

Object.defineProperties(CharacterModel.prototype, {
  [DynamoDbTable]: {
    value: 'ff_characters',
  },
  [DynamoDbSchema]: {
    value: {
      id: {
        type: 'Number',
        keyType: 'HASH',
      },
      name: { type: 'String' },
      game: {
        type: 'Any',
        members: {
          id: {
            type: 'Number',
          },
          name: {
            type: 'String',
          },
        },
      },
      hometown: { type: 'String' },
      weapon: { type: 'String' },
    },
  },
});

class GameModel {}

Object.defineProperties(GameModel.prototype, {
  [DynamoDbTable]: {
    value: 'ff_games',
  },
  [DynamoDbSchema]: {
    value: {
      id: {
        type: 'Number',
        keyType: 'HASH',
      },
      name: { type: 'String' },
      release_date: { type: 'String' },
    },
  },
});

async function getAllCharacters() {
  let data = [];
  const iterator = mapper.scan(CharacterModel);
  for await (const record of iterator) {
    const recordWithIdAsNumber = {
      ...record,
      game: {
        id: Number(record.game.id),
        name: record.game.name,
      },
    };
    data.push(recordWithIdAsNumber);
  }
  return data;
}

async function getCharacter(characterId) {
  const toGet = new CharacterModel();
  toGet.id = characterId;
  const record = await mapper.get(toGet);
  const recordWithIdAsNumber = {
    ...record,
    game: {
      id: Number(record.game.id),
      name: record.game.name,
    },
  };
  return [recordWithIdAsNumber];
}

async function getAllGames() {
  let data = [];
  const iterator = mapper.scan(GameModel);
  for await (const record of iterator) {
    data.push(record);
  }
  return data;
}

async function getGame(gameId) {
  const toGet = new GameModel();
  toGet.id = gameId;
  const data = await mapper.get(toGet);
  return [data];
}

export { getAllCharacters, getCharacter, getAllGames, getGame };
