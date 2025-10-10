const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/SliderController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Public/images/SlideShow/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage, fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')) });

router.get('/', sliderController.getAllSliders);
router.get('/:id', sliderController.getSliderById);
router.post('/create', upload.single('uploadImage'), sliderController.createSlider);
router.put('/:id', upload.single('uploadImage'), sliderController.updateSlider);
router.delete('/:id', sliderController.deleteSlider);

router.get('/employee/slider', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/employee/slider.html'));
});

module.exports = router;
