const userModel = require('../models/User')

const searchUser = async (req, res) => {
    try {
        const User = userModel.getCollection();
        const  hoTen  = req.params.hoTen || '';
        let users;

        if (hoTen == '') {
            users = await (await User.find({ PhanLoai: 1 })).toArray();
        }
        else {
            const regex = new RegExp(hoTen, 'i');
            users = await (await User.find({ hoTen: { $regex: regex }, PhanLoai: 1 })).toArray();
        }

        if (!users.length) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên nào.' });
        }        
        return res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm nhân viên:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tìm kiếm nhân viên.' });
    }
};

module.exports = { searchUser }