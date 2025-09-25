import api from "./api";

/**
 * Busca todas as listas de um usuário
 */
export async function fetchUserLists(userId, includeItems = true) {
  try {
    const params = { includeItems }; 
    const response = await api.get(`/lists/user/${userId}`, { params });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao buscar listas do usuário");
  }
}

/**
 * Retorna uma lista específica pelo ID
 */
export async function fetchListById(listId) {
  try {
    const response = await api.get(`/lists/${listId}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lista não encontrada");
  }
}

/**
 * Cria uma nova lista para o usuário autenticado
 */
export async function createList({ name, description = "", isPublic = false }) {
  try {
    const response = await api.post("/lists", { name, description, isPublic });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao criar lista");
  }
}

/**
 * Atualiza uma lista existente
 */
export async function updateList(listId, { name, description, isPublic }) {
  try {
    const response = await api.put(`/lists/${listId}`, { name, description, isPublic });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao atualizar lista");
  }
}

/**
 * Deleta uma lista
 */
export async function deleteList(listId) {
  try {
    await api.delete(`/lists/${listId}`);
    return true;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao deletar lista");
  }
}

/**
 * Adiciona um item a uma lista
 */
export async function addItemToList(listId, mediaId) {
  try {
    const response = await api.post("/lists/items", { listId, mediaId });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao adicionar item à lista");
  }
}

/**
 * Remove um item de uma lista
 */
export async function removeItemFromList(listId, mediaId) {
  try {
    const response = await api.delete(`/lists/${listId}/items/${mediaId}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao remover item da lista");
  }
}

/**
 * Salva ou remove uma mídia da lista "salvos" do usuário
 */
export async function toggleSaveMedia(mediaId) {
  try {
    const response = await api.post("/lists/save-media", { mediaId });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao salvar mídia");
  }
}

/**
 * Marca ou desmarca uma mídia como favorita
 */
export async function toggleFavoriteMedia(mediaId) {
  try {
    const response = await api.post("/lists/favorite-media", { mediaId });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao favoritar mídia");
  }
}

/**
 * Retorna todas as mídias salvas do usuário
 */
export async function fetchUserSavedMedia(userId) {
  try {
    const response = await api.get(`/lists/user/${userId}/saved`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao buscar mídias salvas");
  }
}

/**
 * Retorna todas as mídias favoritas do usuário
 */
export async function fetchUserFavorites(userId) {
  try {
    const response = await api.get(`/lists/user/${userId}/favorites`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao buscar mídias favoritas");
  }
}