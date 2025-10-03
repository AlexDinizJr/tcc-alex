const recommendationEngine = require('../algorithms/recommendationEngine');
const prisma = require('../utils/database');

const recommendationService = {

  // ------------------------------
  // Recomendações baseadas no usuário
  // ------------------------------
  async getUserRecommendations(userId) {
    return recommendationEngine.getUserRecommendations(userId, limit = 5, {});
  },

  // ------------------------------
  // Recomendações personalizadas com filtros
  // ------------------------------
  async getCustomRecommendations(userId, filters = {}, referenceMediaIds = [], limit = 5) {
    return recommendationEngine.getCustomRecommendations(userId, filters, referenceMediaIds, limit);
  },

  // ------------------------------
  // Preferências iniciais do usuário (onboarding)
  // ------------------------------
  async getInitialPreferences(userId, selectedMediaIds = []) {
    await prisma.userInitialPreference.deleteMany({ where: { userId } });

    // Criar novas preferências
    const createData = selectedMediaIds.map(mediaId => ({ userId, mediaId }));
    await prisma.userInitialPreference.createMany({ data: createData });

    // Retornar algo útil, por exemplo as mídias selecionadas
    return prisma.media.findMany({ where: { id: { in: selectedMediaIds } } });
  },

  // ------------------------------
  // Excluir mídia das recomendações
  // ------------------------------
  async excludeMedia(userId, mediaId, months = 3) {
    return recommendationEngine.excludeMediaForUser(userId, mediaId, months);
  },

  // ------------------------------
  // Conteúdo em alta
  // ------------------------------
  async getTrendingMedia(options = {}) {
    const { limit = 5 } = options;
    return recommendationEngine.getTrendingMedia(limit);
  },

  // ------------------------------
  // Mídias similares
  // ------------------------------
  async getSimilarMedia(mediaId, options = {}) {
    const { limit = 4 } = options;
    return recommendationEngine.getSimilarMedia(mediaId, limit);
  },

  // ------------------------------
  // Preferências de Usuário
  // ------------------------------
  async getUserPreferences(userId) {
    return recommendationEngine.getUserPreferences(userId);
  }

};

module.exports = recommendationService;