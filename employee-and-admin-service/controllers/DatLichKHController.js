const { addBooking, getBookingById, getAllBookings, deleteBookingById } = require('../models/DatLichKHModel');
const { docClient } = require('../config/dynamodb');
const { PutCommand, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const createDatLichController = async (data) => {
  try {
    if (!data.khachHangId) data.khachHangId = null;
    if (!data.ngayDat) data.ngayDat = null;
    if (!data.gioDat) data.gioDat = null;
    if (!data.dichVuId) data.dichVuId = null;

    const newDatLich = await addBooking(data);
    
    if (data.email) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: data.email,
          subject: 'Xác nhận đăng ký lái thử xe',
          html: `
            <h2>Xác nhận đăng ký lái thử</h2>
            <p>Xin chào <strong>${data.hoTenKH}</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký lái thử xe tại showroom của chúng tôi.</p>
            <h3>Thông tin đặt lịch:</h3>
            <ul>
              <li><strong>Mã đặt lịch:</strong> ${newDatLich.id}</li>
              <li><strong>Họ tên:</strong> ${data.hoTenKH}</li>
              <li><strong>Số điện thoại:</strong> ${data.soDT}</li>
              <li><strong>Ngày:</strong> ${data.ngayTao}</li>
              <li><strong>Giờ:</strong> ${data.time}</li>
            </ul>
            <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận lịch hẹn.</p>
            <p>Trân trọng,<br>Showroom CarBuyer</p>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email đã gửi thành công tới:', data.email);
      } catch (emailError) {
        // Bỏ qua lỗi email
      }
    }
    
    return {
      message: 'Đặt lịch thành công!',
      datLich: newDatLich,
    };
  } catch (error) {
    console.error('Lỗi khi tạo đặt lịch:', error);
    throw new Error('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
  }
};

const getDatLichByIdController = async (id) => {
  try {
    const datLich = await getBookingById(id);
    return datLich;
  } catch (error) {
    console.error('Lỗi khi lấy đặt lịch:', error);
    throw new Error('Có lỗi khi lấy đặt lịch.');
  }
};

const getAllDatLichController = async () => {
  try {
    const allDatLich = await getAllBookings();
    return allDatLich;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt lịch:', error);
    throw new Error('Có lỗi khi lấy danh sách đặt lịch.');
  }
};

const updateDatLichController = async (id, data) => {
  try {
    console.log('=== UPDATE BOOKING ===');
    console.log('ID:', id);
    console.log('New data:', data);
    
    const BookingModel = require('../models/BookingModel');
    const result = await docClient.send(new GetCommand({ TableName: 'DatLichKH', Key: { id } }));
    const oldBooking = result.Item;
    
    console.log('Old booking email:', oldBooking?.email);
    
    // Merge old booking với new data, giữ lại email
    const updatedBooking = {
      ...oldBooking,
      ...data,
      id,
      email: data.email || oldBooking?.email || null
    };
    
    console.log('Updated booking email:', updatedBooking.email);
    
    // Nếu date hoặc time thay đổi, gọi email
    if (oldBooking && (oldBooking.date !== data.date || oldBooking.time !== data.time)) {
      console.log('Date/time changed, calling changeBookingDateTime...');
      await BookingModel.changeBookingDateTime(id, data.date, data.time);
    }
    
    await docClient.send(new PutCommand({
      TableName: 'DatLichKH',
      Item: updatedBooking
    }));
    return { success: true };
  } catch (error) {
    console.error('Error in updateDatLichController:', error);
    throw new Error('Có lỗi khi cập nhật lịch hẹn.');
  }
};

const deleteDatLichController = async (id) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'DatLichKH',
      Key: { id }
    }));
    return { success: true };
  } catch (error) {
    throw new Error('Có lỗi khi xóa lịch hẹn.');
  }
};

module.exports = {
  createDatLichController,
  getDatLichByIdController,
  getAllDatLichController,
  updateDatLichController,
  deleteDatLichController
};
