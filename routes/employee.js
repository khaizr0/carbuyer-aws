const path = require('path');
const express = require('express');
const router = express.Router();
const employeeAuth = require('../middlewares/employeeAuth');

const checkAuth = employeeAuth;

router.get('/san-pham', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'san-pham.html'));
});

router.get('/tin-tuc', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'tin-tuc.html'));
});

router.get('/lich-hen', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'lich-hen.html'));
});

router.get('/danh-gia', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'danh-gia.html'));
});

router.get('/slider', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'slider.html'));
});

router.get('/loai-phu-kien', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'loai-phu-kien.html'));
});

router.get('/thuong-hieu', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'thuong-hieu.html'));
});

router.get('/kieu-dang', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'kieu-dang.html'));
});

router.get('/mau-xe', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'mau-xe.html'));
});

router.get('/nguyen-lieu', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'nguyen-lieu.html'));
});

router.get('/categories', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'categories.html'));
});

router.get('/dashboard', checkAuth, (req, res) => {
  res.redirect('/employee/san-pham');
});

router.get('/khac', checkAuth, (req, res) => {
  res.redirect('/employee/categories');
});

router.get('/', (req, res) => {
  if (req.session.userRole === 0 || req.session.userRole === 1) {
    return res.redirect('/employee/san-pham');
  }
  res.redirect('/employee/login');
});

module.exports = router;