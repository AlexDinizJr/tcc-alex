import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { mockUsers } from "../mockdata/mockUsers";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há usuário no localStorage ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Garantir que a estrutura esteja completa e compatível com seus modelos
      setUser({
        ...userData,
        savedMedia: userData.savedMedia || [], // Array de IDs
        lists: userData.lists || [ // Array de IDs de listas
          { 
            id: 1, 
            name: "Favoritos", 
            items: [], // Array de IDs de mídias
            isDefault: true 
          },
          { 
            id: 2, 
            name: "Para Assistir", 
            items: [], 
            isDefault: false 
          },
          { 
            id: 3, 
            name: "Jogar Depois", 
            items: [], 
            isDefault: false 
          }
        ],
        reviews: userData.reviews || {}, // Record<number, number> - ratings apenas
        favorites: userData.favorites || [] // Array de IDs
      });
    }
    setLoading(false);
  }, []);

  // Função de login
  const login = (userData) => {
    const userWithCompleteStructure = {
      ...userData,
      bio: userData.bio || '',
      savedMedia: userData.savedMedia || [],
      lists: userData.lists || [
        { id: 1, name: "Favoritos", items: [], isDefault: true },
        { id: 2, name: "Para Assistir", items: [], isDefault: false },
        { id: 3, name: "Jogar Depois", items: [], isDefault: false },
      ],
      reviews: userData.reviews || {},
      favorites: userData.favorites || []
    };
    
    setUser(userWithCompleteStructure);
    localStorage.setItem('user', JSON.stringify(userWithCompleteStructure));
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Função de login mockado para desenvolvimento
  const mockLogin = (credentials) => {
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      // Remove a senha e garante a estrutura correta do User
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        savedMedia: user.savedMedia || [],
        lists: user.lists || [
          { id: 1, name: "Favoritos", items: [], isDefault: true },
          { id: 2, name: "Para Assistir", items: [], isDefault: false },
          { id: 3, name: "Jogar Depois", items: [], isDefault: false },
        ],
        reviews: user.reviews || {},
        favorites: user.favorites || []
      };
      
      login(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: 'Credenciais inválidas' };
    }
  };

  // Função para atualizar usuário
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Função para atualizar perfil (incluindo bio)
  const updateProfile = (profileData) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    const updatedUser = {
      ...user,
      ...profileData,
      // Garante que campos críticos não sejam removidos
      id: user.id,
      email: user.email,
      bio: user.bio
    };
    
    updateUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  // Funções para gerenciar mídia (trabalhando com IDs)
  const toggleSavedMedia = (mediaItem) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    const updatedUser = { ...user };
    const isSaved = updatedUser.savedMedia.includes(mediaItem.id);
    
    if (isSaved) {
      updatedUser.savedMedia = updatedUser.savedMedia.filter(id => id !== mediaItem.id);
    } else {
      updatedUser.savedMedia = [...updatedUser.savedMedia, mediaItem.id];
    }
    
    updateUser(updatedUser);
    return { success: true, isSaved: !isSaved };
  };

  const toggleFavorite = (mediaItem) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    const updatedUser = { ...user };
    const isFavorited = updatedUser.favorites.includes(mediaItem.id);
    
    if (isFavorited) {
      updatedUser.favorites = updatedUser.favorites.filter(id => id !== mediaItem.id);
    } else {
      updatedUser.favorites = [...updatedUser.favorites, mediaItem.id];
    }
    
    updateUser(updatedUser);
    return { success: true, isFavorited: !isFavorited };
  };

  const addMediaToList = (mediaItem, listId, listName = null) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    const updatedUser = { ...user };
    let targetList;
    
    if (listName) {
      // Criar nova lista
      const newList = {
        id: Date.now(),
        name: listName,
        items: [mediaItem.id], // Armazena apenas o ID
        isDefault: false
      };
      updatedUser.lists = [...updatedUser.lists, newList];
      targetList = newList;
    } else {
      // Adicionar à lista existente
      targetList = updatedUser.lists.find(list => list.id === listId);
      if (!targetList) return { success: false, error: "Lista não encontrada" };
      
      const alreadyInList = targetList.items.includes(mediaItem.id);
      if (!alreadyInList) {
        targetList.items = [...targetList.items, mediaItem.id]; // Armazena apenas o ID
      }
    }
    
    updateUser(updatedUser);
    return { 
      success: true, 
      list: targetList,
      isNewList: !!listName
    };
  };

  // Função para adicionar/atualizar review (usando seu modelo)
  const addOrUpdateReview = (mediaId, rating = "") => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    
    const updatedUser = { ...user };
    
    // Atualiza apenas o rating (conforme seu modelo Record<number, number>)
    updatedUser.reviews = {
      ...updatedUser.reviews,
      [mediaId]: rating
    };
    
    updateUser(updatedUser);
    return { success: true, rating };
  };

  // Função para obter rating do usuário para uma mídia
  const getUserRating = (mediaId) => {
    if (!user) return null;
    return user.reviews[mediaId] || null;
  };

  const value = { 
    user, 
    login, 
    mockLogin,
    logout, 
    updateUser,
    updateProfile,
    toggleSavedMedia,
    toggleFavorite,
    addMediaToList,
    addOrUpdateReview,
    getUserRating,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}