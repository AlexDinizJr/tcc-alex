// contexts/AuthProvider.js
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { mockUsers } from "../mockdata/mockUsers";
import { 
  initializeUser, 
  ensureUserDataCompleteness
} from "./AuthCore";
import { 
  loginUser, 
  mockLoginUser, 
  logoutUser 
} from "./AuthFunctions";
import { 
  toggleSavedMedia, 
  toggleFavorite, 
  addMediaToList,
  removeMediaFromList 
} from "./AuthMediaFunctions";
import { 
  addOrUpdateReview, 
  getUserReview, 
  removeReview 
} from "./AuthReviewFunctions";
import { 
  updateList, 
  deleteList, 
  createList 
} from "./AuthListFunctions";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para atualizar usuário
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Função para atualizar perfil
  const updateProfile = (profileData) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    const updatedUser = {
      ...user,
      ...profileData,
      id: user.id,
      email: user.email
    };
    
    updateUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  // Effect de inicialização - CORRIGIDO
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const updatedUser = initializeUser(storedUser, mockUsers);
      
      ensureUserDataCompleteness(updatedUser);
      
      setUser(updatedUser);
    } else {
      const newUser = initializeUser(null, mockUsers);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    setLoading(false);
  }, []);

  // Funções de autenticação
  const login = (userData) => loginUser(userData, setUser);
  const mockLogin = (credentials) => mockLoginUser(credentials, mockUsers, login);
  const logout = () => logoutUser(setUser);

  // Funções de mídia
  const handleToggleSavedMedia = (mediaItem) => 
    toggleSavedMedia(mediaItem, user, updateUser);
  
  const handleToggleFavorite = (mediaItem) => 
    toggleFavorite(mediaItem, user, updateUser);
  
  const handleAddMediaToList = (mediaItem, listId, listName = null) => 
    addMediaToList(mediaItem, listId, listName, user, updateUser);

  const handleRemoveMediaFromList = (mediaId, listId) => 
    removeMediaFromList(mediaId, listId, user, updateUser);

  // Funções de reviews
  const handleAddOrUpdateReview = (mediaItem, rating, comment = "") => 
    addOrUpdateReview(mediaItem, rating, comment, user, updateUser);
  
  const handleGetUserReview = (mediaId) => getUserReview(mediaId, user);
  
  const handleRemoveReview = (mediaId) => removeReview(mediaId, user, updateUser);

  // Funções de listas
  const handleUpdateList = (listId, updatedData) => 
    updateList(listId, updatedData, user, updateUser);

  const handleDeleteList = (listId) => 
    deleteList(listId, user, updateUser);

  const handleCreateList = (listData) => 
    createList(listData, user, updateUser);


  // Context value
  const value = { 
    user, 
    login, 
    mockLogin,
    logout, 
    updateUser,
    updateProfile,
    toggleSavedMedia: handleToggleSavedMedia,
    toggleFavorite: handleToggleFavorite,
    addMediaToList: handleAddMediaToList,
    removeMediaFromList : handleRemoveMediaFromList,
    addOrUpdateReview: handleAddOrUpdateReview,
    getUserReview: handleGetUserReview,
    removeReview: handleRemoveReview,
    updateList: handleUpdateList,
    deleteList: handleDeleteList,
    createList: handleCreateList,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}