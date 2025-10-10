const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getAllSliders = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({ TableName: 'Slider' }));
  return result.Items || [];
};

const getSliderById = async (id) => {
  const docClient = getDB();
  const result = await docClient.send(new GetCommand({ TableName: 'Slider', Key: { id } }));
  if (!result.Item) throw new Error('Slider không tồn tại');
  return result.Item;
};

const addSlider = async (data) => {
  const docClient = getDB();
  const slider = { id: uuidv4(), ...data };
  await docClient.send(new PutCommand({ TableName: 'Slider', Item: slider }));
  return slider;
};

const updateSlider = async (id, data) => {
  const docClient = getDB();
  const existing = await getSliderById(id);
  const updated = { ...existing, ...data };
  await docClient.send(new PutCommand({ TableName: 'Slider', Item: updated }));
  return updated;
};

const deleteSlider = async (id) => {
  const docClient = getDB();
  await docClient.send(new DeleteCommand({ TableName: 'Slider', Key: { id } }));
};

module.exports = { getAllSliders, getSliderById, addSlider, updateSlider, deleteSlider };
