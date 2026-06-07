const express = require('express');
const { readJSON, writeJSON } = require('../database');
const { adminRequired } = require('../middleware/auth');
const router = express.Router();

// Get quizzes
router.get('/', (req, res) => {
  const qzs = readJSON('quizzes');
  const { regulation, chapter } = req.query;
  let result = qzs;
  if (regulation) result = result.filter(q => q.regulation === parseInt(regulation));
  if (chapter) result = result.filter(q => q.chapter === parseInt(chapter));
  res.json(result);
});

// Admin: Add quiz
router.post('/', adminRequired, (req, res) => {
  const { question, options, answer, explanation, regulation, chapter } = req.body;
  if (!question || !options || options.length < 4) {
    return res.status(400).json({ error: 'Асуулт ба 4 хариулт оруулна уу' });
  }
  const qzs = readJSON('quizzes');
  const qz = {
    id: qzs.length ? Math.max(...qzs.map(q => q.id)) + 1 : 1,
    question, options, answer: answer || 0, explanation: explanation || '',
    regulation: regulation || 0, chapter: chapter || 1,
    createdBy: req.user.email, createdAt: new Date().toISOString()
  };
  qzs.push(qz);
  writeJSON('quizzes', qzs);
  res.status(201).json(qz);
});

// Admin: Delete quiz
router.delete('/:id', adminRequired, (req, res) => {
  let qzs = readJSON('quizzes');
  qzs = qzs.filter(q => q.id !== parseInt(req.params.id));
  writeJSON('quizzes', qzs);
  res.json({ ok: true });
});

module.exports = router;
