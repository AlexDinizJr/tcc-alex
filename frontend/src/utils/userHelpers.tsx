import { mockUsers } from "../mockdata/mockUsers";
import { User } from "../models/UserModel";

// Buscar usuário por ID
export const getUserById = (userId: number) => {
  const user = mockUsers.find(user => user.id === userId);

  if (user) {
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar
    };
  }

  return {
    id: userId,
    name: 'Usuário Anônimo',
    avatar: '/default-avatar.png'
  };
};

// Buscar usuário por Username
export const getUserByUsername = (username: string) => {
  const user = mockUsers.find(u => u.username === username);

  if (user) {
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      username: user.username
    };
  }

  return {
    id: 0,
    name: 'Usuário Anônimo',
    avatar: '/default-avatar.png',
    username: 'anônimo'
  };
};

// Verificar se o usuário já avaliou
export const hasUserReviewed = (user: User, mediaId: number): boolean => {
  if (!user.reviews) return false;
  return mediaId in user.reviews;
};