require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
const { setupBucket } = require('./setup-s3-bucket');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const newsRoutes = require('./routes/tinTucRoute');
const booking = require('./routes/DatLichKHRoute');
const reviewRoutes = require('./routes/reviewRoute');
const sliderRoutes = require('./routes/sliderRoute');
const userRoute = require('./routes/UserRoute');
const otherRoutes = require('./routes/OtherRoute');
const categoryRoutes = require('./routes/category');
const userFilesRoutes = require('./routes/userFiles');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use('/Public', express.static(path.join(__dirname, 'Public')));
app.use('/Documents', express.static(path.join(__dirname, 'Documents')));

// Config route
app.get('/config/config.js', (req, res) => {
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`const mapConfig = { url: "${process.env.GOOGLE_MAPS_EMBED_URL}" };`);
});

// Test route
app.get('/test-user-files', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-user-files.html'));
});

// Admin/Employee redirects - must be before other routes
app.get('/admin', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/admin/`);
});

app.get('/admin/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}${req.originalUrl}`);
});

app.get('/employee', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee/`);
});

app.get('/employee/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}${req.originalUrl}`);
});

app.get('/product/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/news/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/booking/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/review/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/slider/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/category/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/kieu-dang/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/mau-xe/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/nguyen-lieu/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/files/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/api/*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/api/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/api/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/api/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/product/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/product/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/product/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

// Auth related redirects
app.get('/forgot', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/reset-password*', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.get('/email-sent-success', (req, res) => {
  res.redirect(302, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/forgot-password', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/reset-password*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

// Add all other HTTP methods for admin service routes
app.post('/news/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/news/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/news/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/booking/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/booking/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/booking/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/review/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/review/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/review/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/slider/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/slider/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/slider/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/category/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/category/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/category/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/kieu-dang/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/kieu-dang/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/kieu-dang/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/mau-xe/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/mau-xe/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/mau-xe/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/nguyen-lieu/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/nguyen-lieu/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/nguyen-lieu/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.post('/files/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.put('/files/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

app.delete('/files/*', (req, res) => {
  res.redirect(307, `${process.env.BASE_URL}/employee${req.originalUrl}`);
});

// Routes
app.use('/', authRoutes);
app.use('/', otherRoutes);
app.use('/api/user', userRoute);
app.use('/product', productRoutes);
app.use('/news', newsRoutes);
app.use('/booking', booking);
app.use('/review', reviewRoutes);
app.use('/slider', sliderRoutes);
app.use('/category', categoryRoutes);
app.use('/files', userFilesRoutes);

// 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'error', '404.html'));
});

const PORT = process.env.PORT;

// Auto setup S3 bucket khi start app
setupBucket().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Lỗi setup S3:', error.message);
  console.log('App vẫn chạy nhưng S3 có thể chưa sẵn sàng');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});