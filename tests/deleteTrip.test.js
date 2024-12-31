const { deleteTrip } = require('../src/controllers/trip'); 
const client = require('../prisma/client'); 

jest.mock('../prisma/client', () => ({
  trip: {
    delete: jest.fn()
  }
}));

describe('deleteTrip', () => {
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
    req.user = null;

    await deleteTrip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should return 400 if trip_id is not provided', async () => {
    req.body.trip_id = null;

    await deleteTrip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Trip ID is required' });
  });

  it('should return 200 and successfully delete the trip if trip is found', async () => {
    client.trip.delete.mockResolvedValueOnce({ count: 1 });

    await deleteTrip(req, res, next);

    expect(client.trip.delete).toHaveBeenCalledWith({
      where: { userId_trip_id: { userId: 1, trip_id: '12345' } }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trip deleted successfully', trip_id: '12345' });
  });

  it('should return 404 if no trips were deleted', async () => {
    client.trip.delete.mockResolvedValueOnce({ count: 0 });

    await deleteTrip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Trip not found' });
  });

  it('should return 500 if an error occurs during the process', async () => {
    const error = new Error('Something went wrong');
    client.trip.delete.mockRejectedValueOnce(error);

    await deleteTrip(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Something went wrong'
    }));
  });
});
