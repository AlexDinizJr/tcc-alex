import api from "./api";

/**
 * Busca recomendações personalizadas para o usuário logado
 */
export async function fetchUserRecommendations(params = {}) {
  try {
    const response = await api.get("/recommendations", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar recomendações do usuário:", error.response?.data || error);
    return [];
  }
}

/**
 * Busca recomendações para homepage
 */
export async function fetchHomepageRecommendations() {
  try {
    const response = await api.get("/recommendations/homepage");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar recomendações para homepage:", error.response?.data || error);
    return [];
  }
}

/**
 * Busca conteúdo em alta (trending)
 */
export async function fetchTrending() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/recommendations/trending`);
  if (!res.ok) throw new Error("Erro ao buscar trending");

  const result = await res.json();
  // Retornar apenas o array de trending
  return result.data?.trending || [].slice(0, 5);
}

/**
 * Busca mídias similares a uma mídia específica
 */
export async function fetchSimilarMedia(mediaId, options = {}) {
  try {
    console.log(`🔄 Buscando mídias similares para ID: ${mediaId}`);
    const response = await api.get(`/recommendations/similar/${mediaId}`, { params: options });
    console.log("✅ Resposta da API (similar):", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar mídias similares para ${mediaId}:`, error);
    console.error("Detalhes do erro:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return [];
  }
}

/**
 * Recomendações baseadas em engajamento do usuário
 */
export async function fetchEngagementRecommendations(params = {}) {
  try {
    const response = await api.get("/recommendations/engagement", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar recomendações por engajamento:", error.response?.data || error);
    return [];
  }
}

/**
 * Recomendações híbridas otimizadas
 */
export async function fetchOptimizedRecommendations(params = {}) {
  try {
    const response = await api.get("/recommendations/optimized", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar recomendações otimizadas:", error.response?.data || error);
    return [];
  }
}

/**
 * Excluir mídia das recomendações do usuário
 */
export async function excludeFromRecommendations(mediaId, body = {}) {
  try {
    const response = await api.post(`/recommendations/exclude/${mediaId}`, body);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir mídia ${mediaId} das recomendações:`, error.response?.data || error);
    return null;
  }
}

/**
 * Buscar métricas de recomendações
 */
export async function fetchRecommendationMetrics(params = {}) {
  try {
    const response = await api.get("/recommendations/metrics", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de recomendações:", error.response?.data || error);
    return null;
  }
}

/**
 * Registrar engajamento do usuário com uma mídia
 */
export async function trackEngagement(data) {
  try {
    const response = await api.post("/recommendations/track", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar engajamento:", error.response?.data || error);
    return null;
  }
}