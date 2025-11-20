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
app.set('trust proxy', 1); // Trust first proxy (ALB)
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: true, 
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  },
  name: 'employee.sid'
}));
// Static files middleware - MUST be before routes
app.use('/admin/Public', express.static(path.join(__dirname, 'Public')));
app.use('/employee/Public', express.static(path.join(__dirname, 'Public')));
app.use('/admin/Documents', express.static(path.join(__dirname, 'Documents')));
app.use('/employee/Documents', express.static(path.join(__dirname, 'Documents')));
app.use('/admin/css', express.static(path.join(__dirname, 'Public/css')));
app.use('/employee/css', express.static(path.join(__dirname, 'Public/css')));
app.use('/admin/js', express.static(path.join(__dirname, 'Public/JS')));
app.use('/employee/js', express.static(path.join(__dirname, 'Public/JS')));
app.use('/admin/images', express.static(path.join(__dirname, 'Public/images')));
app.use('/employee/images', express.static(path.join(__dirname, 'Public/images')));

// Config route
app.get('/employee/config/config.js', (req, res) => {
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`const mapConfig = { url: "${process.env.GOOGLE_MAPS_EMBED_URL}" };`);
});
app.get('/admin/config/config.js', (req, res) => {
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`const mapConfig = { url: "${process.env.GOOGLE_MAPS_EMBED_URL}" };`);
});

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Session: ${req.session?.userId ? 'Yes' : 'No'} - Role: ${req.session?.userRole}`);
  if (req.path.includes('/category/') || req.path.includes('/kieu-dang') || req.path.includes('/mau-xe') || req.path.includes('/nguyen-lieu')) {
    console.log('API Call - Session details:', {
      userId: req.session?.userId,
      userRole: req.session?.userRole,
      sessionId: req.sessionID
    });
  }
  next();
});

// Test route
app.get('/test-db', async (req, res) => {
  try {
    const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
    const { getDB } = require('./config/db');
    const docClient = getDB();
    
    const result = await docClient.send(new ScanCommand({ 
      TableName: 'ThuongHieu',
      Limit: 5
    }));
    
    res.json({
      success: true,
      count: result.Items?.length || 0,
      items: result.Items || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Routes
app.get('/', (req, res) => res.redirect('/employee/login'));
app.use('/', authRoutes);
app.use('/admin/api/my/user', myUserRoute);
app.use('/admin/api/user', userRoute);
app.use('/employee', employeeRoutes);
app.use('/employee/product', productRoutes);
app.use('/admin/product', productRoutes);
app.use('/employee/news', newsRoutes);
app.use('/admin/news', newsRoutes);
app.use('/employee/booking', booking);
app.use('/admin/booking', booking);
app.use('/employee/bookings', bookingRoutes);
app.use('/admin/bookings', bookingRoutes);
app.use('/employee/review', reviewRoutes);
app.use('/admin/review', reviewRoutes);
app.use('/employee/slider', sliderRoutes);
app.use('/admin/slider', sliderRoutes);
app.use('/employee/category', categoryRoutes);
app.use('/admin/category', categoryRoutes);
app.use('/employee/kieu-dang', kieuDangRoutes);
app.use('/admin/kieu-dang', kieuDangRoutes);
app.use('/employee/mau-xe', mauXeRoutes);
app.use('/admin/mau-xe', mauXeRoutes);
app.use('/employee/nguyen-lieu', nguyenLieuRoutes);
app.use('/admin/nguyen-lieu', nguyenLieuRoutes);
app.use('/employee/files', userFilesRoutes);
app.use('/admin/files', userFilesRoutes);

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