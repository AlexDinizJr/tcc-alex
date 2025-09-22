const recommendationService = require('../services/recommendationService');

const generateRecommendationExplanation = async (userId, recommendations) => {
  // Implementação futura
  return {
    basedOn: 'seus gostos anteriores e comportamento similar de outros usuários',
    factors: ['gêneros preferidos', 'avaliações similares', 'tendências da comunidade'],
    confidence: 'high'
  };
};

const recommendationController = {
  
  // Recomendações personalizadas para o usuário
  async getUserRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { 
        limit = 10, 
        type, 
        genre, 
        minRating, 
        startYear, 
        endYear,
        algorithm = 'hybrid' 
      } = req.query;

      const yearRange = startYear && endYear ? { 
        start: parseInt(startYear), 
        end: parseInt(endYear) 
      } : undefined;

      const options = {
        limit: Math.min(parseInt(limit), 50), // Limite máximo de 50
        type,
        genre,
        minRating: minRating ? parseFloat(minRating) : undefined,
        yearRange,
        algorithm
      }

      let recommendations;
      
      switch (algorithm) {
        case 'collaborative':
          recommendations = await recommendationService.getOptimizedRecommendations(userId, options.limit);
          break;
        case 'content-based':
          recommendations = await recommendationService.getUserRecommendations(userId, options);
          break;
        case 'engagement':
          recommendations = await recommendationService.getEngagementRecommendations(userId, options.limit);
          break;
        case 'trending':
          recommendations = await recommendationService.getTrendingMedia(options);
          break;
        case 'hybrid':
        default:
          recommendations = await recommendationService.getOptimizedRecommendations(userId, options.limit);
      }

      res.json({
        success: true,
        data: {
          recommendations,
          count: recommendations.length,
          filters: { type, genre, minRating, yearRange, algorithm },
          userBased: !!userId,
          algorithmUsed: algorithm
        }
      });

    } catch (error) {
      console.error('Erro nas recomendações do usuário:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao gerar recomendações',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Conteúdo em alta (trending)
  async getTrending(req, res) {
    try {
      const { 
        limit = 10, 
        type, 
        genre,
        timeRange = 'week' // week, month, all-time
      } = req.query;

      const options = {
        limit: Math.min(parseInt(limit), 50),
        type,
        genre,
        timeRange
      };

      const trending = await recommendationService.getTrendingMedia(options);

      res.json({
        success: true,
        data: {
          trending,
          count: trending.length,
          filters: { type, genre, timeRange },
          period: timeRange
        }
      });

    } catch (error) {
      console.error('Erro no conteúdo em alta:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar conteúdo em alta'
      });
    }
  },

  // Mídias similares
  async getSimilarMedia(req, res) {
    try {
      const mediaId = parseInt(req.params.id);
      const { 
        limit = 6, 
        excludeOriginal = true,
        includeMetrics = false 
      } = req.query;

      if (isNaN(mediaId)) {
        return res.status(400).json({ 
          success: false,
          error: 'ID de mídia inválido' 
        });
      }

      const similarMedia = await recommendationService.getSimilarMedia(mediaId, {
        limit: Math.min(parseInt(limit), 20),
        excludeOriginal: excludeOriginal !== 'false'
      });

      let metrics = null;
      if (includeMetrics === 'true') {
        metrics = await recommendationService.getSimilarityMetrics(mediaId, similarMedia);
      }

      res.json({
        success: true,
        data: {
          originalMediaId: mediaId,
          similarMedia,
          count: similarMedia.length,
          metrics
        }
      });

    } catch (error) {
      console.error('Erro ao buscar mídias similares:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar mídias similares' 
      });
    }
  },

  // Recomendações baseadas em engajamento
  async getEngagementRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { 
        limit = 8,
        engagementType = 'all' // all, saved, favorited, viewed
      } = req.query;

      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Autenticação necessária para recomendações baseadas em engajamento' 
        });
      }

      const recommendations = await recommendationService.getEngagementRecommendations(
        userId, 
        Math.min(parseInt(limit), 30)
      );

      res.json({
        success: true,
        data: {
          recommendations,
          count: recommendations.length,
          basedOn: 'user-engagement',
          engagementType,
          userContext: 'authenticated'
        }
      });

    } catch (error) {
      console.error('Erro nas recomendações de engajamento:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao gerar recomendações de engajamento' 
      });
    }
  },

  // Recomendações otimizadas (híbridas)
  async getOptimizedRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { 
        limit = 10,
        includeExplanation = false 
      } = req.query;

      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuário não autenticado' 
        });
      }

      const recommendations = await recommendationService.getOptimizedRecommendations(
        userId, 
        Math.min(parseInt(limit), 25)
      );

      let explanation = null;
      if (includeExplanation === 'true') {
        explanation = await generateRecommendationExplanation(userId, recommendations); // ← CORRIGIDO
      }

      res.json({
        success: true,
        data: {
          recommendations,
          count: recommendations.length,
          algorithm: 'hybrid-optimized',
          explanation,
          features: ['collaborative-filtering', 'content-based', 'engagement-analysis']
        }
      });

    } catch (error) {
      console.error('Erro nas recomendações otimizadas:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao gerar recomendações otimizadas' 
      });
    }
  },

  // Track de engajamento (quando usuário interage com recomendação)
  async trackEngagement(req, res) {
    try {
      const userId = req.user?.id;
      const { mediaId, action, metadata = {}, source = 'unknown' } = req.body;

      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuário não autenticado' 
        });
      }

      if (!mediaId || !action) {
        return res.status(400).json({ 
          success: false,
          error: 'mediaId e action são obrigatórios' 
        });
      }

      // Validar ações permitidas
      const validActions = ['view', 'save', 'favorite', 'share', 'click', 'watch'];
      if (!validActions.includes(action)) {
        return res.status(400).json({ 
          success: false,
          error: `Ação inválida. Ações permitidas: ${validActions.join(', ')}` 
        });
      }

      await recommendationService.trackEngagement(
        userId, 
        parseInt(mediaId), 
        action, 
        { ...metadata, source }
      );

      res.json({ 
        success: true, 
        message: 'Engajamento registrado com sucesso',
        data: { 
          userId, 
          mediaId, 
          action, 
          source,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Erro ao registrar engajamento:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao registrar engajamento' 
      });
    }
  },

  // Excluir mídia das recomendações
  async excludeFromRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { mediaId } = req.params;
      const { 
        months = 3, 
        reason = 'not-interested' 
      } = req.body;

      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuário não autenticado' 
        });
      }

      if (!mediaId) {
        return res.status(400).json({ 
          success: false,
          error: 'mediaId é obrigatório' 
        });
      }

      await recommendationService.excludeMedia(
        userId, 
        parseInt(mediaId), 
        parseInt(months)
      );

      const excludedUntil = new Date();
      excludedUntil.setMonth(excludedUntil.getMonth() + parseInt(months));

      res.json({ 
        success: true, 
        message: 'Mídia excluída das recomendações com sucesso',
        data: { 
          mediaId, 
          excludedUntil: excludedUntil.toISOString(),
          reason,
          durationMonths: parseInt(months)
        }
      });

    } catch (error) {
      console.error('Erro ao excluir mídia:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao excluir mídia das recomendações' 
      });
    }
  },

  // Métricas de recomendação (admin/dashboard)
  async getRecommendationMetrics(req, res) {
    try {
      const { 
        timeRange = 30,
        userId = null,
        detailed = false 
      } = req.query;

      const metrics = await recommendationService.getMetrics(parseInt(timeRange));

      const response = {
        success: true,
        data: {
          overview: {
            timeRange: `${timeRange} dias`,
            totalRecommendations: metrics.total_recommendations,
            engagementRate: metrics.engagement_rate,
            averageScore: metrics.avg_engagement_score
          },
          performance: metrics
        }
      };

      if (detailed === 'true') {
        response.data.detailedMetrics = {
          topGenres: metrics.top_performing_genres,
          actionBreakdown: metrics.action_breakdown
        };
      }

      res.json(response);

    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao buscar métricas de recomendação' 
      });
    }
  },

  // Recomendações para página inicial (combina várias fontes)
  async getHomepageRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { 
        sections = 'all',
        limitPerSection = 6 
      } = req.query;

      const requestedSections = sections.split(',');

      const sectionPromises = [];

      if (requestedSections.includes('all') || requestedSections.includes('trending')) {
        sectionPromises.push(
          recommendationService.getTrendingMedia({ 
            limit: parseInt(limitPerSection) 
          }).then(media => ({
            title: 'Em Alta',
            type: 'trending',
            media,
            count: media.length
          }))
        );
      }

      if (userId && (requestedSections.includes('all') || requestedSections.includes('personalized'))) {
        sectionPromises.push(
          recommendationService.getUserRecommendations(userId, { 
            limit: parseInt(limitPerSection) 
          }).then(media => ({
            title: 'Para Você',
            type: 'personalized',
            media,
            count: media.length
          }))
        );
      }

      if (userId && (requestedSections.includes('all') || requestedSections.includes('engagement'))) {
        sectionPromises.push(
          recommendationService.getEngagementRecommendations(userId, parseInt(limitPerSection))
            .then(media => ({
              title: 'Baseado no Seu Engajamento',
              type: 'engagement',
              media,
              count: media.length
            }))
        );
      }

      if (requestedSections.includes('all') || requestedSections.includes('new')) {
        sectionPromises.push(Promise.resolve({
          title: 'Novidades',
          type: 'new',
          media: [],
          count: 0,
          message: 'Em breve - conteúdo recentemente adicionado'
        }));
      }

      const sectionsData = await Promise.all(sectionPromises);

      res.json({
        success: true,
        data: {
          sections: sectionsData,
          userContext: userId ? 'authenticated' : 'anonymous',
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Erro nas recomendações da homepage:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao carregar recomendações' 
      });
    }
  },

  // Gerar explicação para recomendações (opcional)
  async generateRecommendationExplanation(userId, recommendations) {
    // Implementação futura para explicar o "porquê" das recomendações
    return {
      basedOn: 'seus gostos anteriores e comportamento similar de outros usuários',
      factors: ['gêneros preferidos', 'avaliações similares', 'tendências da comunidade']
    };
  }
}

module.exports = recommendationController;