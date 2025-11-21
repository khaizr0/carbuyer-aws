const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    const { type, data } = event.body ? JSON.parse(event.body) : event;
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    let mailOptions;
    
    switch(type) {
      case 'RESET_PASSWORD':
        mailOptions = buildResetPasswordEmail(data);
        break;
      case 'BOOKING_CONFIRMATION':
        mailOptions = buildBookingConfirmationEmail(data);
        break;
      default:
        throw new Error('Invalid email type');
    }
    
    await transporter.sendMail(mailOptions);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function buildResetPasswordEmail(data) {
  const { email, resetUrl } = data;
  
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Link',
    html: `
      <h2>Đặt lại mật khẩu</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
      <p>Nhấn vào link sau để đặt lại mật khẩu (có hiệu lực trong 15 phút):</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `
  };
}

function buildBookingConfirmationEmail(data) {
  const { email, hoTenKH, id, soDT, ngayTao, time } = data;
  
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác nhận đăng ký lái thử xe',
    html: `
      <h2>Xác nhận đăng ký lái thử</h2>
      <p>Xin chào <strong>${hoTenKH}</strong>,</p>
      <p>Cảm ơn bạn đã đăng ký lái thử xe tại showroom của chúng tôi.</p>
      <h3>Thông tin đặt lịch:</h3>
      <ul>
        <li><strong>Mã đặt lịch:</strong> ${id}</li>
        <li><strong>Họ tên:</strong> ${hoTenKH}</li>
        <li><strong>Số điện thoại:</strong> ${soDT}</li>
        <li><strong>Ngày:</strong> ${ngayTao}</li>
        <li><strong>Giờ:</strong> ${time}</li>
      </ul>
      <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận lịch hẹn.</p>
      <p>Trân trọng,<br>Showroom CarBuyer</p>
    `
  };
}
