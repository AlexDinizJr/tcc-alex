const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { reportIssue, sendRequest } = require('../controllers/reportController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Rotas para reportar problemas e enviar pedidos
 */

/**
 * @swagger
 * /api/reports/issue:
 *   post:
 *     summary: Reportar um problema relacionado a uma mídia
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaId:
 *                 type: integer
 *               issueType:
 *                 type: string
 *               description:
 *                 type: string
 *               userEmail:
 *                 type: string
 *             required:
 *               - mediaId
 *               - issueType
 *               - description
 *     responses:
 *       200:
 *         description: Problema reportado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       500:
 *         description: Erro ao enviar relatório
 */
router.post('/issue', authenticateToken, reportIssue);

/**
 * @swagger
 * /api/reports/request:
 *   post:
 *     summary: Enviar um pedido ou sugestão para a equipe
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestType:
 *                 type: string
 *               details:
 *                 type: string
 *               userEmail:
 *                 type: string
 *             required:
 *               - requestType
 *               - details
 *     responses:
 *       200:
 *         description: Pedido enviado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       500:
 *         description: Erro ao enviar pedido
 */
router.post('/request', authenticateToken, sendRequest);

module.exports = router;