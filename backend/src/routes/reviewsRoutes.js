const express = require('express');
const {
  getMediaReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserMarkedHelpful,
  markHelpful
} = require('../controllers/reviewController');
const { validateReview, validateReviewUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: CRUD de avaliações e feedback dos usuários
 */

/**
 * @swagger
 * /api/reviews/media/{mediaId}:
 *   get:
 *     summary: Lista todas as reviews de uma mídia
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Lista de reviews da mídia
 */
router.get('/media/:mediaId', getMediaReviews);

/**
 * @swagger
 * /api/reviews/user/{userId}:
 *   get:
 *     summary: Lista todas as reviews de um usuário
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de reviews do usuário
 */
router.get('/user/:userId', getUserReviews);

/**
 * @swagger
 * /api/reviews/{reviewId}/user-marked-helpful:
 *   get:
 *     summary: Verifica se o usuário atual marcou uma review como útil
 *     security:
 *       - bearerAuth: []
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da review
 *     responses:
 *       200:
 *         description: Status se o usuário marcou a review como útil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userMarkedHelpful:
 *                   type: boolean
 *                   description: Indica se o usuário atual marcou a review como útil
 *                   example: true
 *       401:
 *         description: Usuário não autenticado (quando não há token)
 *       404:
 *         description: Review não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:reviewId/user-marked-helpful', authenticateToken, getUserMarkedHelpful);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Cria uma nova review
 *     security:
 *       - bearerAuth: []
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mediaId
 *               - rating
 *               - comment
 *             properties:
 *               mediaId:
 *                 type: integer
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 */
router.post('/', authenticateToken, validateReview, createReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Atualiza uma review existente
 *     security:
 *       - bearerAuth: []
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *               comment:
 *                 type: string
 *             example:
 *               rating: 4
 *               comment: "Comentário atualizado"
 *     responses:
 *       200:
 *         description: Review atualizada com sucesso
 *       404:
 *         description: Review não encontrada
 */
router.put('/:reviewId', authenticateToken, validateReviewUpdate, updateReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Deleta uma review
 *     security:
 *       - bearerAuth: []
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deletada com sucesso
 *       404:
 *         description: Review não encontrada
 */
router.delete('/:reviewId', authenticateToken, deleteReview);

/**
 * @swagger
 * /api/reviews/{reviewId}/helpful:
 *   post:
 *     summary: Marca ou desmarca review como útil
 *     security:
 *       - bearerAuth: []
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da review
 *     responses:
 *       200:
 *         description: Status de "útil" atualizado
 *       404:
 *         description: Review não encontrada
 */
router.post('/:reviewId/helpful', authenticateToken, markHelpful);

module.exports = router;
