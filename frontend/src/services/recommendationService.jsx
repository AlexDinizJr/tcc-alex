import api from "./api";

/**
 * Busca recomendações para o usuário logado
 */
/**
 * Busca recomendações para o usuário logado
 */
export async function fetchUserRecommendations(params = {}) {
  try {
    console.log("🌐 [FRONT] Chamando API de recomendações com params:", params);
    const response = await api.get("/recommendations", { params });
    console.log("✅ [FRONT] Resposta da API:", response.data);
    return response.data?.data || []; // retorna só o array de recomendações
  } catch (error) {
    console.error("❌ [FRONT] Erro na API de recomendações:", error);
    return []; // fallback
  }
}

/**
 * Busca recomendações personalizadas (com filtros)
 */
export async function fetchCustomRecommendations(params = {}) {
  try {
    const response = await api.get("/recommendations/custom", { params });
    return response.data?.data.slice(0, 4) || [];
  } catch (error) {
    console.error("❌ [FRONT] Erro na API de recomendações:", error);
    return [];
  }
}
/**
 * Busca conteúdo em alta (trending)
 */
export async function fetchTrending(limit = 15) {
  try {
    const response = await api.get("/recommendations/trending", {
      params: { limit: parseInt(limit) },
    });
    return response.data; // { success, data, count }
  } catch (error) {
    console.error("❌ [FRONT] Erro em fetchTrending:", error);
    throw error;
  }
}

/**
 * Busca mídias similares a uma mídia específica
 */
export async function fetchSimilarMedia(mediaId, options = {}) {
  try {
    console.log(`🔄 Buscando mídias similares para ID: ${mediaId}`);
    const response = await api.get(`/recommendations/similar/${mediaId}`, { params: options });
    console.log("✅ Resposta da API (similar):", response.data);

    const similarArray = Array.isArray(response.data?.data?.similarMedia)
      ? response.data.data.similarMedia
      : [];

    return similarArray;
  } catch (error) {
    console.error(`❌ Erro ao buscar mídias similares para ${mediaId}:`, error);
    return [];
  }
}

/**
 * Preferências iniciais (onboarding)
 */
export async function buildUserInitialPreferences(selectedMediaIds = []) {
  try {
    if (!Array.isArray(selectedMediaIds) || selectedMediaIds.length === 0) {
      throw new Error("❌ selectedMediaIds deve ser um array não vazio");
    }

    const response = await api.post("/recommendations/initial-preferences", {
      selectedMediaIds,
    });

    return response.data; // { success, data }
  } catch (error) {
    console.error("❌ [FRONT] Erro em buildUserInitialPreferences:", error);
    throw error;
  }
}

/**
 * Excluir mídia das recomendações
 */
export async function excludeFromRecommendations(mediaId, body = {}) {
  try {
    if (!mediaId || isNaN(parseInt(mediaId))) {
      throw new Error("❌ mediaId inválido para exclusão");
    }

    const response = await api.post(`/recommendations/exclude/${mediaId}`, body);
    return response.data; // { success, message, data }
  } catch (error) {
    console.error(`❌ [FRONT] Erro em excludeFromRecommendations(${mediaId}):`, error);
    throw error;
  }
}