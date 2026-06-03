const express = require('express');
const router = express.Router();
const pool = require('../db');

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}

router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Department');
  res.json(rows);
});

router.post('/', requireAuth, async (req, res) => {
  const { DepartName } = req.body;
  const [result] = await pool.query('INSERT INTO Department (DepartName) VALUES (?)', [DepartName]);
  const [rows] = await pool.query('SELECT * FROM Department WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { DepartName } = req.body;
  await pool.query('UPDATE Department SET DepartName=? WHERE id=?', [DepartName, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM Department WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM Department WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
