const prisma = require('../utils/database');

const mediaController = {
  async getAllMedia(req, res) {
    try {
      const { type, search, page = 1, limit = 20, sortBy = 'title' } = req.query;
      
      const skip = (page - 1) * limit;
      
      const where = {
        type: type || undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined
      };

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: this.getSortOption(sortBy),
          include: {
            genres: true,
            streamingLinks: true,
            _count: {
              select: {
                reviews: true,
                savedBy: true,
                favoritedBy: true
              }
            }
          }
        }),
        prisma.media.count({ where })
      ]);

      res.json({
        media,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  getSortOption(sortBy) {
    const sortOptions = {
      title: { title: 'asc' },
      rating: { rating: 'desc' },
      year: { year: 'desc' },
      newest: { createdAt: 'desc' }
    };
    return sortOptions[sortBy] || { title: 'asc' };
  },

  async getMediaById(req, res) {
    try {
      const media = await prisma.media.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          genres: true,
          streamingLinks: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatar: true
                }
              }
            },
            orderBy: { date: 'desc' }
          },
          _count: {
            select: {
              reviews: true,
              savedBy: true,
              favoritedBy: true
            }
          }
        }
      });

      if (!media) {
        return res.status(404).json({ error: 'Mídia não encontrada' });
      }

      res.json(media);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getTrending(req, res) {
    try {
      const trending = await prisma.media.findMany({
        take: 10,
        orderBy: [
          { rating: 'desc' },
          { _count: { reviews: 'desc' } }
        ],
        include: {
          _count: {
            select: {
              reviews: true,
              savedBy: true
            }
          }
        }
      });

      res.json(trending);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getRecommendations(req, res) {
    try {
      // Algoritmo simples de recomendação - será substituído pelo microserviço Python
      const recommendations = await prisma.media.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: {
              reviews: true
            }
          }
        }
      });

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = mediaController;