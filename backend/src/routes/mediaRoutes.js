const express = require('express');
const {
  getAllMedia,
  getMediaById,
  getMediaByType,
  searchMedia,
  getMediaGenres,
  getMediaByGenre,
  getMediaStreamingLinks,
  getAvailableStreamingServices,
  getMediaByStreamingService,
  getAllClassifications,
  getMediaByClassification,
  getMediaByYearRange,
  getMediaByMinRating
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
 * /api/media/classifications:
 *   get:
 *     summary: Retorna todas as classificações indicativas disponíveis
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Lista de classificações indicativas
 *         content:
 *           application/json:
 *             example:
 *               - L
 *               - TEN
 *               - TWELVE
 *               - FOURTEEN
 *               - SIXTEEN
 *               - EIGHTEEN
 */
router.get('/classifications', getAllClassifications);

/**
 * @swagger
 * /api/media/classification/{classification}:
 *   get:
 *     summary: Retorna mídias de uma classificação indicativa específica
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: classification
 *         required: true
 *         schema:
 *           type: string
 *           enum: [L, TEN, TWELVE, FOURTEEN, SIXTEEN, EIGHTEEN]
 *         description: Código da classificação indicativa
 *     responses:
 *       200:
 *         description: Lista de mídias filtradas pela classificação indicativa
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: "The Batman"
 *                 type: "MOVIE"
 *                 classification: "FOURTEEN"
 *               - id: 2
 *                 title: "Stranger Things"
 *                 type: "SERIES"
 *                 classification: "FOURTEEN"
 */
router.get('/classification/:classification', getMediaByClassification);

/**
 * @swagger
 * /api/media/year-range:
 *   get:
 *     summary: Retorna mídias dentro de um intervalo de anos
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ano inicial
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ano final
 *     responses:
 *       200:
 *         description: Lista de mídias no intervalo de anos especificado
 *         content:
 *           application/json:
 *             example:
 *               - id: 5
 *                 title: "Oppenheimer"
 *                 year: 2023
 *                 type: "MOVIE"
 *               - id: 6
 *                 title: "Cyberpunk 2077"
 *                 year: 2020
 *                 type: "GAME"
 */
router.get('/year-range', getMediaByYearRange);

/**
 * @swagger
 * /api/media/min-rating:
 *   get:
 *     summary: Retorna mídias com nota acima de um valor mínimo
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: rating
 *         required: true
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Nota mínima (0 a 5)
 *     responses:
 *       200:
 *         description: Lista de mídias com nota mínima
 *         content:
 *           application/json:
 *             example:
 *               - id: 3
 *                 title: "The Last of Us Part II"
 *                 rating: 4.9
 *                 type: "GAME"
 *               - id: 4
 *                 title: "Inception"
 *                 rating: 4.8
 *                 type: "MOVIE"
 */
router.get('/min-rating', getMediaByMinRating);

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