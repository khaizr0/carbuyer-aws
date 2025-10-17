const BookingModel = require('../models/BookingModel');
const path = require('path');
const fs = require('fs');

class BookingController {
    static getTrangThaiText(trangThai) {
        switch(trangThai) {
            case 0: return 'Đã đặt';
            case 1: return 'Hoàn thành';
            case 2: return 'Đổi lịch';
            default: return 'Không xác định';
        }
    }

    static async renderBookingPage(req, res) {
        try {
            const bookings = await BookingModel.getAllBookings();
            const filePath = path.join(__dirname, '../views/employee/lich-hen.html');
            
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Lỗi đọc file:', err);
                    return res.status(500).send('Có lỗi xảy ra khi tải trang');
                }
    
                const bookingRows = bookings.map(booking => `
                    <tr>
                        <td><input type="checkbox" class="row-checkbox" data-id="${booking.id}"></td>
                        <td>${booking.tenSP}</td>
                        <td>${booking.idSP}</td>
                        <td>${booking.hoTenKH}</td>
                        <td>${booking.soDT}</td>
                        <td>${booking.email || 'N/A'}</td>
                        <td>${booking.date}</td>
                        <td>${booking.time}</td>
                        <td>${booking.loaiDichVu}</td>
                        <td>${BookingController.getTrangThaiText(booking.trangThai)}</td>
                        <td>
                            <form action="/lichHen/done" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking.id}">
                                <button type="submit" class="btn btn-success" ${booking.trangThai === 1 ? 'style="display:none;"' : ''}>
                                    <i class="fas fa-check"></i>
                                </button>
                            </form>
                            <button class="btn btn-warning change-time-btn" data-id="${booking.id}" data-date="${booking.date}"
                                data-time="${booking.time}" data-bs-toggle="modal" data-bs-target="#changeTimeModal" ${booking.trangThai === 1 ? 'style="display:none;"' : ''}>
                                <i class="fas fa-clock"></i>
                            </button>
                            <form action="/lichHen/delete" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking.id}">
                                <button type="submit" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                            </form>
                        </td>
                    </tr>
                `).join('');
    
                const modifiedHTML = data.replace(
                    /<tbody>[\s\S]*?<\/tbody>/,
                    `<tbody>${bookingRows}</tbody>`
                );
    
                res.send(modifiedHTML);
            });
        } catch (error) {
            console.error('Lỗi khi tải trang lịch hẹn:', error);
            res.status(500).send('Có lỗi xảy ra khi tải trang lịch hẹn');
        }
    }

    static async searchBookings(req, res) {
        try {
            const query = req.query;
            const bookings = await BookingModel.searchBookings(query);
            const filePath = path.join(__dirname, '../views/employee/lich-hen.html');
            
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Lỗi đọc file:', err);
                    return res.status(500).send('Có lỗi xảy ra khi tải trang');
                }
    
                const bookingRows = bookings.map(booking => `
                    <tr>
                        <td><input type="checkbox" class="row-checkbox" data-id="${booking.id}"></td>
                        <td>${booking.tenSP}</td>
                        <td>${booking.idSP}</td>
                        <td>${booking.hoTenKH}</td>
                        <td>${booking.soDT}</td>
                        <td>${booking.email || 'N/A'}</td>
                        <td>${booking.date}</td>
                        <td>${booking.time}</td>
                        <td>${booking.loaiDichVu}</td>
                        <td>${BookingController.getTrangThaiText(booking.trangThai)}</td>
                        <td>
                            <form action="/lichHen/done" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking.id}">
                                <button type="submit" class="btn btn-success" ${booking.trangThai === 1 ? 'style="display:none;"' : ''}>
                                    <i class="fas fa-check"></i>
                                </button>
                            </form>
                            <button class="btn btn-warning change-time-btn" data-id="${booking.id}" data-date="${booking.date}"
                                data-time="${booking.time}" data-bs-toggle="modal" data-bs-target="#changeTimeModal" ${booking.trangThai === 1 ? 'style="display:none;"' : ''}>
                                <i class="fas fa-clock"></i>
                            </button>
                            <form action="/lichHen/delete" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking.id}">
                                <button type="submit" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                            </form>
                        </td>
                    </tr>
                `).join('');
    
                const modifiedHTML = data.replace(
                    /<tbody>[\s\S]*?<\/tbody>/,
                    `<tbody>${bookingRows}</tbody>`
                );
    
                res.send(modifiedHTML);
            });
        } catch (error) {
            console.error('Lỗi khi tìm kiếm lịch hẹn:', error);
            res.status(500).send('Có lỗi xảy ra khi tìm kiếm lịch hẹn');
        }
    }

    static async markBookingDone(req, res) {
        try {
            const { id } = req.body;
            await BookingModel.updateBookingStatus(id, 1);
            res.redirect('/lichHen');
        } catch (error) {
            console.error('Lỗi đánh dấu hoàn thành:', error);
            res.status(500).send('Có lỗi xảy ra khi đánh dấu hoàn thành');
        }
    }

    static async changeBookingTime(req, res) {
        try {
            const { id, newDate, newTime } = req.body;
            await BookingModel.changeBookingDateTime(id, newDate, newTime);
            res.redirect('/lichHen');
        } catch (error) {
            console.error('Lỗi thay đổi thời gian:', error);
            res.status(500).send('Có lỗi xảy ra khi thay đổi thời gian');
        }
    }

    static async deleteBooking(req, res) {
        try {
            const { id } = req.body;
            await BookingModel.deleteBooking(id);
            res.redirect('/lichHen');
        } catch (error) {
            console.error('Lỗi xóa lịch hẹn:', error);
            res.status(500).send('Có lỗi xảy ra khi xóa lịch hẹn');
        }
    }
}

module.exports = BookingController;
