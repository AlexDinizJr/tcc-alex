const recommendationEngine = require('../algorithms/recommendationEngine');

// --- Configuração do cache ---
const CACHE_TTL = 1000 * 60 * 5; // 5 minutos
const cachedUserRecs = new Map(); // userId -> { data, updatedAt }

const recommendationService = {

  // ------------------------------
  // Função privada: atualiza recomendações do usuário
  // ------------------------------
  async refreshUserRecommendations(userId, limit = 5) {
    const prefs = await recommendationEngine.getUserPreferences(userId);
    const interactionCount = Object.keys(prefs).length;

    let recommendations;
    if (interactionCount < 3) {
      recommendations = await recommendationEngine.getHybridRecommendations(userId, limit);
    } else {
      recommendations = await recommendationEngine.getUserRecommendations(userId, limit);
    }

    cachedUserRecs.set(userId, {
      data: recommendations,
      updatedAt: Date.now()
    });

    return recommendations;
  },

  // ------------------------------
  // Função pública: retorna cache ou atualiza se necessário
  // ------------------------------
  async getCachedUserRecommendations(userId, limit = 5) {
    const cacheEntry = cachedUserRecs.get(userId);
    const now = Date.now();

    if (cacheEntry && (now - cacheEntry.updatedAt < CACHE_TTL)) {
      return cacheEntry.data;
    }

    return this.refreshUserRecommendations(userId, limit);
  },

  // ------------------------------
  // Recomendações baseadas no usuário (usa cache automaticamente)
  // ------------------------------
  async getUserRecommendations(userId, options = {}) {
    const { limit = 5 } = options;

    if (!userId) {
      return recommendationEngine.getColdStartRecommendations(userId, limit);
    }

    return this.getCachedUserRecommendations(userId, limit);
  },

  // ------------------------------
  // Recomendações personalizadas com filtros
  // ------------------------------
  async getCustomRecommendations(userId, filters = {}, referenceMediaIds = [], limit = 5) {
    return recommendationEngine.getCustomRecommendations(userId, filters, referenceMediaIds, limit);
  },

  // ------------------------------
  // Preferências iniciais do usuário (cold start)
  // ------------------------------
  async getInitialPreferences(userId, selectedMediaIds = []) {
    return recommendationEngine.buildUserInitialPreferences(userId, selectedMediaIds);
  },

  // ------------------------------
  // Excluir mídia das recomendações (invalida cache)
  // ------------------------------
  async excludeMedia(userId, mediaId, months = 3) {
    cachedUserRecs.delete(userId); // invalida cache
    return recommendationEngine.excludeMediaForUser(userId, mediaId, months);
  },

  // ------------------------------
  // Conteúdo em alta
  // ------------------------------
  async getTrendingMedia(options = {}) {
    const { limit = 5, type, genre } = options;

    let trending = await recommendationEngine.getTrendingMedia(limit * 2);

    if (type || genre) {
      trending = trending.filter(media => {
        const typeMatch = !type || media.type === type;
        const genreMatch = !genre || media.genres.includes(genre);
        return typeMatch && genreMatch;
      });
    }

    return trending.slice(0, limit);
  },

  // ------------------------------
  // Mídias similares
  // ------------------------------
  async getSimilarMedia(mediaId, options = {}) {
    const { limit = 4 } = options;
    return recommendationEngine.getSimilarMedia(mediaId, limit);
  },

  // ------------------------------
  // Track de engajamento (invalida cache)
  // ------------------------------
  async trackEngagement(userId, mediaId, action, metadata = {}) {
    cachedUserRecs.delete(userId); // invalida cache
    return recommendationEngine.trackRecommendationEngagement(userId, mediaId, action, metadata);
  },

  // ------------------------------
  // Métricas de recomendação
  // ------------------------------
  async getMetrics(timeRange = 30) {
    return recommendationEngine.getRecommendationMetrics(timeRange);
  },

  // ------------------------------
  // Métricas de similaridade
  // ------------------------------
  async getSimilarityMetrics(mediaId, similarMedia) {
    return recommendationEngine.getSimilarityMetrics(mediaId, similarMedia);
  },

};

module.exports = recommendationService;