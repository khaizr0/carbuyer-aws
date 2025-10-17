const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');
const { getS3Url } = require('../utils/s3-upload');

const addNews = async (newsData) => {
  const docClient = getDB();
  await docClient.send(new PutCommand({ TableName: 'TinTuc', Item: newsData }));
  return newsData;
};

const getNewsById = async (id) => {
  const docClient = getDB();
  const result = await docClient.send(new GetCommand({ TableName: 'TinTuc', Key: { id } }));
  if (!result.Item) throw new Error('News not found');
  const news = result.Item;
  if (news.anhDaiDien) {
    news.anhDaiDienUrl = getS3Url(`Database/tintuc/${news.anhDaiDien}`);
  }
  return news;
};

const getAllNews = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({ TableName: 'TinTuc' }));
  const newsList = result.Items || [];
  return newsList.map(news => ({
    ...news,
    anhDaiDienUrl: news.anhDaiDien ? getS3Url(`Database/tintuc/${news.anhDaiDien}`) : null
  }));
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
  const newsList = (result.Items || []).sort((a, b) => new Date(b.ngayDang) - new Date(a.ngayDang)).slice(0, 3);
  return newsList.map(news => ({
    ...news,
    anhDaiDienUrl: news.anhDaiDien ? getS3Url(`Database/tintuc/${news.anhDaiDien}`) : null
  }));
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
