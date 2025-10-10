const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');

const addNews = async (newsData) => {
  const docClient = getDB();
  await docClient.send(new PutCommand({ TableName: 'TinTuc', Item: newsData }));
  return newsData;
};

const getNewsById = async (id) => {
  const docClient = getDB();
  const result = await docClient.send(new GetCommand({ TableName: 'TinTuc', Key: { id } }));
  if (!result.Item) throw new Error('News not found');
  return result.Item;
};

const getAllNews = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({ TableName: 'TinTuc' }));
  return result.Items || [];
};

const updateNewsById = async (id, updatedData) => {
  const docClient = getDB();
  const result = await docClient.send(new GetCommand({ TableName: 'TinTuc', Key: { id } }));
  if (!result.Item) throw new Error('News not found');
  const updatedNews = { ...result.Item, ...updatedData };
  await docClient.send(new PutCommand({ TableName: 'TinTuc', Item: updatedNews }));
  return updatedNews;
};

const deleteNewsById = async (id) => {
  const docClient = getDB();
  await docClient.send(new DeleteCommand({ TableName: 'TinTuc', Key: { id } }));
  return { message: 'News deleted successfully' };
};

const getLatestNewsId = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({ TableName: 'TinTuc' }));
  const newsList = result.Items || [];
  
  if (newsList.length === 0) return 'TT001';
  
  const latestId = newsList.map(n => n.id).sort().reverse()[0];
  const latestIdNumber = latestId.slice(2);
  return `TT${String(parseInt(latestIdNumber) + 1).padStart(3, '0')}`;
};

const showNewsOnHome = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({
    TableName: 'TinTuc',
    FilterExpression: 'trangThai = :status',
    ExpressionAttributeValues: { ':status': 1 }
  }));
  return (result.Items || []).sort((a, b) => new Date(b.ngayDang) - new Date(a.ngayDang)).slice(0, 3);
};

module.exports = {
  addNews,
  getLatestNewsId,
  getNewsById,
  getAllNews,
  updateNewsById,
  deleteNewsById,
  showNewsOnHome
};
