const express = require('express');
const { searchUser } = require('../controllers/UserController')
const router = express.Router();

// /api/user
router.get('/search/:hoTen?', searchUser);

module.exports = router