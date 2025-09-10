import { ALL_MEDIA } from "../mockdata/mockMedia";
import { MOCK_REVIEWS } from "../mockdata/mockReviews";
import { MOCK_LISTS } from "../mockdata/mockLists";

// Converte IDs de mídia para objetos completos
export const convertMediaIdsToObjects = (mediaIds = []) => {
  return mediaIds
    .map(id => ALL_MEDIA.find(media => media.id === id))
    .filter(Boolean);
};

// Utilitário para garantir que seja sempre array
export const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return Object.values(data);
  return [];
};

// Busca lista pelo ID
export const getListById = (listId) => {
  return MOCK_LISTS.find(list => list.id === listId);
};

// Filtra listas por userId
export const getListsByUserId = (userId) => {
  return MOCK_LISTS.filter(list => list.userId === userId);
};

// Busca review pelo ID
export const getReviewById = (reviewId) => {
  return MOCK_REVIEWS.find(review => review.id === reviewId);
};

// Filtra reviews por userId
export const getReviewsByUserId = (userId) => {
  return MOCK_REVIEWS.filter(review => review.userId === userId);
};

// Filtra reviews por mediaId
export const getReviewsByMediaId = (mediaId) => {
  return MOCK_REVIEWS.filter(review => review.mediaId === mediaId);
}

// Busca mídia pelo ID
export const getMediaById = (mediaId) => {
  return ALL_MEDIA.find(media => media.id === mediaId);
};

// Filtra mídias por tipo
export const getMediaByType = (type) => {
  return ALL_MEDIA.filter(media => media.type === type);
};

export const getMediaByIds = (mediaIds = []) => {
  // @ts-ignore
  return ALL_MEDIA.filter(media => mediaIds.includes(media.id));
};