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
      const currentUserId = req.user?.id || null;

      const [reviews, total, stats] = await Promise.all([
        prisma.review.findMany({
          where: { mediaId },
          skip,
          take: limit,
          orderBy: REVIEW_SORT_OPTIONS[sortBy] || REVIEW_SORT_OPTIONS.recent,
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true } },
            helpfuls: true
          }
        }),
        prisma.review.count({ where: { mediaId } }),
        prisma.review.aggregate({
          where: { mediaId },
          _avg: { rating: true },
          _count: { rating: true }
        })
      ]);

      const reviewsWithUserFlag = reviews.map(r => ({
        id: r.id,
        mediaId: r.mediaId,
        userId: r.userId,
        userName: r.user.name,
        avatar: r.user.avatar,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        helpfulCount: r.helpfuls.length,
        userMarkedHelpful: currentUserId
          ? r.helpfuls.some(h => h.userId === currentUserId)
          : false
      }));

      res.json({
        reviews: reviewsWithUserFlag,
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
      const currentUserId = req.user?.id || null;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { date: 'desc' },
          include: {
            media: { select: { id: true, title: true, type: true, image: true, year: true } },
            helpfuls: currentUserId
              ? { where: { userId: currentUserId }, select: { id: true } }
              : false
          }
        }),
        prisma.review.count({ where: { userId } })
      ]);

      const reviewsWithUserFlag = reviews.map(r => ({
        ...r,
        userMarkedHelpful: r.helpfuls?.length > 0
      }));

      res.json({
        reviews: reviewsWithUserFlag,
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

  async createReview(req, res) {
    try {
      const userId = req.user.id;
      const mediaId = parseInt(req.body.mediaId);
      
      let rating;
      if (typeof req.body.rating === 'string') {
        rating = parseFloat(req.body.rating.replace(',', '.'));
      } else {
        rating = parseFloat(req.body.rating);
      }
      
      const comment = req.body.comment?.trim() || '';

      console.log('🔍 Dados recebidos no createReview:', {
        userId,
        mediaId,
        rating: req.body.rating,
        parsedRating: rating,
        typeOfRating: typeof req.body.rating
      });

      if (!mediaId || isNaN(rating) || rating < 0.5 || rating > 5) {
        return res.status(400).json({ 
          error: 'Rating inválido. Deve ser um número entre 0.5 e 5.0' 
        });
      }

      const existingReview = await prisma.review.findUnique({
        where: { userId_mediaId: { userId, mediaId } }
      });
      if (existingReview) {
        return res.status(400).json({ error: 'Você já avaliou esta mídia' });
      }

      // Verifica se a mídia existe
      const media = await prisma.media.findUnique({ where: { id: mediaId } });
      if (!media) return res.status(404).json({ error: 'Mídia não encontrada' });

      const review = await prisma.review.create({
        data: { 
          userId, 
          mediaId, 
          rating,
          comment, 
          date: new Date() 
        },
        include: { 
          user: { select: { id: true, name: true, username: true, avatar: true } } 
        }
      });

      await updateMediaRating(mediaId);

      console.log('✅ Review criada com sucesso:', review);

      res.status(201).json({ 
        message: 'Avaliação criada com sucesso', 
        review 
      });
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async updateReview(req, res) {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.id;
      const { rating, comment } = req.body;

      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) return res.status(404).json({ error: 'Avaliação não encontrada' });
      if (review.userId !== userId) return res.status(403).json({ error: 'Você não pode editar esta avaliação' });

      const updateData = { date: new Date() };
      
      if (rating !== undefined) {
        let parsedRating;
        if (typeof rating === 'string') {
          parsedRating = parseFloat(rating.replace(',', '.'));
        } else {
          parsedRating = parseFloat(rating);
        }
        
        if (isNaN(parsedRating) || parsedRating < 0.5 || parsedRating > 5) {
          return res.status(400).json({ 
            error: 'Rating inválido. Deve ser um número entre 0.5 e 5.0' 
          });
        }
        
        updateData.rating = parsedRating;
      }
      
      if (comment !== undefined) {
        updateData.comment = comment.trim();
      }

      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true } }
        }
      });

      await updateMediaRating(review.mediaId);

      res.json({ 
        message: 'Avaliação atualizada com sucesso', 
        review: updatedReview 
      });
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

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

  async markHelpful(req, res) {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.id;

      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: { helpfuls: true }
      });
      if (!review) return res.status(404).json({ error: 'Avaliação não encontrada' });
      if (review.userId === userId) return res.status(403).json({ error: 'Você não pode marcar sua própria avaliação como útil' });

      const existing = await prisma.helpful.findUnique({
        where: { userId_reviewId: { userId, reviewId } }
      });

      let updatedReview;

      if (existing) {
        const [reviewUpdate] = await prisma.$transaction([
          prisma.review.update({
            where: { id: reviewId },
            data: { helpful: { decrement: 1 } }
          }),
          prisma.helpful.delete({ where: { userId_reviewId: { userId, reviewId } } })
        ]);
        updatedReview = reviewUpdate;
      } else {
        const [reviewUpdate] = await prisma.$transaction([
          prisma.review.update({
            where: { id: reviewId },
            data: { helpful: { increment: 1 } }
          }),
          prisma.helpful.create({ data: { userId, reviewId } })
        ]);
        updatedReview = reviewUpdate;
      }

      const userMarkedHelpful = !existing;

      res.json({
        helpfulCount: updatedReview.helpful,
        userMarkedHelpful
      });
    } catch (error) {
      console.error('Erro ao marcar/desmarcar avaliação como útil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = reviewController;