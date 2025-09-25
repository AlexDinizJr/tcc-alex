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

const calculateDecayFactor = (date) => {
  return Math.max(0, (DECAY_DAYS - daysSince(date)) / DECAY_DAYS);
};

// --- Funções de Engajamento e Métricas ---
const calculateEngagementScore = (media) => {
  if (!media.recommendationEngagements || media.recommendationEngagements.length === 0) return 0;
  
  return media.recommendationEngagements.reduce((score, engagement) => {
    const weight = ENGAGEMENT_WEIGHTS[engagement.action] || 0;
    const decay = calculateDecayFactor(engagement.timestamp);
    return score + (weight * decay);
  }, 0);
};

const calculateMediaMetrics = (media) => {
  if (!media.recommendationEngagements || media.recommendationEngagements.length === 0) {
    return { click_through_rate: 0, save_rate: 0, page_views: 0, engagement_score: 0 };
  }

  const engagements = media.recommendationEngagements;
  const pageViews = engagements.filter(e => e.action === 'page_view').length;
  const saves = engagements.filter(e => e.action === 'saved').length;
  const otherActions = engagements.filter(e => e.action !== 'page_view').length;
  
  const metrics = {
    click_through_rate: pageViews > 0 ? otherActions / pageViews : 0,
    save_rate: pageViews > 0 ? saves / pageViews : 0,
    page_views: pageViews,
    engagement_score: calculateEngagementScore(media)
  };

  return metrics;
};

const getMediaPerformanceScore = (media) => {
  const metrics = calculateMediaMetrics(media);
  
  return Object.entries(metrics).reduce((totalScore, [metric, value]) => {
    return totalScore + (value * (METRICS[metric] || 0));
  }, 0);
};

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
  const [reviews, favorites, saved, engagements] = await Promise.all([
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
    }),
    prisma.recommendationEngagements.findMany({
      where: { userId },
      select: { mediaId: true, action: true, timestamp: true }
    })
  ]);

  const prefs = {};

  const addPreference = (mediaId, weight, createdAt) => {
    const decay = calculateDecayFactor(createdAt);
    prefs[mediaId] = (prefs[mediaId] || 0) + weight * decay;
  };

  // Preferências explícitas
  reviews.forEach(review => addPreference(review.mediaId, INTERACTION_WEIGHTS.rating, review.createdAt));
  favorites.forEach(fav => addPreference(fav.id, INTERACTION_WEIGHTS.favorite, fav.createdAt));
  saved.forEach(save => addPreference(save.id, INTERACTION_WEIGHTS.saved, save.createdAt));

  // Preferências baseadas em engajamento
  engagements.forEach(engagement => {
    const weight = ENGAGEMENT_WEIGHTS[engagement.action] || 0;
    addPreference(engagement.mediaId, weight * 0.5, engagement.timestamp); // Peso reduzido para engajamento
  });

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
  const media = await prisma.media.findMany({
    include: {
      recommendationEngagements: true,
      _count: {
        select: {
          savedBy: true,
          favoritedBy: true,
          reviews: true
        }
      }
    }
  });

  const scored = media.map(m => {
    const engagementScore = calculateEngagementScore(m);
    const performanceScore = getMediaPerformanceScore(m);
    
    // Score final combinando engajamento, métricas e rating
    const finalScore = (
      engagementScore * METRICS.engagement_score +
      performanceScore +
      (m.rating || 0) * 0.1 // Rating como bônus adicional
    );

    return {
      media: m,
      score: finalScore,
      metrics: calculateMediaMetrics(m)
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
    where: { id: { notIn: [...userMediaIds, ...excludedIds] } },
    include: {
      recommendationEngagements: true
    }
  });

  const scoredMedia = allMedia.map(media => {
    let similarityScore = 0;
    
    Object.entries(prefs).forEach(([mediaId, weight]) => {
      const preferredMedia = allMedia.find(m => m.id === parseInt(mediaId));
      if (preferredMedia) {
        similarityScore += calculateSimilarity(media, preferredMedia) * weight;
      }
    });

    // Adicionar score de engajamento global
    const engagementBonus = calculateEngagementScore(media) * 0.3;
    
    return { 
      media, 
      score: similarityScore + engagementBonus,
      similarityScore,
      engagementBonus
    };
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
    },
    include: {
      recommendationEngagements: true
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

    // Score de engajamento global
    const engagementScore = calculateEngagementScore(media) * 0.2;

    return { 
      media, 
      score: similarityScore + engagementScore 
    };
  });

  scoredMedia.sort((a, b) => b.score - a.score);
  return scoredMedia.slice(0, limit).map(item => item.media);
};

