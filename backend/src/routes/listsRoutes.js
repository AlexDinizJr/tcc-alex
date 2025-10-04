const express = require('express');
const {
  getAllLists,
  getUserLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addItemToList,
  removeItemFromList,
  toggleSaveMedia,
  toggleFavoriteMedia,
  getUserSavedMedia,
  getUserFavorites
} = require('../controllers/listController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Gerenciamento de listas de mídia do usuário
 */

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Retorna todas as listas do site com pesquisa opcional pelo nome
 *     tags: [Lists]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Número de listas por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pesquisa pelo nome da lista (opcional)
 *       - in: query
 *         name: includeItems
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir até 4 itens da lista (opcional)
 *     responses:
 *       200:
 *         description: Listas retornadas com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', getAllLists);

/**
 * @swagger
 * /api/lists/user/{userId}:
 *   get:
 *     summary: Retorna todas as listas de um usuário
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Listas retornadas com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/user/:userId', getUserLists);

/**
 * @swagger
 * /api/lists/{listId}:
 *   get:
 *     summary: Retorna uma lista específica pelo ID
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista
 *     responses:
 *       200:
 *         description: Lista encontrada
 *       404:
 *         description: Lista não encontrada
 */
router.get('/:listId', getListById);

/**
 * @swagger
 * /api/lists/user/{userId}/saved:
 *   get:
 *     summary: Retorna todas as mídias salvas de um usuário (se permitido)
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de mídias salvas
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/user/:userId/saved', getUserSavedMedia);

/**
 * @swagger
 * /api/lists/user/{userId}/favorites:
 *   get:
 *     summary: Retorna todas as mídias favoritas de um usuário (se permitido)
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de mídias favoritas
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/user/:userId/favorites', getUserFavorites);

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Cria uma nova lista para o usuário autenticado
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/', authenticateToken, createList);

/**
 * @swagger
 * /api/lists/{listId}:
 *   put:
 *     summary: Atualiza uma lista existente
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lista atualizada
 *       404:
 *         description: Lista não encontrada
 *       401:
 *         description: Não autorizado
 */
router.put('/:listId', authenticateToken, updateList);

/**
 * @swagger
 * /api/lists/{listId}:
 *   delete:
 *     summary: Deleta uma lista existente
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da lista
 *     responses:
 *       204:
 *         description: Lista removida com sucesso
 *       404:
 *         description: Lista não encontrada
 */
router.delete('/:listId', authenticateToken, deleteList);

/**
 * @swagger
 * /api/lists/items:
 *   post:
 *     summary: Adiciona um item a uma lista
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listId:
 *                 type: integer
 *               mediaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item adicionado à lista
 */
router.post('/items', authenticateToken, addItemToList);

/**
 * @swagger
 * /api/lists/{listId}/items/{mediaId}:
 *   delete:
 *     summary: Remove um item de uma lista
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: mediaId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Item removido da lista
 *       404:
 *         description: Item não encontrado
 */
router.delete('/:listId/items/:mediaId', authenticateToken, removeItemFromList);

/**
 * @swagger
 * /api/lists/save-media:
 *   post:
 *     summary: Salva ou remove uma mídia da lista "salvos" do usuário
 *     tags: [Lists]
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
 *     responses:
 *       200:
 *         description: Mídia salva ou removida com sucesso
 */
router.post('/save-media', authenticateToken, toggleSaveMedia);

/**
 * @swagger
 * /api/lists/favorite-media:
 *   post:
 *     summary: Marca ou desmarca uma mídia como favorita
 *     tags: [Lists]
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
 *     responses:
 *       200:
 *         description: Mídia favoritada ou desfavoritada com sucesso
 */
router.post('/favorite-media', authenticateToken, toggleFavoriteMedia);

module.exports = router;