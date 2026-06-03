const express = require('express');
const router = express.Router();
const pool = require('../db');

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}

router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Position');
  res.json(rows);
});

router.post('/', requireAuth, async (req, res) => {
  const { PosName, RequiredQualification } = req.body;
  const [result] = await pool.query('INSERT INTO Position (PosName, RequiredQualification) VALUES (?,?)', [PosName, RequiredQualification]);
  const [rows] = await pool.query('SELECT * FROM Position WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { PosName, RequiredQualification } = req.body;
  await pool.query('UPDATE Position SET PosName=?, RequiredQualification=? WHERE id=?', [PosName, RequiredQualification, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM Position WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM Position WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
