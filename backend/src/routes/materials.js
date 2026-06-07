const express = require('express');
const { readJSON, writeJSON } = require('../database');
const { adminRequired } = require('../middleware/auth');
const router = express.Router();

// Get all materials (optionally filter by regulation)
router.get('/', (req, res) => {
  const mats = readJSON('materials');
  const { regulation } = req.query;
  const result = regulation ? mats.filter(m => m.regulation === parseInt(regulation)) : mats;
  res.json(result);
});

// Admin: Add material
router.post('/', adminRequired, (req, res) => {
  const { title, content, regulation, chapter } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Гарчиг ба агуулга оруулна уу' });
  const mats = readJSON('materials');
  const mat = {
    id: mats.length ? Math.max(...mats.map(m => m.id)) + 1 : 1,
    title, content, regulation: regulation || 0, chapter: chapter || 1,
    createdBy: req.user.email, createdAt: new Date().toISOString()
  };
  mats.push(mat);
  writeJSON('materials', mats);
  res.status(201).json(mat);
});

// Admin: Delete material
router.delete('/:id', adminRequired, (req, res) => {
  let mats = readJSON('materials');
  mats = mats.filter(m => m.id !== parseInt(req.params.id));
  writeJSON('materials', mats);
  res.json({ ok: true });
});

module.exports = router;
