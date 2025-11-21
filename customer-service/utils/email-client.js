const axios = require('axios');

const LAMBDA_API_URL = process.env.LAMBDA_EMAIL_API_URL;
const LAMBDA_API_KEY = process.env.LAMBDA_EMAIL_API_KEY;

async function sendBookingConfirmationEmail(bookingData) {
  if (!LAMBDA_API_URL) {
    console.warn('LAMBDA_EMAIL_API_URL not configured, skipping email');
    return;
  }
  
  try {
    await axios.post(LAMBDA_API_URL, {
      type: 'BOOKING_CONFIRMATION',
      data: bookingData
    }, { 
      timeout: 5000,
      headers: {
        'x-api-key': LAMBDA_API_KEY
      }
    });
    console.log('Booking confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error.message);
  }
}

module.exports = {
  sendBookingConfirmationEmail
};
