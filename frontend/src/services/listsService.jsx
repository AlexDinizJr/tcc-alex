import { MOCK_LISTS } from "../mockdata/mockLists";
import { ALL_MEDIA } from "../mockdata/mockMedia";

/**
 * Busca todas as listas de um usuário
 */
export async function fetchUserLists(username) {
  await new Promise(res => setTimeout(res, 200));

  const userLists = MOCK_LISTS.filter(list => list.username === username);

  const populatedLists = userLists.map(list => ({
    ...list,
    items: list.items.map(mediaId => ALL_MEDIA.find(m => m.id === mediaId))
  }));

  return populatedLists;
}

/**
 * Cria uma nova lista para o usuário
 */
export async function createList(username, listName) {
  await new Promise(res => setTimeout(res, 200));

  if (!listName.trim()) {
    throw new Error("Nome da lista não pode estar vazio");
  }

  const newList = {
    id: MOCK_LISTS.length + 1,
    username,
    name: listName.trim(),
    items: []
  };

  MOCK_LISTS.push(newList);
  return newList;
}

/**
 * Adiciona um item à lista
 */
export async function addItemToList(listId, mediaId) {
  await new Promise(res => setTimeout(res, 200));

  const list = MOCK_LISTS.find(l => l.id === listId);
  if (!list) {
    throw new Error("Lista não encontrada");
  }

  // Verifica se a mídia existe
  const mediaExists = ALL_MEDIA.some(m => m.id === mediaId);
  if (!mediaExists) {
    throw new Error("Mídia não encontrada");
  }

  if (list.items.includes(mediaId)) {
    throw new Error("Mídia já está na lista");
  }

  list.items.push(mediaId);
  return list;
}

/**
 * Remove um item da lista
 */
export async function removeItemFromList(listId, mediaId) {
  await new Promise(res => setTimeout(res, 200));

  const list = MOCK_LISTS.find(l => l.id === listId);
  if (!list) {
    throw new Error("Lista não encontrada");
  }

  const initialLength = list.items.length;
  list.items = list.items.filter(id => id !== mediaId);

  if (list.items.length === initialLength) {
    throw new Error("Mídia não encontrada na lista");
  }

  return list;
}

/**
 * Deleta uma lista do usuário
 */
export async function deleteList(listId) {
  await new Promise(res => setTimeout(res, 200));

  const index = MOCK_LISTS.findIndex(l => l.id === listId);
  if (index === -1) {
    throw new Error("Lista não encontrada");
  }

  MOCK_LISTS.splice(index, 1);
  return true;
}