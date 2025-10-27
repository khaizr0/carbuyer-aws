const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/SliderController');
const { uploadSlider } = require('../utils/s3-upload');

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/employee/login');
  next();
};

router.get('/', sliderController.getAllSliders);
router.get('/:id', sliderController.getSliderById);
router.post('/create', uploadSlider.single('uploadImage'), sliderController.createSlider);
router.put('/:id', uploadSlider.single('uploadImage'), sliderController.updateSlider);
router.delete('/:id', sliderController.deleteSlider);



module.exports = router;
