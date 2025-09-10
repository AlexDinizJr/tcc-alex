import { mockUsers } from "../mockdata/mockUsers";

/**
 * Simula uma chamada de API para buscar usuário por ID
 */
export async function fetchUserById(userId) {
  await new Promise(res => setTimeout(res, 200));
  return mockUsers.find(u => u.id === userId) || null;
}

/**
 * Simula uma chamada de API para buscar usuário pelo username
 */
export async function fetchUserByUsername(username) {
  await new Promise(res => setTimeout(res, 200));
  return mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}
