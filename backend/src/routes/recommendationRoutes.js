const express = require('express');
const router = express.Router();

const {
  getUserRecommendations,
  getTrending,
  getSimilarMedia,
  getEngagementRecommendations,
  getOptimizedRecommendations,
  excludeFromRecommendations,
  getRecommendationMetrics,
  getHomepageRecommendations,
  trackEngagement
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
 * /api/recommendations/homepage:
 *   get:
 *     summary: Recomendações exibidas na homepage
 *     description: 
 *       Rota exclusiva para usuários logados. Retorna recomendações curtas e rápidas para exibição na homepage.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mídias para exibição na homepage
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/homepage', getHomepageRecommendations);

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
 * /api/recommendations/engagement:
 *   get:
 *     summary: Recomendações baseadas em engajamento do usuário
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *       - in: query
 *         name: engagementType
 *         schema:
 *           type: string
 *           enum: [all, saved, favorited, viewed]
 *           default: all
 *     responses:
 *       200:
 *         description: Lista de recomendações baseadas em engajamento
 */
router.get('/engagement', getEngagementRecommendations);

/**
 * @swagger
 * /api/recommendations/optimized:
 *   get:
 *     summary: Recomendações híbridas otimizadas
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
 *         name: includeExplanation
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Recomendações geradas via algoritmo híbrido
 */
router.get('/optimized', getOptimizedRecommendations);

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