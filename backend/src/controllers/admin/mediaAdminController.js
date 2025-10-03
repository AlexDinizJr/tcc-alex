const prisma = require('../../utils/database');

// Validação simplificada para o body da mídia
const validateMediaData = (data) => {
  const errors = [];

  // Título obrigatório
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Título é obrigatório e deve ser uma string.');
  }

  // Type obrigatório (enum do Prisma)
  const validTypes = ['MOVIE', 'SERIES', 'MUSIC', 'GAME', 'BOOK'];
  if (!data.type || !validTypes.includes(data.type)) {
    errors.push(`Tipo é obrigatório e deve ser válido (${validTypes.join(', ')}).`);
  }

  // Classification opcional (enum do Prisma)
  const validClassifications = ['L', 'TEN', 'TWELVE', 'FOURTEEN', 'SIXTEEN', 'EIGHTEEN'];
  if (data.classification && !validClassifications.includes(data.classification)) {
    errors.push(`Classification inválida. Valores válidos: ${validClassifications.join(', ')}.`);
  }

  // Ano obrigatório
  if (!data.year || isNaN(parseInt(data.year))) {
    errors.push('Ano é obrigatório e deve ser um número válido.');
  }

  // Rating (opcional, mas deve ser válido se fornecido)
  if (data.rating && (isNaN(parseFloat(data.rating)) || data.rating < 0 || data.rating > 5)) {
    errors.push('Rating deve ser um número entre 0 e 5.');
  }

  // Arrays
  ['genres', 'platforms', 'artists', 'authors', 'directors'].forEach((field) => {
    if (data[field] && !Array.isArray(data[field])) {
      errors.push(`${field} deve ser um array de strings.`);
    }
  });

  // Campos numéricos opcionais
  ['seasons', 'duration', 'pages', 'tracks'].forEach((field) => {
    if (data[field] && isNaN(parseInt(data[field]))) {
      errors.push(`${field} deve ser um número válido.`);
    }
  });

  // Validação para developer (opcional, mas deve ser string se existir)
  if (data.developer && typeof data.developer !== 'string') {
    errors.push('developer deve ser uma string.');
  }

  return errors;
};

const adminMediaController = {
  async getMediaForEdit(req, res) {
    try {
      const { id } = req.params;
      const media = await prisma.media.findUnique({
        where: { id: parseInt(id) },
        include: { 
          streamingLinks: true 
        }
      });

      if (!media) return res.status(404).json({ message: 'Mídia não encontrada.' });
      
      res.json(media);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async createMedia(req, res) {
    try {
      const data = req.body;
      const errors = validateMediaData(data);
      if (errors.length) return res.status(400).json({ errors });

      // Verificar se já existe mídia com mesmo título e tipo
      const existingMedia = await prisma.media.findFirst({
        where: {
          title: data.title,
          type: data.type
        }
      });

      if (existingMedia) {
        return res.status(409).json({ 
          message: 'Já existe uma mídia com este título e tipo.' 
        });
      }

      const media = await prisma.media.create({
        data: {
          title: data.title,
          type: data.type,
          classification: data.classification || null,
          description: data.description || null,
          image: data.image || null,
          year: parseInt(data.year),
          rating: data.rating ? parseFloat(data.rating) : 0,
          reviewCount: 0,
          developer: data.developer || null,
          // AGORA É ARRAY DE STRINGS SIMPLES:
          genres: data.genres || [],
          platforms: data.platforms || [],
          artists: data.artists || [],
          authors: data.authors || [],
          directors: data.directors || [],
          seasons: data.seasons ? parseInt(data.seasons) : null,
          duration: data.duration ? parseInt(data.duration) : null,
          pages: data.pages ? parseInt(data.pages) : null,
          tracks: data.tracks ? parseInt(data.tracks) : null,
          publisher: data.publisher || null
        }
        // REMOVIDO include - arrays já vêm na resposta
      });

      res.status(201).json({ 
        message: 'Mídia criada com sucesso!', 
        media  // Já inclui todos os arrays
      });
    } catch (error) {
      console.error('Erro ao criar mídia:', error);
      
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          message: 'Já existe uma mídia com este título e tipo.' 
        });
      }
      
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async updateMedia(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const errors = validateMediaData(data);
      if (errors.length) return res.status(400).json({ errors });

      const existingMedia = await prisma.media.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingMedia) {
        return res.status(404).json({ message: 'Mídia não encontrada.' });
      }

      const media = await prisma.media.update({
        where: { id: parseInt(id) },
        data: {
          title: data.title,
          type: data.type,
          classification: data.classification || null,
          description: data.description || null,
          image: data.image || null,
          year: parseInt(data.year),
          rating: data.rating !== undefined ? parseFloat(data.rating) : existingMedia.rating,
          reviewCount: data.reviewCount !== undefined ? parseInt(data.reviewCount) : existingMedia.reviewCount,
          developer: data.developer !== undefined ? data.developer : existingMedia.developer,
          // AGORA É ARRAY SIMPLES:
          genres: data.genres !== undefined ? data.genres : existingMedia.genres,
          platforms: data.platforms !== undefined ? data.platforms : existingMedia.platforms,
          artists: data.artists !== undefined ? data.artists : existingMedia.artists,
          authors: data.authors !== undefined ? data.authors : existingMedia.authors,
          directors: data.directors !== undefined ? data.directors : existingMedia.directors,
          seasons: data.seasons !== undefined ? (data.seasons ? parseInt(data.seasons) : null) : existingMedia.seasons,
          duration: data.duration !== undefined ? (data.duration ? parseInt(data.duration) : null) : existingMedia.duration,
          pages: data.pages !== undefined ? (data.pages ? parseInt(data.pages) : null) : existingMedia.pages,
          tracks: data.tracks !== undefined ? (data.tracks ? parseInt(data.tracks) : null) : existingMedia.tracks,
          publisher: data.publisher !== undefined ? data.publisher : existingMedia.publisher
        }
        // REMOVIDO include
      });

      res.json({ 
        message: 'Mídia atualizada com sucesso!', 
        media
      });
    } catch (error) {
      console.error('Erro ao atualizar mídia:', error);
      
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          message: 'Já existe uma mídia com este título e tipo.' 
        });
      }
      
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se a mídia existe
      const media = await prisma.media.findUnique({
        where: { id: parseInt(id) }
      });

      if (!media) {
        return res.status(404).json({ message: 'Mídia não encontrada.' });
      }

      await prisma.media.delete({ 
        where: { id: parseInt(id) } 
      });
      
      res.json({ message: 'Mídia deletada com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = adminMediaController;