import api from "./api";

/**
 * Busca recomendações para o usuário logado
 */
export async function fetchUserRecommendations(params = {}) {
  try {
    console.log("🌐 [FRONT] Chamando API de recomendações com params:", params);
    const response = await api.get("/recommendations", { params });
    console.log("✅ [FRONT] Resposta da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [FRONT] Erro na API de recomendações:", error);
    throw error;
  }
}

/**
 * Busca recomendações personalizadas para o usuário logado
 */
export async function fetchCustomRecommendations(params = {}) {
  try {
    console.log("🌐 [FRONT] Chamando API de recomendações com params:", params);
    const response = await api.get("/recommendations/custom", { params });
    console.log("✅ [FRONT] Resposta da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [FRONT] Erro na API de recomendações:", error);
    throw error;
  }
}

/**
 * Busca conteúdo em alta (trending)
 */
export async function fetchTrending() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/recommendations/trending`);
  if (!res.ok) throw new Error("Erro ao buscar trending");

  const result = await res.json();
  
  return result.data?.trending.slice(0, 5) || [];
}

/**
 * Busca mídias similares a uma mídia específica
 */
export async function fetchSimilarMedia(mediaId, options = {}) {
  try {
    console.log(`🔄 Buscando mídias similares para ID: ${mediaId}`);
    const response = await api.get(`/recommendations/similar/${mediaId}`, { params: options });
    console.log("✅ Resposta da API (similar):", response.data);
    return response.data.slice(0, 4) || [];
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
 * Pegar as preferências iniciais do usuário com base nas mídias selecionadas
 */
export async function buildUserInitialPreferences(selectedMediaIds = []) {
  try {
    console.log("🌐 [FRONT] Enviando mídias selecionadas para gerar preferências iniciais:", selectedMediaIds);

    const response = await api.post("/recommendations/initial-preferences", {
      selectedMediaIds
    });

    console.log("✅ [FRONT] Preferências iniciais recebidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [FRONT] Erro ao gerar preferências iniciais:", error.response?.data || error);
    return null;
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
 * As funções abaixo são para métricas e tracking de engajamento não necessárias para o funcionamento básico das recomendações
 */

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