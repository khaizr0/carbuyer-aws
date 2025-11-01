const axios = require('axios');

const LAMBDA_API_URL = process.env.LAMBDA_EMAIL_API_URL;

async function sendResetPasswordEmail(email, resetUrl) {
  if (!LAMBDA_API_URL) {
    console.warn('LAMBDA_EMAIL_API_URL not configured, skipping email');
    return;
  }
  
  try {
    await axios.post(LAMBDA_API_URL, {
      type: 'RESET_PASSWORD',
      data: { email, resetUrl }
    }, { timeout: 5000 });
    console.log('Reset password email sent to:', email);
  } catch (error) {
    console.error('Failed to send reset password email:', error.message);
    // Không throw error - email là optional
  }
}

async function sendBookingConfirmationEmail(bookingData) {
  if (!LAMBDA_API_URL) {
    console.warn('LAMBDA_EMAIL_API_URL not configured, skipping email');
    return;
  }
  
  try {
    await axios.post(LAMBDA_API_URL, {
      type: 'BOOKING_CONFIRMATION',
      data: bookingData
    }, { timeout: 5000 });
    console.log('Booking confirmation email sent to:', bookingData.email);
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error.message);
    // Không throw error - email là optional
  }
}

module.exports = {
  sendResetPasswordEmail,
  sendBookingConfirmationEmail
};
