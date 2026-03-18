const { validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Middleware para processar resultados de validação do express-validator
 */

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

module.exports = validationMiddleware;
