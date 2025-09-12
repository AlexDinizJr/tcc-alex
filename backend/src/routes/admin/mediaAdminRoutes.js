const express = require('express');
const { 
  createMedia, 
  updateMedia, 
  deleteMedia, 
  getMediaForEdit 
} = require('../../controllers/admin/mediaController');
const { authenticateToken, isAdmin } = require('../../middleware/auth');
const { validateMediaUrls } = require('../../middleware/urlValidation');

const router = express.Router();

// GET /api/admin/media/:id - Buscar mídia para edição
router.get('/:id', authenticateToken, isAdmin, getMediaForEdit);

// POST /api/admin/media - Criar nova mídia
router.post('/', authenticateToken, isAdmin, validateMediaUrls, createMedia);

// PUT /api/admin/media/:id - Atualizar mídia
router.put('/:id', authenticateToken, isAdmin, validateMediaUrls, updateMedia);

// DELETE /api/admin/media/:id - Deletar mídia
router.delete('/:id', authenticateToken, isAdmin, deleteMedia);

module.exports = router;