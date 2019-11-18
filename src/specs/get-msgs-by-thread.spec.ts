import request from 'supertest';
import app from '../app'
import { MongoClient, Db } from 'mongodb'
import { MONGOURI } from './mongo-setup'
import HttpStatus from 'http-status-codes'


describe('GET /thread/:thread_id', () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    db = await connection.db("sms");
  });

  afterEach(async () => {
    db.collection('threads').remove({})
  })

  afterAll(async () => {
    await connection.close();
  });

  describe('with a thread id thats not an int', () => {
    it('returns bad request', async () => {
      let res = await request(app).get('/thread/asdf')

      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with an existing thread', () => {
    let threadId:number;

    beforeEach(async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['aeden', 'kiefer', 'jeff_goldblum']})

      threadId = res.body.thread_id

      await request(app)
        .post(`/thread/${threadId}/aeden`)
        .send({'message':'Hey Jeff'})

      await request(app)
        .post(`/thread/${threadId}/jeff_goldblum`)
        .send({'message':'Hey Aeden'})

      await request(app)
        .post(`/thread/${threadId}/kiefer`)
        .send({'message':'Gentlemen!'})
    })

    it('returns all the messages', async () => {
      let expected = [
        { username: 'aeden', message: 'Hey Jeff' },
        { username: 'jeff_goldblum', message: 'Hey Aeden' },
        { username: 'kiefer', message: 'Gentlemen!' }
      ]

      let res = await request(app).get(`/thread/${threadId}`)

      expect(res.body.messages).toEqual(expected)
      expect(res.status).toEqual(HttpStatus.OK)
    })
  })
});
