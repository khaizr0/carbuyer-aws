const { getAllSliders, getSliderById, addSlider, updateSlider, deleteSlider } = require('../models/SliderModel');

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
    if (req.file) data.hinhAnh = `/Public/images/SlideShow/${req.file.filename}`;
    const slider = await addSlider(data);
    res.status(201).json({ message: 'Thêm slider thành công', slider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.hinhAnh = `/Public/images/SlideShow/${req.file.filename}`;
    const slider = await updateSlider(req.params.id, data);
    res.status(200).json({ message: 'Cập nhật slider thành công', slider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    await deleteSlider(req.params.id);
    res.status(200).json({ message: 'Xóa slider thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
