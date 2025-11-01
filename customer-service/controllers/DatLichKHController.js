const { addBooking, getBookingById, getAllBookings, deleteBookingById } = require('../models/DatLichKHModel');
const { docClient } = require('../config/dynamodb');
const { PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { sendBookingConfirmationEmail } = require('../utils/email-client');

const createDatLichController = async (data) => {
  try {
    if (!data.khachHangId) data.khachHangId = null;
    if (!data.ngayDat) data.ngayDat = null;
    if (!data.gioDat) data.gioDat = null;
    if (!data.dichVuId) data.dichVuId = null;

    const newDatLich = await addBooking(data);
    
    if (data.email) {
      await sendBookingConfirmationEmail({
        email: data.email,
        hoTenKH: data.hoTenKH,
        id: newDatLich.id,
        soDT: data.soDT,
        ngayTao: data.ngayTao,
        time: data.time
      });
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
    await docClient.send(new PutCommand({
      TableName: 'DatLichKH',
      Item: { id, ...data }
    }));
    return { success: true };
  } catch (error) {
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
