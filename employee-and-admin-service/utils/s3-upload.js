const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3Client, S3_BUCKET } = require('../config/s3');
const path = require('path');

// Upload cho Products
const uploadProducts = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: S3_BUCKET,
    key: (req, file, cb) => {
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, `Database/Products/${filename}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    }
  },
  limits: { files: 5 }
});

// Upload cho Tin tức
const uploadNews = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: S3_BUCKET,
    key: (req, file, cb) => {
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, `Database/tintuc/${filename}`);
    }
  }),
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

// Upload cho Đánh giá
const uploadReviews = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: S3_BUCKET,
    key: (req, file, cb) => {
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, `Database/danhgia/${filename}`);
    }
  }),
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

// Upload cho Users
const uploadUsers = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: S3_BUCKET,
    key: (req, file, cb) => {
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, `Database/Users/${filename}`);
    }
  }),
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

// Upload cho Slider
const uploadSlider = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: S3_BUCKET,
    key: (req, file, cb) => {
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, `SlideShow/${filename}`);
    }
  }),
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

// Helper function để lấy URL
function getS3Url(key) {
  return `${process.env.S3_PUBLIC_URL}/${key}`;
}

module.exports = {
  uploadProducts,
  uploadNews,
  uploadReviews,
  uploadUsers,
  uploadSlider,
  getS3Url
};
