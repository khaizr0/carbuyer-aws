const path = require('path');
const express = require('express');
const router = express.Router();

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/employee/login');
  next();
};

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

router.get('/dashboard', checkAuth, (req, res) => {
  res.redirect('/employee/san-pham');
});

router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/employee/san-pham');
  res.redirect('/employee/login');
});

module.exports = router;