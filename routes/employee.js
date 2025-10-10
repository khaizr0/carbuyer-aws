const path = require('path');
const express = require('express');
const router = express.Router();

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

router.get('/dashboard', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'san-pham.html'));
});

module.exports = router;