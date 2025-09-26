import api from "./api";

/**
 * Busca todos os usuários com paginação e busca
 */
export async function fetchUsers({ page = 1, limit = 20, search = "" } = {}) {
  try {
    const response = await api.get("/users", { params: { page, limit, search } });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error.response?.data || error);
    return [];
  }
}

/**
 * Busca usuário por ID
 */
export async function fetchUserById(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário ${userId}:`, error.response?.data || error);
    return null;
  }
}

/**
 * Busca usuário por username
 */
export async function fetchUserByUsername(username) {
  try {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário ${username}:`, error.response?.data || error);
    return null;
  }
}

/**
 * Atualiza perfil básico do usuário autenticado
 */
export async function updateUserProfile(data) {
  try {
    const response = await api.put("/users/profile", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error.response?.data || error);
    return null;
  }
}

/**
 * Atualiza perfil sensível (senha, email, username) do usuário autenticado
 */
export async function updateUserSecurity(data) {
  try {
    const response = await api.put("/users/profile/security", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil sensível:", error.response?.data || error);
    return null;
  }
}

/**
 * Upload de avatar
 */
export async function uploadUserAvatar(formData) {
  try {
    const response = await api.post("/users/avatar/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.user;
  } catch (error) {
    console.error("Erro ao fazer upload do avatar:", error.response?.data || error);
    return null;
  }
}

/**
 * Upload de cover
 */
export async function uploadUserCover(formData) {
  try {
    const response = await api.post("/users/cover/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.user;
  } catch (error) {
    console.error("Erro ao fazer upload da cover:", error.response?.data || error);
    return null;
  }
}

/**
 * Remove avatar
 */
export async function deleteUserAvatar() {
  try {
    const response = await api.delete("/users/avatar");
    return response.data;
  } catch (error) {
    console.error("Erro ao remover avatar:", error.response?.data || error);
    return null;
  }
}

/**
 * Remove cover
 */
export async function deleteUserCover() {
  try {
    const response = await api.delete("/users/cover");
    return response.data;
  } catch (error) {
    console.error("Erro ao remover cover:", error.response?.data || error);
    return null;
  }
}