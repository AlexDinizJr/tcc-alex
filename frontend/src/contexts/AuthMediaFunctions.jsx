export const toggleSavedMedia = (mediaItem, user, updateUser) => {
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

export const toggleFavorite = (mediaItem, user, updateUser) => {
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

export const addMediaToList = (mediaItem, listId, listName, user, updateUser) => {
  if (!user) return { success: false, error: "Usuário não autenticado" };
  
  console.log('🔄 addMediaToList - mediaItem:', mediaItem);
  console.log('🔄 addMediaToList - listId:', listId);

  const updatedUser = { ...user };
  let targetList;
  
  // Garantir que lists seja array
  if (!Array.isArray(updatedUser.lists)) {
    updatedUser.lists = [];
  }

  if (listName) {
    // Criar nova lista - armazena apenas o ID
    const newList = {
      id: Date.now(),
      name: listName,
      items: [mediaItem.id], // ← APENAS o ID
      isDefault: false,
      createdAt: new Date().toISOString(),
      description: ""
    };
    updatedUser.lists = [...updatedUser.lists, newList];
    targetList = newList;
  } else {
    // Encontrar lista existente
    targetList = updatedUser.lists.find(list => list.id === listId);
    if (!targetList) return { success: false, error: "Lista não encontrada" };
    
    // Garantir que items seja array
    if (!Array.isArray(targetList.items)) {
      targetList.items = [];
    }
    
    // VERIFICAÇÃO DE DUPLICATA - por ID
    const alreadyInList = targetList.items.includes(mediaItem.id);
    console.log('🔍 Item já está na lista:', alreadyInList, 'Item ID:', mediaItem.id);
    
    if (alreadyInList) {
      return { 
        success: false, 
        error: `"${mediaItem.title}" já está nesta lista!` 
      };
    }
    
    // Adicionar item à lista (APENAS o ID)
    targetList.items = [...targetList.items, mediaItem.id];
  }

  // Atualizar usuário
  updateUser(updatedUser);
  
  return { 
    success: true, 
    list: targetList,
    message: listName 
      ? `Lista "${listName}" criada com sucesso!` 
      : `"${mediaItem.title}" adicionado à lista!`
  };
};

export const removeMediaFromList = (mediaId, listId, user, updateUser) => {
  return new Promise((resolve, reject) => {
    if (!user) {
      reject({ success: false, error: "Usuário não autenticado" });
      return;
    }

    const updatedUser = { ...user };
    
    const targetList = updatedUser.lists.find(list => list.id === listId);
    if (!targetList) {
      reject({ success: false, error: "Lista não encontrada" });
      return;
    }

    // Remove pelo ID
    targetList.items = targetList.items.filter(id => id !== mediaId);
    
    updateUser(updatedUser);
    
    resolve({ success: true });
  });
};