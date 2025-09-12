const express = require('express');
const {
  updateMediaStreamingLinks,
  addStreamingLink,
  removeStreamingLink
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
 * /api/admin/streaming/media/{mediaId}/streaming-links:
 *   put:
 *     summary: Atualiza todos os links de streaming de uma mídia
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
 *               streamingLinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                     url:
 *                       type: string
 *     responses:
 *       200:
 *         description: Links de streaming atualizados com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Mídia não encontrada
 */
router.put('/media/:mediaId/streaming-links', authenticateToken, isAdmin, updateMediaStreamingLinks);

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
router.post('/media/:mediaId/streaming-links', authenticateToken, isAdmin, addStreamingLink);

/**
 * @swagger
 * /api/admin/streaming/media/{mediaId}/streaming-links/{service}:
 *   delete:
 *     summary: Remove um link de streaming de uma mídia
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
 *       - in: path
 *         name: service
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do serviço de streaming
 *     responses:
 *       200:
 *         description: Link de streaming removido com sucesso
 *       404:
 *         description: Link ou mídia não encontrado
 */
router.delete('/media/:mediaId/streaming-links/:service', authenticateToken, isAdmin, removeStreamingLink);

module.exports = router;