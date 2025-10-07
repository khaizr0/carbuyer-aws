const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

// Trang danh sách lịch hẹn
router.get('/', BookingController.renderBookingPage);

// Tìm kiếm lịch hẹn
router.get('/search', BookingController.searchBookings);

// Đánh dấu hoàn thành lịch hẹn
router.post('/done', BookingController.markBookingDone);

// Thay đổi thời gian lịch hẹn
router.post('/change-time', BookingController.changeBookingTime);

// Xóa lịch hẹn
router.post('/delete', BookingController.deleteBooking);

module.exports = router;