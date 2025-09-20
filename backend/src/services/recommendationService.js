const prisma = require('../utils/database');

// --- Métricas e pesos de engajamento ---
const METRICS = {
  click_through_rate: 0.2,  // >20%
  save_rate: 0.1,           // >10%
  page_views: 0.15,         // >15%
  engagement_score: 0.6     // score composto
};

const ENGAGEMENT_WEIGHTS = {
  page_view: 0.4,
  saved: 0.3,
  favorited: 0.2,
  added_to_list: 0.1
};

const INTERACTION_WEIGHTS = {
  rating: 0.5,   // Avaliações altas (>4.5)
  favorite: 0.3, // Favoritou
  saved: 0.2     // Salvou em listas
};

const DECAY_DAYS = 90; // Decaimento temporal: 90 dias máximo para interações

// --- Funções auxiliares ---
const daysSince = (date) => {
  const now = new Date();
  return (now - new Date(date)) / (1000 * 60 * 60 * 24); // diferença em dias
};

const normalize = (score, maxScore) => (maxScore ? score / maxScore : 0);

// --- Funções principais ---
const buildFilters = ({ type, genre, yearRange, minRating }) => {
  const filters = {};
  if (type) filters.type = type;
  if (genre) filters.genres = { has: genre };
  if (yearRange?.start && yearRange?.end) filters.year = { gte: yearRange.start, lte: yearRange.end };
  if (minRating) filters.rating = { gte: minRating };
  return filters;
};

const buildUserInitialPreferences = async (userId, selectedMediaIds) => {
  const media = await prisma.media.findMany({
    where: { id: { in: selectedMediaIds } }
  });

  const preferences = media.reduce(
    (acc, m) => {
      m.genres.forEach(g => acc.genres[g] = (acc.genres[g] || 0) + 1);
      acc.types[m.type] = (acc.types[m.type] || 0) + 1;
      return acc;
    },
    { genres: {}, types: {} }
  );

  return preferences;
};

const getUserPreferences = async (userId) => {
  const [reviews, favorites, saved] = await Promise.all([
    prisma.review.findMany({ 
      where: { userId, rating: { gte: 4.5 } }, 
      select: { mediaId: true, rating: true, createdAt: true } 
    }),
    prisma.media.findMany({ 
      where: { favoritedBy: { some: { id: userId } } }, 
      select: { id: true, createdAt: true } 
    }),
    prisma.media.findMany({ 
      where: { savedBy: { some: { id: userId } } }, 
      select: { id: true, createdAt: true } 
    })
  ]);

  const prefs = {};

  const addPreference = (mediaId, weight, createdAt) => {
    const decay = Math.min(1, (DECAY_DAYS - daysSince(createdAt)) / DECAY_DAYS);
    prefs[mediaId] = (prefs[mediaId] || 0) + weight * decay;
  };

  reviews.forEach(review => addPreference(review.mediaId, INTERACTION_WEIGHTS.rating, review.createdAt));
  favorites.forEach(fav => addPreference(fav.id, INTERACTION_WEIGHTS.favorite, fav.createdAt));
  saved.forEach(save => addPreference(save.id, INTERACTION_WEIGHTS.saved, save.createdAt));

  return prefs;
};

const calculateSimilarity = (mediaA, mediaB) => {
  let score = 0;

  // Gêneros (peso maior)
  const sharedGenres = mediaA.genres.filter(g => mediaB.genres.includes(g)).length;
  score += sharedGenres / Math.max(mediaA.genres.length, mediaB.genres.length);

  // Tipo (bônus pequeno)
  if (mediaA.type === mediaB.type) score += 0.1;

  // Pessoas envolvidas (artistas, diretores, autores)
  const sharedPeople = [
    ...new Set([
      ...(mediaA.artists || []),
      ...(mediaB.artists || []),
      ...(mediaA.directors || []),
      ...(mediaB.directors || []),
      ...(mediaA.authors || []),
      ...(mediaB.authors || [])
    ])
  ].length;
  
  score += sharedPeople * 0.05;

  return normalize(score, 1.5);
};

