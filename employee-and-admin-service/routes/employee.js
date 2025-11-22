const path = require('path');
const express = require('express');
const router = express.Router();
const employeeAuth = require('../middlewares/employeeAuth');

const checkAuth = employeeAuth;

router.get('/san-pham', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'san-pham.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/tin-tuc', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'tin-tuc.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/lich-hen', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'lich-hen.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/danh-gia', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'danh-gia.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/slider', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'slider.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/loai-phu-kien', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'loai-phu-kien.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/thuong-hieu', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'thuong-hieu.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/kieu-dang', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'kieu-dang.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/mau-xe', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'mau-xe.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/nguyen-lieu', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'nguyen-lieu.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
});

router.get('/categories', checkAuth, (req, res) => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'views', 'employee', 'categories.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('Xin chào, ABC', `Xin chào, ${req.session.userName || 'User'}`);
  res.send(html);
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

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/employee/login');
});

module.exports = router;