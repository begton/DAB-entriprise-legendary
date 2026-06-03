const express = require('express');
const router = express.Router();
const pool = require('../db');

// middleware to protect routes
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}

// list with optional search
router.get('/', requireAuth, async (req, res) => {
  const { q } = req.query;
  try {
    let sql = 'SELECT e.*, d.DepartName, p.PosName FROM Employee e LEFT JOIN Department d ON e.DepartmentId=d.id LEFT JOIN Position p ON e.PositionId=p.id';
    let params = [];
    if (q) {
      sql += ' WHERE e.EmpFirstName LIKE ? OR e.EmpLastName LIKE ? OR e.EmpEmail LIKE ?';
      params = [`%${q}%`, `%${q}%`, `%${q}%`];
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get one
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Employee WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// create
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    const [result] = await pool.query('INSERT INTO Employee (EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpHireDate, EmpStatus, DepartmentId, PositionId) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [data.EmpFirstName, data.EmpLastName, data.EmpGender, data.EmpDateOfBirth, data.EmpEmail, data.EmpTelephone, data.EmpAddress, data.EmpHireDate, data.EmpStatus, data.DepartmentId || null, data.PositionId || null]);
    const [rows] = await pool.query('SELECT * FROM Employee WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    await pool.query('UPDATE Employee SET EmpFirstName=?, EmpLastName=?, EmpGender=?, EmpDateOfBirth=?, EmpEmail=?, EmpTelephone=?, EmpAddress=?, EmpHireDate=?, EmpStatus=?, DepartmentId=?, PositionId=? WHERE id=?',
      [data.EmpFirstName, data.EmpLastName, data.EmpGender, data.EmpDateOfBirth, data.EmpEmail, data.EmpTelephone, data.EmpAddress, data.EmpHireDate, data.EmpStatus, data.DepartmentId || null, data.PositionId || null, req.params.id]);
    const [rows] = await pool.query('SELECT * FROM Employee WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM Employee WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// report: employees on leave grouped by department
router.get('/report/on-leave', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Employees_On_Leave');
    const [counts] = await pool.query('SELECT * FROM Employees_On_Leave_Count');
    res.json({ rows, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
