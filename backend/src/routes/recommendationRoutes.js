const express = require('express');
const router = express.Router();

const {
  getUserRecommendations,
  getTrending,
  getSimilarMedia,
  getInitialPreferences,
  excludeFromRecommendations,
  getRecommendationMetrics,
  trackEngagement,
  getCustomRecommendations
} = require('../controllers/recommendationController');

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Endpoints para recomendações, tendências e métricas
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Obter recomendações personalizadas para o usuário
 *     description: Retorna recomendações com base no histórico de interação do usuário. Necessário estar autenticado.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: algorithm
 *         schema:
 *           type: string
 *           enum: [collaborative, content-based, engagement, trending, hybrid]
 *           default: hybrid
 *     responses:
 *       200:
 *         description: Lista de recomendações personalizadas
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/', getUserRecommendations);

/**
 * @swagger
 * /api/recommendations/custom:
 *   get:
 *     summary: Obter recomendações customizadas (usuário autenticado)
 *     description: 
 *       Gera recomendações personalizadas usando filtros (tipo, gênero, nota mínima, ano) e mídias de referência.
 *       É necessário estar logado para acessar esta rota.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: [] # obrigatório
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: movie
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *           example: action
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           format: float
 *           example: 7.5
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *           example: 2010
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *           example: 2023
 *       - in: query
 *         name: referenceMediaIds
 *         schema:
 *           type: string
 *           description: IDs de mídia de referência, separados por vírgula
 *           example: "12,45,99"
 *     responses:
 *       200:
 *         description: Lista de recomendações customizadas
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/custom', getCustomRecommendations);


/**
 * @swagger
 * /api/recommendations/trending:
 *   get:
 *     summary: Obter conteúdo em alta (trending)
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [week, month, all-time]
 *           default: week
 *     responses:
 *       200:
 *         description: Lista de mídias em alta
 */
router.get('/trending', getTrending);

/**
 * @swagger
 * /api/recommendations/similar/{id}:
 *   get:
 *     summary: Buscar mídias similares a uma mídia específica
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *       - in: query
 *         name: excludeOriginal
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Lista de mídias similares
 */
router.get('/similar/:id', getSimilarMedia);

/**
 * @swagger
 * /api/recommendations/exclude/{mediaId}:
 *   post:
 *     summary: Excluir mídia das recomendações do usuário
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               months:
 *                 type: integer
 *                 default: 3
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mídia excluída com sucesso
 */
router.post('/exclude/:mediaId', excludeFromRecommendations);

/**
 * @swagger
 * /api/recommendations/initial-preferences:
 *   post:
 *     summary: Salvar ou obter preferências iniciais do usuário (onboarding)
 *     description: Recebe os IDs de mídias escolhidas pelo usuário durante o onboarding e retorna as preferências geradas.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               selectedMediaIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs de mídias escolhidas pelo usuário
 *                 example: [12, 45, 99]
 *     responses:
 *       200:
 *         description: Preferências iniciais do usuário
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao gerar preferências
 */
router.post('/initial-preferences', getInitialPreferences);

/**
 * @swagger
 * /api/recommendations/metrics:
 *   get:
 *     summary: Buscar métricas de recomendações (para admin/dashboard)
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: integer
 *           default: 30
 *       - in: query
 *         name: detailed
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Métricas de recomendações
 */
router.get('/metrics', getRecommendationMetrics);

/**
 * @swagger
 * /api/recommendations/track:
 *   post:
 *     summary: Registrar engajamento do usuário com uma mídia
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mediaId
 *               - action
 *             properties:
 *               mediaId:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [view, save, favorite, share, click, watch]
 *               metadata:
 *                 type: object
 *               source:
 *                 type: string
 *     responses:
 *       200:
 *         description: Engajamento registrado com sucesso
 */
router.post('/track', trackEngagement);

module.exports = router;