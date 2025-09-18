const prisma = require('../utils/database');

// Função auxiliar para atualizar média e contagem de avaliações de uma mídia
async function updateMediaRating(mediaId) {
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
    console.error('Erro ao atualizar média da mídia:', error);
  }
}

// Opções de ordenação para reviews
const REVIEW_SORT_OPTIONS = {
  recent: { date: 'desc' },
  helpful: { helpful: 'desc' },
  rating: { rating: 'desc' }
};

const reviewController = {
  // Obter avaliações de uma mídia
  async getMediaReviews(req, res) {
    try {
      const mediaId = parseInt(req.params.mediaId);
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const sortBy = req.query.sortBy || 'recent';
      const skip = (page - 1) * limit;

      const [reviews, total, stats] = await Promise.all([
        prisma.review.findMany({
          where: { mediaId },
          skip,
          take: limit,
          orderBy: REVIEW_SORT_OPTIONS[sortBy] || REVIEW_SORT_OPTIONS.recent,
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true } }
          }
        }),
        prisma.review.count({ where: { mediaId } }),
        prisma.review.aggregate({
          where: { mediaId },
          _avg: { rating: true },
          _count: { rating: true }
        })
      ]);

      res.json({
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          averageRating: stats._avg.rating || 0,
          totalReviews: stats._count.rating || 0
        }
      });
    } catch (error) {
      console.error('Erro ao obter avaliações da mídia:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Obter avaliações de um usuário
  async getUserReviews(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { date: 'desc' },
          include: { media: { select: { id: true, title: true, type: true, image: true, year: true } } }
        }),
        prisma.review.count({ where: { userId } })
      ]);

      res.json({
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao obter avaliações do usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Criar avaliação
  async createReview(req, res) {
    try {
      const userId = req.user.id;
      const mediaId = parseInt(req.body.mediaId);
      const rating = parseInt(req.body.rating);
      const comment = req.body.comment?.trim() || '';

      // Verifica se já existe
      const existingReview = await prisma.review.findUnique({
        where: { userId_mediaId: { userId, mediaId } }
      });
      if (existingReview) return res.status(400).json({ error: 'Você já avaliou esta mídia' });

      // Verifica se a mídia existe
      const media = await prisma.media.findUnique({ where: { id: mediaId } });
      if (!media) return res.status(404).json({ error: 'Mídia não encontrada' });

      const review = await prisma.review.create({
        data: { userId, mediaId, rating, comment, date: new Date()},
        include: { user: { select: { id: true, name: true, username: true, avatar: true } }, media: { select: { id: true, title: true, type: true } } }
      });

      await updateMediaRating(mediaId);

      res.status(201).json({ message: 'Avaliação criada com sucesso', review });
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar avaliação
  async updateReview(req, res) {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.id;
      const { rating, comment } = req.body;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) return res.status(404).json({ error: 'Avaliação não encontrada' });
      if (review.userId !== userId) return res.status(403).json({ error: 'Você não pode editar esta avaliação' });

      // Prepara os campos que serão atualizados
      const updateData = {};
      if (rating !== undefined) updateData.rating = parseInt(rating);
      if (comment !== undefined) updateData.comment = comment.trim();
      updateData.date = new Date();

      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true } }
        }
      });

      await updateMediaRating(review.mediaId);

      res.json({ message: 'Avaliação atualizada com sucesso', review: updatedReview });
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Excluir avaliação
  async deleteReview(req, res) {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.id;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) return res.status(404).json({ error: 'Avaliação não encontrada' });
      if (review.userId !== userId) return res.status(403).json({ error: 'Você não pode excluir esta avaliação' });

      await prisma.review.delete({ where: { id: reviewId } });
      await updateMediaRating(review.mediaId);

      res.json({ message: 'Avaliação excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Marcar avaliação como útil
  async markHelpful(req, res) {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.id;

      // Busca a review
      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) return res.status(404).json({ error: 'Avaliação não encontrada' });
      if (review.userId === userId) return res.status(403).json({ error: 'Você não pode marcar sua própria avaliação como útil' });

      // Verifica se já existe registro no Helpful
      const existing = await prisma.helpful.findUnique({
        where: { userId_reviewId: { userId, reviewId } }
      });

      let updatedReview;

      if (existing) {
        // Se já marcou, desmarca
        const [reviewUpdate, helpfulDelete] = await prisma.$transaction([
          prisma.review.update({
            where: { id: reviewId },
            data: { helpful: { decrement: 1 } },
            include: { user: { select: { id: true, name: true, username: true, avatar: true } } }
          }),
          prisma.helpful.delete({ where: { userId_reviewId: { userId, reviewId } } })
        ]);
        updatedReview = reviewUpdate;
      } else {
        // Se ainda não marcou, marca
        const [reviewUpdate, helpfulCreate] = await prisma.$transaction([
          prisma.review.update({
            where: { id: reviewId },
            data: { helpful: { increment: 1 } },
            include: { user: { select: { id: true, name: true, username: true, avatar: true } } }
          }),
          prisma.helpful.create({ data: { userId, reviewId } })
        ]);
        updatedReview = reviewUpdate;
      }

      res.json({
        message: existing ? 'Avaliação desmarcada como útil' : 'Avaliação marcada como útil',
        review: updatedReview
      });

    } catch (error) {
      console.error('Erro ao marcar/desmarcar avaliação como útil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
};

module.exports = reviewController;
