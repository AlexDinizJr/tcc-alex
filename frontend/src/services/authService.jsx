import api from "./api";

export async function fetchCurrentUser() {
  try {
    const response = await api.get("/auth/profile", { withCredentials: true });
    return response.data.user || response.data;;
  } catch (err) {
    console.error("Erro ao buscar usuário logado:", err.response?.data || err);
    return null;
  }
}

export async function login({ usernameOrEmail, password }) {
  try {
    const response = await api.post("/auth/login", { usernameOrEmail, password });
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response?.data || error);
    return {};
  }
}

export async function register(newUser) {
  try {
    const response = await api.post("/auth/register", newUser);
    return { success: true, data: response.data };
  } catch (err) {
    let errorMessage = "Erro ao registrar";

    const backendError = err.response?.data?.error || err.response?.data?.message;
    
    if (backendError) {
      if (backendError.includes("Email")) errorMessage = "Este email já está cadastrado.";
      else if (backendError.includes("Username")) errorMessage = "Este username já está em uso.";
      else errorMessage = backendError;
    }

    return { success: false, error: errorMessage };
  }
}

export async function recoverPassword(email) {
  try {
    const response = await api.post("/auth/password/recovery", { email });
    return { success: true, message: response.data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || "Erro ao recuperar senha" };
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const response = await api.post("/auth/password/reset", { token, newPassword });
    return { success: true, message: response.data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || "Erro ao redefinir senha" };
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao fazer logout" };
  }
}