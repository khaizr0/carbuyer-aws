//chạy "npm run db" để tạo database
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function createDatabase() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);

        // // Tạo các collection
        await db.createCollection('DatLichKH');
        await db.createCollection('LoaiPhuKien');
        await db.createCollection('PhuKien');
        await db.createCollection('ThuongHieu');
        await db.createCollection('TinTuc');
        await db.createCollection('User');
        await db.createCollection('XeOto');

        console.log('Đã tạo xong các collection');

        // Thêm dữ liệu vào từng collection
        await db.collection('DatLichKH').insertOne({
            id: "DL001",
            hoTenKH: "Nguyen Van A",
            time: "10:30",
            date: "2024-10-21",
            soDT: "0909123456",
            idXe: "XE1733646898449",
            idPhuKien: null,
            trangThai: 0
        });

        await db.collection('LoaiPhuKien').insertMany([
            { id: "LPK999", tenLoai: "Khác" },
            { id: "LPK001", tenLoai: "Camera" },
            { id: "LPK002", tenLoai: "Cảm biến" },
            { id: "LPK003", tenLoai: "Loa Bluetooth" },
            { id: "LPK004", tenLoai: "Gương cầu lồi" },
            { id: "LPK005", tenLoai: "Sạc điện thoại" },
            { id: "LPK006", tenLoai: "Máy bơm lốp" },
            { id: "LPK007", tenLoai: "Bọc ghế" },
            { id: "LPK008", tenLoai: "Thảm lót sàn" },
            { id: "LPK009", tenLoai: "Tẩu sạc đa năng" },
            { id: "LPK010", tenLoai: "Hệ thống định vị GPS" },
            { id: "LPK011", tenLoai: "Đèn LED" },
            { id: "LPK012", tenLoai: "Kính chắn nắng" },
            { id: "LPK013", tenLoai: "Túi khí bổ sung" },
        ]);

        await db.collection('PhuKien').insertMany([
            {
                id: "PK1732901518686",
                tenSP: "Camera hành trình",
                iDthuongHieu: "TH001",
                idLoai: "LPK001",
                GiaNiemYet: 312312,
                chiTietSP: "Camera hành trình full HD.",
                hinhAnh: "camera_hanh_trinh.jpg",
                trangThai: "Mới",
                datLich: 0,
                ngayTao: 0
            },
            {
                id: "PK002",
                tenSP: "Cảm biến áp suất lốp",
                iDthuongHieu: "TH002",
                idLoai: "LPK002",
                GiaNiemYet: 1500000,
                chiTietSP: "Cảm biến chính xác, tích hợp hiển thị màn hình.",
                hinhAnh: "cam_bien_ap_suat_lop.jpg",
                trangThai: "Mới",
                datLich: 0,
                ngayTao: 0
            }
        ]);

        await db.collection('ThuongHieu').insertMany([
            { id: "THKHAC0", TenTH: "Khác", idPhanLoaiTH: 0 },
            // Xe
            { id: "THXE001", TenTH: "Toyota", idPhanLoaiTH: 0 },
            { id: "THXE002", TenTH: "Honda", idPhanLoaiTH: 0 },
            { id: "THXE003", TenTH: "Ford", idPhanLoaiTH: 0 },
            { id: "THXE004", TenTH: "Hyundai", idPhanLoaiTH: 0 },
            { id: "THXE005", TenTH: "Kia", idPhanLoaiTH: 0 },
            { id: "THXE006", TenTH: "Mazda", idPhanLoaiTH: 0 },
            { id: "THXE007", TenTH: "Chevrolet", idPhanLoaiTH: 0 },
            { id: "THXE008", TenTH: "BMW", idPhanLoaiTH: 0 },
            { id: "THXE009", TenTH: "Mercedes-Benz", idPhanLoaiTH: 0 },
            { id: "THXE010", TenTH: "Audi", idPhanLoaiTH: 0 },
            { id: "THXE011", TenTH: "Nissan", idPhanLoaiTH: 0 },
            { id: "THXE012", TenTH: "Mitsubishi", idPhanLoaiTH: 0 },
            { id: "THXE013", TenTH: "Lexus", idPhanLoaiTH: 0 },
            { id: "THXE014", TenTH: "Volkswagen", idPhanLoaiTH: 0 },
            { id: "THXE015", TenTH: "Subaru", idPhanLoaiTH: 0 },
            // Phụ Kiện
            { id: "THPK001", TenTH: "Bosch", idPhanLoaiTH: 1 },
            { id: "THPK002", TenTH: "Pioneer", idPhanLoaiTH: 1 },
            { id: "THPK003", TenTH: "Bridgestone", idPhanLoaiTH: 1 },
            { id: "THPK004", TenTH: "Michelin", idPhanLoaiTH: 1 },
            { id: "THPK005", TenTH: "Philips", idPhanLoaiTH: 1 },
            { id: "THPK006", TenTH: "Hankook", idPhanLoaiTH: 1 },
            { id: "THPK007", TenTH: "Kenwood", idPhanLoaiTH: 1 },
            { id: "THPK008", TenTH: "Sony", idPhanLoaiTH: 1 },
            { id: "THPK009", TenTH: "Thule", idPhanLoaiTH: 1 },
            { id: "THPK010", TenTH: "Yokohama", idPhanLoaiTH: 1 },
            { id: "THPK011", TenTH: "Mobil 1", idPhanLoaiTH: 1 },
            { id: "THPK012", TenTH: "Castrol", idPhanLoaiTH: 1 },
            { id: "THPK013", TenTH: "Denso", idPhanLoaiTH: 1 },
            { id: "THPK014", TenTH: "NGK", idPhanLoaiTH: 1 },
            { id: "THPK015", TenTH: "Goodyear", idPhanLoaiTH: 1 }
        ]);

        await db.collection('TinTuc').insertMany([
            {
                id: "TT001",
                tenTT: "Toyota ra mắt Camry mới",
                anhDaiDien: "camry_news.png",
                chiTietBaiViet: "Toyota chính thức ra mắt dòng Camry 2023...",
                ngayDang: "2024-10-16",
                trangThai: 1
            },
            {
                id: "TT002",
                tenTT: "Honda Civic 2024 có gì mới?",
                anhDaiDien: "civic_news.png",
                chiTietBaiViet: "Honda đã cập nhật dòng Civic mới với nhiều tính năng nổi bật...",
                ngayDang: "2024-11-01",
                trangThai: 1
            }
        ]);

        await db.collection('User').insertOne({
            id: "U001",
            hoTen: "Nguyen Van B",
            email: "nguyenvanb@example.com",
            ngaySinh: "1990-05-10",
            gioiTinh: "Nam",
            cccd: "123456789",
            matKhau: "e6a6b5bed8bad4efeba3ab7b2d010514:d9c6265fcb454ac38f9ad9b1dde43a95b1325502213dad05b0ab2c4311a768eef27b6876be11853eb2c9cc07ba099c3df54259490722c8c966eaa1e5ce21dffc", //Pass: hashedpassword123
            anhNhanVien: "avatar_nguyenvanb.png",
            PhanLoai: 0
        });

        await db.collection('User').insertOne({
            id: "U002",
            hoTen: "Le Thi C",
            email: "caophankhai123@gmail.com",
            ngaySinh: "1992-08-15",
            gioiTinh: "Nu",
            cccd: "987654321",
            matKhau: "e6a6b5bed8bad4efeba3ab7b2d010514:d9c6265fcb454ac38f9ad9b1dde43a95b1325502213dad05b0ab2c4311a768eef27b6876be11853eb2c9cc07ba099c3df54259490722c8c966eaa1e5ce21dffc", //Pass: hashedpassword123
            anhNhanVien: "avatar_lethic.png",
            PhanLoai: 1
        });
        

        await db.collection('XeOto').insertMany([
            {
                id: "XE001",
                tenSP: "Toyota Camry",
                nguyenLieuXe: "Xăng",
                iDthuongHieu: "TH001",
                namSanXuat: 2023,
                kieuDang: "Sedan",
                GiaNiemYet: 1000000000,
                soChoNgoi: 5,
                soKm: 0,
                mauXe: "Đen",
                loaiCanSo: "automatic",
                hinhAnh: "toyota_camry.jpg",
                chiTietSP: "Xe nhập khẩu, đời mới 2023.",
                trangThai: "Mới",
                datLich: 1,
                ngayTao: 0
            },
            {
                id: "XE002",
                tenSP: "Honda CR-V",
                nguyenLieuXe: "Xăng",
                iDthuongHieu: "TH002",
                namSanXuat: 2023,
                kieuDang: "SUV",
                GiaNiemYet: 900000000,
                soChoNgoi: 7,
                soKm: 0,
                mauXe: "Trắng",
                loaiCanSo: "automatic",
                hinhAnh: "honda_crv.jpg",
                chiTietSP: "Xe gia đình, đời mới 2023.",
                trangThai: "Mới",
                datLich: 0,
                ngayTao: 0
            }
        ]);

        console.log('Đã thêm dữ liệu vào các collection');
    } catch (error) {
        console.error('Lỗi:', error);
    } finally {
        await client.close();
    }
}

createDatabase();