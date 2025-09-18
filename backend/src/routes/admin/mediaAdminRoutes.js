const express = require('express');
const { 
  createMedia, 
  updateMedia, 
  deleteMedia, 
  getMediaForEdit 
} = require('../../controllers/admin/mediaAdminController');
const { authenticateToken, isAdmin } = require('../../middleware/auth');
const { validateMediaUrls } = require('../../middleware/urlValidation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminMedia
 *   description: Gerenciamento de mídias para administradores
 */

/**
 * @swagger
 * /api/admin/media/{id}:
 *   get:
 *     summary: Buscar mídia para edição
 *     tags: [AdminMedia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia encontrada com sucesso
 *       404:
 *         description: Mídia não encontrada
 */
router.get('/:id', authenticateToken, isAdmin, getMediaForEdit);

/**
 * @swagger
 * /api/admin/media:
 *   post:
 *     summary: Criar nova mídia
 *     tags: [AdminMedia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [MOVIE, SERIES, MUSIC, GAME, BOOK]
 *               classification:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               year:
 *                 type: integer
 *                 nullable: true
 *               rating:
 *                 type: number
 *                 nullable: true
 *               reviewCount:
 *                 type: integer
 *                 nullable: true
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *               directors:
 *                 type: array
 *                 items:
 *                   type: string
 *               seasons:
 *                 type: integer
 *                 nullable: true
 *               duration:
 *                 type: integer
 *                 nullable: true
 *               pages:
 *                 type: integer
 *                 nullable: true
 *               publisher:
 *                 type: string
 *                 nullable: true
 *               image:
 *                 type: string
 *                 nullable: true
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
 *       201:
 *         description: Mídia criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authenticateToken, isAdmin, validateMediaUrls, createMedia);

/**
 * @swagger
 * /api/admin/media/{id}:
 *   put:
 *     summary: Atualizar mídia existente
 *     tags: [AdminMedia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [MOVIE, SERIES, MUSIC, GAME, BOOK]
 *               classification:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               year:
 *                 type: integer
 *                 nullable: true
 *               rating:
 *                 type: number
 *                 nullable: true
 *               reviewCount:
 *                 type: integer
 *                 nullable: true
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *               directors:
 *                 type: array
 *                 items:
 *                   type: string
 *               seasons:
 *                 type: integer
 *                 nullable: true
 *               duration:
 *                 type: integer
 *                 nullable: true
 *               pages:
 *                 type: integer
 *                 nullable: true
 *               publisher:
 *                 type: string
 *                 nullable: true
 *               image:
 *                 type: string
 *                 nullable: true
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
 *         description: Mídia atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Mídia não encontrada
 */
router.put('/:id', authenticateToken, isAdmin, validateMediaUrls, updateMedia);

/**
 * @swagger
 * /api/admin/media/{id}:
 *   delete:
 *     summary: Deletar mídia
 *     tags: [AdminMedia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da mídia
 *     responses:
 *       200:
 *         description: Mídia deletada com sucesso
 *       404:
 *         description: Mídia não encontrada
 */
router.delete('/:id', authenticateToken, isAdmin, deleteMedia);

module.exports = router;