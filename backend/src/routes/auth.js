const express = require('express');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { lastName, firstName, org, email, password } = req.body;
  if (!lastName || !firstName || !org || !email || !password) {
    return res.status(400).json({ error: 'Бүх талбарыг бөглөнө үү' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Нууц үг 6-аас доошгүй тэмдэгт байна' });
  }
  const users = readJSON('users');
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Энэ имэйл бүртгэлтэй байна' });
  }
  const user = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    email, password: bcrypt.hashSync(password, 10),
    lastName, firstName, org,
    role: 'user', blocked: 0, points: 0,
    correctAnswers: 0, totalAnswers: 0, chaptersCompleted: [],
    registeredAt: new Date().toISOString()
  };
  users.push(user);
  writeJSON('users', users);
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email, lastName, firstName, org, role: user.role, points: 0 } });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Имэйл, нууц үгээ оруулна уу' });
  }
  const users = readJSON('users');
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Имэйл эсвэл нууц үг буруу' });
  }
  if (user.blocked) {
    return res.status(403).json({ error: 'Бүртгэл түр хаагдсан' });
  }
  const token = generateToken(user);
  res.json({
    token,
    user: { id: user.id, email: user.email, lastName: user.lastName, firstName: user.firstName, org: user.org, role: user.role, points: user.points || 0 }
  });
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ user: null });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, require('../middleware/auth').SECRET);
    const users = readJSON('users');
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.json({ user: null });
    res.json({ user: { id: user.id, email: user.email, lastName: user.lastName, firstName: user.firstName, org: user.org, role: user.role, points: user.points || 0 } });
  } catch (e) {
    res.json({ user: null });
  }
});

module.exports = router;
