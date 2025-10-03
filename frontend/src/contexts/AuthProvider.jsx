import { useState, useEffect, createContext } from "react";
import { 
  fetchCurrentUser, 
  login as loginService, 
  logout as logoutService,
  register as registerService
} from "../services/authService";
import { 
  createList as createListService,
  updateList as updateListService,
  deleteList as deleteListService,
  addItemToList as addItemToListService,
  removeItemFromList as removeItemFromListService,
  toggleSaveMedia as toggleSaveMediaService,
  toggleFavoriteMedia as toggleFavoriteMediaService
} from "../services/listsService";
import { 
  createReview as createReviewService,
  editReview as editReviewService,
  deleteReview as deleteReviewService,
  toggleHelpful as toggleHelpfulService
} from "../services/reviewService";
import {
  updateUserProfile,
  updateUserSecurity,
  updateUserPrivacy,
  deleteUserProfile,
  uploadUserAvatar,
  uploadUserCover,
  deleteUserAvatar,
  deleteUserCover 
} from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetUser = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      if (currentUser) setUser(currentUser);
      else setUser(null);
      return currentUser;
    } catch (error) {
      console.error("Erro ao recarregar usuário:", error);
      localStorage.removeItem("authToken");
      setUser(null);
      return null;
    }
  };

  const refreshUserOnInteraction = async () => {
    if (user) {
      await fetchAndSetUser();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (token) await fetchAndSetUser();
        else setUser(null);
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
        setUser(null);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // --- AUTENTICAÇÃO ---
  const login = async ({ usernameOrEmail, password }) => {
    try {
      const result = await loginService({ usernameOrEmail, password });
      if (result?.token) {
        localStorage.setItem("authToken", result.token);
        await fetchAndSetUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      return await registerService(userData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutService();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setLoading(false);
    }
  };

  // --- PERFIL ---
  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await updateUserProfile(profileData);
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePrivacy = async (privacySettings) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    try {
      const payload = {
        profileVisibility: privacySettings.profileVisibility,
        showActivity: privacySettings.showActivity ?? true,
        showSavedItems: privacySettings.showSavedItems,
        showFavorites: privacySettings.showFavorites,
        showReviews: privacySettings.showReviews,
        showStats: privacySettings.showStats,
        dataCollection: privacySettings.dataCollection
      };

      await updateUserPrivacy(payload); // envia achatado
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      const backendError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Erro desconhecido";
      return { success: false, error: backendError };
    }
  };

  // --- EMAIL, USERNAME, SENHA ---
  const updateEmail = async (currentPassword, newEmail) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      const result = await updateUserSecurity({ currentPassword, newEmail });
      
      // 🔥 Verifica se o backend retornou sucesso
      if (result.success === false) {
        return { success: false, error: result.error };
      }
      
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      // 🔥 AGORA vai cair aqui quando a senha estiver errada
      console.error('Erro ao atualizar email:', error);
      
      // 🔥 Tratamento específico para senha incorreta
      const errorMessage = error.message || "Erro ao atualizar email";
      const isWrongPassword = errorMessage.toLowerCase().includes('senha') || 
                            errorMessage.toLowerCase().includes('password') ||
                            errorMessage.toLowerCase().includes('incorreto') ||
                            errorMessage.toLowerCase().includes('inválido') ||
                            error.statusCode === 401;

      return { 
        success: false, 
        error: isWrongPassword ? "Senha atual incorreta" : errorMessage 
      };
    }
  };

  const updateUsername = async (currentPassword, newUsername) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      const result = await updateUserSecurity({ currentPassword, newUsername });
      
      if (result.success === false) {
        return { success: false, error: result.error };
      }
      
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      console.error('Erro ao atualizar username:', error);
      
      const errorMessage = error.message || "Erro ao atualizar username";
      const isWrongPassword = errorMessage.toLowerCase().includes('senha') || 
                            errorMessage.toLowerCase().includes('password') ||
                            errorMessage.toLowerCase().includes('incorreto') ||
                            errorMessage.toLowerCase().includes('inválido') ||
                            error.statusCode === 401;

      return { 
        success: false, 
        error: isWrongPassword ? "Senha atual incorreta" : errorMessage 
      };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      const result = await updateUserSecurity({ currentPassword, newPassword });
      
      if (result.success === false) {
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      
      const errorMessage = error.message || "Erro ao atualizar senha";
      const isWrongPassword = errorMessage.toLowerCase().includes('senha') || 
                            errorMessage.toLowerCase().includes('password') ||
                            errorMessage.toLowerCase().includes('incorreto') ||
                            errorMessage.toLowerCase().includes('inválido') ||
                            error.statusCode === 401;

      return { 
        success: false, 
        error: isWrongPassword ? "Senha atual incorreta" : errorMessage 
      };
    }
  };

  // --- DELETE ACCOUNT ---

  const deleteAccount = async (password) => {
    if (!user) return;
    if (!password) throw new Error("Senha é obrigatória para deletar a conta");

    try {
      await deleteUserProfile(password); // envia a senha para o backend
      logout();
      return true;
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      throw error;
    }
  };

  // --- AVATAR E COVER ---

  const uploadAvatarFile = async (file) => {
    if (!user || !file) return { success: false };
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadUserAvatar(formData);
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      console.error("Erro ao enviar avatar:", error);
      return { success: false, error: error.message };
    }
  };

  const uploadCoverFile = async (file) => {
    if (!user || !file) return { success: false };
    try {
      const formData = new FormData();
      formData.append("cover", file);
      await uploadUserCover(formData);
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      console.error("Erro ao enviar cover:", error);
      return { success: false, error: error.message };
    }
  };

  const removeAvatar = async () => {
    if (!user) return { success: false };
    try {
      await deleteUserAvatar();
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      console.error("Erro ao remover avatar:", error);
      return { success: false, error: error.message };
    }
  };

  const removeCover = async () => {
    if (!user) return { success: false };
    try {
      await deleteUserCover();
      const refreshedUser = await fetchAndSetUser();
      return { success: true, user: refreshedUser };
    } catch (error) {
      console.error("Erro ao remover cover:", error);
      return { success: false, error: error.message };
    }
  };

  // --- MÍDIA, LISTAS, REVIEWS (mantidos com reloadUser) ---
  const toggleSavedMedia = async (mediaItem) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await toggleSaveMediaService(mediaItem.id);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (mediaItem) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await toggleFavoriteMediaService(mediaItem.id);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createList = async (listData) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await createListService(listData);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateList = async (listId, updatedData) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await updateListService(listId, updatedData);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteList = async (listId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await deleteListService(listId);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addMediaToList = async (mediaItem, listId, listName = null, isPublic = false) => {
    if (!user) return { success: false, reason: "unauthenticated" };
    try {
      if (listName) {
        const newList = await createListService({ name: listName, description: "", isPublic });
        await new Promise(r => setTimeout(r, 100));
        await addItemToListService(newList.id, mediaItem.id);
      } else {
        await addItemToListService(listId, mediaItem.id);
      }
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || "unknown";
      const isDuplicate = /already exists|duplicate|already in list|já está/i.test(errorMessage);
      return { success: false, isDuplicate, originalError: errorMessage };
    }
  };

  const removeMediaFromList = async (mediaId, listId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await removeItemFromListService(listId, mediaId);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addOrUpdateReview = async (mediaItem, rating, comment = "") => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      const existingReview = user.reviews?.find(r => r.mediaId === mediaItem.id);
      if (existingReview) {
        await editReviewService(existingReview.id, { rating, comment });
      } else {
        await createReviewService({ mediaId: mediaItem.id, rating, comment, title: mediaItem.title });
      }
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeReview = async (mediaId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      const existingReview = user.reviews?.find(r => r.mediaId === mediaId);
      if (existingReview) await deleteReviewService(existingReview.id);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleHelpful = async (reviewId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    try {
      await toggleHelpfulService(reviewId);
      await fetchAndSetUser();
      return { success: true };
    } catch (error) {
      console.error(`Erro ao marcar review ${reviewId} como útil:`, error);
      return { success: false, error: error.message || "Erro ao marcar útil" };
    }
  };

  const getUserReview = (mediaId) => user?.reviews?.find(r => r.mediaId === mediaId) || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateEmail,
        updatePassword,
        updateUsername,
        updatePrivacy,
        uploadAvatarFile,
        uploadCoverFile,
        deleteAccount,
        removeAvatar,
        removeCover,
        toggleSavedMedia,
        toggleFavorite,
        addMediaToList,
        removeMediaFromList,
        addOrUpdateReview,
        getUserReview,
        removeReview,
        toggleHelpful,
        updateList,
        deleteList,
        createList,
        reloadUser: fetchAndSetUser,
        refreshUserOnInteraction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };