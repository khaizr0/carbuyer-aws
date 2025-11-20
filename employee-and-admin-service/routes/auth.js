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
  if (req.session.userId) return res.redirect('/admin/');
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
  if (req.session.userRole !== 0) {
    req.session.destroy();
    return res.redirect('/admin/login');
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'home.html'));
});

router.get('/admin/', (req, res) => {
  if (!req.session.userId) return res.redirect('/admin/login');
  if (req.session.userRole !== 0) {
    req.session.destroy();
    return res.redirect('/admin/login');
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'home.html'));
});

router.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Handle POST
const employeeLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const { getUserByEmail } = require('../models/User');
    const { comparePassword } = require('../utils/crypto-helper');
    
    console.log('Login attempt for:', userName);
    const user = await getUserByEmail(userName);
    
    if (!user) {
      console.log('User not found:', userName);
      return res.status(400).send('User not found');
    }
    
    console.log('User found:', user.email, 'Role:', user.PhanLoai);
    console.log('Password hash format:', user.matKhau);
    
    if (!comparePassword(password, user.matKhau)) {
      console.log('Invalid password for:', userName);
      return res.status(400).send('Invalid password');
    }
    
    if (user.PhanLoai !== 1) {
      console.log('Not authorized - Role:', user.PhanLoai);
      return res.status(403).send('Not authorized');
    }
    
    req.session.userId = user.id;
    req.session.userRole = user.PhanLoai;
    console.log('Login successful for:', userName);
    return res.redirect('/employee/san-pham');
  } catch (error) {
    console.error('Employee login error:', error);
    return res.status(500).send('Internal server error: ' + error.message);
  }
};

const adminLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const { getUserByEmail } = require('../models/User');
    const { comparePassword } = require('../utils/crypto-helper');
    
    console.log('Admin login attempt for:', userName);
    const user = await getUserByEmail(userName);
    
    if (!user) {
      console.log('User not found:', userName);
      return res.status(400).send('User not found');
    }
    
    console.log('User found:', user.email, 'Role:', user.PhanLoai);
    
    if (!comparePassword(password, user.matKhau)) {
      console.log('Invalid password for:', userName);
      return res.status(400).send('Invalid password');
    }
    
    if (user.PhanLoai !== 0) {
      console.log('Not authorized - Role:', user.PhanLoai);
      return res.status(403).send('Not authorized');
    }
    
    req.session.userId = user.id;
    req.session.userRole = user.PhanLoai;
    console.log('Admin login successful for:', userName);
    return res.redirect('/admin/');
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).send('Internal server error: ' + error.message);
  }
};

router.post('/employee/login', employeeLogin);
router.post('/admin/login', adminLogin);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/reset-password/:email/:token', resetPassword);

module.exports = router;