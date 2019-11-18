import request from 'supertest';
import app from '../app'
import { MongoClient, Db } from 'mongodb'
import { MONGOURI } from './mongo-setup'
import HttpStatus from 'http-status-codes'

let connection: MongoClient;
let db: Db;

beforeAll(async () => {
  connection = await MongoClient.connect(MONGOURI, {
    useNewUrlParser: true,
  });
  db = await connection.db("sms");
  db.collection('threads').remove({})
});

describe('POST /thread', () => {
  afterEach(async () => {
    db.collection('threads').remove({})
  })

  afterAll(async () => {
    await connection.close();
  });

  describe('without a users property', () => {
    it('returns bad request', async () => {
      let res = await request(app).post('/thread')

      expect(res.body.errors[0].param).toEqual('users')
      expect(res.body.errors[0].msg).toEqual('Provide an array of at least one user.')
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with an empty users array', () => {
    it('returns bad request', async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':[]})

      expect(res.body.errors[0].param).toEqual('users')
      expect(res.body.errors[0].msg).toEqual('Provide an array of at least one user.')
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with at least one user', () => {
    it('starts a new message thread', async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['what']})

      expect(res.status).toEqual(HttpStatus.OK)
    })
  })

  describe('with multiple users', () => {
    it('starts a new message thread', async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['what', 'are', 'we', 'talking', 'about']})

      expect(res.status).toEqual(HttpStatus.OK)
    })
  })

  describe('with excessive spaces around user names', () => {
    it('returns bad request', async () => {
      let users = {'users':['what', ' are  ', ' we', ' talking ', 'about']}
      let res = await request(app)
        .post('/thread')
        .send(users)

      expect(res.body.errors[0].param).toEqual('users')
      expect(res.body.errors[0].msg).toEqual('Names can only contain alphanumerics, \"_\", and \"-\"')
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with non-alpanumeric characters', () => {
    it('returns bad request', async () => {
      let users = {'users':[',,what']}
      let res = await request(app)
        .post('/thread')
        .send(users)

      expect(res.body.errors[0].param).toEqual('users')
      expect(res.body.errors[0].msg).toEqual('Names can only contain alphanumerics, \"_\", and \"-\"')
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
  })

  describe('with an existing user thread', () => {
    it('returns the id of the existing thread', async () => {
      let users = {'users':['what', 'are', 'we', 'talking', 'about']}
      let firstReq = await request(app)
        .post('/thread')
        .send(users)

      let secondReq = await request(app)
        .post('/thread')
        .send(users)

      expect(firstReq.body.thread_id).toEqual(secondReq.body.thread_id)
    })
  })
})
