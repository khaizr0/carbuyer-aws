const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const multer = require('multer');
const path = require('path');

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Public/images/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage, fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')) });

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/create', reviewController.createReview);
router.put('/:id', upload.single('uploadImage'), reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

router.get('/employee/danh-gia', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/employee/danh-gia.html'));
});

module.exports = router;
