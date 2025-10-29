const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');
const { getS3Url } = require('../utils/s3-upload');

const getAllReviews = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({ TableName: 'DanhGia' }));
  const reviews = result.Items || [];
  return reviews.map(review => ({
    ...review,
    hinhAnhUrl: review.hinhAnh ? getS3Url(`Database/danhgia/${review.hinhAnh}`) : null
  }));
};

const getReviewById = async (id) => {
  const docClient = getDB();
  const result = await docClient.send(new GetCommand({ TableName: 'DanhGia', Key: { id } }));
  if (!result.Item) throw new Error('Không tìm thấy đánh giá');
  const review = result.Item;
  if (review.hinhAnh) {
    review.hinhAnhUrl = getS3Url(`Database/danhgia/${review.hinhAnh}`);
  }
  return review;
};

const addReview = async (reviewData) => {
  const docClient = getDB();
  const newReview = {
    id: `DG${Date.now()}`,
    ...reviewData,
    ngayTao: new Date().toISOString()
  };
  await docClient.send(new PutCommand({ TableName: 'DanhGia', Item: newReview }));
  return newReview;
};

const updateReview = async (id, reviewData) => {
  const docClient = getDB();
  const result = await docClient.send(new GetCommand({ TableName: 'DanhGia', Key: { id } }));
  if (!result.Item) throw new Error('Không tìm thấy đánh giá');
  const updatedReview = { ...result.Item, ...reviewData };
  await docClient.send(new PutCommand({ TableName: 'DanhGia', Item: updatedReview }));
  return updatedReview;
};

const deleteReview = async (id) => {
  const docClient = getDB();
  await docClient.send(new DeleteCommand({ TableName: 'DanhGia', Key: { id } }));
  return { message: 'Xóa đánh giá thành công' };
};

module.exports = { getAllReviews, getReviewById, addReview, updateReview, deleteReview };
