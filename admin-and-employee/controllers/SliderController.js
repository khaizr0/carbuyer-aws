const { getAllSliders, getSliderById, addSlider, updateSlider, deleteSlider } = require('../models/SliderModel');
const { getS3Url } = require('../utils/s3-upload');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('../config/s3');

exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await getAllSliders();
    res.status(200).json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSliderById = async (req, res) => {
  try {
    const slider = await getSliderById(req.params.id);
    res.status(200).json(slider);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createSlider = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.hinhAnh = req.file.key;
    const slider = await addSlider(data);
    res.status(201).json({ message: 'Thêm slider thành công', slider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    const oldSlider = await getSliderById(req.params.id);
    const data = { ...req.body };
    if (req.file) {
      if (oldSlider.hinhAnh) {
        const key = oldSlider.hinhAnh.replace(/^\//, '');
        await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
      }
      data.hinhAnh = req.file.key;
    }
    const slider = await updateSlider(req.params.id, data);
    res.status(200).json({ message: 'Cập nhật slider thành công', slider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    const slider = await getSliderById(req.params.id);
    if (slider.hinhAnh) {
      const key = slider.hinhAnh.replace(/^\//, '');
      await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    }
    await deleteSlider(req.params.id);
    res.status(200).json({ message: 'Xóa slider thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
