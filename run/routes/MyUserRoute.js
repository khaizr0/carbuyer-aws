require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createUser, updateUser, deleteUser } = require('../controllers/MyUserController')
const adminAuth = require('../middlewares/adminAuth')
// const validation = require('../middlewares/validation')
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH_USERS);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Chỉ được phép tải lên tệp hình ảnh (JPEG, PNG, GIF).'), false);
        }
        cb(null, true);
    }
});

// /api/my/user

router.post('/', upload.single('anhNhanVien'), createUser);
router.put('/:id', upload.single('anhNhanVien'),  updateUser);
router.delete('/:id', deleteUser);



// ví dụ thêm validation cho router
// router.post('/', upload.single('anhNhanVien'), validation.validateMyUserRequest, createUser);



module.exports = router