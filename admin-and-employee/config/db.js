require('dotenv').config();
const { docClient } = require('./dynamodb');

const connectDB = async () => {
  try {
    console.log('Kết nối DynamoDB thành công!');
  } catch (error) {
    console.error('Kết nối database không thành công:', error);
    process.exit(1);
  }
};

const getDB = () => {
  return docClient;
};

module.exports = { connectDB, getDB };
