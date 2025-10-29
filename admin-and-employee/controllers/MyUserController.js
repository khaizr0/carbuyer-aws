require('dotenv').config();
const userModel = require('../models/User')
const { hashPassword } = require('../utils/crypto-helper');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('../config/s3');

const generateUserId = async () => {
    const User = await userModel.getCollection();
    const lastUser = await User.findOne({}, { sort: { id: -1 } });
    let nextId = 1;

    if (lastUser && lastUser.id) {
        const lastIdNumber = parseInt(lastUser.id.slice(1));
        nextId = lastIdNumber + 1;
    }

    return `U${nextId.toString().padStart(3, '0')}`;
};

const createUser = async (req, res) => {
    try {
        const { email, cccd, matKhau, PhanLoai } = req.body;
        const User = await userModel.getCollection();

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { cccd: cccd }
            ]
        });
        if (existingUser) {
            return res.status(409).send();
        }

        const phanLoai = parseInt(PhanLoai, 10);
        const hashedPassword = hashPassword(matKhau);
        const userID = await generateUserId();
        const newUser = {
            id: userID,
            ...req.body,
            matKhau: hashedPassword,
            anhNhanVien: req.file ? req.file.key.split('/').pop() : null,
            PhanLoai: phanLoai
        };
        await User.insertOne(newUser)
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' })
    }
};
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const matKhau = req.body.matKhau || null;
        const newImage = req.file ? req.file.key.split('/').pop() : null;
        const PhanLoai = req.body.PhanLoai
        let hashedPassword;
        const User = await userModel.getCollection();


        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại.' });
        }

        if (newImage && user.anhNhanVien) {
            try {
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: `Database/Users/${user.anhNhanVien}`
                }));
            } catch (error) {
                console.log('Lỗi xóa file cũ:', error.message);
            }
        }
        if (matKhau) {
            hashedPassword = hashPassword(matKhau);
        }
        const phanLoai = parseInt(PhanLoai, 10);

        const updateFields = {
            ...req.body,
            ...(newImage && { anhNhanVien: newImage }),
            ...(matKhau && { matKhau: hashedPassword }),
            PhanLoai: phanLoai
        };
        
        await User.updateOne(
            { id: userId },
            { $set: updateFields }
        );

        res.status(200).json({ message: 'Cập nhật thành công.', updateFields });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra.', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const User = await userModel.getCollection();

        const existingUser = await User.findOne({ id: id });
        if (!existingUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng nào' })
        }

        if (existingUser.anhNhanVien) {
            try {
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: `Database/Users/${existingUser.anhNhanVien}`
                }));
            } catch (error) {
                console.log('Lỗi xóa file:', error.message);
            }
        }

        await User.deleteOne({ id });
        return res.status(200).json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' })
    }
};
module.exports = {
    createUser,
    updateUser,
    deleteUser,
};