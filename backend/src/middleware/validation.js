const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUserRegistration = [
  body('email')
    .trim()
    .isEmail().withMessage('E-mail inválido'),

  body('password')
    .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),

  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('O nome deve ter no mínimo 2 caracteres'),

  body('username')
    .trim()
    .matches(/^[a-zA-Z0-9._-]+$/).withMessage('O username só pode conter letras, números, ponto, underline e hífen')
    .isLength({ min: 3 }).withMessage('O username deve ter no mínimo 3 caracteres'),

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