const express = require('express');
const router = express.Router();
const { addNews, getNewsById, getAllNews, updateNewsById, deleteNewsById, getLatestNewsId, showNewsOnHome } = require('../models/TinTuc');  // Import functions from TinTuc.js
const newsController = require('../controllers/newsController');
const multer = require('multer');  // Import multer for file handling
const path = require('path');
// CREATE: Add a new news article

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/images/');  // Folder where the images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Rename file with a timestamp to avoid overwriting
    }
});

const upload = multer({ storage: storage });  // Create multer instance
// CREATE: Add a new news article (with file upload)
router.post('/create', upload.single('anhDaiDien'), async (req, res) => {
    try {
        const { tenTT, chiTietBaiViet, trangThai } = req.body;
        const anhDaiDien = req.file ? req.file.filename : null;  // Get the uploaded image filename
        const ngayDang = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        // Convert trangThai to integer
        const trangThaiInt = parseInt(trangThai, 10);

        // Check if the conversion to integer was successful
        if (isNaN(trangThaiInt)) {
            return res.status(400).json({ message: 'Invalid trangThai value. It must be an integer.' });
        }
        const newId = await getLatestNewsId();  // Fetch the latest news to get the current ID

        const newNews = { id: newId, tenTT, anhDaiDien, chiTietBaiViet, ngayDang, trangThai: trangThaiInt };

        const result = await addNews(newNews);  // Call addNews function from TinTuc.js
        res.status(201).json({ message: 'News created successfully!', news: result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error });
    }
});



// UPDATE: Update a specific news article by ID (with file upload)
router.put('/:id', upload.single('anhDaiDien'), async (req, res) => {
    try {
        const { tenTT, chiTietBaiViet, trangThai } = req.body;
        const anhDaiDien = req.file ? req.file.filename : null;  // Get the uploaded image filename (if any)
        const ngayDang = new Date();  // Get the current date and time
        
        // Prepare the data to be updated
        const updatedNewsData = {
            tenTT,
            anhDaiDien,
            chiTietBaiViet,
            ngayDang,
            trangThai
        };

        // Call the updateNewsById function to update the news article
        const updatedNews = await updateNewsById(req.params.id, updatedNewsData);
        
        if (!updatedNews) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json({ message: 'News updated successfully!', news: updatedNews });
    } catch (error) {
        res.status(500).json({ message: 'Error updating news', error });
    }
});


// READ ALL: Fetch all news articles
router.get('/', async (req, res) => {
    try {
        const news = await getAllNews();  // Call getAllNews function from TinTuc.js
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error });
    }
});

// READ SINGLE: Fetch a specific news article by ID
router.get('/:id', async (req, res) => {
    try {
        const news = await getNewsById(req.params.id);  // Call getNewsById function from TinTuc.js
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error });
    }
});

// DELETE: Delete a specific news article by ID
router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const result = await deleteNewsById(req.params.id);  // Call deleteNewsById function from TinTuc.js
        if (!result) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json({ message: 'News deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news', error });
    }
});

router.get('/employee/tin-tuc', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'employee/tin-tuc.html'));
  });

router.get('/tintuc', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'news.html'));
  });

router.get('/api/showNewsOnHome', async (req, res) => {
    try {
        const news = await showNewsOnHome();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news for home', error });
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
