const recommendationService = require('../services/recommendationService');

const recommendationController = {
  
  // Recomendações personalizadas para o usuário
  async getUserRecommendations(req, res) {
    try {
      const userId = req.user?.id || parseInt(req.query.userId);
      
      const { 
        limit = 5, 
      } = req.query;

      if (!userId || isNaN(userId)) {
        return res.status(400).json({ 
          success: false,
          error: 'ID do usuário é obrigatório',
          details: 'Faça login ou forneça um userId válido'
        });
      }

      console.log(`🎯 [CONTROLLER] Gerando recomendações para usuário ${userId}`);

      const recommendations = await recommendationService.getUserRecommendations(userId);

      console.log(`✅ [CONTROLLER] ${recommendations.length} recomendações geradas para usuário ${userId}`);

      res.json({
        success: true,
        data: recommendations,
        count: recommendations.length,
        userBased: !!userId,
        userId: userId,
        limit
      });

    } catch (error) {
      console.error('❌ [CONTROLLER] Erro nas recomendações:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao gerar recomendações',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Recomendações customizadas com filtros
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

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const filters = {
        type,
        genre,
        minRating: minRating ? parseFloat(minRating) : undefined,
        yearRange: startYear && endYear ? {
          start: parseInt(startYear),
          end: parseInt(endYear)
        } : undefined
      };

      // Parseia os IDs de mídia de referência
      const referenceIds = referenceMediaIds
        ? referenceMediaIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
        : [];

      const recommendations = await recommendationService.getCustomRecommendations(
        userId,
        filters,
        referenceIds,
        Math.min(parseInt(limit), 50)
      );

      res.json({
        success: true,
        data: recommendations,
        count: recommendations.length,
        filters,
        referenceMediaIds: referenceIds,
        userBased: true
      });

    } catch (error) {
      console.error('❌ Erro nas recomendações customizadas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao gerar recomendações customizadas'
      });
    }
  },

  // Preferências iniciais (onboarding)
  async getInitialPreferences(req, res) {
    try {
      const userId = req.user.id; 
      const { selectedMediaIds = [] } = req.body;

      if (!selectedMediaIds.length) {
        return res.status(400).json({
          success: false,
          error: 'selectedMediaIds é obrigatório'
        });
      }

      const preferences = await recommendationService.getInitialPreferences(userId, selectedMediaIds);

      res.json({
        success: true,
        data: preferences
      });

    } catch (error) {
      console.error("❌ Erro ao buscar preferências iniciais:", error);
      res.status(500).json({ 
        success: false,
        error: "Erro ao buscar preferências iniciais" 
      });
    }
  },

  // Excluir mídia das recomendações
  async excludeFromRecommendations(req, res) {
    try {
      const userId = req.user?.id;
      const { mediaId } = req.params;
      const { months = 3 } = req.body;

      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuário não autenticado' 
        });
      }

      if (!mediaId || isNaN(parseInt(mediaId))) {
        return res.status(400).json({ 
          success: false,
          error: 'mediaId é obrigatório e deve ser um número válido' 
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
          mediaId: parseInt(mediaId),
          excludedUntil: excludedUntil.toISOString(),
          durationMonths: parseInt(months)
        }
      });

    } catch (error) {
      console.error('❌ Erro ao excluir mídia:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro ao excluir mídia das recomendações' 
      });
    }
  },

  // Conteúdo em alta (trending)
  async getTrending(req, res) {
    try {
      const { limit = 5 } = req.query;

      const trending = await recommendationService.getTrendingMedia({
        limit: Math.min(parseInt(limit), 50)
      });

      res.json({
        success: true,
        data: trending,
        count: trending.length
      });

    } catch (error) {
      console.error('❌ Erro no conteúdo em alta:', error);
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
        limit = 5, 
        excludeOriginal = true,
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

      res.json({
        success: true,
        data: {
          originalMediaId: mediaId,
          similarMedia,
          count: similarMedia.length,
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

// No recommendationController
  async getUserPreferences(req, res) {
    try {
      const userId = req.user?.id || parseInt(req.query.userId);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório',
          details: 'Faça login ou forneça um userId válido'
        });
      }

      console.log(`🎯 [CONTROLLER] Buscando preferências do usuário ${userId}`);

      // Chama o service que retorna as preferências (reviews, saved, favorites, eng.)
      const preferences = await recommendationService.getUserPreferences(userId);

      console.log(`✅ [CONTROLLER] Preferências carregadas para usuário ${userId}`);

      res.json({
        success: true,
        userId,
        data: preferences,
        count: Object.keys(preferences).length
      });

    } catch (error) {
      console.error('❌ [CONTROLLER] Erro ao buscar preferências do usuário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar preferências do usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

}

module.exports = recommendationController;