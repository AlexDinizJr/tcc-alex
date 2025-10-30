const prisma = require('../utils/database');

// --- Configurações de Pesos ---
const SIMILARITY_WEIGHTS = {
  genres: 0.8,
  type: 0.2,
  people: 0.4
};

const INTERACTION_WEIGHTS = {
  rating: 1.0,
  favorite: 0.8,
  saved: 0.6,
  engagement: 0.4
};

// --- Funções Auxiliares ---
const buildFilters = ({ type, genre, yearRange, minRating }) => {
  const filters = {};
  if (type) filters.type = type;
  if (genre) filters.genres = { has: genre };
  if (yearRange?.start && yearRange?.end) {
    filters.year = { gte: yearRange.start, lte: yearRange.end };
  }
  if (minRating) filters.rating = { gte: minRating };
  return filters;
};

const calculateSimilarity = (mediaA, mediaB) => {
  let score = 0;

  // Gêneros (peso maior)
  const sharedGenres = mediaA.genres?.filter(g => mediaB.genres?.includes(g)).length || 0;
  const maxGenres = Math.max(mediaA.genres?.length || 1, mediaB.genres?.length || 1);
  score += (sharedGenres / maxGenres) * SIMILARITY_WEIGHTS.genres;

  // Tipo
  if (mediaA.type === mediaB.type) {
    score += SIMILARITY_WEIGHTS.type;
  }

  // Pessoas (artistas, diretores, autores)
  const peopleA = [...(mediaA.artists || []), ...(mediaA.directors || []), ...(mediaA.authors || [])];
  const peopleB = [...(mediaB.artists || []), ...(mediaB.directors || []), ...(mediaB.authors || [])];
  const sharedPeople = peopleA.filter(p => peopleB.includes(p)).length;
  score += (sharedPeople * 0.1) * SIMILARITY_WEIGHTS.people;

  return Math.min(score, 1.0);
};

const buildUserInitialPreferences = async (userId) => {
  if (!userId) return { genres: {}, types: {} };

  // 1️⃣ Buscar mídias selecionadas pelo usuário no onboarding
  const initialPreferences = await prisma.userInitialPreference.findMany({
    where: { userId },
    include: { media: true } // include pega o objeto completo da media
  });

  if (!initialPreferences.length) {
    return { genres: {}, types: {} };
  }

  // 2️⃣ Construir objeto de preferências
  const preferences = initialPreferences.reduce(
    (acc, entry) => {
      const m = entry.media;
      m.genres?.forEach(g => {
        acc.genres[g] = (acc.genres[g] || 0) + 1;
      });
      acc.types[m.type] = (acc.types[m.type] || 0) + 1;
      return acc;
    },
    { genres: {}, types: {} }
  );

  return preferences;
};

const getUserPreferences = async (userId) => {
  if (!userId) return {};

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviews: { select: { mediaId: true, rating: true } },
        savedMedia: { select: { id: true } },
        favorites: { select: { id: true } },
        recommendationEngagements: { select: { mediaId: true, score: true } },
      },
    });

    if (!user) return {};

    const preferences = {};

    user.reviews.forEach(r => {
      preferences[r.mediaId] = (preferences[r.mediaId] || 0) + INTERACTION_WEIGHTS.rating * (r.rating / 5);
    });

    user.savedMedia.forEach(m => {
      preferences[m.id] = (preferences[m.id] || 0) + INTERACTION_WEIGHTS.saved;
    });

    user.favorites.forEach(m => {
      preferences[m.id] = (preferences[m.id] || 0) + INTERACTION_WEIGHTS.favorite;
    });

    user.recommendationEngagements.forEach(e => {
      preferences[e.mediaId] = (preferences[e.mediaId] || 0) + INTERACTION_WEIGHTS.engagement * (e.score || 0.5);
    });

    return preferences;
  } catch (error) {
    console.error('❌ Erro ao buscar preferências:', error);
    return {};
  }
};

