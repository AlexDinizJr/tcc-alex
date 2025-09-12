const prisma = require('../utils/database');
const streamingService = require('../services/streamingService');

const mediaController = {
  async getAllMedia(req, res) {
    try {
      const { type, search, page = 1, limit = 20, sortBy = 'title', genre } = req.query;
      const skip = (page - 1) * limit;

      const where = {
        type: type || undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
        genres: genre ? { has: genre } : undefined
      };

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: this.getSortOption(sortBy),
          select: {
            id: true,
            title: true,
            type: true,
            rating: true,
            image: true,
            year: true,
            genres: true,
            description: true,
            platforms: true,
            _count: {
              select: { reviews: true, savedBy: true, favoritedBy: true }
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

  async searchMedia(req, res) {
    try {
      const { q, type, genre, year, minRating, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const where = {
        type: type || undefined,
        genres: genre ? { has: genre } : undefined,
        year: year ? parseInt(year) : undefined,
        rating: minRating ? { gte: parseFloat(minRating) } : undefined,
        OR: q ? [
          { title: { contains: q, mode: 'insensitive' } },
          { directors: { hasSome: [q] } },
          { artists: { hasSome: [q] } },
          { authors: { hasSome: [q] } }
        ] : undefined
      };

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { title: 'asc' },
          select: {
            id: true,
            title: true,
            type: true,
            rating: true,
            image: true,
            year: true,
            genres: true,
            description: true,
            platforms: true,
            _count: { select: { reviews: true } }
          }
        }),
        prisma.media.count({ where })
      ]);

      res.json({
        results: media,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        filters: { query: q, type, genre, year, minRating }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaById(req, res) {
    try {
      const media = await prisma.media.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
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
            orderBy: { date: 'desc' },
            take: 10
          },
          _count: {
            select: {
              reviews: true,
              savedBy: true,
              favoritedBy: true,
              lists: true
            }
          }
        }
      });

      if (!media) return res.status(404).json({ error: 'Mídia não encontrada' });

      // Formatar streaming links só para referência
      const formattedStreamingLinks = media.streamingLinks.map(link => ({
        service: link.service,
        url: link.url,
        icon: streamingService.getServiceIcon(link.service),
        name: streamingService.availableServices[link.service] || link.service
      }));

      const ratingDistribution = await this.getRatingDistribution(media.id);

      res.json({
        ...media,
        streamingLinks: formattedStreamingLinks,
        ratingDistribution
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaByType(req, res) {
    try {
      const { type } = req.params;
      const { page = 1, limit = 20, sortBy = 'title' } = req.query;
      const skip = (page - 1) * limit;

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where: { type },
          skip,
          take: parseInt(limit),
          orderBy: this.getSortOption(sortBy),
          select: {
            id: true,
            title: true,
            rating: true,
            image: true,
            genres: true,
            description: true,
            _count: { select: { reviews: true } }
          }
        }),
        prisma.media.count({ where: { type } })
      ]);

      res.json({
        media,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        type
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaByGenre(req, res) {
    try {
      const { genre } = req.params;
      const { type, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const where = {
        genres: { has: genre },
        type: type || undefined
      };

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { rating: 'desc' },
          select: {
            id: true,
            title: true,
            rating: true,
            image: true,
            genres: true,
            description: true,
            _count: { select: { reviews: true } }
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
        },
        genre,
        type
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaGenres(req, res) {
    try {
      const { type } = req.query;
      const where = type ? { type } : {};

      const media = await prisma.media.findMany({
        where,
        select: { genres: true }
      });

      const genreCount = {};
      media.forEach(item => item.genres.forEach(g => genreCount[g] = (genreCount[g] || 0) + 1));

      const genres = Object.entries(genreCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      res.json({ genres, total: genres.length, byType: type || 'all' });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaStreamingLinks(req, res) {
    try {
      const { id } = req.params;
      const streamingLinks = await streamingService.getMediaStreamingLinks(parseInt(id));
      res.json({ mediaId: parseInt(id), streamingLinks, count: streamingLinks.length });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getAvailableStreamingServices(req, res) {
    try {
      const services = streamingService.getAvailableServices();
      res.json({ services, count: services.length });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaByStreamingService(req, res) {
    try {
      const { service } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where: { streamingLinks: { some: { service } } },
          skip,
          take: parseInt(limit),
          orderBy: { rating: 'desc' },
          select: {
            id: true,
            title: true,
            rating: true,
            image: true,
            genres: true,
            description: true,
            _count: { select: { reviews: true } }
          }
        }),
        prisma.media.count({ where: { streamingLinks: { some: { service } } } })
      ]);

      res.json({
        media,
        service,
        serviceName: streamingService.availableServices[service] || service,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getTrending(req, res) {
    try {
      const { type, limit = 10 } = req.query;
      const where = type ? { type } : {};

      const trending = await prisma.media.findMany({
        where,
        take: parseInt(limit),
        orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
        select: {
          id: true,
          title: true,
          rating: true,
          image: true,
          genres: true,
          description: true,
          _count: { select: { reviews: true, savedBy: true } }
        }
      });

      res.json({ trending, type: type || 'all', limit: parseInt(limit) });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getRecommendations(req, res) {
    try {
      const { excludeId, limit = 5, type } = req.query;
      const where = { id: excludeId ? { not: parseInt(excludeId) } : undefined, type: type || undefined };

      const recommendations = await prisma.media.findMany({
        where,
        take: parseInt(limit),
        orderBy: { rating: 'desc' },
        select: {
          id: true,
          title: true,
          rating: true,
          image: true,
          genres: true,
          description: true,
          _count: { select: { reviews: true } }
        }
      });

      res.json({
        recommendations,
        count: recommendations.length,
        filters: { excludeId: excludeId ? parseInt(excludeId) : null, type: type || 'all' }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getRatingDistribution(mediaId) {
    try {
      const distribution = await prisma.review.groupBy({
        by: ['rating'],
        where: { mediaId },
        _count: { rating: true },
        orderBy: { rating: 'asc' }
      });

      return distribution.reduce((acc, item) => {
        acc[item.rating] = item._count.rating;
        return acc;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    } catch {
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
  },

  getSortOption(sortBy) {
    const sortOptions = {
      title: { title: 'asc' },
      rating: { rating: 'desc' },
      year: { year: 'desc' },
      newest: { createdAt: 'desc' },
      popular: { reviewCount: 'desc' }
    };
    return sortOptions[sortBy] || { title: 'asc' };
  }
};

module.exports = mediaController;
