const { ScanCommand, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');

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
      idXe: idXe || null,
      idPhuKien: idPhuKien || null,
      trangThai: data.trangThai || 0,
      ngayTao: new Date().toISOString()
    };

    await docClient.send(new PutCommand({ TableName: 'DatLichKH', Item: bookingData }));
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
