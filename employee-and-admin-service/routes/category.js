const express = require('express');
const router = express.Router();
const controller = require('../controllers/CategoryController');
const employeeAuth = require('../middlewares/employeeAuth');

router.get('/loai-phu-kien', controller.getAllLoaiPhuKien);
router.post('/loai-phu-kien', employeeAuth, controller.createLoaiPhuKien);
router.put('/loai-phu-kien/:id', employeeAuth, controller.updateLoaiPhuKien);
router.delete('/loai-phu-kien/:id', employeeAuth, controller.deleteLoaiPhuKien);

router.get('/thuong-hieu', controller.getAllThuongHieu);
router.post('/thuong-hieu', employeeAuth, controller.createThuongHieu);
router.put('/thuong-hieu/:id', employeeAuth, controller.updateThuongHieu);
router.delete('/thuong-hieu/:id', employeeAuth, controller.deleteThuongHieu);

module.exports = router;
