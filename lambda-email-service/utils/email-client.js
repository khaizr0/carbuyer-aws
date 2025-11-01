const axios = require('axios');

const LAMBDA_API_URL = process.env.LAMBDA_EMAIL_API_URL;

async function sendResetPasswordEmail(email, resetUrl) {
  try {
    await axios.post(LAMBDA_API_URL, {
      type: 'RESET_PASSWORD',
      data: { email, resetUrl }
    });
    console.log('Reset password email sent to:', email);
  } catch (error) {
    console.error('Failed to send reset password email:', error.message);
    throw error;
  }
}

async function sendBookingConfirmationEmail(bookingData) {
  try {
    await axios.post(LAMBDA_API_URL, {
      type: 'BOOKING_CONFIRMATION',
      data: bookingData
    });
    console.log('Booking confirmation email sent to:', bookingData.email);
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error.message);
    throw error;
  }
}

module.exports = {
  sendResetPasswordEmail,
  sendBookingConfirmationEmail
};
