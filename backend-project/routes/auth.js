const express = require('express');
const router = express.Router();
const pool = require('../db');

// login (session-based)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Users WHERE UserName = ? LIMIT 1', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = rows[0];
    // NOTE: password is plain-text in demo SQL. Replace with bcrypt in production.
    if (user.Password !== password) return res.status(401).json({ message: 'Invalid credentials' });
    req.session.user = { id: user.id, username: user.UserName, employeeId: user.EmployeeId };
    res.json({ message: 'Logged in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ authenticated: false });
  res.json({ authenticated: true, user: req.session.user });
});

module.exports = router;