const getTrendingMedia = async (limit = 10) => {
  // Ordena por engajamento composto + rating
  const media = await prisma.media.findMany({
    include: {
      recommendationEngagement: true
    }
  });

  const scored = media.map(m => {
    const engagementScore = m.recommendationEngagement.reduce((sum, e) => sum + e.score, 0);
    return {
      media: m,
      score: engagementScore + (m.rating || 0) // combina engajamento + avaliação
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(item => item.media);
};

const getUserRecommendations = async (userId, limit = 5) => {
  const [prefs, excludedItems] = await Promise.all([
    getUserPreferences(userId),
    prisma.userExcludedMedia.findMany({
      where: { userId, expireAt: { gte: new Date() } },
      select: { mediaId: true }
    })
  ]);

  const excludedIds = excludedItems.map(item => item.mediaId);
  const userMediaIds = Object.keys(prefs).map(Number);

  const allMedia = await prisma.media.findMany({
    where: { id: { notIn: [...userMediaIds, ...excludedIds] } }
  });

  const scoredMedia = allMedia.map(media => {
    let similarityScore = 0;
    
    Object.entries(prefs).forEach(([mediaId, weight]) => {
      const preferredMedia = allMedia.find(m => m.id === parseInt(mediaId));
      if (preferredMedia) {
        similarityScore += calculateSimilarity(media, preferredMedia) * weight;
      }
    });

    return { media, score: similarityScore };
  });

  scoredMedia.sort((a, b) => b.score - a.score);

  // Diversificação por gêneros
  const finalRecommendations = [];
  const includedGenres = new Set();

  for (const item of scoredMedia) {
    if (finalRecommendations.length >= limit) break;
    
    const itemGenres = item.media.genres || [];
    const hasGenreOverlap = itemGenres.some(genre => includedGenres.has(genre));
    
    if (!hasGenreOverlap || finalRecommendations.length < 2) {
      finalRecommendations.push(item.media);
      itemGenres.forEach(genre => includedGenres.add(genre));
    }
  }

  return finalRecommendations;
};

const getCustomRecommendations = async (userId, filters = {}, referenceMediaIds = [], limit = 5) => {
  const [prefs, excludedItems] = await Promise.all([
    getUserPreferences(userId),
    prisma.userExcludedMedia.findMany({
      where: { userId, expireAt: { gte: new Date() } },
      select: { mediaId: true }
    })
  ]);

  const excludedIds = excludedItems.map(item => item.mediaId);
  const userMediaIds = Object.keys(prefs).map(Number);

  const whereFilters = buildFilters(filters);

  const allMedia = await prisma.media.findMany({
    where: {
      ...whereFilters,
      id: { notIn: [...userMediaIds, ...excludedIds] }
    }
  });

  const scoredMedia = allMedia.map(media => {
    let similarityScore = 0;

    // Similaridade com preferências do usuário
    Object.entries(prefs).forEach(([mediaId, weight]) => {
      const preferredMedia = allMedia.find(m => m.id === parseInt(mediaId));
      if (preferredMedia) {
        similarityScore += calculateSimilarity(media, preferredMedia) * weight;
      }
    });

    // Similaridade com mídias de referência (peso menor)
    referenceMediaIds.forEach(refId => {
      const refMedia = allMedia.find(m => m.id === refId);
      if (refMedia) {
        similarityScore += calculateSimilarity(media, refMedia) * 0.5;
      }
    });

    return { media, score: similarityScore };
  });

  scoredMedia.sort((a, b) => b.score - a.score);
  return scoredMedia.slice(0, limit).map(item => item.media);
};

// --- Cold Start ---
const getColdStartRecommendations = async (userId, limit = 5) => {
  // 1. Conteúdos populares globalmente
  const popularMedia = await prisma.media.findMany({
    orderBy: { rating: 'desc' },
    take: limit * 2
  });

  // 2. Preferências iniciais do usuário
  const initialPrefs = await buildUserInitialPreferences(userId, []);
  if (!initialPrefs || Object.keys(initialPrefs.genres).length === 0) {
    // Cold Start puro: retorna apenas populares
    return popularMedia.slice(0, limit);
  }

  // 3. Combina popularidade com preferências iniciais
  return popularMedia
    .map(media => {
      let score = 0;
      // Gêneros preferidos
      media.genres.forEach(g => {
        if (initialPrefs.genres[g]) score += initialPrefs.genres[g];
      });
      // Tipo preferido
      if (initialPrefs.types[media.type]) score += initialPrefs.types[media.type];
      return { media, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.media);
};

// --- Hybrid Recommendations ---
const getHybridRecommendations = async (userId, limit = 5) => {
  const prefs = await getUserPreferences(userId);
  const interactionCount = Object.keys(prefs).length;

  if (interactionCount < 5) {
    return getColdStartRecommendations(userId, limit);
  } else {
    return getUserRecommendations(userId, limit);
  }
};

// --- Track user engagement ---
const trackRecommendationEngagement = async (userId, mediaId, action) => {
  const engagementScore = {
    page_view: 1,
    saved: 2,
    favorited: 3,
    added_to_list: 4
  }[action] || 0;

  await prisma.recommendationEngagement.create({
    data: { userId, mediaId, action, score: engagementScore, timestamp: new Date() }
  });
};

const getEngagementBasedRecommendations = async (userId, limit = 5) => {
  const recentEngaged = await prisma.recommendationEngagement.findMany({
    where: { userId, score: { gte: 2 } },
    orderBy: { timestamp: 'desc' },
    take: 10
  });

  const mediaIds = recentEngaged.map(r => r.mediaId);
  return Promise.all(mediaIds.map(mid => getSimilarMedia(mid, limit)))
    .then(results => results.flat().slice(0, limit));
};

// --- Recommendation metrics ---
const getRecommendationMetrics = async () => {
  const totalRecommendations = await prisma.recommendationLog.count();
  const successfulEngagements = await prisma.recommendationEngagement.count({
    where: { score: { gte: 2 } }
  });

  const avgScore = await prisma.recommendationEngagement.aggregate({
    _avg: { score: true }
  });

  // Top genres (simples)
  const topGenres = await prisma.media.groupBy({
    by: ['type'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  });

  return {
    total_recommendations: totalRecommendations,
    engagement_rate: totalRecommendations > 0 ? (successfulEngagements / totalRecommendations) * 100 : 0,
    avg_engagement_score: avgScore._avg.score || 0,
    top_performing_genres: topGenres.map(g => g.type)
  };
};

const getSimilarMedia = async (mediaId, limit = 4) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) return [];

  const allMedia = await prisma.media.findMany({ 
    where: { NOT: { id: mediaId } } 
  });

  const scoredMedia = allMedia
    .map(otherMedia => ({
      media: otherMedia,
      score: calculateSimilarity(media, otherMedia)
    }))
    .sort((a, b) => b.score - a.score);

  return scoredMedia.slice(0, limit).map(item => item.media);
};

const excludeMediaForUser = async (userId, mediaId, months = 3) => {
  const expireAt = new Date();
  expireAt.setMonth(expireAt.getMonth() + months);
  
  return prisma.userExcludedMedia.create({ 
    data: { userId, mediaId, expireAt } 
  });
};

module.exports = {
  buildFilters,
  getUserPreferences,
  calculateSimilarity,
  getTrendingMedia,
  getUserRecommendations,
  getCustomRecommendations,
  excludeMediaForUser,
  buildUserInitialPreferences,
  getSimilarMedia,
  getColdStartRecommendations,
  getHybridRecommendations,
  trackRecommendationEngagement,
  getEngagementBasedRecommendations,
  getRecommendationMetrics
};