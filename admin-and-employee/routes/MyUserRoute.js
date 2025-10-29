require('dotenv').config();
const express = require('express');
const { createUser, updateUser, deleteUser } = require('../controllers/MyUserController')
const { uploadUsers } = require('../utils/s3-upload');
const adminAuth = require('../middlewares/adminAuth')
const router = express.Router();

// /api/my/user

router.post('/', uploadUsers.single('anhNhanVien'), createUser);
router.put('/:id', uploadUsers.single('anhNhanVien'), updateUser);
router.delete('/:id', deleteUser);



// ví dụ thêm validation cho router
// router.post('/', upload.single('anhNhanVien'), validation.validateMyUserRequest, createUser);



module.exports = router