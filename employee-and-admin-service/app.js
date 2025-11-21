require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
const { setupBucket } = require('./setup-s3-bucket');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const productRoutes = require('./routes/product');
const newsRoutes = require('./routes/tinTucRoute');
const booking = require('./routes/DatLichKHRoute');
const bookingRoutes = require('./routes/Booking');
const reviewRoutes = require('./routes/reviewRoute');
const sliderRoutes = require('./routes/sliderRoute');
const myUserRoute = require('./routes/MyUserRoute');
const userRoute = require('./routes/UserRoute');
const categoryRoutes = require('./routes/category');
const kieuDangRoutes = require('./routes/kieuDang');
const mauXeRoutes = require('./routes/mauXe');
const nguyenLieuRoutes = require('./routes/nguyenLieu');
const userFilesRoutes = require('./routes/userFiles');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
}));
// Static files middleware - MUST be before routes
app.use('/admin/Public', express.static(path.join(__dirname, 'Public')));
app.use('/employee/Public', express.static(path.join(__dirname, 'Public')));
app.use('/private/Public', express.static(path.join(__dirname, 'Public')));
app.use('/admin/Documents', express.static(path.join(__dirname, 'Documents')));
app.use('/employee/Documents', express.static(path.join(__dirname, 'Documents')));
app.use('/private/Documents', express.static(path.join(__dirname, 'Documents')));

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

// Debug route for static files
app.get('/debug-static', (req, res) => {
  const fs = require('fs');
  const publicPath = path.join(__dirname, 'Public');
  const cssPath = path.join(__dirname, 'Public/css');
  
  res.json({
    publicExists: fs.existsSync(publicPath),
    cssExists: fs.existsSync(cssPath),
    publicContents: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : 'Not found',
    cssContents: fs.existsSync(cssPath) ? fs.readdirSync(cssPath) : 'Not found',
    __dirname: __dirname
  });
});

// Routes
app.get('/', (req, res) => res.redirect('/employee/login'));
app.use('/', authRoutes);
app.use('/employee', employeeRoutes);
app.use('/employee/booking', bookingRoutes);
app.use('/private/my/user', myUserRoute);
app.use('/private/user', userRoute);
app.use('/private/product', productRoutes);
app.use('/private/news', newsRoutes);
app.use('/private/booking', booking);
app.use('/private/review', reviewRoutes);
app.use('/private/slider', sliderRoutes);
app.use('/private/category', categoryRoutes);
app.use('/private/kieu-dang', kieuDangRoutes);
app.use('/private/mau-xe', mauXeRoutes);
app.use('/private/nguyen-lieu', nguyenLieuRoutes);
app.use('/private/files', userFilesRoutes);

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