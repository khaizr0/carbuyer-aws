const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const { uploadReviews } = require('../utils/s3-upload');

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/employee/login');
  next();
};

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/create', uploadReviews.single('uploadImage'), reviewController.createReview);
router.put('/:id', uploadReviews.single('uploadImage'), reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);



module.exports = router;
