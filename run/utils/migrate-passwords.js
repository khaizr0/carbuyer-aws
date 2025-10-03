// Script để chuyển đổi password từ SHA256 sang scrypt format
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { hashPassword } = require('./utils/crypto-helper');

async function migratePasswords() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const users = await db.collection('User').find({}).toArray();

        for (const user of users) {
            // Kiểm tra nếu password chưa có format salt:hash
            if (!user.matKhau.includes(':')) {
                console.log(`Migrating password for user: ${user.email}`);
                
                // Tạo password mới với scrypt (giả sử password cũ là "123456")
                // Trong thực tế, bạn cần yêu cầu user reset password
                const newHashedPassword = hashPassword('123456');
                
                await db.collection('User').updateOne(
                    { _id: user._id },
                    { $set: { matKhau: newHashedPassword } }
                );
            }
        }

        console.log('Migration completed!');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await client.close();
    }
}

migratePasswords();