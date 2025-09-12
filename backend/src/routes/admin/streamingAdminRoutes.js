const express = require('express');
const {
  updateMediaStreamingLinks,
  addStreamingLink,
  removeStreamingLink
} = require('../../controllers/admin/streamingController');
const { authenticateToken, isAdmin } = require('../../middleware/auth');

const router = express.Router();

router.put('/media/:mediaId/streaming-links', authenticateToken, isAdmin, updateMediaStreamingLinks);
router.post('/media/:mediaId/streaming-links', authenticateToken, isAdmin, addStreamingLink);
router.delete('/media/:mediaId/streaming-links/:service', authenticateToken, isAdmin, removeStreamingLink);

module.exports = router;