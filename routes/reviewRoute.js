const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const multer = require('multer');
const path = require('path');

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/employee/login');
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Public/images/Database/danhgia/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    }
  }
});

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/create', upload.single('uploadImage'), reviewController.createReview);
router.put('/:id', upload.single('uploadImage'), reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);



module.exports = router;
