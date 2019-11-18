import request from 'supertest';
import app from '../app'
import { MongoClient, Db } from 'mongodb'
import { MONGOURI } from './mongo-setup'
import HttpStatus from 'http-status-codes'

describe('POST /thread/:thread_id/:username', () => {
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
      let res = await request(app).post('/thread/asdf/aeden')

      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with a non-existent thread id ', () => {
    it('returns bad request', async () => {
      let res = await request(app).post('/thread/734589/aeden')

      expect(res.body.errors[0].msg).toEqual('Provide an existing message id.')
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with a non-existent user on specified thread', () => {
    let threadId:number;

    beforeEach(async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['what']})

      threadId = res.body.thread_id
    })

    it('returns bad request', async () => {
      let res = await request(app).post(`/thread/${threadId}/aeden`)

      expect(res.body.errors[0].msg).toEqual('Provide an existing user on the thread.')
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with a blank message', () => {
    let threadId:number;

    beforeEach(async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['aeden']})

      threadId = res.body.thread_id
    })

    it('returns bad request', async () => {
      let res = await request(app).post(`/thread/${threadId}/aeden`)

      expect(res.body.errors[0].msg).toEqual('Please provide a message.')
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with a non-empty message', () => {
    let threadId:number;

    beforeEach(async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['aeden']})

      threadId = res.body.thread_id
    })

    it('returns no content', async () => {
      let res = await request(app)
        .post(`/thread/${threadId}/aeden`)
        .send({'message':'MY FIRST MESSAGE'})

      expect(res.status).toEqual(HttpStatus.NO_CONTENT)
    })
  })
})
