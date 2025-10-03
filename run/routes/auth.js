const path = require('path');
const express = require('express');
const { login, forgotPassword, resetPassword, resetPasswordPage } = require('../controllers/authController');
const router = express.Router();

// Handle GET
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'authentication', 'Admin-login.html'));
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
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'home.html'));
});

// Handle POST
router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/reset-password/:email/:token', resetPassword);

module.exports = router;