import { User } from "../models/UserModel";

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