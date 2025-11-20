const express = require('express');
const router = express.Router();
const employeeAuth = require('../middlewares/employeeAuth');
const { getRecentProductsController, getAllProductsController, deleteProductByIdController, createCarProduct, createAccessoryProduct 
            , getEditProductPageController, updateProduct, getProductByIdController, getRelatedProductsController } = require('../controllers/ProductController');

router.get('/recent-products', employeeAuth, getRecentProductsController);
router.get('/', employeeAuth, getAllProductsController);
router.delete('/:id', employeeAuth, deleteProductByIdController);
router.post('/create-car', employeeAuth, createCarProduct);
router.post('/create-accessory', employeeAuth, createAccessoryProduct);
router.get('/edit/:id', employeeAuth, getEditProductPageController);
router.post('/update/:id', employeeAuth, updateProduct);
router.get('/products/:id', employeeAuth, getProductByIdController);
router.get('/related/:id', employeeAuth, getRelatedProductsController);
router.get('/search', employeeAuth, require('../controllers/ProductController').searchProductsController);
router.get('/brands', employeeAuth, require('../controllers/ProductController').getBrandsController);

module.exports = router;