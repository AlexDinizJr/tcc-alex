import { MOCK_REVIEWS } from "../mockdata/mockReviews";
import { Review, NewReview } from "../models/ReviewModel";

// Helper para adicionar reviews no form
export const addReview = (
  mediaId: number, 
  reviewData: NewReview,
  userId: number,
  userName: string,
  userAvatar?: string
): Review => {
  if (!MOCK_REVIEWS[mediaId]) {
    // @ts-ignore
    MOCK_REVIEWS[mediaId] = [];
  }
  
  const newReview: Review = {
    ...reviewData,
    // @ts-ignore
    id: MOCK_REVIEWS[mediaId].length + 1,
    userId: userId,
    user: userName,
    avatar: userAvatar,
    date: new Date().toISOString().split('T')[0],
    helpful: 0
  };
  
  // @ts-ignore
  MOCK_REVIEWS[mediaId].unshift(newReview);
  return newReview;
};