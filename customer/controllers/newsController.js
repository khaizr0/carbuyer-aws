const TinTuc = require('../models/TinTuc');

// Lấy tất cả tin tức
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await TinTuc.getAllNews();
        res.status(200).json(newsList);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tin tức', error: error.message });
    }
};

// Lấy chi tiết tin tức theo ID
exports.getNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;
        const news = await TinTuc.getNewsById(newsId);
        res.status(200).json(news);
    } catch (error) {
        res.status(404).json({ message: 'Không tìm thấy tin tức', error: error.message });
    }
};