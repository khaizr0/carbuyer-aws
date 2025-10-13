require('dotenv').config();
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { client, docClient } = require('./config/dynamodb');

const tables = [
  {
    TableName: 'User',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'EmailIndex',
      KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'XeOto',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'PhuKien',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'ThuongHieu',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'LoaiPhuKien',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'TinTuc',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'DatLichKH',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'DanhGia',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'Slider',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'KieuDang',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'MauXe',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  {
    TableName: 'NguyenLieuXe',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  }
];

async function createTables() {
  for (const table of tables) {
    try {
      await client.send(new CreateTableCommand(table));
      console.log(`Đã tạo table: ${table.TableName}`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`Table ${table.TableName} đã tồn tại`);
      } else {
        console.error(`Lỗi tạo table ${table.TableName}:`, error);
      }
    }
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  const sampleData = [
    { TableName: 'DatLichKH', Item: { id: 'DL001', hoTenKH: 'Nguyen Van A', time: '10:30', date: '2024-10-21', soDT: '0909123456', idXe: 'XE1733646898449', idPhuKien: null, trangThai: 0 }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK999', tenLoai: 'Khác' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK001', tenLoai: 'Camera' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK002', tenLoai: 'Cảm biến' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK003', tenLoai: 'Loa Bluetooth' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK004', tenLoai: 'Gương cầu lồi' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK005', tenLoai: 'Sạc điện thoại' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK006', tenLoai: 'Máy bơm lốp' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK007', tenLoai: 'Bọc ghế' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK008', tenLoai: 'Thảm lót sàn' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK009', tenLoai: 'Tẩu sạc đa năng' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK010', tenLoai: 'Hệ thống định vị GPS' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK011', tenLoai: 'Đèn LED' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK012', tenLoai: 'Kính chắn nắng' }},
    { TableName: 'LoaiPhuKien', Item: { id: 'LPK013', tenLoai: 'Túi khí bổ sung' }},
    { TableName: 'PhuKien', Item: { id: 'PK1732901518686', tenSP: 'Camera hành trình', iDthuongHieu: 'THPK001', idLoai: 'LPK001', GiaNiemYet: 312312, chiTietSP: 'Camera hành trình full HD.', hinhAnh: 'camera_hanh_trinh.jpg', trangThai: 'Mới', datLich: 0, ngayTao: '2024-01-15T00:00:00.000Z' }},
    { TableName: 'PhuKien', Item: { id: 'PK002', tenSP: 'Cảm biến áp suất lốp', iDthuongHieu: 'THPK002', idLoai: 'LPK002', GiaNiemYet: 1500000, chiTietSP: 'Cảm biến chính xác, tích hợp hiển thị màn hình.', hinhAnh: 'cam_bien_ap_suat_lop.jpg', trangThai: 'Mới', datLich: 0, ngayTao: '2024-01-20T00:00:00.000Z' }},
    { TableName: 'ThuongHieu', Item: { id: 'THKHAC0', TenTH: 'Khác', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE001', TenTH: 'Toyota', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE002', TenTH: 'Honda', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE003', TenTH: 'Ford', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE004', TenTH: 'Hyundai', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE005', TenTH: 'Kia', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE006', TenTH: 'Mazda', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE007', TenTH: 'Chevrolet', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE008', TenTH: 'BMW', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE009', TenTH: 'Mercedes-Benz', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE010', TenTH: 'Audi', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE011', TenTH: 'Nissan', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE012', TenTH: 'Mitsubishi', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE013', TenTH: 'Lexus', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE014', TenTH: 'Volkswagen', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THXE015', TenTH: 'Subaru', idPhanLoaiTH: 0 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK001', TenTH: 'Bosch', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK002', TenTH: 'Pioneer', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK003', TenTH: 'Bridgestone', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK004', TenTH: 'Michelin', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK005', TenTH: 'Philips', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK006', TenTH: 'Hankook', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK007', TenTH: 'Kenwood', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK008', TenTH: 'Sony', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK009', TenTH: 'Thule', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK010', TenTH: 'Yokohama', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK011', TenTH: 'Mobil 1', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK012', TenTH: 'Castrol', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK013', TenTH: 'Denso', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK014', TenTH: 'NGK', idPhanLoaiTH: 1 }},
    { TableName: 'ThuongHieu', Item: { id: 'THPK015', TenTH: 'Goodyear', idPhanLoaiTH: 1 }},
    { TableName: 'TinTuc', Item: { id: 'TT001', tenTT: 'Toyota ra mắt Camry mới', anhDaiDien: 'camry_news.png', chiTietBaiViet: 'Toyota chính thức ra mắt dòng Camry 2023...', ngayDang: '2024-10-16', trangThai: 1 }},
    { TableName: 'TinTuc', Item: { id: 'TT002', tenTT: 'Honda Civic 2024 có gì mới?', anhDaiDien: 'civic_news.png', chiTietBaiViet: 'Honda đã cập nhật dòng Civic mới với nhiều tính năng nổi bật...', ngayDang: '2024-11-01', trangThai: 1 }},
    { TableName: 'User', Item: { id: 'U001', hoTen: 'Nguyen Van B', email: 'nguyenvanb@example.com', ngaySinh: '1990-05-10', gioiTinh: 'Nam', cccd: '123456789', matKhau: 'e6a6b5bed8bad4efeba3ab7b2d010514:d9c6265fcb454ac38f9ad9b1dde43a95b1325502213dad05b0ab2c4311a768eef27b6876be11853eb2c9cc07ba099c3df54259490722c8c966eaa1e5ce21dffc', anhNhanVien: 'avatar_nguyenvanb.png', PhanLoai: 0 }},
    { TableName: 'User', Item: { id: 'U002', hoTen: 'Le Thi C', email: 'caophankhai123@gmail.com', ngaySinh: '1992-08-15', gioiTinh: 'Nu', cccd: '987654321', matKhau: 'e6a6b5bed8bad4efeba3ab7b2d010514:d9c6265fcb454ac38f9ad9b1dde43a95b1325502213dad05b0ab2c4311a768eef27b6876be11853eb2c9cc07ba099c3df54259490722c8c966eaa1e5ce21dffc', anhNhanVien: 'avatar_lethic.png', PhanLoai: 1 }},
    { TableName: 'XeOto', Item: { id: 'XE001', tenSP: 'Toyota Camry', idNguyenLieu: 'NL001', iDthuongHieu: 'THXE001', namSanXuat: 2023, idKieuDang: 'KD001', GiaNiemYet: 1000000000, soChoNgoi: 5, soKm: 0, idMauXe: 'MX001', loaiCanSo: 'automatic', hinhAnh: 'toyota_camry.jpg', chiTietSP: 'Xe nhập khẩu, đời mới 2023.', trangThai: 'Mới', datLich: 1, ngayTao: '2024-02-01T00:00:00.000Z' }},
    { TableName: 'XeOto', Item: { id: 'XE002', tenSP: 'Honda CR-V', idNguyenLieu: 'NL001', iDthuongHieu: 'THXE002', namSanXuat: 2023, idKieuDang: 'KD002', GiaNiemYet: 900000000, soChoNgoi: 7, soKm: 0, idMauXe: 'MX002', loaiCanSo: 'automatic', hinhAnh: 'honda_crv.jpg', chiTietSP: 'Xe gia đình, đời mới 2023.', trangThai: 'Mới', datLich: 0, ngayTao: '2024-02-10T00:00:00.000Z' }},
    { TableName: 'DanhGia', Item: { id: 'DG001', tenKH: 'Anh Nam', noiDung: 'Tư vấn nhiệt tình, thân thiện', hinhAnh: '/Public/images/pro5-picture.jpg' }},
    { TableName: 'DanhGia', Item: { id: 'DG002', tenKH: 'Chị Hằng', noiDung: 'Dịch vụ chu đáo, chuyên nghiệp', hinhAnh: '/Public/images/pro5-picture.jpg' }},
    { TableName: 'Slider', Item: { id: 'SL001', tieuDe: 'Slide 1', hinhAnh: '/Public/images/SlideShow/img5.png' }},
    { TableName: 'Slider', Item: { id: 'SL002', tieuDe: 'Slide 2', hinhAnh: '/Public/images/SlideShow/img2.png' }},
    { TableName: 'Slider', Item: { id: 'SL003', tieuDe: 'Slide 3', hinhAnh: '/Public/images/SlideShow/img3.jpg' }},
    { TableName: 'KieuDang', Item: { id: 'KD001', tenKieuDang: 'Sedan' }},
    { TableName: 'KieuDang', Item: { id: 'KD002', tenKieuDang: 'SUV' }},
    { TableName: 'KieuDang', Item: { id: 'KD003', tenKieuDang: 'Hatchback' }},
    { TableName: 'KieuDang', Item: { id: 'KD004', tenKieuDang: 'Coupe' }},
    { TableName: 'KieuDang', Item: { id: 'KD005', tenKieuDang: 'Convertible' }},
    { TableName: 'KieuDang', Item: { id: 'KD006', tenKieuDang: 'Pickup' }},
    { TableName: 'KieuDang', Item: { id: 'KD007', tenKieuDang: 'Minivan' }},
    { TableName: 'MauXe', Item: { id: 'MX001', tenMau: 'Đen' }},
    { TableName: 'MauXe', Item: { id: 'MX002', tenMau: 'Trắng' }},
    { TableName: 'MauXe', Item: { id: 'MX003', tenMau: 'Xám' }},
    { TableName: 'MauXe', Item: { id: 'MX004', tenMau: 'Bạc' }},
    { TableName: 'MauXe', Item: { id: 'MX005', tenMau: 'Đỏ' }},
    { TableName: 'MauXe', Item: { id: 'MX006', tenMau: 'Xanh dương' }},
    { TableName: 'MauXe', Item: { id: 'MX007', tenMau: 'Vàng' }},
    { TableName: 'MauXe', Item: { id: 'MX008', tenMau: 'Nâu' }},
    { TableName: 'NguyenLieuXe', Item: { id: 'NL001', tenNguyenLieu: 'Xăng' }},
    { TableName: 'NguyenLieuXe', Item: { id: 'NL002', tenNguyenLieu: 'Dầu Diesel' }},
    { TableName: 'NguyenLieuXe', Item: { id: 'NL003', tenNguyenLieu: 'Điện' }},
    { TableName: 'NguyenLieuXe', Item: { id: 'NL004', tenNguyenLieu: 'Hybrid' }}
  ];

  for (const data of sampleData) {
    try {
      await docClient.send(new PutCommand(data));
      console.log(`Đã thêm: ${data.Item.id}`);
    } catch (error) {
      console.error(`Lỗi thêm ${data.Item.id}:`, error.message);
    }
  }

  console.log('Hoàn thành!');
}

createTables();
