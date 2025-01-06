const axios = require('axios');
const logger = require('./logger');

exports.sendReviewRequest = async (job) => {
  try {
    // In production, you'd want to use a proper email/SMS service
    if (process.env.NODE_ENV === 'production') {
      // Send SMS
      // await sendSMS(job.phone, `Please review your locksmith service: ${process.env.REVIEW_URL}/${job._id}`);
      
      // Send Email
      // await sendEmail(job.email, 'Review your locksmith service', emailTemplate(job));
    }

    logger.info(`Review request sent for job ${job._id}`);
  } catch (error) {
    logger.error('Error sending review request:', error);
    throw error;
  }
}; 