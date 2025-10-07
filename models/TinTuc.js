const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
// CREATE: Add a new news article
const addNews = async (newsData) => {
    try {
        const db = await getDB();
        const collection = db.collection('TinTuc');
        console.log(newsData);
        

        const result = await collection.insertOne(newsData);

        const insertedNews = { ...newsData, _id: result.insertedId }; 
        return insertedNews; 

    } catch (error) {
        console.error('Error adding news:', error);
        throw new Error('Error adding news');
    }
};


// READ: Get a news article by ID
const getNewsById = async (id) => {
    try {
        const db = await getDB();
        const collection = db.collection('TinTuc');
        const news = await collection.findOne({ _id: new ObjectId(id) });
        if (!news) throw new Error('News not found');
        return news;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Error fetching news');
    }
};

// READ: Get all news articles
const getAllNews = async () => {
    try {
        const db = await getDB();
        const collection = db.collection('TinTuc');
        const newsList = await collection.find({}).toArray();
        return newsList;
    } catch (error) {
        console.error('Error fetching all news:', error);
        throw new Error('Error fetching news list');
    }
};

// UPDATE: Update an existing news article by ID
const updateNewsById = async (id, updatedData) => {
    try {
        const db = await getDB();
        const collection = db.collection('TinTuc');
        console.log(id);
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );
        if (result.matchedCount === 0) throw new Error('News not found');
        const updatedNews = await collection.findOne({ _id: new ObjectId(id) });
        return updatedNews;
    } catch (error) {
        console.error('Error updating news:', error);
        throw new Error('Error updating news');
    }
};

// DELETE: Delete a news article by ID
const deleteNewsById = async (id) => {
    try {
        const db = await getDB();
        const collection = db.collection('TinTuc'); // Ensure this is the correct collection name
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) throw new Error('News not found');
        return { message: 'News deleted successfully' };
    } catch (error) {
        console.error('Error deleting news:', error);
        throw new Error('Error deleting news');
    }
};

const getLatestNewsId = async () => {
    try {
        const db = await getDB();
        const collection = db.collection('TinTuc');
        
        const latestNews = await collection.find().sort({ _id: -1 }).limit(1).toArray();
        
        if (latestNews.length === 0) {
            return 'TT001'; 
        }

        const latestId = latestNews[0].id;
        const latestIdNumber = latestId.slice(2); 
        
        const newId = `TT${String(parseInt(latestIdNumber) + 1).padStart(3, '0')}`;

        return newId; 
    } catch (error) {
        console.error('Error fetching latest news ID:', error);
        throw new Error('Error fetching latest news ID');
    }
};

//home.html:
const showNewsOnHome = async () => {
    try {
        const db = await getDB();
        const collection = db.collection('TinTuc');
        
        const newsList = await collection
            .find({ trangThai: 1 }) 
            .sort({ ngayDang: -1 }) 
            .limit(3)
            .toArray();
        
        return newsList;
    } catch (error) {
        console.error('Error fetching news for home:', error);
        throw new Error('Error fetching news for home');
    }
};


module.exports = {
    addNews,
    getLatestNewsId,
    getNewsById,
    getAllNews,
    updateNewsById,
    deleteNewsById,
    showNewsOnHome
};
