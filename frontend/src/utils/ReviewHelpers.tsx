import { User } from "../models/UserModel";

export const hasUserReviewed = (user: User, mediaId: number): boolean => {
  if (!user.reviews) return false;
  return mediaId in user.reviews;
};

export const getUserReviewId = (user: User, mediaId: number): number | null => {
  if (!user.reviews) return null;
  return user.reviews[mediaId] || null;
};