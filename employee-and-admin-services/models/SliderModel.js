const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { getS3Url } = require('../utils/s3-upload');

const getAllSliders = async () => {
  const docClient = getDB();
  const result = await docClient.send(new ScanCommand({ TableName: 'Slider' }));
  const sliders = result.Items || [];
  return sliders.map(s => {
    let imageUrl = s.hinhAnh;
    if (imageUrl && imageUrl.includes('/Public/images/SlideShow/')) {
      const filename = imageUrl.split('/').pop();
      imageUrl = getS3Url(`SlideShow/${filename}`);
    } else if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = getS3Url(imageUrl.replace(/^\//, ''));
    }
    return { ...s, hinhAnh: imageUrl };
  });
};

const getSliderById = async (id) => {
  const docClient = getDB();
  const result = await docClient.send(new GetCommand({ TableName: 'Slider', Key: { id } }));
  if (!result.Item) throw new Error('Slider không tồn tại');
  const slider = result.Item;
  if (slider.hinhAnh) {
    if (slider.hinhAnh.includes('/Public/images/SlideShow/')) {
      const filename = slider.hinhAnh.split('/').pop();
      slider.hinhAnh = getS3Url(`SlideShow/${filename}`);
    } else if (!slider.hinhAnh.startsWith('http')) {
      slider.hinhAnh = getS3Url(slider.hinhAnh.replace(/^\//, ''));
    }
  }
  return slider;
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
