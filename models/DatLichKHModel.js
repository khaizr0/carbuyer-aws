const { getDB } = require('../config/db');
const nodemailer = require('nodemailer');

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}
  // Cấu hình nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'khai.sendmail@gmail.com',
      pass: 'bfsjnqexelavxnhi',
    },
  });

  // Helper function để lấy email nhân viên
  async function getStaffEmails() {
    const db = getDB();
    const staffMembers = await db.collection('User').find({ PhanLoai: 1 }).toArray();
    return staffMembers.map(staff => staff.email);
  }

  // Helper function để lấy thông tin sản phẩm
  async function getProductInfo(idXe, idPhuKien) {
    const db = getDB();
    if (idXe) {
      const xe = await db.collection('XeOto').findOne({ id: idXe });
      return xe ? `Xe: ${xe.tenSP}` : '';
    } else if (idPhuKien) {
      const phuKien = await db.collection('PhuKien').findOne({ id: idPhuKien });
      return phuKien ? `Phụ kiện: ${phuKien.tenSP}` : '';
    }
    return '';
  }

  // Helper function để gửi email
  async function sendNewBookingNotification(bookingData) {
    try {
      const staffEmails = await getStaffEmails();
      if (!staffEmails.length) {
        console.log('Không tìm thấy email nhân viên');
        return;
      }

      const productInfo = await getProductInfo(bookingData.idXe, bookingData.idPhuKien);

      const mailOptions = {
        from: 'khai.sendmail@gmail.com',
        to: staffEmails.join(', '),
        subject: 'Đơn Đặt Lịch Mới',
        html: `
          <h2>Thông Tin Đơn Đặt Lịch Mới</h2>
          <p><strong>Mã đơn:</strong> ${bookingData.id}</p>
          <p><strong>Khách hàng:</strong> ${bookingData.hoTenKH}</p>
          <p><strong>Số điện thoại:</strong> ${bookingData.soDT}</p>
          <p><strong>Ngày đặt:</strong> ${formatDate(bookingData.date)}</p>
          <p><strong>Giờ đặt:</strong> ${bookingData.time}</p>
          <p><strong>Sản phẩm:</strong> ${productInfo}</p>
          <p>Vui lòng kiểm tra và xử lý đơn đặt lịch trong hệ thống.</p>
          <p>Đây là email tự động vui lòng không trả lời.</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Đã gửi email thông báo thành công');
    } catch (error) {
      console.error('Lỗi khi gửi email thông báo:', error);
    }
  }

const DatLichKHModel = {
  // Thêm một lịch hẹn mới
  async addBooking(data) {
    try {
      const db = getDB();
      console.log(data.hoTenKH);
      let idXe = null;
      let idPhuKien = null;

      if (data.idXe && data.idXe.startsWith('XE')) {
        idXe = data.idXe;
      } else if (data.idXe && data.idXe.startsWith('PK')) {
        idPhuKien = data.idXe;
      }

      // Chuyển đổi ngày sang định dạng yyyy-mm-dd
      const formattedDate = new Date(data.ngayTao).toISOString().split('T')[0];

      const bookingData = {
        id: `DL${Date.now()}`,
        hoTenKH: data.hoTenKH,
        time: data.time,
        date: formattedDate,
        soDT: data.soDT,
        idXe: idXe || null,
        idPhuKien: idPhuKien || null,
        trangThai: data.trangThai || 0,
        ngayTao: new Date(),
      };

      const result = await db.collection('DatLichKH').insertOne(bookingData);

      // Gửi email thông báo
      await sendNewBookingNotification(bookingData);

      console.log('Đặt lịch thành công:', bookingData);
      return bookingData;
    } catch (error) {
      console.error('Lỗi khi thêm lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi thêm lịch hẹn.');
    }
  },

  // Lấy tất cả các lịch hẹn
  async getAllBookings() {
    try {
      const db = getDB();
      return await db.collection('DatLichKH').find().toArray();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi lấy danh sách lịch hẹn.');
    }
  },

  // Lấy lịch hẹn theo ID
  async getBookingById(id) {
    try {
      const db = getDB();
      const booking = await db.collection('DatLichKH').findOne({ id });
      if (!booking) {
        throw new Error('Không tìm thấy lịch hẹn.');
      }
      return booking;
    } catch (error) {
      console.error('Lỗi khi lấy lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi lấy lịch hẹn.');
    }
  },

  // Cập nhật trạng thái lịch hẹn
  async updateBookingStatus(id, trangThai) {
    try {
      const db = getDB();
      const result = await db.collection('DatLichKH').updateOne(
        { id },
        { $set: { trangThai } }
      );

      if (result.modifiedCount === 0) {
        throw new Error('Không tìm thấy lịch hẹn hoặc trạng thái không thay đổi.');
      }

      console.log(`Cập nhật trạng thái thành công cho lịch hẹn ID: ${id}`);
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi cập nhật trạng thái lịch hẹn.');
    }
  },
};

module.exports = DatLichKHModel;
