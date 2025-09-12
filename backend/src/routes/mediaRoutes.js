const express = require('express');
const {
  getAllMedia,
  getMediaById,
  getTrending,
  getRecommendations,
  getMediaByType,
  searchMedia,
  getMediaGenres,
  getMediaByGenre,
  getMediaStreamingLinks,
  getAvailableStreamingServices,
  getMediaByStreamingService
} = require('../controllers/mediaController');

const router = express.Router();

// Rotas principais
router.get('/', getAllMedia);
router.get('/trending', getTrending);
router.get('/recommendations', getRecommendations);
router.get('/search', searchMedia);
router.get('/genres', getMediaGenres);
router.get('/genre/:genre', getMediaByGenre);
router.get('/type/:type', getMediaByType);
router.get('/:id', getMediaById);

// Novas rotas para streaming links
router.get('/:id/streaming-links', getMediaStreamingLinks);
router.get('/services/streaming', getAvailableStreamingServices);
router.get('/service/streaming/:service', getMediaByStreamingService);

module.exports = router;