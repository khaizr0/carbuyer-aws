const express = require('express');
const path = require('path');
const router = express.Router();

const viewsPath = path.join(__dirname, '../views'); 

router.get('/', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Home.html'));
});

router.get('/xedangban', (req, res) => {
    res.sendFile(path.join(viewsPath, 'productOption.html'));
});

router.get('/phukien', (req, res) => {
    res.sendFile(path.join(viewsPath, 'otherProduct.html'));
});

router.get('/chitietsanpham', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Product-detail.html'));
});

router.get('/chitietphukien', (req, res) => {
    res.sendFile(path.join(viewsPath, 'other-detail.html'));
});

router.get('/tintuc', (req, res) => {
    res.sendFile(path.join(viewsPath, 'news.html'));
});

module.exports = router;
