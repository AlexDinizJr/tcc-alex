import api from "./api";

export async function reportIssue({ mediaId, mediaTitle, issueType, description, userEmail }) {
  try {
    const response = await api.post("/reports/issue", {
      mediaId,
      mediaTitle,
      issueType,
      description,
      userEmail
    });
    return { success: true, data: response.data };
  } catch (err) {
    console.error("Erro ao reportar problema:", err.response?.data || err);
    return { success: false, error: err.response?.data?.error || "Erro ao reportar problema" };
  }
}

/**
 * Envia um pedido ou sugestão para a equipe
 * @param {Object} data - Dados do pedido
 * @param {string} data.requestType - Tipo do pedido/sugestão
 * @param {string} data.details - Detalhes do pedido
 * @param {string} [data.userEmail] - Email do usuário (opcional, se não estiver logado)
 */
export async function sendRequest({ requestType, details, userEmail }) {
  try {
    const response = await api.post("/reports/request", {
      requestType,
      details,
      userEmail
    });
    return { success: true, data: response.data };
  } catch (err) {
    console.error("Erro ao enviar pedido:", err.response?.data || err);
    return { success: false, error: err.response?.data?.error || "Erro ao enviar pedido" };
  }
}