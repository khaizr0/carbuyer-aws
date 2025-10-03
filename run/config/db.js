require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let db;
let client;

const connectDB = async () => {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Kết nối MongoDB thành công!');
    db = client.db(dbName);
  } catch (error) {
    console.error('Kết nối database không thành công:', error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database chưa được khởi tạo');
  }
  return db;
};

// Thêm hàm đóng kết nối khi ứng dụng dừng
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('Đã đóng kết nối MongoDB');
    process.exit(0);
  }
});

module.exports = { connectDB, getDB };