const express = require('express');
const { 
  getUserById, 
  getUserByUsername, 
  updateUser,
  uploadAvatar,
  uploadCover,
  deleteAvatar,
  deleteCover
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { avatarUpload, coverUpload } = require('../config/upload');

const router = express.Router();

// Rotas existentes
router.get('/:id', getUserById);
router.get('/username/:username', getUserByUsername);
router.put('/profile', authenticateToken, updateUser);

// Novas rotas de upload
router.post(
  '/avatar/upload',
  authenticateToken,
  avatarUpload.single('avatar'),
  uploadAvatar
);

router.post(
  '/cover/upload', 
  authenticateToken,
  coverUpload.single('cover'),
  uploadCover
);

router.delete('/avatar', authenticateToken, deleteAvatar);
router.delete('/cover', authenticateToken, deleteCover);

module.exports = router;