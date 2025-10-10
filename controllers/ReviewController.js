const { getAllReviews, getReviewById, addReview, updateReview, deleteReview } = require('../models/ReviewModel');

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
    const review = await addReview(req.body);
    res.status(201).json({ message: 'Thêm đánh giá thành công', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.hinhAnh = `/Public/images/${req.file.filename}`;
    const review = await updateReview(req.params.id, data);
    res.status(200).json({ message: 'Cập nhật đánh giá thành công', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await deleteReview(req.params.id);
    res.status(200).json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
