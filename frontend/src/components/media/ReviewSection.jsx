import { useState, useEffect, useMemo } from "react";
import {
  fetchReviewsByMediaId,
  createReview,
  editReview,
  deleteReview,
  toggleHelpful
} from "../../services/reviewService";
import { useToast } from "../../hooks/useToast";

import ReviewGrid from "../reviews/ReviewGrid";
import ReviewForm from "../media/ReviewForm";

export default function ReviewSection({ mediaId, currentUser }) {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const PAGE_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetchReviewsByMediaId(mediaId);

        const reviewsData = Array.isArray(res)
          ? res
          : Array.isArray(res?.reviews)
          ? res.reviews
          : [];

        const normalized = reviewsData.map((r) => ({
          ...r,
          helpfulCount: r.helpfulCount ?? 0,
          userMarkedHelpful: currentUser ? !!r.userMarkedHelpful : false, 
          userName: r.userName ?? (r.user?.name || "Usuário"),
          avatar: r.avatar ?? (r.user?.avatar || null),
        }));

        setReviews(normalized);
      } catch (err) {
        console.error("Erro ao carregar reviews:", err);
      }
    }

    loadReviews();
  }, [mediaId, currentUser]);

  const userReview = useMemo(
    () => reviews.find((r) => currentUser && r.userId === currentUser.id),
    [reviews, currentUser]
  );

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) return showToast("Faça login para enviar uma avaliação.", "warning");
    if (userReview) return showToast("Você já avaliou esta mídia.", "warning");

    const { rating, comment } = newReview;
    if (!rating || rating <= 0) return showToast("Selecione uma nota.", "warning");
    if (!comment || !comment.trim()) return showToast("Escreva um comentário.", "warning");

    setIsSubmitting(true);
    try {
      const tempId = `temp-${Date.now()}`;
      const tempReview = {
        id: tempId,
        mediaId,
        userId: currentUser.id,
        userName: currentUser.name,
        avatar: currentUser.avatar,
        rating,
        comment,
        date: new Date().toISOString(),
        helpfulCount: 0,
        userMarkedHelpful: false,
      };

      setReviews((prev) => [tempReview, ...prev]);
      showToast("Enviando avaliação...", "info");

      const created = await createReview({ mediaId, userId: currentUser.id, rating, comment });

      setReviews((prev) =>
        prev.map((r) => (r.id === tempId ? { ...r, ...created.review } : r))
      );

      setNewReview({ rating: 0, comment: "" });
      showToast("Avaliação enviada com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      setReviews((prev) => prev.filter((r) => !String(r.id).startsWith("temp-")));
      showToast("Erro ao enviar avaliação.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (reviewId, newComment, newRating) => {
    if (!currentUser) return showToast("Faça login.", "warning");
    setIsSubmitting(true);
    try {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, comment: newComment, rating: newRating } : r
        )
      );

      const updated = await editReview(reviewId, { comment: newComment, rating: newRating });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, ...updated.review } : r))
      );
      showToast("Avaliação editada com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao editar:", err);
      showToast("Erro ao editar avaliação.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!currentUser) return showToast("Faça login.", "warning");
    try {
      setReviews((s) => s.filter((r) => r.id !== reviewId));
      await deleteReview(reviewId);
      showToast("Avaliação removida.", "success");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      showToast("Erro ao remover avaliação.", "error");
    }
  };

  const handleHelpfulToggle = async (reviewId) => {
    if (!currentUser) return showToast("Faça login para marcar como útil.", "warning");

    try {
      const result = await toggleHelpful(reviewId);

      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                helpfulCount: result.helpfulCount,
                userMarkedHelpful: result.userMarkedHelpful,
              }
            : r
        )
      );
    } catch (err) {
      console.error("Erro ao marcar útil:", err);
      showToast("Erro ao marcar como útil.", "error");
    }
  };

  const loadMore = () => setVisibleCount((c) => c + PAGE_SIZE);

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-8 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Avaliações dos Usuários</h2>

      <ReviewGrid
        reviews={reviews.slice(0, visibleCount)}
        totalReviews={reviews.length}
        showUserInfo={true}
        showMediaTitle={false}
        onHelpfulClick={handleHelpfulToggle}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        currentUserId={currentUser?.id}
        showContainer={false}
        showToast={showToast}
        onLoadMore={loadMore}
        canLoadMore={visibleCount < reviews.length}
      />

      <div className="mt-6">
        <ReviewForm
          newReview={newReview}
          isSubmitting={isSubmitting}
          onRatingChange={handleRatingChange}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  );
}