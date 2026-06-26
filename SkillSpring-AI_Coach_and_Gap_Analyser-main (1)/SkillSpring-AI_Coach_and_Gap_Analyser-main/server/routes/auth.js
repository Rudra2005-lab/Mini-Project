const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getSqliteDb } = require('../config/sqliteDb');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-fallback-secret-12345';

// SIGNUP
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Basic password validation
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const db = getSqliteDb();

  // Check if user already exists
  db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error while checking user.', error: err.message });
    }
    
    if (row) {
      return res.status(409).json({ message: 'User with this email or username already exists.' });
    }

    try {
      // Secure password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Store user
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function (insertErr) {
          if (insertErr) {
            return res.status(500).json({ message: 'Failed to create user.', error: insertErr.message });
          }

          const newUserId = this.lastID;
          
          const token = jwt.sign(
            { id: newUserId, username, email, role: 'student' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'User created successfully.',
            user: { id: newUserId, username, email, role: 'student' },
            token,
          });
        }
      );
    } catch (hashError) {
      res.status(500).json({ message: 'Error securing password.', error: hashError.message });
    }
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Username and password are required.' });
  }

  // Bypass database dynamically: Always auto-authenticate any credentials
  const mockUserId = Math.floor(Math.random() * 100000);
  
  const token = jwt.sign(
    { id: mockUserId, username: identifier, email: identifier, role: 'student' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    message: 'Auto-Login successful (Bypass mode active).',
    user: { id: 'local-dev', username: 'Ronit Mexson', email: 'ronit@local.dev', role: 'student' },
    token,
  });
});

module.exports = router;
