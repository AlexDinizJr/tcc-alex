const express = require('express');
const { 
  createMedia, 
  updateMedia, 
  deleteMedia, 
  getMediaForEdit 
} = require('../../controllers/admin/mediaAdminController');
const { authenticateToken, isAdmin } = require('../../middleware/auth');

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       404:
 *         description: Mídia não encontrada
 *       500:
 *         description: Erro interno do servidor
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
 *             required:
 *               - title
 *               - type
 *               - year
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               type:
 *                 type: string
 *                 enum: [MOVIE, SERIES, MUSIC, GAME, BOOK]
 *                 example: "MOVIE"
 *               year:
 *                 type: integer
 *                 example: 2010
 *               classification:
 *                 type: string
 *                 enum: [L, TEN, TWELVE, FOURTEEN, SIXTEEN, EIGHTEEN]
 *                 nullable: true
 *                 example: "FOURTEEN"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "A mind-bending thriller"
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/image.jpg"
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 nullable: true
 *                 example: 4.5
 *               reviewCount:
 *                 type: integer
 *                 nullable: true
 *                 example: 150
 *               developer:
 *                 type: string
 *                 nullable: true
 *                 example: "Warner Bros."
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi", "Thriller"]
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Cinema", "Blu-ray"]
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Leonardo DiCaprio", "Marion Cotillard"]
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Christopher Nolan"]
 *               directors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Christopher Nolan"]
 *               seasons:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               duration:
 *                 type: integer
 *                 nullable: true
 *                 example: 148
 *               pages:
 *                 type: integer
 *                 nullable: true
 *                 example: 320
 *               publisher:
 *                 type: string
 *                 nullable: true
 *                 example: "Penguin Books"
 *     responses:
 *       201:
 *         description: Mídia criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 media:
 *                   $ref: '#/components/schemas/Media'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Mídia já existe com este título e tipo
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', authenticateToken, isAdmin, createMedia);

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
 *                 example: "Inception: Director's Cut"
 *               type:
 *                 type: string
 *                 enum: [MOVIE, SERIES, MUSIC, GAME, BOOK]
 *                 example: "MOVIE"
 *               year:
 *                 type: integer
 *                 example: 2010
 *               classification:
 *                 type: string
 *                 enum: [L, TEN, TWELVE, FOURTEEN, SIXTEEN, EIGHTEEN]
 *                 nullable: true
 *                 example: "SIXTEEN"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Extended version with bonus scenes"
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/new-image.jpg"
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 nullable: true
 *                 example: 4.8
 *               reviewCount:
 *                 type: integer
 *                 nullable: true
 *                 example: 200
 *               developer:
 *                 type: string
 *                 nullable: true
 *                 example: "Warner Bros. Pictures"
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi", "Thriller", "Drama"]
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Cinema", "Blu-ray", "4K UHD"]
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"]
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Christopher Nolan"]
 *               directors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Christopher Nolan"]
 *               seasons:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               duration:
 *                 type: integer
 *                 nullable: true
 *                 example: 158
 *               pages:
 *                 type: integer
 *                 nullable: true
 *                 example: 350
 *               publisher:
 *                 type: string
 *                 nullable: true
 *                 example: "Warner Books"
 *     responses:
 *       200:
 *         description: Mídia atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 media:
 *                   $ref: '#/components/schemas/Media'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Mídia não encontrada
 *       409:
 *         description: Mídia já existe com este título e tipo
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', authenticateToken, isAdmin, updateMedia);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Mídia não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', authenticateToken, isAdmin, deleteMedia);

module.exports = router;