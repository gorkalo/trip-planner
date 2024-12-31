const { getSavedTrips } = require('../src/controllers/trip');
const client = require('../prisma/client');

jest.mock('../prisma/client', () => ({
  trip: {
    findMany: jest.fn()
  }
}));

describe('getSavedTrips', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 1 },
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
    req.user = null;

    await getSavedTrips(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should return 200 with trips data if trips are found', async () => {
    const trips = [
      { id: '1', trip_id: '12345', name: 'Trip 1' },
      { id: '2', trip_id: '67890', name: 'Trip 2' }
    ];
    client.trip.findMany.mockResolvedValueOnce(trips);

    await getSavedTrips(req, res, next);

    expect(client.trip.findMany).toHaveBeenCalledWith({
      where: { userId: 1 }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trips);
  });

  it('should return 404 with an no saved trips are found message', async () => {
    client.trip.findMany.mockResolvedValueOnce([]);

    await getSavedTrips(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No saved trips found' });
  });

  it('should return 500 if an error occurs during the process', async () => {
    const error = new Error('Something went wrong');
    client.trip.findMany.mockRejectedValueOnce(error);

    await getSavedTrips(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Something went wrong'
    }));

  });
});
