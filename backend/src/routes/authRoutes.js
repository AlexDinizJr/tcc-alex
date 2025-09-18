const express = require('express');
const { register, login, getProfile, requestPasswordRecovery, resetPassword } = require('../controllers/authController');
const { validateUserRegistration } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação de usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', validateUserRegistration, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Faz login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - usernameOrEmail
 *               - password
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @swagger
 * /api/auth/password/recovery:
 *   post:
 *     summary: Solicita recuperação de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Token de recuperação enviado por e-mail
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/password/recovery', requestPasswordRecovery);

/**
 * @swagger
 * /api/auth/password/reset:
 *   post:
 *     summary: Redefine a senha usando token de recuperação
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/password/reset', resetPassword);

module.exports = router;
