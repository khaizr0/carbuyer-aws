const userModel = require('../models/User')

const searchUser = async (req, res) => {
    try {
        const User = await userModel.getCollection();
        const  hoTen  = req.params.hoTen || '';
        let users;

        if (hoTen == '') {
            users = await User.find({}).toArray();
        }
        else {
            const regex = new RegExp(hoTen, 'i');
            users = await User.find({ hoTen: { $regex: regex } }).toArray();
        }

        if (!users.length) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng nào.' });
        }        
        return res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm người dùng:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tìm kiếm người dùng.' });
    }
};

module.exports = { searchUser }