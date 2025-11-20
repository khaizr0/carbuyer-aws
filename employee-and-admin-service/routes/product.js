const express = require('express');
const router = express.Router();
const { getRecentProductsController, getAllProductsController, deleteProductByIdController, createCarProduct, createAccessoryProduct 
            , getEditProductPageController, updateProduct, getProductByIdController, getRelatedProductsController } = require('../controllers/ProductController');

router.get('/recent-products', getRecentProductsController);
router.get('/', getAllProductsController);
router.delete('/:id', deleteProductByIdController);
router.post('/create-car', createCarProduct);
router.post('/create-accessory', createAccessoryProduct);
router.get('/edit/:id', getEditProductPageController);
router.post('/update/:id', updateProduct);
router.get('/products/:id', getProductByIdController);
router.get('/related/:id', getRelatedProductsController);
router.get('/search', require('../controllers/ProductController').searchProductsController);
router.get('/brands', require('../controllers/ProductController').getBrandsController);

module.exports = router;