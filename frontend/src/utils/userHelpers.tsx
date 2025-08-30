import { mockUsers } from "../mockdata/mockUsers";
import { User } from "../models/UserModel";

export const getUserById = (userId) => {
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

export const hasUserReviewed = (user: User, mediaId: number): boolean => {
  if (!user.reviews) return false;
  return mediaId in user.reviews;
};