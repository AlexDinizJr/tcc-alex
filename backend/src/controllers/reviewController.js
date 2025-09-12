const prisma = require('../utils/database');

const reviewController = {
  async getMediaReviews(req, res) {
    try {
      const { mediaId } = req.params;
      const { page = 1, limit = 10, sortBy = 'recent' } = req.query;
      
      const skip = (page - 1) * limit;
      
      const sortOptions = {
        recent: { date: 'desc' },
        helpful: { helpful: 'desc' },
        rating: { rating: 'desc' }
      };

      const [reviews, total, averageRating] = await Promise.all([
        prisma.review.findMany({
          where: { mediaId: parseInt(mediaId) },
          skip,
          take: parseInt(limit),
          orderBy: sortOptions[sortBy] || { date: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          }
        }),
        prisma.review.count({
          where: { mediaId: parseInt(mediaId) }
        }),
        prisma.review.aggregate({
          where: { mediaId: parseInt(mediaId) },
          _avg: { rating: true },
          _count: { rating: true }
        })
      ]);

      res.json({
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          averageRating: averageRating._avg.rating || 0,
          totalReviews: averageRating._count.rating || 0
        }
      });
    } catch (error) {
      console.error('Error getting media reviews:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getUserReviews(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { userId: parseInt(userId) },
          skip,
          take: parseInt(limit),
          orderBy: { date: 'desc' },
          include: {
            media: {
              select: {
                id: true,
                title: true,
                type: true,
                image: true,
                year: true
              }
            }
          }
        }),
        prisma.review.count({
          where: { userId: parseInt(userId) }
        })
      ]);

      res.json({
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting user reviews:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async createReview(req, res) {
    try {
      const { mediaId, rating, comment } = req.body;
      const userId = req.user.id;

      // Verificar se o usuário já avaliou esta mídia
      const existingReview = await prisma.review.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId: parseInt(mediaId)
          }
        }
      });

      if (existingReview) {
        return res.status(400).json({ error: 'Você já avaliou esta mídia' });
      }

      // Verificar se a mídia existe
      const media = await prisma.media.findUnique({
        where: { id: parseInt(mediaId) }
      });

      if (!media) {
        return res.status(404).json({ error: 'Mídia não encontrada' });
      }

      const review = await prisma.review.create({
        data: {
          rating: parseInt(rating),
          comment: comment?.trim() || '',
          mediaId: parseInt(mediaId),
          userId,
          date: new Date(),
          helpful: 0
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          media: {
            select: {
              id: true,
              title: true,
              type: true
            }
          }
        }
      });

      // Atualizar a média de avaliações da mídia
      await this.updateMediaRating(parseInt(mediaId));

      res.status(201).json({
        message: 'Avaliação criada com sucesso',
        review
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async updateReview(req, res) {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      const review = await prisma.review.findUnique({
        where: { id: parseInt(reviewId) },
        include: {
          media: true
        }
      });

      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ error: 'Você não pode editar esta avaliação' });
      }

      const updatedReview = await prisma.review.update({
        where: { id: parseInt(reviewId) },
        data: {
          rating: parseInt(rating),
          comment: comment?.trim() || '',
          date: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          }
        }
      });

      // Atualizar a média de avaliações da mídia
      await this.updateMediaRating(review.mediaId);

      res.json({
        message: 'Avaliação atualizada com sucesso',
        review: updatedReview
      });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      const review = await prisma.review.findUnique({
        where: { id: parseInt(reviewId) },
        include: {
          media: true
        }
      });

      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ error: 'Você não pode excluir esta avaliação' });
      }

      await prisma.review.delete({
        where: { id: parseInt(reviewId) }
      });

      // Atualizar a média de avaliações da mídia
      await this.updateMediaRating(review.mediaId);

      res.json({ message: 'Avaliação excluída com sucesso' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async markHelpful(req, res) {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      // Verificar se o usuário já marcou esta avaliação como útil
      const existingHelpful = await prisma.helpful.findUnique({
        where: {
          userId_reviewId: {
            userId,
            reviewId: parseInt(reviewId)
          }
        }
      });

      if (existingHelpful) {
        return res.status(400).json({ error: 'Você já marcou esta avaliação como útil' });
      }

      const [updatedReview] = await Promise.all([
        prisma.review.update({
          where: { id: parseInt(reviewId) },
          data: {
            helpful: {
              increment: 1
            }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          }
        }),
        prisma.helpful.create({
          data: {
            userId,
            reviewId: parseInt(reviewId)
          }
        })
      ]);

      res.json({
        message: 'Avaliação marcada como útil',
        review: updatedReview
      });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async updateMediaRating(mediaId) {
    try {
      const stats = await prisma.review.aggregate({
        where: { mediaId },
        _avg: { rating: true },
        _count: { rating: true }
      });

      await prisma.media.update({
        where: { id: mediaId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.rating || 0
        }
      });
    } catch (error) {
      console.error('Error updating media rating:', error);
    }
  }
};

module.exports = reviewController;