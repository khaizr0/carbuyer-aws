const express = require('express');
const router = express.Router();
const controller = require('../controllers/KieuDangController');
const employeeAuth = require('../middlewares/employeeAuth');

router.get('/', controller.getAllKieuDang);
router.post('/', employeeAuth, controller.createKieuDang);
router.put('/:id', employeeAuth, controller.updateKieuDang);
router.delete('/:id', employeeAuth, controller.deleteKieuDang);

module.exports = router;
