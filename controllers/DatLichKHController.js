const { addBooking, getBookingById, getAllBookings, deleteBookingById } = require('../models/DatLichKHModel');
const { docClient } = require('../config/dynamodb');
const { PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const createDatLichController = async (data) => {
  try {
    // Handling missing fields by setting them to null
    if (!data.khachHangId) data.khachHangId = null;
    if (!data.ngayDat) data.ngayDat = null;
    if (!data.gioDat) data.gioDat = null;
    if (!data.dichVuId) data.dichVuId = null;

    // Proceed with adding the new booking
    const newDatLich = await addBooking(data);
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
