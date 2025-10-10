require('dotenv').config();
const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { client } = require('./config/dynamodb');

async function checkTables() {
  try {
    const result = await client.send(new ListTablesCommand({}));
    console.log('Tables hiện có:', result.TableNames);
    console.log('Số lượng tables:', result.TableNames?.length || 0);
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
}

checkTables();
