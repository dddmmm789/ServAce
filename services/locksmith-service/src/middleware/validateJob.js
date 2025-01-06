const Joi = require('joi');
const logger = require('../utils/logger');

const jobSchema = Joi.object({
  searchType: Joi.string().valid('phone', 'address').required(),
  searchValue: Joi.string().required(),
  type: Joi.string().required(),
  urgency: Joi.string().valid('normal', 'urgent', 'emergency').required(),
  customerName: Joi.string(),
  description: Joi.string(),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2),
    type: Joi.string().valid('Point')
  })
});

module.exports = (req, res, next) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    logger.error('Job validation error:', error.details);
    return res.status(400).json({ 
      message: 'Invalid job data', 
      details: error.details 
    });
  }
  next();
}; 