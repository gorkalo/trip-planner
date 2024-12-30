require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../../prisma/client');
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../utils');

exports.signup = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash } });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({ email: user.email, token: token });

  } catch (err) {
    return res.status(err?.status || 500).json({ error: err?.message || 'Something went wrong' });
  }
};

exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json(token);

  } catch (err) {
    return res.status(err?.status || 500).json({ error: err?.message || 'Something went wrong' });
  }
};