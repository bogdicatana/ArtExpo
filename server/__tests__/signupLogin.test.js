const request = require('supertest');
const app = require('../app'); // the express app you exported
const { accountDB } = require('../db');

beforeAll(done => {
  accountDB.serialize(() => {
    accountDB.run(`CREATE TABLE accounts (
      id INTEGER PRIMARY KEY,
      username TEXT,
      password TEXT,
      email TEXT
    )`, done);
  });
});

afterAll(done => {
  accountDB.close(done);
});

test('should create a new account on /signup', async () => {
  const res = await request(app)
    .post('/signup')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'secure123'
    });
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('accountID');
});

describe('POST /login', () => {
  it('should log in with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'secure123'
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });

  it('should return error with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('failed login');
  });
});
