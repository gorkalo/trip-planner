require('dotenv').config();
const authenticate = require('../src/middlewares/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authenticate middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
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

  it('should call next if token is valid', () => {
    const user = { id: 1 };
    const token = 'valid-jwt-token';

    req.header.mockReturnValueOnce(`Bearer ${token}`);
    jwt.verify.mockReturnValueOnce(user);

    authenticate(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if no token is provided', () => {

    req.header.mockReturnValueOnce(undefined);

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if token is invalid', () => {
    const invalidToken = 'invalid-jwt-token';
    req.header.mockReturnValueOnce(`Bearer ${invalidToken}`);
    jwt.verify.mockImplementationOnce(() => { throw new Error('Invalid token') });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if token is malformed', () => {
    const malformedToken = 'malformed-token';
    req.header.mockReturnValueOnce(`Bearer ${malformedToken}`);
    jwt.verify.mockImplementationOnce(() => { throw new Error('jwt malformed') });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle jwt.verify errors gracefully', () => {
    const errorMessage = 'jwt expired';
    req.header.mockReturnValueOnce('Bearer expired-token');
    jwt.verify.mockImplementationOnce(() => { throw new Error(errorMessage) });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token.' });
    expect(next).not.toHaveBeenCalled();
  });
});
