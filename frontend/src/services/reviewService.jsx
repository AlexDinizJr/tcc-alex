import api from "./api";
import { fetchMediaById } from "./mediaService";

/**
 * Busca todas as reviews de uma mídia
 */
export async function fetchReviewsByMediaId(mediaId) {
  try {
    const response = await api.get(`/reviews/media/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar reviews da mídia ${mediaId}:`, error.response?.data || error);
    return [];
  }
}

/**
 * Busca todas as reviews de um usuário e adiciona o título da mídia
 */
export async function fetchReviewsByUserId(userId) {
  try {
    const response = await api.get(`/reviews/user/${userId}`);
    const reviews = response.data.reviews || [];

    // Enriquecer cada review com o título da mídia
    const reviewsWithMedia = await Promise.all(
      reviews.map(async (review) => {
        let mediaTitle = "";
        try {
          const media = await fetchMediaById(review.mediaId);
          mediaTitle = media.title;
        } catch (err) {
          console.error(`Erro ao buscar mídia ${review.mediaId}:`, err);
        }
        return { ...review, mediaTitle };
      })
    );

    return {
      reviews: reviewsWithMedia,
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    console.error(`Erro ao buscar reviews do usuário ${userId}:`, error.response?.data || error);
    return { reviews: [], pagination: {} };
  }
}

/**
 * Cria uma nova review
 */
export async function createReview(reviewData) {
  try {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar review:", error.response?.data || error);
    return null;
  }
}

/**
 * Atualiza uma review existente
 */
export async function editReview(reviewId, updatedData) {
  try {
    const response = await api.put(`/reviews/${reviewId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar review ${reviewId}:`, error.response?.data || error);
    return null;
  }
}

/**
 * Deleta uma review
 */
export async function deleteReview(reviewId) {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar review ${reviewId}:`, error.response?.data || error);
    return null;
  }
}

/**
 * Marca ou desmarca review como útil
 */
export async function toggleHelpful(reviewId) {
  try {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao marcar review ${reviewId} como útil:`, error.response?.data || error);
    return null;
  }
}
