const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const {
  getUserRecommendations,
  getTrending,
  getSimilarMedia,
  getInitialPreferences,
  excludeFromRecommendations,
  getCustomRecommendations,
  getUserPreferences
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
 *         name: userId
 *         schema:
 *           type: integer
 *         description: ID do usuário (alternativa ao JWT)
 *     responses:
 *       200:
 *         description: Lista de recomendações personalizadas
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/', authenticateToken, getUserRecommendations);

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
router.get('/custom', authenticateToken, getCustomRecommendations);

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
 *           default: 5
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
router.post('/exclude/:mediaId', authenticateToken, excludeFromRecommendations);

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
router.post('/initial-preferences', authenticateToken, getInitialPreferences);

/**
 * @swagger
 * /api/recommendations/preferences:
 *   get:
 *     summary: Obter preferências do usuário
 *     description: Retorna as preferências do usuário com base em reviews, saved e favoritos. Pode ser testado no Swagger usando o token de autenticação ou passando userId.
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: ID do usuário (opcional se JWT fornecido)
 *     responses:
 *       200:
 *         description: Preferências do usuário
 *       400:
 *         description: ID do usuário inválido
 *       500:
 *         description: Erro ao buscar preferências
 */
router.get('/preferences', authenticateToken, getUserPreferences);

module.exports = router;