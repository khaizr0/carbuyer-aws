const express = require('express');
const router = express.Router();
const controller = require('../controllers/KieuDangController');

router.get('/', controller.getAllKieuDang);
router.post('/', controller.createKieuDang);
router.put('/:id', controller.updateKieuDang);
router.delete('/:id', controller.deleteKieuDang);

module.exports = router;
