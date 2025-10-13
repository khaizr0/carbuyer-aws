require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
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
const otherRoutes = require('./routes/OtherRoute');
const categoryRoutes = require('./routes/category');
const kieuDangRoutes = require('./routes/kieuDang');
const mauXeRoutes = require('./routes/mauXe');
const nguyenLieuRoutes = require('./routes/nguyenLieu');
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

// Routes
app.use('/', authRoutes);
app.use('/', otherRoutes);
app.use('/api/my/user', myUserRoute);
app.use('/api/user', userRoute);
app.use('/employee', employeeRoutes);
app.use('/product', productRoutes);
app.use('/news', newsRoutes);
app.use('/booking', booking);
app.use('/employee/booking', bookingRoutes);
app.use('/review', reviewRoutes);
app.use('/slider', sliderRoutes);
app.use('/category', categoryRoutes);
app.use('/kieu-dang', kieuDangRoutes);
app.use('/mau-xe', mauXeRoutes);
app.use('/nguyen-lieu', nguyenLieuRoutes);

// 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'error', '404.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});