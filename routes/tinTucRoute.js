const express = require('express');
const router = express.Router();
const { addNews, getNewsById, getAllNews, updateNewsById, deleteNewsById, getLatestNewsId, showNewsOnHome } = require('../models/TinTuc');
const newsController = require('../controllers/newsController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// CREATE: Add a new news article

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/images/Database/tintuc/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });  // Create multer instance
// CREATE: Add a new news article (with file upload)
router.post('/create', upload.single('anhDaiDien'), async (req, res) => {
    try {
        const { tenTT, chiTietBaiViet, trangThai } = req.body;
        const anhDaiDien = req.file ? req.file.filename : null;
        const ngayDang = new Date().toISOString().split('T')[0];
        const trangThaiInt = parseInt(trangThai, 10);

        if (isNaN(trangThaiInt)) {
            return res.status(400).json({ message: 'Invalid trangThai value. It must be an integer.' });
        }
        
        const newId = await getLatestNewsId();
        const newNews = { id: newId, tenTT, anhDaiDien, chiTietBaiViet, ngayDang, trangThai: trangThaiInt };
        const result = await addNews(newNews);
        
        res.status(201).json({ message: 'News created successfully!', news: result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error: error.message });
    }
});



// UPDATE: Update a specific news article by ID (with file upload)
router.put('/:id', upload.single('anhDaiDien'), async (req, res) => {
    try {
        const { tenTT, chiTietBaiViet, trangThai } = req.body;
        const ngayDang = new Date().toISOString().split('T')[0];
        
        if (req.file) {
            const oldNews = await getNewsById(req.params.id);
            if (oldNews.anhDaiDien) {
                const oldImagePath = path.join('Public/images/Database/tintuc/', oldNews.anhDaiDien);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }
        
        const updatedNewsData = {
            ...(tenTT && { tenTT }),
            ...(req.file && { anhDaiDien: req.file.filename }),
            ...(chiTietBaiViet && { chiTietBaiViet }),
            ...(trangThai !== undefined && { trangThai: parseInt(trangThai, 10) }),
            ngayDang
        };

        const updatedNews = await updateNewsById(req.params.id, updatedNewsData);
        res.status(200).json({ message: 'News updated successfully!', news: updatedNews });
    } catch (error) {
        res.status(500).json({ message: 'Error updating news', error: error.message });
    }
});


// READ ALL: Fetch all news articles
router.get('/', async (req, res) => {
    try {
        const news = await getAllNews();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error: error.message });
    }
});

// READ SINGLE: Fetch a specific news article by ID
router.get('/:id', async (req, res) => {
    try {
        const news = await getNewsById(req.params.id);
        res.status(200).json(news);
    } catch (error) {
        res.status(404).json({ message: 'News not found', error: error.message });
    }
});

// DELETE: Delete a specific news article by ID
router.delete('/:id', async (req, res) => {
    try {
        const news = await getNewsById(req.params.id);
        if (news.anhDaiDien) {
            const imagePath = path.join('Public/images/Database/tintuc/', news.anhDaiDien);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await deleteNewsById(req.params.id);
        res.status(200).json({ message: 'News deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news', error: error.message });
    }
});

const checkAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/employee/login');
  next();
};



router.get('/tintuc', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'news.html'));
  });

router.get('/api/showNewsOnHome', async (req, res) => {
    try {
        const news = await showNewsOnHome();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news for home', error: error.message });
    }
});

// Route render trang chi tiết tin tức
router.get('/detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/news-detail.html'));
});

// API lấy tất cả tin tức
router.get('/api/all', newsController.getAllNews);

// API lấy chi tiết tin tức
router.get('/api/detail/:id', newsController.getNewsById);

module.exports = router;
