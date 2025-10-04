const prisma = require('../utils/database');
const streamingService = require('../services/streamingService');

// Funções auxiliares
const getSortOption = (sortBy) => {
  const sortOptions = {
    title: { title: 'asc' },
    rating: [{ rating: 'desc' }, { title: 'asc' }],
    year: [{ year: 'desc' }, { title: 'asc' }],
    newest: [{ createdAt: 'desc' }, { title: 'asc' }],
    popular: [{ reviewCount: 'desc' }, { title: 'asc' }]
  };
  return sortOptions[sortBy] || { title: 'asc' };
};

// Controller
const mediaController = {
  async getAllMedia(req, res) {
    try {
      const {
        type,
        search,
        page = 1,
        limit = 20,
        sortBy = 'title',
        year,
        classification,
        genres,      // espera array ou string
        platforms    // espera array ou string
      } = req.query;

      const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
      const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 20;
      const skip = (pageNumber - 1) * limitNumber;

      // Constrói o filtro
      const where = {};
      if (type) where.type = type;
      if (search) where.title = { contains: search, mode: 'insensitive' };
      if (year) where.year = parseInt(year);
      if (classification) where.classification = classification;

      // Gêneros e plataformas podem ser arrays
      if (genres) {
        if (Array.isArray(genres)) {
          where.genres = { hasSome: genres };
        } else {
          where.genres = { has: genres };
        }
      }

      if (platforms) {
        if (Array.isArray(platforms)) {
          where.platforms = { hasSome: platforms };
        } else {
          where.platforms = { has: platforms };
        }
      }

      const currentUserId = req.user?.id || null;

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: limitNumber,
          orderBy: getSortOption(sortBy),
          include: {
            savedBy: currentUserId
              ? { where: { id: currentUserId }, select: { id: true } }
              : false,
            favoritedBy: currentUserId
              ? { where: { id: currentUserId }, select: { id: true } }
              : false,
            _count: { select: { reviews: true } }
          }
        }),
        prisma.media.count({ where })
      ]);

      // Flags para o usuário
      const mediaWithFlags = media.map(item => ({
        ...item,
        isSavedByUser: currentUserId ? item.savedBy?.length > 0 : false,
        isFavoritedByUser: currentUserId ? item.favoritedBy?.length > 0 : false
      }));

      res.json({
        media: mediaWithFlags,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber)
        }
      });

    } catch (error) {
      console.error('Erro no getAllMedia:', error);
      res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  },

  async searchMedia(req, res) {
    try {
      let { q, type, genre, year, minRating, page = 1, limit = 5000 } = req.query;
      const skip = (page - 1) * limit;
      const currentUserId = req.user?.id || null;

      q = q ? q.trim().toLowerCase().replace(/[\s\-:]+/g, ' ') : "";

      let whereType = type ? `AND m.type = '${type}'` : '';
      let whereGenre = genre ? `AND '${genre}' = ANY(m.genres)` : '';
      let whereYear = year ? `AND m.year = ${parseInt(year)}` : '';
      let whereRating = minRating ? `AND m.rating >= ${parseFloat(minRating)}` : '';

      let media = [];
      let total = 0;

      if (q) {
        // SQL cru com busca profunda e fuzzy
        const sql = `
          SELECT m.*,
            CASE 
              WHEN LOWER(m.title) = LOWER($1) THEN 3
              WHEN m.title ILIKE $2 THEN 2
              WHEN m.title % $3 THEN 1
              ELSE 0
            END AS relevance
          FROM "Media" m
          WHERE (
              m.title ILIKE '%' || $1 || '%'
              OR m.title % $1
              OR EXISTS (
                SELECT 1 FROM unnest(m.directors) AS d(director)
                WHERE d.director ILIKE '%' || $1 || '%'
              )
              OR EXISTS (
                SELECT 1 FROM unnest(m.artists) AS a(artist)
                WHERE a.artist ILIKE '%' || $1 || '%'
              )
              OR EXISTS (
                SELECT 1 FROM unnest(m.authors) AS au(author)
                WHERE au.author ILIKE '%' || $1 || '%'
              )
              OR m.publisher ILIKE '%' || $1 || '%'
              OR m.developer ILIKE '%' || $1 || '%'
          )
          ${whereType} ${whereGenre} ${whereYear} ${whereRating}
          ORDER BY relevance DESC, similarity(m.title, $1) DESC, m.title ASC
          LIMIT $4 OFFSET $5
        `;

        media = await prisma.$queryRawUnsafe(sql, q, `${q}%`, q, limit, skip);

        const countSql = `
          SELECT COUNT(*)::int as total
          FROM "Media" m
          WHERE (
              m.title ILIKE '%' || $1 || '%'
              OR m.title % $1
              OR EXISTS (
                SELECT 1 FROM unnest(m.directors) AS d(director)
                WHERE d.director ILIKE '%' || $1 || '%'
              )
              OR EXISTS (
                SELECT 1 FROM unnest(m.artists) AS a(artist)
                WHERE a.artist ILIKE '%' || $1 || '%'
              )
              OR EXISTS (
                SELECT 1 FROM unnest(m.authors) AS au(author)
                WHERE au.author ILIKE '%' || $1 || '%'
              )
              OR m.publisher ILIKE '%' || $1 || '%'
              OR m.developer ILIKE '%' || $1 || '%'
          )
          ${whereType} ${whereGenre} ${whereYear} ${whereRating}
        `;
        const count = await prisma.$queryRawUnsafe(countSql, q);
        total = count[0]?.total || 0;
      } else {
        // fallback: lista normal
        [media, total] = await Promise.all([
          prisma.media.findMany({
            skip,
            take: parseInt(limit),
            orderBy: { title: "asc" },
            include: {
              savedBy: currentUserId
                ? { where: { id: currentUserId }, select: { id: true } }
                : false,
              favoritedBy: currentUserId
                ? { where: { id: currentUserId }, select: { id: true } }
                : false,
              _count: { select: { reviews: true } }
            }
          }),
          prisma.media.count()
        ]);
      }

      // flags de usuário
      const mediaWithFlags = media.map(item => ({
        ...item,
        isSavedByUser: currentUserId ? item.savedBy?.length > 0 : false,
        isFavoritedByUser: currentUserId ? item.favoritedBy?.length > 0 : false
      }));

      res.json({
        results: mediaWithFlags,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        filters: { query: q, type, genre, year, minRating }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  },
  
  async getMediaById(req, res) {
    try {
      const mediaId = parseInt(req.params.id);
      if (isNaN(mediaId)) {
        return res.status(400).json({ error: "ID de mídia inválido" });
      }

      const currentUserId = req.user?.id || null;

      const media = await prisma.media.findUnique({
        where: { id: mediaId },
        include: {
          reviews: true,
          savedBy: currentUserId
            ? { where: { id: currentUserId }, select: { id: true } }
            : false,
          favoritedBy: currentUserId
            ? { where: { id: currentUserId }, select: { id: true } }
            : false,
          lists: true
        },
      });

      if (!media) {
        return res.status(404).json({ error: "Mídia não encontrada" });
      }

      const mediaWithFlags = {
        ...media,
        isSavedByUser: currentUserId ? media.savedBy?.length > 0 : false,
        isFavoritedByUser: currentUserId ? media.favoritedBy?.length > 0 : false
      };

      res.status(200).json(mediaWithFlags);
    } catch (error) {
      console.error("Erro ao buscar mídia por ID:", error);
      res.status(500).json({ error: "Erro interno ao buscar mídia" });
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
          orderBy: getSortOption(sortBy),
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

   async getAllClassifications(req, res) {
    try {
      const classifications = Object.values(prisma.ClassificationRating);
      res.json({ classifications });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaByClassification(req, res) {
    try {
      const { classification } = req.params;
      const media = await prisma.media.findMany({ where: { classification } });
      res.json({ media, classification });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mídias por classificação' });
    }
  },

  async getMediaByMinRating(req, res) {
    try {
      const ratingParam = req.query.rating || req.query.minRating || 3.0;
      const minRating = parseFloat(ratingParam);
      if (isNaN(minRating) || minRating < 0 || minRating > 5) {
        return res.status(400).json({ error: "rating inválido (0 a 5)" });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const where = { rating: { gte: minRating } };

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: limit,
          orderBy: { rating: 'desc' },
          select: { id: true, title: true, rating: true, image: true, genres: true, year: true, type: true }
        }),
        prisma.media.count({ where })
      ]);

      res.json({
        media,
        minRating,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaByYearRange(req, res) {
    try {
      const startYear = parseInt(req.query.startYear, 10);
      const endYear = parseInt(req.query.endYear, 10);

      if (isNaN(startYear) || isNaN(endYear)) {
        return res.status(400).json({ error: "startYear e endYear válidos são obrigatórios" });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const where = { year: { gte: startYear, lte: endYear } };

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: limit,
          orderBy: { rating: 'desc' },
          select: { id: true, title: true, rating: true, image: true, genres: true, year: true, type: true }
        }),
        prisma.media.count({ where })
      ]);

      res.json({
        media,
        yearRange: `${startYear}-${endYear}`,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
};

module.exports = mediaController;
