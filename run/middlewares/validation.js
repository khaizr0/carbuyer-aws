const validateMyUserRequest = (req, res, next) => {
    const requiredFields = ['hoTen', 'email', 'ngaySinh', 'gioiTinh', 'cccd', 'matKhau', 'PhanLoai'];
    for (const field of requiredFields) {
        if (!req.body[field] && field !== 'matKhau') {
            return res.status(400).json({ message: `Trường ${field} là bắt buộc.` });
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: 'Email không hợp lệ.' });
    }

    const cccd = req.body.cccd.toString();
    if (![8, 12].includes(cccd.length)) {
        return res.status(400).json({
            message: 'Số CCCD phải có 8 hoặc 12 ký tự.'
        });
    }

    if (req.body.matKhau) {
        const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(req.body.matKhau)) {
            return res.status(400).json({
                message: 'Mật khẩu phải có ít nhất:' +
                    '\n- 8 ký tự' +
                    '\n- 1 ký tự đặc biệt' +
                    '\n- 1 chữ in hoa' +
                    '\n- 1 chữ thường' +
                    '\n- 1 số'
            });
        }
    }

    const ngaySinh = new Date(req.body.ngaySinh);
    const currentDate = new Date();
    const minAge = 18; 
    const maxAge = 65; 

    const age = currentDate.getFullYear() - ngaySinh.getFullYear();
    if (age < minAge || age > maxAge) {
        return res.status(400).json({
            message: `Tuổi phải từ ${minAge} đến ${maxAge}.`
        });
    }

    const validGioiTinh = ['Nam', 'Nu'];
    if (!validGioiTinh.includes(req.body.gioiTinh)) {
        return res.status(400).json({
            message: 'Giới tính không hợp lệ. Chỉ chấp nhận Nam hoặc Nữ.'
        });
    }

    const validPhanLoai = ['0', '1'];
    if (!validPhanLoai.includes(req.body.PhanLoai)) {
        return res.status(400).json({
            message: 'Phân loại không hợp lệ. Chỉ chấp nhận 0 (Admin) hoặc 1 (Nhân viên).'
        });
    }

    if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; 

        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                message: 'Chỉ chấp nhận ảnh có định dạng JPEG, PNG, hoặc GIF.'
            });
        }

        if (req.file.size > maxSize) {
            return res.status(400).json({
                message: 'Kích thước ảnh không được vượt quá 5MB.'
            });
        }
    }

    next();
};

module.exports = {validateMyUserRequest};