// --- Cold Start ---
const getColdStartRecommendations = async (userId, limit = 5) => {
  // 1. Conteúdos populares globalmente com engajamento
  const popularMedia = await prisma.media.findMany({
    include: {
      recommendationEngagements: true
    },
    take: limit * 3
  });

  // Ordenar por engajamento + rating
  const scoredMedia = popularMedia.map(media => ({
    media,
    score: getMediaPerformanceScore(media) + (media.rating || 0) * 0.1
  })).sort((a, b) => b.score - a.score);

  // 2. Preferências iniciais do usuário (se existirem)
  const initialPrefs = await buildUserInitialPreferences(userId, []);
  if (!initialPrefs || Object.keys(initialPrefs.genres).length === 0) {
    return scoredMedia.slice(0, limit).map(item => item.media);
  }

  // 3. Combinar popularidade com preferências iniciais
  const finalScored = scoredMedia.map(item => {
    let preferenceScore = 0;
    const media = item.media;
    
    // Gêneros preferidos
    media.genres.forEach(g => {
      if (initialPrefs.genres[g]) preferenceScore += initialPrefs.genres[g];
    });
    
    // Tipo preferido
    if (initialPrefs.types[media.type]) preferenceScore += initialPrefs.types[media.type];
    
    return {
      media,
      score: item.score + (preferenceScore * 0.3) // Peso menor para preferências iniciais
    };
  });

  finalScored.sort((a, b) => b.score - a.score);
  return finalScored.slice(0, limit).map(item => item.media);
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
const trackRecommendationEngagements = async (userId, mediaId, action, additionalData = {}) => {
  const baseScore = ENGAGEMENT_WEIGHTS[action] || 0;
  let finalScore = baseScore;
  
  // Bônus baseado em métricas específicas
  if (action === 'page_view' && additionalData.duration > 60) {
    finalScore += 0.1; // Engajamento prolongado
  }
  
  if (action === 'saved' && additionalData.listType === 'favorites') {
    finalScore += 0.2; // Salvou nos favoritos
  }

  await prisma.recommendationEngagements.create({
    data: { 
      userId, 
      mediaId, 
      action, 
      score: finalScore, 
      timestamp: new Date(),
      metadata: additionalData 
    }
  });

  // Atualizar métricas em tempo real (opcional)
  await updateMediaMetrics(mediaId);
};

const updateMediaMetrics = async (mediaId) => {
  // Poderia atualizar cache ou tabela de métricas agregadas aqui
  console.log(`Métricas atualizadas para mediaId: ${mediaId}`);
};

const getEngagementBasedRecommendations = async (userId, limit = 5) => {
  const recentEngaged = await prisma.recommendationEngagements.findMany({
    where: { 
      userId, 
      score: { gte: ENGAGEMENT_WEIGHTS.saved } // Engajamentos significativos
    },
    orderBy: { timestamp: 'desc' },
    take: 10,
    include: { media: true }
  });

  if (recentEngaged.length === 0) {
    return getTrendingMedia(limit);
  }

  // Agrupar por mediaId e calcular scores
  const mediaScores = recentEngaged.reduce((acc, engagement) => {
    const decay = calculateDecayFactor(engagement.timestamp);
    const score = engagement.score * decay;
    
    acc[engagement.mediaId] = (acc[engagement.mediaId] || 0) + score;
    return acc;
  }, {});

  // Buscar mídias similares às engajadas
  const similarMediaPromises = Object.keys(mediaScores).map(mediaId =>
    getSimilarMedia(parseInt(mediaId), 3)
  );

  const similarResults = await Promise.all(similarMediaPromises);
  const allSimilar = similarResults.flat();

  // Remover duplicatas e ordenar
  const uniqueMedia = Array.from(new Map(
    allSimilar.map(media => [media.id, media])
  ).values());

  return uniqueMedia.slice(0, limit);
};

// --- Recommendation metrics ---
const getRecommendationMetrics = async (timeRange = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  const [successfulEngagements, engagementStats, topGenres] = await Promise.all([
    prisma.recommendationEngagements.count({
      where: { 
        score: { gte: 2 },
        timestamp: { gte: startDate }
      }
    }),
    prisma.recommendationEngagements.aggregate({
      where: { timestamp: { gte: startDate } },
      _avg: { score: true },
      _max: { score: true },
      _min: { score: true },
      _count: { id: true }
    }),
    prisma.media.groupBy({
      by: ['type'],
      where: {
        recommendationEngagements: {
          some: {
            timestamp: { gte: startDate },
            score: { gte: ENGAGEMENT_WEIGHTS.page_view }
          }
        }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    })
  ]);

  const engagementsByAction = await prisma.recommendationEngagements.groupBy({
    by: ['action'],
    where: { timestamp: { gte: startDate } },
    _count: { id: true },
    _avg: { score: true }
  });

  const actionMetrics = engagementsByAction.reduce((acc, item) => {
    acc[item.action] = {
      count: item._count.id,
      avg_score: item._avg.score,
      weight: ENGAGEMENT_WEIGHTS[item.action] || 0
    };
    return acc;
  }, {});

  return {
    time_range: `${timeRange} days`,
    total_recommendations: engagementStats._count.id,
    engagement_rate: engagementStats._count.id > 0 ? 
      (successfulEngagements / engagementStats._count.id) * 100 : 0,
    score_stats: {
      average: engagementStats._avg.score || 0,
      maximum: engagementStats._max.score || 0,
      minimum: engagementStats._min.score || 0,
      total_engagements: engagementStats._count.id
    },
    top_performing_genres: topGenres.map(g => ({
      type: g.type,
      count: g._count.id
    })),
    action_breakdown: actionMetrics,
    target_metrics: METRICS,
    engagement_weights: ENGAGEMENT_WEIGHTS
  };
};

const getSimilarMedia = async (mediaId, limit = 4) => {
  const media = await prisma.media.findUnique({ 
    where: { id: mediaId },
    include: { recommendationEngagements: true }
  });
  
  if (!media) return [];

  const allMedia = await prisma.media.findMany({ 
    where: { NOT: { id: mediaId } },
    include: { recommendationEngagements: true }
  });

  const scoredMedia = allMedia
    .map(otherMedia => ({
      media: otherMedia,
      similarity: calculateSimilarity(media, otherMedia),
      engagement: calculateEngagementScore(otherMedia)
    }))
    .map(item => ({
      media: item.media,
      score: item.similarity + (item.engagement * 0.2) // Combinar similaridade com engajamento
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

// --- Função para gerar recomendações otimizadas ---
const getOptimizedRecommendations = async (userId, limit = 5) => {
  const [userRecs, trending, engagementRecs] = await Promise.all([
    getUserRecommendations(userId, limit),
    getTrendingMedia(limit),
    getEngagementBasedRecommendations(userId, Math.floor(limit / 2))
  ]);

  // Combinar todas as fontes
  const allCandidates = [...new Map([
    ...userRecs.map(item => [item.id, item]),
    ...trending.map(item => [item.id, item]),
    ...engagementRecs.map(item => [item.id, item])
  ]).values()];

  // Score final considerando múltiplos fatores
  const scoredCandidates = await Promise.all(
    allCandidates.map(async (media) => {
      const personalizationScore = await calculatePersonalizationScore(userId, media.id);
      const engagementScore = calculateEngagementScore(media);
      const performanceScore = getMediaPerformanceScore(media);
      
      const finalScore = (
        personalizationScore * 0.5 + 
        engagementScore * 0.3 + 
        performanceScore * 0.2
      );

      return { media, score: finalScore };
    })
  );

  scoredCandidates.sort((a, b) => b.score - a.score);
  return scoredCandidates.slice(0, limit).map(item => item.media);
};

const calculatePersonalizationScore = async (userId, mediaId) => {
  // Implementação simplificada - poderia usar collaborative filtering
  const prefs = await getUserPreferences(userId);
  return prefs[mediaId] || 0;
};

const getSimilarityMetrics = async (mediaId, similarMedia) => {
  const originalMedia = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { genres: true, type: true, rating: true }
  });

  if (!originalMedia) return null;

  return similarMedia.map(media => {
    const similarity = calculateSimilarity(originalMedia, media);
    return {
      mediaId: media.id,
      title: media.title,
      similarityScore: similarity,
      sharedGenres: media.genres.filter(g => originalMedia.genres.includes(g)).length,
      sameType: media.type === originalMedia.type
    };
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
  trackRecommendationEngagements,
  getEngagementBasedRecommendations,
  getRecommendationMetrics,
  getOptimizedRecommendations,
  calculateEngagementScore,
  getMediaPerformanceScore,
  calculateMediaMetrics,
  getSimilarityMetrics
};