const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signup } = require('../src/controllers/auth');
const prisma = require('../prisma/client');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../prisma/client', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  }
}));

describe('signup', () => {
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

    await signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
  });

  it('should return 400 if email format is invalid', async () => {
    req.body.email = 'invalid-email';

    await signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
  });

  it('should return 400 if password length is less than 6 characters', async () => {
    req.body.password = '123';

    await signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Password must be at least 6 characters' });
  });

  it('should return 400 if user already exists', async () => {
    const existingUser = { id: 1, email: 'test@example.com' };
    prisma.user.findUnique.mockResolvedValueOnce(existingUser);

    await signup(req, res, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
  });

  it('should return 200 and a token if user is created successfully', async () => {
    const newUser = { id: 1, email: 'test@example.com' };
    const hashedPassword = 'hashedPassword123';
    const token = 'jwt-token';

    bcrypt.hash.mockResolvedValueOnce(hashedPassword);
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValueOnce(newUser);
    jwt.sign.mockReturnValueOnce(token);

    await signup(req, res, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com', password: hashedPassword }
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1 },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      email: 'test@example.com',
      token: token
    });
  });

  it('should return 500 if an error occurs during the process', async () => {
    const error = new Error('Something went wrong');
    prisma.user.create.mockRejectedValueOnce(error);

    await signup(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Something went wrong'
    }));
    
  });
});
