require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/User');
const { getDB } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/crypto-helper');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;

const emailRS ="";
const tokenRS ="";

// Hàm đăng nhập
const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await getUserByEmail(userName);

    if (!user) {
      return res.status(400).send('User not found');
    }

    if (!comparePassword(password, user.matKhau)) {
      return res.status(400).send('Invalid password');
    }
    console.log(user);
    
    req.session.userId = user.id;
    req.session.userRole = user.PhanLoai;

    if (user.PhanLoai === 0) {
      return res.redirect('/admin');
    } else if (user.PhanLoai === 1) {
      return res.redirect('/employee/dashboard');
    } else {
      return res.status(403).send('Not authorized');
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send('Internal server error');
  }
};

// Hàm quên mật khẩu với JWT
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).send('Email không tồn tại trong hệ thống, vui lòng nhập lại hoặc đăng kí tài khoản');
    }

    const secret = JWT_SECRET + user.matKhau;
    const payload = { email: user.email, id: user._id };
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });

    const resetUrl = `http://localhost:3000/reset-password/${user.email}/${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Link',
      text: `Here is your password reset link: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.redirect('/email-sent-success');
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).send('Internal server error');
  }
};

// Hàm hiển thị trang reset mật khẩu
const resetPasswordPage = async (req, res) => {
  const { email, token } = req.params;

  console.log('Email:', email);  
  console.log('Token:', token);  

  try {


    if (!email || !token) {
      return res.status(400).send('Email hoặc token không được cung cấp');
    }

    const { getUserByEmail } = require('../models/User');
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).send('Email không hợp lệ');
    }

    const secret = JWT_SECRET + user.matKhau;
    jwt.verify(token, secret);  // Verify the token

    global.emailRS = email; 
    global.tokenRS = token;

    // Send the reset-password.html file, including email and token in query parameters
    res.sendFile(path.join(__dirname, '../views/authentication/reset-password.html'));

  } catch (error) {
    console.error('Error during reset password page:', error);
    res.status(500).send('Internal server error');
  }
};


// Hàm xử lý đặt lại mật khẩu
const resetPassword = async (req, res) => {
  const { password, password2 } = req.body;

  // Lấy email và token từ biến toàn cục
  const email = global.emailRS;
  const token = global.tokenRS;

  console.log('-----------------------');
  console.log('Email:', email); 
  console.log('Token:', token);

  if (!email || !token) {
    return res.status(400).send('Không thể tìm thấy email hoặc token');
  }

  // Kiểm tra xem mật khẩu có khớp hay không
  if (password !== password2) {
    return res.status(400).send('Mật khẩu không khớp, vui lòng quay lại trang trước');
  }

  try {
    const { getUserByEmail } = require('../models/User');
    const { PutCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDB();
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).send('Email không hợp lệ');
    }

    // Xác thực token
    const secret = JWT_SECRET + user.matKhau;
    jwt.verify(token, secret, (err) => {
      if (err) {
        return res.status(400).send('Token không hợp lệ hoặc đã hết hạn');
      }
    });

    // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = hashPassword(password);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    user.matKhau = hashedPassword;
    await docClient.send(new PutCommand({ TableName: 'User', Item: user }));

    res.send('Mật khẩu đã được cập nhật thành công, vui lòng đăng nhập lại');
  } catch (error) {
    console.error('Lỗi trong quá trình xử lý mật khẩu:', error);
    res.status(500).send('Lỗi máy chủ, vui lòng thử lại sau');
  }
};

module.exports = { login, forgotPassword, resetPasswordPage, resetPassword };
