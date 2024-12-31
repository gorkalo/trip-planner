const logger = require('../services/logger');
const errorHandler = (err, res) => {

  const status = err?.status || 500;
  const message = err?.message || 'Something went wrong';

  logger.error('Error: %s | Status: %d | Stack: %s', message, status, err?.stack);

  return res.status(status).json({
      success: false,
      error: message,
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
  });
};

module.exports = errorHandler;