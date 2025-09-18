const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUserRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('username').isAlphanumeric().isLength({ min: 3 }),
  handleValidationErrors
];

const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 1000 }),
  handleValidationErrors
];

const validateReviewUpdate = [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 1000 }),
  (req, res, next) => {
    if (!req.body.rating && !req.body.comment) {
      return res.status(400).json({ error: 'É necessário enviar rating ou comment para atualizar' });
    }
    next();
  }
];

module.exports = {
  validateUserRegistration,
  validateReview,
  validateReviewUpdate,
  handleValidationErrors
};