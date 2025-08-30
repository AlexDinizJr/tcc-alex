import { mockUsers } from "../mockdata/mockUsers";
import { User } from "../models/UserModel";

// Função para buscar usuário pelo email (simulando login)
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Função para buscar usuário pelo ID
export const findUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const findUserByName = (name: string): User | undefined => {
  return mockUsers.find(user => user.name === name);
};

// Função para obter o usuário atualmente logado (mock)
export const getCurrentUser = (): User | null => {
  // Simula um usuário logado - na prática, isso viria do contexto/auth
  // Por enquanto retorna o primeiro usuário como mock
  return mockUsers[0] || null;
};