// --- Recomendações Principais ---
const getUserRecommendations = async (userId, limit = 15, filters = {}) => {
  if (!userId) return [];

  try {
    console.log(`🎯 Gerando recomendações para usuário ${userId}`);

    // 1️⃣ Pegar preferências e interações do usuário
    const [preferences, userInteractions] = await Promise.all([
      getUserPreferences(userId),

      // Buscar mídias salvas, favoritas e excluídas
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          savedMedia: { select: { id: true } },
          favorites: { select: { id: true } },
          excludedMedia: { select: { mediaId: true } },
        }
      })
    ]);

    // Mapear IDs para excluir
    const interactedMediaIds = [
      ...(userInteractions?.savedMedia.map(m => m.id) || []),
      ...(userInteractions?.favorites.map(m => m.id) || []),
      ...(userInteractions?.excludedMedia.map(e => e.mediaId) || [])
    ];

    const preferredMediaIds = Object.keys(preferences).map(Number);

    console.log(`📊 Preferências: ${preferredMediaIds.length} mídias, Interações/Exclusões: ${interactedMediaIds.length} mídias`);

    // 2️⃣ Cold start se usuário não tiver preferências
    if (preferredMediaIds.length === 0) {
      console.log('🌱 Usuário sem preferências - usando cold start');
      return await applyColdStartRecommendations(userId, limit);
    }

    // 3️⃣ Buscar mídias preferidas
    const preferredMedia = await prisma.media.findMany({
      where: { id: { in: preferredMediaIds } }
    });

    // 4️⃣ Buscar candidatos excluindo interações e preferências
    const candidateMedia = await prisma.media.findMany({
      where: {
        ...buildFilters(filters),
        id: { notIn: [...interactedMediaIds, ...preferredMediaIds] }
      },
      take: 100 // limitar para performance
    });

    console.log(`🔍 ${candidateMedia.length} candidatos disponíveis`);

    // 5️⃣ Calcular scores com base na similaridade
    const scoredMedia = candidateMedia.map(candidate => {
      let totalScore = 0;

      preferredMedia.forEach(preferred => {
        const similarity = calculateSimilarity(candidate, preferred);
        const preferenceWeight = preferences[preferred.id] || 0;
        totalScore += similarity * preferenceWeight;
      });

      return { media: candidate, score: totalScore };
    });

    // 6️⃣ Ordenar e limitar
    scoredMedia.sort((a, b) => b.score - a.score);
    const recommendations = scoredMedia.slice(0, limit).map(item => item.media);

    console.log(`✅ ${recommendations.length} recomendações geradas`);

    return recommendations;

  } catch (error) {
    console.error('❌ Erro ao gerar recomendações:', error);
    // fallback
    return await getTrendingMedia(limit);
  }
};

const getCustomRecommendations = async (userId, filters = {}, referenceMediaIds = [], limit = 5) => {
  if (!userId) return [];

  try {
    const [preferences, userInteractions] = await Promise.all([
      getUserPreferences(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          savedMedia: { select: { id: true } },
          favorites: { select: { id: true } },
          excludedMedia: { select: { mediaId: true } },
        }
      })
    ]);

    const interactedMediaIds = [
      ...(userInteractions?.savedMedia.map(m => m.id) || []),
      ...(userInteractions?.favorites.map(m => m.id) || []),
      ...(userInteractions?.excludedMedia.map(e => e.mediaId) || [])
    ];

    const preferredMediaIds = Object.keys(preferences).map(Number);

    // Buscar mídias de referência se fornecidas
    const referenceMedia = referenceMediaIds.length > 0
      ? await prisma.media.findMany({ where: { id: { in: referenceMediaIds } } })
      : [];

    // Se não houver preferências nem referências, usar cold start
    if (preferredMediaIds.length === 0 && referenceMedia.length === 0) {
      return await applyColdStartRecommendations(userId, limit);
    }

    // Buscar mídias preferidas do usuário
    const preferredMedia = preferredMediaIds.length > 0
      ? await prisma.media.findMany({ where: { id: { in: preferredMediaIds } } })
      : [];

    // Buscar candidatos com filtros
    const seedIds = [...new Set([...
      preferredMediaIds,
      ...referenceMediaIds
    ])];

    const candidateMedia = await prisma.media.findMany({
      where: {
        ...buildFilters(filters),
        id: { notIn: [...interactedMediaIds, ...seedIds] }
      },
      take: 100
    });

    const scoredMedia = candidateMedia.map(candidate => {
      let score = 0;

      preferredMedia.forEach(pref => {
        const similarity = calculateSimilarity(candidate, pref);
        const preferenceWeight = preferences[pref.id] || 0;
        const reducedWeight = Math.min(preferenceWeight, 1) * 0.1;
        score += similarity * reducedWeight;
      });

      referenceMedia.forEach(refMedia => {
        const similarity = calculateSimilarity(candidate, refMedia);
        score += similarity * 0.7;
      });

      let filterScore = 0;
      if (filters.type && candidate.type === filters.type) {
        filterScore += 0.5;
      }
      if (filters.genre && Array.isArray(candidate.genres) && candidate.genres.includes(filters.genre)) {
        filterScore += 0.5;
      }
      if (filters.yearRange?.start && filters.yearRange?.end && typeof candidate.year === 'number') {
        if (candidate.year >= filters.yearRange.start && candidate.year <= filters.yearRange.end) {
          filterScore += 0.3;
        }
      }
      if (typeof filters.minRating === 'number' && typeof candidate.rating === 'number') {
        if (candidate.rating >= filters.minRating) {
          filterScore += 0.2;
        }
      }
      score += filterScore;

      return { media: candidate, score };
    });

    scoredMedia.sort((a, b) => b.score - a.score);
    return scoredMedia.slice(0, limit).map(item => item.media);

  } catch (error) {
    console.error('❌ Erro em recomendações customizadas:', error);
    return await getTrendingMedia(limit);
  }
};

