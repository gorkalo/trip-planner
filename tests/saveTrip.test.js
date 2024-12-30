
const axios = require('axios');
const { saveTrip } = require('../src/controllers/trip');
const client = require('../prisma/client');

jest.mock('axios');
jest.mock('../prisma/client', () => ({
  trip: {
    create: jest.fn()
  }
}));

describe('saveTrip', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: { trip_id: '12345' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if user is not found', async () => {
    req.user = null; // Simulate no user in the request

    await saveTrip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should return 400 if trip_id is not provided', async () => {
    req.body.trip_id = null;

    await saveTrip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Trip ID is required' });
  });

  it('should return 404 if trip data is not found from the API', async () => {
    axios.get.mockResolvedValueOnce({ data: null });

    await saveTrip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Trip not found' });
  });

  it('should return 200 and save the trip if data is found', async () => {
    const tripData = { id: '1', name: 'Test Trip', description: 'A sample trip' };
    axios.get.mockResolvedValueOnce({ data: tripData });

    client.trip.create.mockResolvedValueOnce({});

    await saveTrip(req, res, next);

    expect(axios.get).toHaveBeenCalledWith(
      'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips',
      expect.objectContaining({
        params: { id: '12345' },
        headers: { 'x-api-key': process.env.TRIPS_API_KEY }
      })
    );
    expect(client.trip.create).toHaveBeenCalledWith({
      data: {
        ...tripData,
        trip_id: '12345',
        userId: 1
      }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trip saved successfully', trip_id: '12345' });
  });

  it('should return 500 if an error occurs during the process', async () => {
    const error = new Error('Something went wrong');
    axios.get.mockRejectedValueOnce(error);

    await saveTrip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
  });
});