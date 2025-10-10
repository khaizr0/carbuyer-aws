const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');

class BookingModel {
    static async getAllBookings() {
        const docClient = getDB();
        const result = await docClient.send(new ScanCommand({ TableName: 'DatLichKH' }));
        const bookings = result.Items || [];
        
        const processedBookings = await Promise.all(bookings.map(async (booking) => {
            let productName = 'Chưa xác định';
            let productType = 'Chưa xác định';
    
            if (booking.idXe) {
                const xe = await docClient.send(new GetCommand({ TableName: 'XeOto', Key: { id: booking.idXe } }));
                productName = xe.Item?.tenSP || 'Không xác định';
                productType = 'Đăng kí lái thử';
            }
    
            if (booking.idPhuKien) {
                const phuKien = await docClient.send(new GetCommand({ TableName: 'PhuKien', Key: { id: booking.idPhuKien } }));
                productName = phuKien.Item?.tenSP || 'Không xác định';
                productType = 'Đặt trước sản phẩm';
            }
    
            const formattedDate = booking.date ? booking.date.split('-').reverse().join('/') : 'Chưa xác định';
    
            return {
                ...booking,
                tenSP: productName,
                idSP: booking.idXe || booking.idPhuKien,
                loaiDichVu: productType,
                date: formattedDate
            };
        }));
    
        return processedBookings;
    }

    static async searchBookings(query) {
        const docClient = getDB();
        const result = await docClient.send(new ScanCommand({ TableName: 'DatLichKH' }));
        let bookings = result.Items || [];

        if (query.tenKhachHang) {
            bookings = bookings.filter(b => b.hoTenKH?.toLowerCase().includes(query.tenKhachHang.toLowerCase()));
        }
        if (query.soDT) {
            bookings = bookings.filter(b => b.soDT === query.soDT);
        }
        if (query.ngay) {
            bookings = bookings.filter(b => b.date === query.ngay);
        }
        if (query.trangThai) {
            bookings = bookings.filter(b => b.trangThai === parseInt(query.trangThai));
        }

        return await this.processBookings(bookings);
    }

    static async processBookings(bookings) {
        const docClient = getDB();
        return await Promise.all(bookings.map(async (booking) => {
            let productName = 'Chưa xác định';
            let productType = 'Chưa xác định';

            if (booking.idXe) {
                const xe = await docClient.send(new GetCommand({ TableName: 'XeOto', Key: { id: booking.idXe } }));
                productName = xe.Item?.tenSP || 'Không xác định';
                productType = 'Đăng kí lái thử';
            }

            if (booking.idPhuKien) {
                const phuKien = await docClient.send(new GetCommand({ TableName: 'PhuKien', Key: { id: booking.idPhuKien } }));
                productName = phuKien.Item?.tenSP || 'Không xác định';
                productType = 'Đặt trước sản phẩm';
            }

            const formattedDate = booking.date ? booking.date.split('-').reverse().join('/') : 'Chưa xác định';

            return {
                ...booking,
                tenSP: productName,
                idSP: booking.idXe || booking.idPhuKien,
                loaiDichVu: productType,
                date: formattedDate
            };
        }));
    }

    static async updateBookingStatus(id, status) {
        const docClient = getDB();
        const result = await docClient.send(new GetCommand({ TableName: 'DatLichKH', Key: { id } }));
        const booking = result.Item;
        if (!booking) return { modifiedCount: 0 };
        booking.trangThai = status;
        await docClient.send(new PutCommand({ TableName: 'DatLichKH', Item: booking }));
        return { modifiedCount: 1 };
    }

    static async changeBookingDateTime(id, newDate, newTime) {
        const docClient = getDB();
        const result = await docClient.send(new GetCommand({ TableName: 'DatLichKH', Key: { id } }));
        const booking = result.Item;
        if (!booking) return { modifiedCount: 0 };
        booking.date = newDate;
        booking.time = newTime;
        booking.trangThai = 2;
        await docClient.send(new PutCommand({ TableName: 'DatLichKH', Item: booking }));
        return { modifiedCount: 1 };
    }

    static async deleteBooking(id) {
        const docClient = getDB();
        await docClient.send(new DeleteCommand({ TableName: 'DatLichKH', Key: { id } }));
        return { deletedCount: 1 };
    }
}

module.exports = BookingModel;
