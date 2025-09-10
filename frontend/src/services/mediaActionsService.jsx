import { mockUsers } from "../mockdata/mockUsers";
import { MOCK_LISTS } from "../mockdata/mockLists";
import { ALL_MEDIA } from "../mockdata/mockMedia";

/**
 * Alterna o estado de salvamento de uma mídia para o usuário
 * @param {number} userId 
 * @param {number} mediaId 
 * @returns {Promise<Object>} { success: boolean, isSaved: boolean, error?: string }
 */
export async function toggleSavedMedia(userId, mediaId) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado" };
  
  const isCurrentlySaved = user.savedMedia?.includes(mediaId) || false;
  
  if (isCurrentlySaved) {
    user.savedMedia = user.savedMedia.filter(id => id !== mediaId);
  } else {
    user.savedMedia = [...(user.savedMedia || []), mediaId];
  }
  
  return { success: true, isSaved: !isCurrentlySaved };
}

/**
 * Alterna o estado de favorito de uma mídia para o usuário
 * @param {number} userId 
 * @param {number} mediaId 
 * @returns {Promise<Object>} { success: boolean, isFavorited: boolean, error?: string }
 */
export async function toggleFavorite(userId, mediaId) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado" };
  
  const isCurrentlyFavorited = user.favorites?.includes(mediaId) || false;
  
  if (isCurrentlyFavorited) {
    user.favorites = user.favorites.filter(id => id !== mediaId);
  } else {
    user.favorites = [...(user.favorites || []), mediaId];
  }
  
  return { success: true, isFavorited: !isCurrentlyFavorited };
}

/**
 * Adiciona uma mídia à lista do usuário
 * @param {number} userId 
 * @param {number} mediaId 
 * @param {number} listId 
 * @param {string} listName 
 * @returns {Promise<Object>} { success: boolean, list: Object, error?: string }
 */
export async function addMediaToList(userId, mediaId, listId, listName = null) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado" };
  
  // Verifica se a mídia existe
  const media = ALL_MEDIA.find(m => m.id === mediaId);
  if (!media) return { success: false, error: "Mídia não encontrada" };
  
  if (listName) {
    // Criar nova lista
    const newList = {
      id: MOCK_LISTS.length + 1,
      username: user.username,
      name: listName,
      items: [mediaId]
    };
    
    MOCK_LISTS.push(newList);
    
    // Atualiza o usuário com a nova lista
    if (!user.lists) user.lists = [];
    user.lists.push(newList.id);
    
    return { success: true, list: newList };
  }
  
  // Adicionar à lista existente
  const list = MOCK_LISTS.find(l => l.id === listId);
  if (!list) return { success: false, error: "Lista não encontrada" };
  
  if (list.username !== user.username) {
    return { success: false, error: "Lista não pertence ao usuário" };
  }
  
  if (list.items.includes(mediaId)) {
    return { success: false, error: "Mídia já está na lista" };
  }
  
  list.items.push(mediaId);
  return { success: true, list };
}

/**
 * Remove uma mídia da lista do usuário
 * @param {number} userId 
 * @param {number} listId 
 * @param {number} mediaId 
 * @returns {Promise<Object>} { success: boolean, error?: string }
 */
export async function removeMediaFromList(userId, listId, mediaId) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado" };
  
  const list = MOCK_LISTS.find(l => l.id === listId);
  if (!list) return { success: false, error: "Lista não encontrada" };
  
  if (list.username !== user.username) {
    return { success: false, error: "Lista não pertence ao usuário" };
  }
  
  const initialLength = list.items.length;
  list.items = list.items.filter(id => id !== mediaId);
  
  if (list.items.length === initialLength) {
    return { success: false, error: "Mídia não encontrada na lista" };
  }
  
  return { success: true };
}

/**
 * Verifica se o usuário salvou uma mídia
 * @param {number} userId 
 * @param {number} mediaId 
 * @returns {Promise<boolean>}
 */
export async function isMediaSaved(userId, mediaId) {
  await new Promise(res => setTimeout(res, 100));
  
  const user = mockUsers.find(u => u.id === userId);
  return user?.savedMedia?.includes(mediaId) || false;
}

/**
 * Verifica se o usuário favoritou uma mídia
 * @param {number} userId 
 * @param {number} mediaId 
 * @returns {Promise<boolean>}
 */
export async function isMediaFavorited(userId, mediaId) {
  await new Promise(res => setTimeout(res, 100));
  
  const user = mockUsers.find(u => u.id === userId);
  return user?.favorites?.includes(mediaId) || false;
}