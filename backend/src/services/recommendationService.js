const recommendationEngine = require('../algorithms/recommendationEngine');

const recommendationService = {
  // Recomendações baseadas no usuário
  async getUserRecommendations(userId, options = {}) {
    const {
      limit = 5,
      type,
      genre,
      minRating,
      yearRange
    } = options;

    const filters = { type, genre, minRating, yearRange };
    
    if (!userId) {
      return recommendationEngine.getColdStartRecommendations(userId, limit);
    }

    // Verifica se é cold start ou usuário com histórico
    const prefs = await recommendationEngine.getUserPreferences(userId);
    const interactionCount = Object.keys(prefs).length;

    if (interactionCount < 3) {
      return recommendationEngine.getHybridRecommendations(userId, limit);
    }

    return recommendationEngine.getUserRecommendations(userId, limit);
  },

  // Recomendações personalizadas com filtros
  async getCustomRecommendations(userId, filters = {}, referenceMediaIds = [], limit = 5) {
    return recommendationEngine.getCustomRecommendations(userId, filters, referenceMediaIds, limit);
  },

  // Preferências iniciais do usuário (cold start)
  async getInitialPreferences(userId, selectedMediaIds = []) {
    return recommendationEngine.buildUserInitialPreferences(userId, selectedMediaIds);
  },

    // Excluir mídia das recomendações
  async excludeMedia(userId, mediaId, months = 3) {
    return recommendationEngine.excludeMediaForUser(userId, mediaId, months);
  },

  // Conteúdo em alta
  async getTrendingMedia(options = {}) {
    const { limit = 5, type, genre } = options;
    const filters = { type, genre };
    
    let trending = await recommendationEngine.getTrendingMedia(limit * 2);
    
    // Aplicar filtros adicionais se fornecidos
    if (filters.type || filters.genre) {
      trending = trending.filter(media => {
        const typeMatch = !filters.type || media.type === filters.type;
        const genreMatch = !filters.genre || media.genres.includes(filters.genre);
        return typeMatch && genreMatch;
      });
    }
    
    return trending.slice(0, limit);
  },

  // Mídias similares
  async getSimilarMedia(mediaId, options = {}) {
    const { limit = 4, excludeOriginal = true } = options;
    return recommendationEngine.getSimilarMedia(mediaId, limit);
  },

  // Track de engajamento
  async trackEngagement(userId, mediaId, action, metadata = {}) {
    return recommendationEngine.trackRecommendationEngagement(userId, mediaId, action, metadata);
  },

  // Métricas de recomendação
  async getMetrics(timeRange = 30) {
    return recommendationEngine.getRecommendationMetrics(timeRange);
  },

  // Métricas de similaridade
  async getSimilarityMetrics(mediaId, similarMedia) {
    return recommendationEngine.getSimilarityMetrics(mediaId, similarMedia);
  },

};

module.exports = recommendationService;