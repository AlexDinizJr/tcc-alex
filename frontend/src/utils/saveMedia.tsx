import { User } from "../models/UserModel";

// ----------- Salvar para depois -----------

export const saveMediaForUser = (user: User, mediaId: number): User => {
  const updatedUser = { ...user };
  
  if (!updatedUser.savedMedia) {
    updatedUser.savedMedia = [];
  }
  
  if (!updatedUser.savedMedia.includes(mediaId)) {
    updatedUser.savedMedia.push(mediaId);
  }
  
  return updatedUser;
};

export const unsaveMediaForUser = (user: User, mediaId: number): User => {
  const updatedUser = { ...user };
  
  if (updatedUser.savedMedia) {
    updatedUser.savedMedia = updatedUser.savedMedia.filter(id => id !== mediaId);
  }
  
  return updatedUser;
};

export const isMediaSaved = (user: User, mediaId: number): boolean => {
  return user.savedMedia?.includes(mediaId) || false;
};

// ----------- Favoritos -----------

export const addMediaToFavorites = (user: User, mediaId: number): User => {
  const updatedUser = { ...user };
  
  if (!updatedUser.favorites) {
    updatedUser.favorites = [];
  }
  
  if (!updatedUser.favorites.includes(mediaId)) {
    updatedUser.favorites.push(mediaId);
  }
  
  return updatedUser;
};

export const removeMediaFromFavorites = (user: User, mediaId: number): User => {
  const updatedUser = { ...user };
  
  if (updatedUser.favorites) {
    updatedUser.favorites = updatedUser.favorites.filter(id => id !== mediaId);
  }
  
  return updatedUser;
};

export const isMediaFavorited = (user: User, mediaId: number): boolean => {
  return user.favorites?.includes(mediaId) || false;
};
