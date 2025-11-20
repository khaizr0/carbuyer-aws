const express = require('express');
const router = express.Router();
const controller = require('../controllers/NguyenLieuController');
const employeeAuth = require('../middlewares/employeeAuth');

router.get('/', employeeAuth, controller.getAll);
router.post('/', employeeAuth, controller.create);
router.put('/:id', employeeAuth, controller.update);
router.delete('/:id', employeeAuth, controller.deleteItem);

module.exports = router;
