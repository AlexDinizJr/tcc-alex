const express = require('express');
const { getUserById, getUserByUsername, updateUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', getUserById);
router.get('/username/:username', getUserByUsername);
router.put('/profile', authenticateToken, updateUser);

module.exports = router;