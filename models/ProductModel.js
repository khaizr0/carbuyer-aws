const { ScanCommand, PutCommand, GetCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');
const fs = require('fs');
const path = require('path');

const addCarProduct = async (carData) => {
  const docClient = getDB();
  const newCarData = {
    id: `XE${Date.now()}`,
    tenSP: carData.tenSP,
    nguyenLieuXe: carData.nguyenLieuXe,
    iDthuongHieu: carData.iDthuongHieu,
    namSanXuat: carData.namSanXuat,
    kieuDang: carData.kieuDang,
    GiaNiemYet: Number(carData.GiaNiemYet),
    soChoNgoi: carData.soChoNgoi,
    soKm: Number(carData.soKm || 0),
    mauXe: carData.mauXe,
    loaiCanSo: carData.loaiCanSo,
    hinhAnh: carData.hinhAnh || '',
    chiTietSP: carData.chiTietSP || '',
    trangThai: carData.trangThai,
    datLich: Number(carData.datLich) || 0,
    ngayTao: new Date().toISOString()
  };
  await docClient.send(new PutCommand({ TableName: 'XeOto', Item: newCarData }));
  return newCarData;
};

const addAccessoryProduct = async (accessoryData) => {
  const docClient = getDB();
  const newAccessoryData = {
    id: `PK${Date.now()}`,
    tenSP: accessoryData.tenSP,
    iDthuongHieu: accessoryData.iDthuongHieu,
    idLoai: accessoryData.idLoai,
    GiaNiemYet: Number(accessoryData.GiaNiemYet),
    chiTietSP: accessoryData.chiTietSP,
    hinhAnh: accessoryData.hinhAnh || '',
    trangThai: accessoryData.trangThai,
    datLich: Number(accessoryData.datLich) || 0,
    ngayTao: new Date().toISOString()
  };
  await docClient.send(new PutCommand({ TableName: 'PhuKien', Item: newAccessoryData }));
  return newAccessoryData;
};

const getRecentProducts = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({
    TableName: 'XeOto',
    FilterExpression: 'trangThai <> :hide',
    ExpressionAttributeValues: { ':hide': 'Hide' }
  }));
  return (result.Items || []).sort((a, b) => b.namSanXuat - a.namSanXuat).slice(0, 6);
};

const getAllProducts = async () => {
  const docClient = getDB();
  const [cars, accessories, brands] = await Promise.all([
    docClient.send(new ScanCommand({ TableName: 'XeOto' })),
    docClient.send(new ScanCommand({ TableName: 'PhuKien' })),
    docClient.send(new ScanCommand({ TableName: 'ThuongHieu' }))
  ]);

  const brandMap = (brands.Items || []).reduce((acc, brand) => {
    acc[brand.id] = brand.TenTH;
    return acc;
  }, {});

  const mapImages = (imageString) => {
    if (!imageString) return [];
    return imageString.split(' || ').map(image => `/Public/images/Database/Products/${image.trim()}`);
  };

  const formattedCars = (cars.Items || []).map(car => ({
    id: car.id,
    name: car.tenSP,
    brand: brandMap[car.iDthuongHieu] || 'Unknown',
    price: car.GiaNiemYet,
    type: 'Ô tô',
    status: car.trangThai,
    images: mapImages(car.hinhAnh)
  }));

  const formattedAccessories = (accessories.Items || []).map(acc => ({
    id: acc.id,
    name: acc.tenSP,
    brand: brandMap[acc.iDthuongHieu] || 'Unknown',
    price: acc.GiaNiemYet,
    type: 'Phụ kiện',
    status: acc.trangThai,
    images: mapImages(acc.hinhAnh)
  }));

  return [...formattedCars, ...formattedAccessories];
};

const deleteProductById = async (id) => {
  const docClient = getDB();
  const tableName = id.startsWith('XE') ? 'XeOto' : 'PhuKien';
  
  const result = await docClient.send(new GetCommand({ TableName: tableName, Key: { id } }));
  const product = result.Item;

  if (product?.hinhAnh) {
    product.hinhAnh.split(' || ').forEach(imageName => {
      const imagePath = path.join('Public/images/Database/Products/', imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  await docClient.send(new DeleteCommand({ TableName: tableName, Key: { id } }));
  return `Xóa ${tableName === 'XeOto' ? 'ô tô' : 'phụ kiện'} thành công!`;
};

const findProductById = async (productId) => {
  const docClient = getDB();
  const tableName = productId.startsWith('XE') ? 'XeOto' : 'PhuKien';
  const result = await docClient.send(new GetCommand({ TableName: tableName, Key: { id: productId } }));
  return { product: result.Item, productType: tableName === 'XeOto' ? 'XE' : 'PK' };
};

const getProductById = async (id) => {
  const docClient = getDB();
  const tableName = id.startsWith('XE') ? 'XeOto' : 'PhuKien';
  const result = await docClient.send(new GetCommand({ TableName: tableName, Key: { id } }));
  const product = result.Item;

  if (!product) throw new Error('Sản phẩm không tồn tại.');

  const images = product.hinhAnh ? product.hinhAnh.split(' || ').map(img => `/Public/images/Database/Products/${img}`) : [];

  if (tableName === 'XeOto') {
    return {
      id: product.id,
      name: product.tenSP,
      brand: product.iDthuongHieu,
      price: product.GiaNiemYet,
      year: product.namSanXuat,
      type: 'Ô tô',
      mileage: product.soKm,
      fuelType: product.nguyenLieuXe,
      color: product.mauXe,
      transmission: product.loaiCanSo,
      details: product.chiTietSP,
      status: product.trangThai === 1 ? 'Đang đăng' : 'Đã ẩn',
      booked: product.datLich === 1,
      images
    };
  }

  return {
    id: product.id,
    name: product.tenSP,
    brand: product.iDthuongHieu,
    price: product.GiaNiemYet,
    type: 'Phụ kiện',
    status: product.trangThai === 1 ? 'Đang đăng' : 'Đã ẩn',
    images
  };
};

module.exports = { addCarProduct, getRecentProducts, getAllProducts, deleteProductById, addAccessoryProduct, findProductById, getProductById };
