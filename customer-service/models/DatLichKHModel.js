const { ScanCommand, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');
const nodemailer = require('nodemailer');

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'khai.sendmail@gmail.com',
    pass: 'bfsjnqexelavxnhi',
  },
});

async function getStaffEmails() {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({
    TableName: 'User',
    FilterExpression: 'PhanLoai = :phanLoai',
    ExpressionAttributeValues: { ':phanLoai': 1 }
  }));
  return (result.Items || []).map(staff => staff.email);
}

async function getProductInfo(idXe, idPhuKien) {
  const docClient = getDB();
  if (idXe) {
    const result = await docClient.send(new GetCommand({ TableName: 'XeOto', Key: { id: idXe } }));
    return result.Item ? `Xe: ${result.Item.tenSP}` : '';
  } else if (idPhuKien) {
    const result = await docClient.send(new GetCommand({ TableName: 'PhuKien', Key: { id: idPhuKien } }));
    return result.Item ? `Phụ kiện: ${result.Item.tenSP}` : '';
  }
  return '';
}

async function sendNewBookingNotification(bookingData) {
  try {
    const staffEmails = await getStaffEmails();
    if (!staffEmails.length) return;

    const productInfo = await getProductInfo(bookingData.idXe, bookingData.idPhuKien);

    await transporter.sendMail({
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
      `
    });
  } catch (error) {
  }
}

const DatLichKHModel = {
  async addBooking(data) {
    const docClient = getDB();
    let idXe = null;
    let idPhuKien = null;

    if (data.idXe?.startsWith('XE')) {
      idXe = data.idXe;
    } else if (data.idXe?.startsWith('PK')) {
      idPhuKien = data.idXe;
    }

    const formattedDate = new Date(data.ngayTao).toISOString().split('T')[0];

    const bookingData = {
      id: `DL${Date.now()}`,
      hoTenKH: data.hoTenKH,
      time: data.time,
      date: formattedDate,
      soDT: data.soDT,
      email: data.email || null,
      idXe: idXe || null,
      idPhuKien: idPhuKien || null,
      trangThai: data.trangThai || 0,
      ngayTao: new Date().toISOString()
    };

    await docClient.send(new PutCommand({ TableName: 'DatLichKH', Item: bookingData }));
    await sendNewBookingNotification(bookingData);
    return bookingData;
  },

  async getAllBookings() {
    const docClient = getDB();
    const result = await docClient.send(new ScanCommand({ TableName: 'DatLichKH' }));
    return result.Items || [];
  },

  async getBookingById(id) {
    const docClient = getDB();
    const result = await docClient.send(new GetCommand({ TableName: 'DatLichKH', Key: { id } }));
    if (!result.Item) throw new Error('Không tìm thấy lịch hẹn.');
    return result.Item;
  },

  async updateBookingStatus(id, trangThai) {
    const docClient = getDB();
    const result = await docClient.send(new GetCommand({ TableName: 'DatLichKH', Key: { id } }));
    if (!result.Item) throw new Error('Không tìm thấy lịch hẹn.');
    const booking = { ...result.Item, trangThai };
    await docClient.send(new PutCommand({ TableName: 'DatLichKH', Item: booking }));
    return true;
  }
};

module.exports = DatLichKHModel;
