const express = require('express');
const router = express.Router();
const controller = require('../controllers/MauXeController');

router.get('/', controller.getAllMauXe);
router.post('/', controller.createMauXe);
router.put('/:id', controller.updateMauXe);
router.delete('/:id', controller.deleteMauXe);

module.exports = router;
