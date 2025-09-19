const express = require('express');
const {
  updateMediaStreamingLinks,
  addStreamingLink,
  removeStreamingLink,
  getAllStreamingLinks
} = require('../../controllers/admin/streamingAdminController');
const { authenticateToken, isAdmin } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminStreaming
 *   description: Gerenciamento de links de streaming para administradores
 */

/**
 * @swagger
 * /api/admin/streaming/streaming-links:
 *   get:
 *     summary: Retorna todos os links de streaming cadastrados
 *     tags: [AdminStreaming]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de links de streaming
 */
router.get('/streaming-links', authenticateToken, isAdmin, getAllStreamingLinks);

/**
 * @swagger
 * /api/admin/streaming/links/{linkId}:
 *   put:
 *     summary: Atualiza um link de streaming específico
 *     tags: [AdminStreaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: linkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do link de streaming
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Link de streaming atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Link de streaming não encontrado
 */
router.put(
  '/links/:linkId',
  authenticateToken,
  isAdmin,
  updateMediaStreamingLinks // método que atualiza link pelo ID
);

/**
 * @swagger
 * /api/admin/streaming/media/{mediaId}/streaming-links:
 *   post:
 *     summary: Adiciona um novo link de streaming a uma mídia
 *     tags: [AdminStreaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da mídia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Link de streaming adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Mídia não encontrada
 */
router.post(
  '/media/:mediaId/streaming-links',
  authenticateToken,
  isAdmin,
  addStreamingLink
);

/**
 * @swagger
 * /api/admin/streaming/links/{linkId}:
 *   delete:
 *     summary: Remove um link de streaming pelo ID
 *     tags: [AdminStreaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: linkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do link de streaming
 *     responses:
 *       200:
 *         description: Link de streaming removido com sucesso
 *       404:
 *         description: Link não encontrado
 */
router.delete(
  '/links/:linkId',
  authenticateToken,
  isAdmin,
  removeStreamingLink
);

module.exports = router;