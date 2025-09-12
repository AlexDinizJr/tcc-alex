const express = require('express');
const {
  getUserLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addItemToList,
  removeItemFromList,
  toggleSaveMedia,
  toggleFavoriteMedia
} = require('../controllers/listController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/user/:userId', getUserLists);
router.get('/:listId', getListById);
router.post('/', authenticateToken, createList);
router.put('/:listId', authenticateToken, updateList);
router.delete('/:listId', authenticateToken, deleteList);
router.post('/items', authenticateToken, addItemToList);
router.delete('/:listId/items/:mediaId', authenticateToken, removeItemFromList);
router.post('/save-media', authenticateToken, toggleSaveMedia);
router.post('/favorite-media', authenticateToken, toggleFavoriteMedia);

module.exports = router;