import { MOCK_REVIEWS } from "../mockdata/mockReviews";

/**
 * Busca todas as reviews de uma mídia
 */
export async function fetchReviewsByMediaId(mediaId) {
  await new Promise(res => setTimeout(res, 200));
  return MOCK_REVIEWS.filter(r => r.mediaId === mediaId);
}

/**
 * Cria uma nova review
 */
export async function createReview(reviewData) {
  await new Promise(res => setTimeout(res, 200));
  MOCK_REVIEWS.push(reviewData); // Simula persistência
  return reviewData;
}

/**
 * Edita uma review existente
 */
export async function editReview(reviewId, newComment, newRating) {
  await new Promise(res => setTimeout(res, 200));
  const review = MOCK_REVIEWS.find(r => r.id === reviewId);
  if (review) {
    review.comment = newComment;
    review.rating = newRating;
    review.date = new Date().toLocaleDateString("pt-BR");
  }
  return review;
}

/**
 * Marca review como útil
 */
export async function incrementHelpful(reviewId) {
  await new Promise(res => setTimeout(res, 200));
  const review = MOCK_REVIEWS.find(r => r.id === reviewId);
  if (review) {
    review.helpful = (review.helpful || 0) + 1;
  }
  return review;
}
