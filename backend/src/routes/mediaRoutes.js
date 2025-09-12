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

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Endpoints para consultar mídias (filmes, séries, músicas, etc)
 */

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Retorna todas as mídias
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Lista de mídias retornada com sucesso
 */
router.get('/', getAllMedia);

/**
 * @swagger
 * /api/media/trending:
 *   get:
 *     summary: Retorna as mídias em alta (trending)
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Lista de mídias em alta retornada com sucesso
 */
router.get('/trending', getTrending);

/**
 * @swagger
 * /api/media/recommendations:
 *   get:
 *     summary: Retorna recomendações de mídia personalizadas
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Lista de recomendações
 */
router.get('/recommendations', getRecommendations);

/**
 * @swagger
 * /api/media/search:
 *   get:
 *     summary: Pesquisa mídias por nome ou palavra-chave
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de pesquisa
 *     responses:
 *       200:
 *         description: Lista de mídias encontradas
 */
router.get('/search', searchMedia);

/**
 * @swagger
 * /api/media/genres:
 *   get:
 *     summary: Retorna todos os gêneros disponíveis
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Lista de gêneros
 */
router.get('/genres', getMediaGenres);

/**
 * @swagger
 * /api/media/genre/{genre}:
 *   get:
 *     summary: Retorna mídias de um gênero específico
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do gênero
 *     responses:
 *       200:
 *         description: Lista de mídias filtradas pelo gênero
 */
router.get('/genre/:genre', getMediaByGenre);

/**
 * @swagger
 * /api/media/type/{type}:
 *   get:
 *     summary: "Retorna mídias de um tipo específico (ex: movie, game, music)"
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo da mídia
 *     responses:
 *       200:
 *         description: Lista de mídias filtradas pelo tipo
 */
router.get('/type/:type', getMediaByType);

/**
 * @swagger
 * /api/media/{id}/streaming-links:
 *   get:
 *     summary: Retorna os links de streaming para uma mídia
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Lista de links de streaming
 */
router.get('/:id/streaming-links', getMediaStreamingLinks);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Retorna uma mídia pelo ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia encontrada
 *       404:
 *         description: Mídia não encontrada
 */
router.get('/:id', getMediaById);

/**
 * @swagger
 * /api/media/services/streaming:
 *   get:
 *     summary: Retorna os serviços de streaming disponíveis
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Lista de serviços
 */
router.get('/services/streaming', getAvailableStreamingServices);

/**
 * @swagger
 * /api/media/service/streaming/{service}:
 *   get:
 *     summary: Retorna mídias disponíveis em um serviço de streaming específico
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: service
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do serviço de streaming
 *     responses:
 *       200:
 *         description: Lista de mídias no serviço
 */
router.get('/service/streaming/:service', getMediaByStreamingService);

module.exports = router;