const express = require('express');
const {
  getMediaReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
} = require('../controllers/reviewController');
const { validateReview } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/media/:mediaId', getMediaReviews);
router.get('/user/:userId', getUserReviews);
router.post('/', authenticateToken, validateReview, createReview);
router.put('/:reviewId', authenticateToken, validateReview, updateReview);
router.delete('/:reviewId', authenticateToken, deleteReview);
router.post('/:reviewId/helpful', authenticateToken, markHelpful);

module.exports = router;