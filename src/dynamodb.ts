import AWS from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const client = new AWS.DynamoDB(options);
const mapper = new DataMapper({ client });

interface IGameData {
  id: number
  name: string
}

@table('ff_characters')
class CharacterModel {
  @hashKey()
  id?: number;

  @attribute()
  name?: string;

  @attribute()
  game!: IGameData;

  @attribute()
  hometown?: string;

  @attribute()
  weapon?: string;
}

@table('ff_games')
class GameModel {
  @hashKey()
  id?: number;

  @attribute()
  name?: string;

  @attribute()
  release_date?: number;
}

async function getAllCharacters() {
  let data = [];
  const iterator = mapper.scan(CharacterModel);
  for await (const record of iterator) {
    const recordWithIdAsNumber = {
      ...record,
      game: {
        id: Number(record.game.id),
        name: record.game.name
      }, 
    };
    data.push(recordWithIdAsNumber);
  }
  return data;
}

async function getCharacter(characterId: number) {
  const toGet = new CharacterModel();
  toGet.id = characterId;
  const data = await mapper.get(toGet);
  return [ data ];
}

async function getAllGames() {
  let data = [];
  const iterator = mapper.scan(GameModel);
  for await (const record of iterator) {
    data.push(record);
  }
  return data;
}

async function getGame(gameId: number) {
  const toGet = new GameModel();
  toGet.id = gameId;
  const data = await mapper.get(toGet);
  return [ data ];
}

export { getAllCharacters, getCharacter, getAllGames, getGame };