// --- Cold Start ---
const applyColdStartRecommendations = async (userId, limit = 5) => {
  console.log(`🌱 Aplicando Cold Start para usuário ${userId}`);

  // 1️⃣ Pegar preferências iniciais do onboarding
  const preferences = await buildUserInitialPreferences(userId);

  // 2️⃣ Verificar se o usuário selecionou algo
  const hasPreferences =
    Object.keys(preferences.genres).length > 0 ||
    Object.keys(preferences.types).length > 0;

  if (hasPreferences) {
    // Buscar IDs das mídias selecionadas no onboarding
    const preferredMediaIds = await prisma.userInitialPreference.findMany({
      where: { userId },
      select: { mediaId: true }
    }).then(res => res.map(r => r.mediaId));

    // Buscar as mídias que o usuário escolheu (sementes)
    const preferredMedia = await prisma.media.findMany({
      where: { id: { in: preferredMediaIds } }
    });

    // Buscar trending para misturar na diversidade
    const trending = await getTrendingMedia(limit * 2);

    // 3️⃣ Buscar candidatos que compartilhem gênero ou tipo
    const candidateMedia = await prisma.media.findMany({
      where: {
        id: { notIn: preferredMediaIds }, // exclui o que ele já escolheu
        OR: [
          { type: { in: Object.keys(preferences.types) } },
          { genres: { hasSome: Object.keys(preferences.genres) } }
        ]
      },
      take: limit * 3 // pega bastante para ranquear
    });

    // 4️⃣ Calcular score de similaridade com as preferências iniciais
    const scoredMedia = candidateMedia.map(candidate => {
      let score = 0;

      preferredMedia.forEach(pref => {
        score += calculateSimilarity(candidate, pref);
      });

      return { media: candidate, score };
    });

    // Ordenar por score (descendente)
    scoredMedia.sort((a, b) => b.score - a.score);

    // 5️⃣ Misturar com trending para diversidade
    const finalList = [
      ...scoredMedia.map(s => s.media),
      ...trending
    ].filter((v, i, a) => a.findIndex(m => m.id === v.id) === i) // remover duplicatas
     .slice(0, limit);

    console.log(`✅ Cold Start gerou ${finalList.length} recomendações para user ${userId}`);
    return finalList;

  } else {
    // Caso o usuário não tenha marcado nada -> só trending
    const trendingOnly = await getTrendingMedia(limit);
    console.log(`✅ Cold Start: usuário sem preferências, retornando trending (${trendingOnly.length})`);
    return trendingOnly;
  }
};

// --- Funções Mantidas (praticamente inalteradas) ---
const excludeMediaForUser = async (userId, mediaId, months = 3) => {
  const expireAt = new Date();
  expireAt.setMonth(expireAt.getMonth() + months);
  
  return prisma.userExcludedMedia.create({ 
    data: { userId, mediaId, expireAt } 
  });
};

const getSimilarMedia = async (mediaId, limit = 5) => {
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
    }))
    .map(item => ({
      media: item.media,
      score: item.similarity
    }))
    .sort((a, b) => b.score - a.score);

  return scoredMedia.slice(0, limit).map(item => item.media);
};

const getTrendingMedia = async (limit = 15) => {
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
    },
    take: limit * 2
  });

  const scored = media.map(m => {
    const engagementScore = m.recommendationEngagements?.length || 0;
    const popularityScore = (m._count.savedBy + m._count.favoritedBy + m._count.reviews) * 0.1;
    const ratingScore = (m.rating || 0) * 0.2;
    
    return {
      media: m,
      score: engagementScore + popularityScore + ratingScore
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(item => item.media);
};

// --- Exportações ---
module.exports = {
  buildFilters,
  calculateSimilarity,
  buildUserInitialPreferences,
  getUserPreferences,
  getUserRecommendations,
  getCustomRecommendations,
  applyColdStartRecommendations,
  excludeMediaForUser,
  getSimilarMedia,
  getTrendingMedia
};