export const updateList = (listId, updatedData, user, updateUser) => {
  if (!user) return { success: false, error: "Usuário não autenticado" };

  const updatedUser = { ...user };
  
  // Garantir que lists seja array
  if (!Array.isArray(updatedUser.lists)) {
    updatedUser.lists = [];
  }
  
  const updatedLists = updatedUser.lists.map(list => {
    if (list.id === listId) {
      return {
        ...list,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
    }
    return list;
  });

  updatedUser.lists = updatedLists;
  updateUser(updatedUser);
  
  return { success: true };
};

export const deleteList = (listId, user, updateUser) => {
  if (!user) return { success: false, error: "Usuário não autenticado" };

  const updatedUser = { ...user };
  
  // Garantir que lists seja array
  if (!Array.isArray(updatedUser.lists)) {
    updatedUser.lists = [];
  }
  
  updatedUser.lists = updatedUser.lists.filter(list => list.id !== listId);
  updateUser(updatedUser);
  
  return { success: true };
};

// Função para criar nova lista
export const createList = (listData, user, updateUser) => {
  if (!user) return { success: false, error: "Usuário não autenticado" };

  const updatedUser = { ...user };
  
  // Garantir que lists seja array
  if (!Array.isArray(updatedUser.lists)) {
    updatedUser.lists = [];
  }

  const newList = {
    id: Date.now(),
    name: listData.name,
    description: listData.description || "",
    isPublic: listData.isPublic || false,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  updatedUser.lists = [...updatedUser.lists, newList];
  updateUser(updatedUser);
  
  return { success: true, list: newList };
};