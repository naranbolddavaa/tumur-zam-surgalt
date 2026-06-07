const express = require('express');
const { readJSON, writeJSON } = require('../database');
const { authRequired } = require('../middleware/auth');
const router = express.Router();

// Save score
router.post('/', authRequired, (req, res) => {
  const { chapter, score, total } = req.body;
  const users = readJSON('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });

  user.points = (user.points || 0) + score;
  user.correctAnswers = (user.correctAnswers || 0) + score;
  user.totalAnswers = (user.totalAnswers || 0) + total;
  const chapters = JSON.parse(user.chaptersCompleted || '[]');
  if (!chapters.includes(chapter)) chapters.push(chapter);
  user.chaptersCompleted = JSON.stringify(chapters);

  writeJSON('users', users);

  const scores = readJSON('scores');
  scores.push({ id: scores.length + 1, userId: user.id, chapter, score, total, createdAt: new Date().toISOString() });
  writeJSON('scores', scores);

  res.json({ points: user.points, correctAnswers: user.correctAnswers, totalAnswers: user.totalAnswers });
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  const users = readJSON('users');
  const rankings = users
    .filter(u => u.role !== 'admin')
    .map(u => ({
      name: (u.lastName || '') + ' ' + (u.firstName || ''),
      org: u.org || '',
      points: u.points || 0,
      correctAnswers: u.correctAnswers || 0,
      totalAnswers: u.totalAnswers || 0,
      chapters: JSON.parse(u.chaptersCompleted || '[]').length
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 50);
  res.json(rankings);
});

// Get user progress
router.get('/progress', authRequired, (req, res) => {
  const users = readJSON('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.json({ points: 0, correctAnswers: 0, totalAnswers: 0, chapters: [] });
  res.json({
    points: user.points || 0,
    correctAnswers: user.correctAnswers || 0,
    totalAnswers: user.totalAnswers || 0,
    chapters: JSON.parse(user.chaptersCompleted || '[]')
  });
});

module.exports = router;
