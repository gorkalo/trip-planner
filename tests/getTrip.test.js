require('dotenv').config();
const request = require('supertest');
const axios = require('axios');
const { getTrip } = require('../src/controllers/trip');
const axiosMockAdapter = require('axios-mock-adapter');
const app = require('../src/app');
const errorHandler = require('../src/middlewares/error');
app.get('/trip', getTrip);
app.use((err, req, res, next) => {
  errorHandler(err, res);
});

const mockAxios = new axiosMockAdapter(axios);

describe('GET /trip', () => {
  
  afterEach(() => {
    mockAxios.reset();
  });

  it('should return a sorted list of trips (fastest)', async () => {
    const tripsData = [
      { duration: 3, cost: 10 },
      { duration: 2, cost: 20 },
      { duration: 5, cost: 15 },
    ];

    mockAxios.onGet('https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips').reply(200, tripsData);

    const response = await request(app)
      .get('/trip?origin=ATL&destination=PEK&sort_by=fastest')
      .set('x-api-key', process.env.TRIPS_API_KEY);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { duration: 2, cost: 20 },
      { duration: 3, cost: 10 },
      { duration: 5, cost: 15 },
    ]);
  });

  it('should return a sorted list of trips (cheapest)', async () => {
    const tripsData = [
      { duration: 3, cost: 10 },
      { duration: 2, cost: 20 },
      { duration: 5, cost: 15 },
    ];

    mockAxios.onGet('https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips').reply(200, tripsData);

    const response = await request(app)
      .get('/trip?origin=ATL&destination=PEK&sort_by=cheapest')
      .set('x-api-key', process.env.TRIPS_API_KEY);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { duration: 3, cost: 10 },
      { duration: 5, cost: 15 },
      { duration: 2, cost: 20 },
    ]);
  });

  it('should return 400 if origin or destination is invalid', async () => {
    const response = await request(app)
      .get('/trip?origin=ZZ&destination=UK&sort_by=fastest')
      .set('x-api-key', process.env.TRIPS_API_KEY);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid origin or destination' });
  });

  it('should return 400 if sort_by is invalid', async () => {
    const response = await request(app)
      .get('/trip?origin=ATL&destination=PEK&sort_by=invalid')
      .set('x-api-key', process.env.TRIPS_API_KEY);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid sort by option' });
  });

  it('should return 404 if no trips are found', async () => {
    mockAxios.onGet('https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips').reply(200, []);

    const response = await request(app)
      .get('/trip?origin=ATL&destination=PEK&sort_by=fastest')
      .set('x-api-key', process.env.TRIPS_API_KEY);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No trips found' });
  });

  it('should handle server errors gracefully', async () => {
    mockAxios.onGet('https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips').reply(500);

    const response = await request(app)
      .get('/trip?origin=ATL&destination=PEK&sort_by=fastest')
      .set('x-api-key', process.env.TRIPS_API_KEY);

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual('Request failed with status code 500');
  });
});
