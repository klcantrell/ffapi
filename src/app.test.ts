import request from 'supertest';
import { app } from './server';
import { CHARACTERS_MOCK } from './__mocks__/dynamodb';

jest.mock('./dynamodb');

describe('GET /characters', () => {
  it('should return all characters', async done => {
    const response = await request(app)
      .get('/characters')
      .expect(200);
    expect(response.body.data).toEqual(CHARACTERS_MOCK);
    done();
  });
});
