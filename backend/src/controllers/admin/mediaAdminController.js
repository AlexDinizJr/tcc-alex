const prisma = require('../../utils/database');

const validateMediaData = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Título é obrigatório e deve ser uma string.');
  }
  if (!data.type || !['movie', 'series', 'music', 'game', 'book'].includes(data.type)) {
    errors.push('Tipo é obrigatório e deve ser válido (movie, series, music, game, book).');
  }
  if (data.year && isNaN(parseInt(data.year))) {
    errors.push('Ano deve ser um número válido.');
  }
  if (data.rating && (isNaN(parseFloat(data.rating)) || data.rating < 0 || data.rating > 5)) {
    errors.push('Rating deve ser um número entre 0 e 5.');
  }
  if (data.genres && !Array.isArray(data.genres)) {
    errors.push('Gêneros devem ser um array de strings.');
  }
  if (data.platforms && !Array.isArray(data.platforms)) {
    errors.push('Platforms devem ser um array de strings.');
  }
  if (data.streamingLinks) {
    if (!Array.isArray(data.streamingLinks)) {
      errors.push('StreamingLinks deve ser um array.');
    } else {
      data.streamingLinks.forEach((link, idx) => {
        if (!link.service || !link.url) {
          errors.push(`Streaming link na posição ${idx} precisa de service e url.`);
        }
      });
    }
  }

  return errors;
};

const adminMediaController = {
  async getMediaForEdit(req, res) {
    try {
      const { id } = req.params;
      const media = await prisma.media.findUnique({
        where: { id: parseInt(id) },
        include: { streamingLinks: true }
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

      const media = await prisma.media.create({
        data: {
          title: data.title,
          type: data.type,
          description: data.description || '',
          image: data.image || '', 
          year: data.year ? parseInt(data.year) : null,
          rating: data.rating ? parseFloat(data.rating) : 0,
          genres: data.genres ? { set: data.genres } : undefined,
          platforms: data.platforms ? { set: data.platforms } : undefined,
          artists: data.artists ? { set: data.artists } : undefined,
          authors: data.authors ? { set: data.authors } : undefined,
          directors: data.directors ? { set: data.directors } : undefined,
          streamingLinks: data.streamingLinks ? { create: data.streamingLinks } : undefined
        },
        include: { streamingLinks: true }
      });

      res.status(201).json({ message: 'Mídia criada com sucesso!', media });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async updateMedia(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const errors = validateMediaData(data);
      if (errors.length) return res.status(400).json({ errors });

      const media = await prisma.media.update({
        where: { id: parseInt(id) },
        data: {
          title: data.title,
          type: data.type,
          description: data.description || '',
          image: data.image || '',
          year: data.year ? parseInt(data.year) : null,
          rating: data.rating ? parseFloat(data.rating) : undefined,
          genres: data.genres ? { set: data.genres } : undefined,
          platforms: data.platforms ? { set: data.platforms } : undefined,
          artists: data.artists ? { set: data.artists } : undefined,
          authors: data.authors ? { set: data.authors } : undefined,
          directors: data.directors ? { set: data.directors } : undefined,
          streamingLinks: data.streamingLinks
            ? { deleteMany: {}, create: data.streamingLinks }
            : undefined
        },
        include: { streamingLinks: true }
      });

      res.json({ message: 'Mídia atualizada com sucesso!', media });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      await prisma.media.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Mídia deletada com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = adminMediaController;