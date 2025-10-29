const { getAllReviews, getReviewById, addReview, updateReview, deleteReview } = require('../models/ReviewModel');
const { getS3Url } = require('../utils/s3-upload');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('../config/s3');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    res.status(200).json(review);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.hinhAnh = req.file.key.split('/').pop();
    }
    const review = await addReview(data);
    res.status(201).json({ message: 'Thêm đánh giá thành công', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const oldReview = await getReviewById(req.params.id);
    const data = { ...req.body };
    if (req.file) {
      if (oldReview.hinhAnh) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: S3_BUCKET,
          Key: `Database/danhgia/${oldReview.hinhAnh}`
        }));
      }
      data.hinhAnh = req.file.key.split('/').pop();
    }
    const review = await updateReview(req.params.id, data);
    res.status(200).json({ message: 'Cập nhật đánh giá thành công', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    if (review.hinhAnh) {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: `Database/danhgia/${review.hinhAnh}`
      }));
    }
    await deleteReview(req.params.id);
    res.status(200).json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
