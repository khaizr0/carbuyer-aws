const express = require('express');
const router = express.Router();
const controller = require('../controllers/MauXeController');
const employeeAuth = require('../middlewares/employeeAuth');

router.get('/', controller.getAllMauXe);
router.post('/', employeeAuth, controller.createMauXe);
router.put('/:id', employeeAuth, controller.updateMauXe);
router.delete('/:id', employeeAuth, controller.deleteMauXe);

module.exports = router;
