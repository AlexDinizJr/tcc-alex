import { MOCK_LISTS } from "../mockdata/mockLists";
import { ALL_MEDIA } from "../mockdata/mockMedia";

/**
 * Busca todas as listas de um usuário
 * @param {string} username
 * @returns {Promise<Array>} Lista de objetos {id, name, items: [media]}
 */
export async function fetchUserLists(username) {
  await new Promise(res => setTimeout(res, 200));

  const userLists = MOCK_LISTS.filter(list => list.username === username);

  // Preenche os itens com os dados completos da mídia
  const populatedLists = userLists.map(list => ({
    ...list,
    items: list.items.map(mediaId => ALL_MEDIA.find(m => m.id === mediaId))
  }));

  return populatedLists;
}

/**
 * Cria uma nova lista para o usuário
 * @param {string} username
 * @param {string} listName
 * @returns {Promise<Object>} A lista criada
 */
export async function createList(username, listName) {
  await new Promise(res => setTimeout(res, 200));

  const newList = {
    id: MOCK_LISTS.length + 1,
    username,
    name: listName,
    items: []
  };

  MOCK_LISTS.push(newList);
  return newList;
}

/**
 * Adiciona um item à lista
 * @param {number} listId
 * @param {number} mediaId
 * @returns {Promise<Object>} A lista atualizada
 */
export async function addItemToList(listId, mediaId) {
  await new Promise(res => setTimeout(res, 200));

  const list = MOCK_LISTS.find(l => l.id === listId);
  if (list && !list.items.includes(mediaId)) {
    list.items.push(mediaId);
  }
  return list;
}

/**
 * Remove um item da lista
 * @param {number} listId
 * @param {number} mediaId
 * @returns {Promise<Object>} A lista atualizada
 */
export async function removeItemFromList(listId, mediaId) {
  await new Promise(res => setTimeout(res, 200));

  const list = MOCK_LISTS.find(l => l.id === listId);
  if (list) {
    list.items = list.items.filter(id => id !== mediaId);
  }
  return list;
}

/**
 * Deleta uma lista do usuário
 * @param {number} listId
 * @returns {Promise<boolean>} true se deletou
 */
export async function deleteList(listId) {
  await new Promise(res => setTimeout(res, 200));

  const index = MOCK_LISTS.findIndex(l => l.id === listId);
  if (index !== -1) {
    MOCK_LISTS.splice(index, 1);
    return true;
  }
  return false;
}
