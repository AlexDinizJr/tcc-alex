import { MOCK_USERS } from "../mockdata/mockUsers";
import { createList, addItemToList } from "./listService";

/**
 * Alterna o estado de salvamento de uma mídia para o usuário
 */
export async function toggleSavedMedia(userId, mediaId) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = MOCK_USERS.find(u => u.id === userId);
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
 */
export async function toggleFavorite(userId, mediaId) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = MOCK_USERS.find(u => u.id === userId);
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
 * Adiciona uma mídia à lista do usuário (usando listsService)
 */
export async function addMediaToList(userId, mediaId, listId, listName = null) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado" };
  
  try {
    if (listName) {
      // Criar nova lista usando listsService (listId é ignorado quando listName é fornecido)
      const newList = await createList(user.username, listName);
      
      // Adicionar item à nova lista
      const updatedList = await addItemToList(newList.id, mediaId);
      
      // Atualizar usuário com a nova lista
      if (!user.lists) user.lists = [];
      user.lists.push(newList.id);
      
      return { success: true, list: updatedList };
    } else if (listId) {
      // Adicionar à lista existente usando listsService
      const updatedList = await addItemToList(listId, mediaId);
      
      // Verificar se a lista pertence ao usuário
      if (updatedList.username !== user.username) {
        return { success: false, error: "Lista não pertence ao usuário" };
      }
      
      return { success: true, list: updatedList };
    } else {
      return { success: false, error: "Nenhuma lista selecionada" };
    }
  } catch (error) {
    return { success: false, error: error.message || "Erro ao adicionar à lista" };
  }
}

/**
 * Remove uma mídia da lista do usuário
 */
export async function removeMediaFromList(userId) {
  await new Promise(res => setTimeout(res, 200));
  
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado" };
  
  // Nota: Você precisaria criar removeItemFromList no listsService
  // Por enquanto retornamos um mock
  return { success: true, message: "Item removido da lista" };
}

/**
 * Verifica se o usuário salvou uma mídia
 */
export async function isMediaSaved(userId, mediaId) {
  await new Promise(res => setTimeout(res, 100));
  
  const user = MOCK_USERS.find(u => u.id === userId);
  return user?.savedMedia?.includes(mediaId) || false;
}

/**
 * Verifica se o usuário favoritou uma mídia
 */
export async function isMediaFavorited(userId, mediaId) {
  await new Promise(res => setTimeout(res, 100));
  
  const user = MOCK_USERS.find(u => u.id === userId);
  return user?.favorites?.includes(mediaId) || false;
}