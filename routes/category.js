const express = require('express');
const router = express.Router();
const controller = require('../controllers/CategoryController');

router.get('/loai-phu-kien', controller.getAllLoaiPhuKien);
router.post('/loai-phu-kien', controller.createLoaiPhuKien);
router.put('/loai-phu-kien/:id', controller.updateLoaiPhuKien);
router.delete('/loai-phu-kien/:id', controller.deleteLoaiPhuKien);

router.get('/thuong-hieu', controller.getAllThuongHieu);
router.post('/thuong-hieu', controller.createThuongHieu);
router.put('/thuong-hieu/:id', controller.updateThuongHieu);
router.delete('/thuong-hieu/:id', controller.deleteThuongHieu);

module.exports = router;
