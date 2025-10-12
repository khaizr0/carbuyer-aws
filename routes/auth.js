const path = require('path');
const express = require('express');
const { login, forgotPassword, resetPassword, resetPasswordPage } = require('../controllers/authController');
const router = express.Router();

// Handle GET
router.get('/employee/login', (req, res) => {
  if (req.session.userId) return res.redirect('/employee/san-pham');
  res.sendFile(path.join(__dirname, '..', 'views', 'authentication', 'Employee-login.html'));
});

router.get('/admin/login', (req, res) => {
  if (req.session.userId) return res.redirect('/admin');
  res.sendFile(path.join(__dirname, '..', 'views', 'authentication', 'Admin-login.html'));
});

router.get('/login', (req, res) => {
  res.redirect('/employee/login');
});

router.get('/forgot', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views','authentication', 'forgot-password.html'));
});

router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views','authentication', 'reset-password.html'));
});

router.get('/email-sent-success', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views','authentication', 'email-sent-success.html'));
});

router.get('/reset-password/:email/:token', resetPasswordPage);

router.get('/reset-password', resetPassword);

// session
router.get('/admin', (req, res) => {
  if (!req.session.userId) return res.redirect('/admin/login');
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'home.html'));
});

// Handle POST
const employeeLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const { getUserByEmail } = require('../models/User');
    const { comparePassword } = require('../utils/crypto-helper');
    const user = await getUserByEmail(userName);
    if (!user) return res.status(400).send('User not found');
    if (!comparePassword(password, user.matKhau)) return res.status(400).send('Invalid password');
    if (user.PhanLoai !== 1) return res.status(403).send('Not authorized');
    req.session.userId = user.id;
    req.session.userRole = user.PhanLoai;
    return res.redirect('/employee/san-pham');
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
};

const adminLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const { getUserByEmail } = require('../models/User');
    const { comparePassword } = require('../utils/crypto-helper');
    const user = await getUserByEmail(userName);
    if (!user) return res.status(400).send('User not found');
    if (!comparePassword(password, user.matKhau)) return res.status(400).send('Invalid password');
    if (user.PhanLoai !== 0) return res.status(403).send('Not authorized');
    req.session.userId = user.id;
    req.session.userRole = user.PhanLoai;
    return res.redirect('/admin');
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
};

router.post('/employee/login', employeeLogin);
router.post('/admin/login', adminLogin);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/reset-password/:email/:token', resetPassword);

module.exports = router;