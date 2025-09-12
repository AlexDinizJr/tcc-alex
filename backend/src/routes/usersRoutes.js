const express = require('express');
const {
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  uploadAvatar,
  uploadCover,
  deleteAvatar,
  deleteCover
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { avatarUpload, coverUpload } = require('../config/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados a usuários e perfis
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários com paginação e busca
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de usuários por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por nome ou username
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/users/username/{username}:
 *   get:
 *     summary: Busca usuário pelo nome de usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/username/:username', getUserByUsername);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Atualiza perfil do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               profileVisibility:
 *                 type: string
 *                 enum: [public, private]
 *               showSavedItems:
 *                 type: boolean
 *               showFavorites:
 *                 type: boolean
 *               showReviews:
 *                 type: boolean
 *               showStats:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.put('/profile', authenticateToken, updateUser);

/**
 * @swagger
 * /api/users/avatar/upload:
 *   post:
 *     summary: Faz upload do avatar do usuário
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar atualizado com sucesso
 */
router.post('/avatar/upload', authenticateToken, avatarUpload.single('avatar'), uploadAvatar);

/**
 * @swagger
 * /api/users/cover/upload:
 *   post:
 *     summary: Faz upload da imagem de capa do usuário
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cover
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Capa atualizada com sucesso
 */
router.post('/cover/upload', authenticateToken, coverUpload.single('cover'), uploadCover);

/**
 * @swagger
 * /api/users/avatar:
 *   delete:
 *     summary: Remove o avatar do usuário
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Avatar removido com sucesso
 */
router.delete('/avatar', authenticateToken, deleteAvatar);

/**
 * @swagger
 * /api/users/cover:
 *   delete:
 *     summary: Remove a imagem de capa do usuário
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Capa removida com sucesso
 */
router.delete('/cover', authenticateToken, deleteCover);

module.exports = router;
