const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { login } = require('../src/controllers/auth');
const prisma = require('../prisma/client');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../prisma/client', () => ({
  user: {
    findUnique: jest.fn(),
  }
}));

describe('login', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: { email: 'test@example.com', password: 'password123' }
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

  it('should return 400 if email or password is missing', async () => {
    req.body.email = null;

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
  });

  it('should return 404 if user is not found', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);

    await login(req, res, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email' });
  });

  it('should return 400 if password is invalid', async () => {
    const user = { id: 1, email: 'test@example.com', password: 'hashedPassword123' };
    prisma.user.findUnique.mockResolvedValueOnce(user);
    bcrypt.compare.mockResolvedValueOnce(false);

    await login(req, res, next);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
  });

  it('should return 200 and a token if login is successful', async () => {
    const user = { id: 1, email: 'test@example.com', password: 'hashedPassword123' };
    const token = 'jwt-token';
    prisma.user.findUnique.mockResolvedValueOnce(user);
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce(token);

    await login(req, res, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '24h' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(token);
  });

  it('should return 500 if an error occurs during the process', async () => {
    const error = new Error('Something went wrong');
    prisma.user.findUnique.mockRejectedValueOnce(error);

    await login(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Something went wrong'
    }));
  });
});
