const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { validateUserRegistration } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;