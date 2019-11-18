import request from 'supertest';
import app from '../app'
import { MongoClient, Db } from 'mongodb'
import { MONGOURI } from './mongo-setup'
import HttpStatus from 'http-status-codes'


describe('POST /thread', () => {
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

  describe('without a users property', () => {
    it('returns 422', async () => {
      let res = await request(app).post('/thread')

      expect(res.body.errors[0].param).toEqual('users')
      expect(res.body.errors[0].msg).toEqual('Provide an array of at least one user.')
      expect(res.status).toEqual(422)
    })
  })

  describe('with an empty users array', () => {
    it('returns 422', async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':[]})

      expect(res.body.errors[0].param).toEqual('users')
      expect(res.body.errors[0].msg).toEqual('Provide an array of at least one user.')
      expect(res.status).toEqual(422)
    })
  })

  describe('with at least one user', () => {
    it('starts a new message thread', async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['what']})

      expect(res.status).toEqual(200)
    })
  })

  describe('with multiple users', () => {
    it('starts a new message thread', async () => {
      let res = await request(app)
        .post('/thread')
        .send({'users':['what', 'are', 'we', 'talking', 'about']})

      expect(res.status).toEqual(200)
    })
  })

  describe('with excessive spaces around user names', () => {
    it('starts a new message thread', async () => {
      let users = {'users':['  what', ' are  ', ' we', ' talking ', 'about']}
      let res = await request(app)
        .post('/thread')
        .send(users)
      let thread = await db.collection('threads').findOne({ id: parseInt(res.body.thread_id)})

      expect(thread.name).toEqual('what,are,we,talking,about')
      expect(res.status).toEqual(200)
    })
  })

  describe('with an existing user thread', () => {
    it('returns the id of the existing thread', async () => {
      let users = {'users':['  what', ' are  ', ' we', ' talking ', 'about']}
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
