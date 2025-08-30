import { ALL_MEDIA } from "../mockdata/mockMedia";
import { MOCK_REVIEWS } from "../mockdata/mockReviews";
import { MediaType } from "../models/MediaType";
import { Review } from "../models/ReviewModel";

export const getMediaByType = (type: MediaType) => {
  return ALL_MEDIA.filter(item => item.type === type);
};

export const getMediaById = (id: number) => {
  return ALL_MEDIA.find(item => item.id === id);
}

export const getReviewsByMediaId = (mediaId: number): Review[] => {
  return MOCK_REVIEWS[mediaId] || [];
};