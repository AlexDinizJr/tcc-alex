import api from "./api";

/**
 * Busca todas as mídias com filtros de pesquisa e paginação
 */
export async function fetchMedia({
  type,
  searchQuery = "",
  sortBy = "",
  page = 1,
  itemsPerPage = 20,
}) {
  try {
    const response = await api.get("/media", {
      params: {
        type,
        search: searchQuery,
        sortBy,
        page,
        limit: itemsPerPage,
      },
    });
    
    console.log("📦 Response da API:", response.data); // Debug
    
    // ✅ CORREÇÃO: O backend retorna "media" não "items"
    return {
      items: response.data.media || [], // ← Aqui está o problema!
      total: response.data.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Erro ao buscar mídias:", error.response?.data || error);
    return { items: [], total: 0 };
  }
}

/**
 * Busca mídia por ID
 */
export async function fetchMediaById(id) {
  try {
    const response = await api.get(`/media/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar mídia com id ${id}:`, error.response?.data || error);
    return null;
  }
}

/**
 * Busca mídias por tipo (ex: movie, game, music)
 */
export async function fetchMediaByType(type, options = {}) {
  const { excludeId = null, limit = null } = options;
  try {
    const response = await api.get(`/media/type/${type}`, {
      params: { excludeId, limit },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar mídias do tipo ${type}:`, error.response?.data || error);
    return [];
  }
}

export async function fetchStreamingLinksByMediaId(mediaId) {
  if (!mediaId) return [];
  try {
    const response = await api.get(`/media/${mediaId}/streaming-links`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar links de streaming da mídia ${mediaId}:`, error.response?.data || error);
    return [];
  }
}

/**
 * Busca todas as classificações
 */
export async function fetchAllClassifications() {
  try {
    const response = await api.get("/media/classifications");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar classificações:", error.response?.data || error);
    return [];
  }
}

/**
 * Busca mídias por classificação indicativa
 */
export async function fetchMediaByClassification(classification) {
  try {
    const response = await api.get(`/media/classification/${classification}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar mídias da classificação ${classification}:`, error.response?.data || error);
    return [];
  }
}

/**
 * Busca mídias por intervalo de anos
 */
export async function fetchMediaByYearRange(startYear, endYear) {
  try {
    const response = await api.get("/media/year-range", { params: { startYear, endYear } });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mídias por ano:", error.response?.data || error);
    return [];
  }
}

/**
 * Busca mídias por nota mínima
 */
export async function fetchMediaByMinRating(rating) {
  try {
    const response = await api.get("/media/min-rating", { params: { rating } });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mídias por rating:", error.response?.data || error);
    return [];
  }
}

/**
 * Busca as midias com filtros de pesquisa, ordenação e paginação
 */
export async function fetchMediaFiltered({
  type,
  search = "",
  sortBy = "title",
  page = 1,
  limit = 20,
  year,
  classification,
  genres,
  platforms,
}) {
  try {
    const params = {
      type,
      search,
      sortBy,
      page,
      limit,
    };

    if (year) params.year = year;
    if (classification) params.classification = classification;
    if (genres && genres.length > 0) params.genres = genres.join(","); // ou o formato que seu backend espera
    if (platforms && platforms.length > 0) params.platforms = platforms.join(",");

    const response = await api.get("/media", { params });
    return response.data; // { media, pagination }
  } catch (error) {
    console.error(`Erro ao buscar mídias (${type}):`, error.response?.data || error);
    return { media: [], pagination: { pages: 1 } };
  }
}

/**
 * Busca serviços de streaming disponíveis
 */
export async function fetchAvailableStreamingServices() {
  try {
    const response = await api.get("/media/services/streaming");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços de streaming:", error.response?.data || error);
    return [];
  }
}

/**
 * Busca mídias disponíveis em um serviço de streaming específico
 */
export async function fetchMediaByStreamingService(service) {
  try {
    const response = await api.get(`/media/service/streaming/${service}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar mídias no serviço ${service}:`, error.response?.data || error);
    return [];
  }
}

/**
 * Busca mídias por um termo q
 */
export async function searchMediaByQuery(query) {
  if (!query.trim()) return [];
  try {
    const response = await api.get("/media/search", { params: { q: query } });
    // Retorna o array correto
    return Array.isArray(response.data.results) ? response.data.results : [];
  } catch (error) {
    console.error("Erro ao buscar mídias:", error.response?.data || error);
    return [];
  }
}