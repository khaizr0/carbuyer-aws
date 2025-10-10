const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

router.get('/', checkAuth, BookingController.renderBookingPage);

// Tìm kiếm lịch hẹn
router.get('/search', checkAuth, BookingController.searchBookings);

// Đánh dấu hoàn thành lịch hẹn
router.post('/done', checkAuth, BookingController.markBookingDone);

// Thay đổi thời gian lịch hẹn
router.post('/change-time', checkAuth, BookingController.changeBookingTime);

// Xóa lịch hẹn
router.post('/delete', checkAuth, BookingController.deleteBooking);

module.exports = router;