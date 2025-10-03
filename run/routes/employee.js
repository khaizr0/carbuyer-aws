const path = require('path');
const express = require('express');
const router = express.Router();

// Employee dashboard route (accessible only to employees)
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'employee', 'san-pham.html'));
});

module.exports = router;