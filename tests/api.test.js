const request = require('supertest');
const app = require('../src/app');

describe('GET /api/ping', () => {
  it('should return a pong message that ensures the API is working', async () => {
    const response = await request(app).get('/api/ping');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('pong');
  });
});
