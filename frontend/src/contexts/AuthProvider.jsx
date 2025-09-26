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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const reloadUser = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error("Erro ao recarregar usuário:", error);
      localStorage.removeItem("authToken");
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        
        if (token) {
          await reloadUser();
        } else {
          setUser(null);
        }
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
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
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
      const result = await registerService(userData);
      return result;
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
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // --- MÍDIA ---
  const toggleSavedMedia = async (mediaItem) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      await toggleSaveMediaService(mediaItem.id);
      await reloadUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (mediaItem) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      await toggleFavoriteMediaService(mediaItem.id);
      await reloadUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // --- LISTAS ---
  const createList = async (listData) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      const newList = await createListService(listData);
      await reloadUser();
      return { success: true, list: newList };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateList = async (listId, updatedData) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      const updatedList = await updateListService(listId, updatedData);
      await reloadUser();
      return { success: true, list: updatedList };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteList = async (listId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      await deleteListService(listId);
      await reloadUser();
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
        await new Promise(resolve => setTimeout(resolve, 100));
        await addItemToListService(newList.id, mediaItem.id);
        await reloadUser();
        return { success: true, newList };
      } else {
        await addItemToListService(listId, mediaItem.id);
        await reloadUser();
        return { success: true };
      }
    } catch (error) {
      console.error("Erro detalhado em addMediaToList:", error);

      // apenas sinaliza duplicação ou erro genérico
      const errorMessage = error.message || error.response?.data?.message || "unknown";

      const isDuplicate = errorMessage.includes("already exists") ||
                          errorMessage.includes("duplicate") ||
                          errorMessage.includes("already in list") ||
                          errorMessage.includes("já está");

      return { success: false, isDuplicate, originalError: errorMessage };
    }
  };

  const removeMediaFromList = async (mediaId, listId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      await removeItemFromListService(listId, mediaId);
      await reloadUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // --- REVIEWS ---
  const addOrUpdateReview = async (mediaItem, rating, comment = "") => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      const existingReview = user.reviews?.find(r => r.mediaId === mediaItem.id);
      
      if (existingReview) {
        await editReviewService(existingReview.id, { rating, comment });
      } else {
        await createReviewService({
          mediaId: mediaItem.id,
          rating,
          comment,
          title: mediaItem.title
        });
      }
      
      await reloadUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeReview = async (mediaId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      const existingReview = user.reviews?.find(r => r.mediaId === mediaId);
      if (existingReview) {
        await deleteReviewService(existingReview.id);
      }
      await reloadUser();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleHelpful = async (reviewId) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    try {
      await toggleHelpfulService(reviewId);
      await reloadUser();
      return { success: true };
    } catch (error) {
      console.error(`Erro ao marcar review ${reviewId} como útil:`, error);
      return { success: false, error: error.message || "Erro ao marcar útil" };
    }
  };

  const getUserReview = (mediaId) => {
    return user?.reviews?.find(r => r.mediaId === mediaId) || null;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
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
    reloadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };