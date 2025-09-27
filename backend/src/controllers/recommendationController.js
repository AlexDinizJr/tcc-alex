const recommendationService = require('../services/recommendationService');

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
        limit: Math.min(parseInt(limit), 50),
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

  // Recomendações customizadas com filtros e referência de mídia
  async getCustomRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const {
        limit = 10,
        type,
        genre,
        minRating,
        startYear,
        endYear,
        referenceMediaIds
      } = req.query;

      const yearRange = startYear && endYear ? {
        start: parseInt(startYear),
        end: parseInt(endYear)
      } : undefined;

      const filters = {
        type,
        genre,
        minRating: minRating ? parseFloat(minRating) : undefined,
        yearRange
      };

      // Parseia os IDs de mídia de referência para array de inteiros
      const referenceIds = referenceMediaIds
        ? referenceMediaIds.split(',').map(id => parseInt(id)).filter(Boolean)
        : [];

      const customRecommendations = await recommendationService.getCustomRecommendations(
        userId,
        filters,
        referenceIds,
        Math.min(parseInt(limit), 50)
      );

      res.json({
        success: true,
        data: {
          recommendations: customRecommendations,
          count: customRecommendations.length,
          filters,
          referenceMediaIds: referenceIds,
          userBased: !!userId
        }
      });

    } catch (error) {
      console.error('Erro nas recomendações customizadas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao gerar recomendações customizadas'
      });
    }
  },

  async getInitialPreferences(req, res) {
    try {
      const userId = req.user.id; 
      const { selectedMediaIds = [] } = req.body;

      // Chama o service para gerar preferências iniciais
      const preferences = await recommendationService.getInitialPreferences(userId, selectedMediaIds);

      res.status(200).json(preferences);
    } catch (error) {
      console.error("Erro ao buscar preferências iniciais:", error);
      res.status(500).json({ error: "Erro ao buscar preferências iniciais" });
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
  
}

module.exports = recommendationController;