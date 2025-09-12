const express = require('express');
const mediaController = require('../controllers/mediaController');

const router = express.Router();

// Rotas públicas
router.get('/', mediaController.getAllMedia); // listar mídias com filtros, pesquisa e paginação
router.get('/trending', mediaController.getTrending); // mídias em alta
router.get('/recommendations', mediaController.getRecommendations); // recomendações simples
router.get('/:id', mediaController.getMediaById); // detalhes de uma mídia específica

// Rotas de criação/edição/deleção de mídias, caso seja necessário;
// router.post('/', authenticateToken, mediaController.createMedia);
// router.put('/:id', authenticateToken, mediaController.updateMedia);
// router.delete('/:id', authenticateToken, mediaController.deleteMedia);

module.exports = router;
