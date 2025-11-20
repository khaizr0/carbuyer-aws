const { ScanCommand, PutCommand, GetCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');
const fs = require('fs');
const path = require('path');

const addCarProduct = async (carData) => {
  const docClient = getDB();
  const newCarData = {
    id: `XE${Date.now()}`,
    tenSP: carData.tenSP,
    idNguyenLieu: carData.nguyenLieu,
    iDthuongHieu: carData.iDthuongHieu,
    namSanXuat: carData.namSanXuat,
    idKieuDang: carData.kieuDang,
    GiaNiemYet: Number(carData.GiaNiemYet),
    soChoNgoi: carData.soChoNgoi,
    soKm: Number(carData.soKm || 0),
    idMauXe: carData.mauXe,
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
  const [cars, accessories, brands, styles, colors, fuels] = await Promise.all([
    docClient.send(new ScanCommand({ TableName: 'XeOto' })),
    docClient.send(new ScanCommand({ TableName: 'PhuKien' })),
    docClient.send(new ScanCommand({ TableName: 'ThuongHieu' })),
    docClient.send(new ScanCommand({ TableName: 'KieuDang' })),
    docClient.send(new ScanCommand({ TableName: 'MauXe' })),
    docClient.send(new ScanCommand({ TableName: 'NguyenLieuXe' }))
  ]);

  const brandMap = (brands.Items || []).reduce((acc, brand) => {
    acc[brand.id] = brand.TenTH;
    return acc;
  }, {});

  const styleMap = (styles.Items || []).reduce((acc, style) => {
    acc[style.id] = style.tenKieuDang;
    return acc;
  }, {});

  const colorMap = (colors.Items || []).reduce((acc, color) => {
    acc[color.id] = color.tenMau;
    return acc;
  }, {});

  const fuelMap = (fuels.Items || []).reduce((acc, fuel) => {
    acc[fuel.id] = fuel.tenNguyenLieu;
    return acc;
  }, {});

  const formattedCars = (cars.Items || []).map(car => {
    const imageFileName = car.hinhAnh ? car.hinhAnh.split(' || ')[0].trim() : '';
    const price = Number(car.GiaNiemYet) || 0;
    return {
      id: car.id,
      name: car.tenSP,
      brand: brandMap[car.iDthuongHieu] || 'Unknown',
      price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
      year: car.namSanXuat,
      mileage: car.soKm ? car.soKm.toLocaleString('vi-VN') + ' km' : '0 km',
      fuelType: fuelMap[car.idNguyenLieu] || 'N/A',
      imageUrl: imageFileName ? `${process.env.S3_PUBLIC_URL}/Database/Products/${imageFileName}` : '/employee/Public/images/no-image-found.jpg',
      brandId: car.iDthuongHieu,
      type: 'Xe',
      style: styleMap[car.idKieuDang] || car.idKieuDang,
      styleId: car.idKieuDang,
      color: colorMap[car.idMauXe] || car.idMauXe,
      colorId: car.idMauXe,
      fuelId: car.idNguyenLieu,
      status: car.trangThai,
      createdAt: new Date(car.ngayTao || 0).getTime()
    };
  });

  const formattedAccessories = (accessories.Items || []).map(acc => {
    const imageFileName = acc.hinhAnh ? acc.hinhAnh.split(' || ')[0].trim() : '';
    const price = Number(acc.GiaNiemYet) || 0;
    return {
      id: acc.id,
      name: acc.tenSP,
      brand: brandMap[acc.iDthuongHieu] || 'Unknown',
      price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
      imageUrl: imageFileName ? `${process.env.S3_PUBLIC_URL}/Database/Products/${imageFileName}` : '/employee/Public/images/no-image-found.jpg',
      brandId: acc.iDthuongHieu,
      categoryId: acc.idLoai,
      type: 'Phụ kiện',
      status: acc.trangThai,
      createdAt: new Date(acc.ngayTao || 0).getTime()
    };
  });

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
  console.log('=== FIND PRODUCT BY ID ===');
  console.log('Product ID:', productId);
  
  const docClient = getDB();
  const tableName = productId.startsWith('XE') ? 'XeOto' : 'PhuKien';
  console.log('Table name:', tableName);
  
  try {
    const result = await docClient.send(new GetCommand({ TableName: tableName, Key: { id: productId } }));
    console.log('DynamoDB result:', result);
    console.log('Product found:', result.Item ? 'YES' : 'NO');
    
    return { product: result.Item, productType: tableName === 'XeOto' ? 'XE' : 'PK' };
  } catch (error) {
    console.error('DynamoDB error:', error);
    throw error;
  }
};

const getRelatedProducts = async (kieuDang, currentId) => {
  const docClient = getDB();
  let result = await docClient.send(new ScanCommand({
    TableName: 'XeOto',
    FilterExpression: 'idKieuDang = :kieuDang AND id <> :currentId AND trangThai <> :hide',
    ExpressionAttributeValues: {
      ':kieuDang': kieuDang,
      ':currentId': currentId,
      ':hide': 'Hide'
    }
  }));
  
  if (!result.Items || result.Items.length === 0) {
    result = await docClient.send(new ScanCommand({
      TableName: 'XeOto',
      FilterExpression: 'id <> :currentId AND trangThai <> :hide',
      ExpressionAttributeValues: {
        ':currentId': currentId,
        ':hide': 'Hide'
      }
    }));
  }
  
  const fuels = await docClient.send(new ScanCommand({ TableName: 'NguyenLieuXe' }));
  const fuelMap = (fuels.Items || []).reduce((acc, f) => {
    acc[f.id] = f.tenNguyenLieu;
    return acc;
  }, {});
  
  return (result.Items || []).slice(0, 3).map(p => ({
    ...p,
    fuelType: fuelMap[p.idNguyenLieu] || 'N/A'
  }));
};

const getProductById = async (id) => {
  const docClient = getDB();
  const tableName = id.startsWith('XE') ? 'XeOto' : 'PhuKien';
  const result = await docClient.send(new GetCommand({ TableName: tableName, Key: { id } }));
  const product = result.Item;

  if (!product) throw new Error('Sản phẩm không tồn tại.');

  const images = product.hinhAnh ? product.hinhAnh.split(' || ').map(img => `${process.env.S3_PUBLIC_URL}/Database/Products/${img}`) : [];

  if (tableName === 'XeOto') {
    const [fuelRes, colorRes] = await Promise.all([
      product.idNguyenLieu ? docClient.send(new GetCommand({ TableName: 'NguyenLieuXe', Key: { id: product.idNguyenLieu } })) : null,
      product.idMauXe ? docClient.send(new GetCommand({ TableName: 'MauXe', Key: { id: product.idMauXe } })) : null
    ]);
    
    return {
      id: product.id,
      name: product.tenSP,
      brand: product.iDthuongHieu,
      price: product.GiaNiemYet,
      year: product.namSanXuat,
      type: 'Ô tô',
      mileage: product.soKm,
      fuelType: fuelRes?.Item?.tenNguyenLieu || 'N/A',
      color: colorRes?.Item?.tenMau || 'N/A',
      transmission: product.loaiCanSo,
      seats: product.soChoNgoi,
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

module.exports = { addCarProduct, getRecentProducts, getAllProducts, deleteProductById, addAccessoryProduct, findProductById, getProductById, getRelatedProducts };
