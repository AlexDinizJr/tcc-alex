import { useState, useEffect, useMemo } from "react";
import {
  fetchReviewsByMediaId,
  createReview,
  editReview,
  deleteReview,
  toggleHelpful as toggleHelpfulService
} from "../../services/reviewService";
import { fetchUserById } from "../../services/userService";
import { useToast } from "../../hooks/useToast";

import ReviewGrid from "../reviews/ReviewGrid";
import ReviewForm from "../media/ReviewForm";

export default function ReviewSection({ mediaId, currentUser }) {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🆕 Estado controlado do formulário
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  // controle de quantos carregar
  const PAGE_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE); // reset quando muda a mídia
    async function loadReviews() {
      try {
        const res = await fetchReviewsByMediaId(mediaId);
        const reviewsData = Array.isArray(res)
          ? res
          : Array.isArray(res?.reviews)
          ? res.reviews
          : [];

        const enriched = await Promise.all(
          reviewsData.map(async (r) => {
            if (r.userName && r.avatar !== undefined) return r;
            try {
              const user = await fetchUserById(r.userId);
              return { ...r, userName: user.name, avatar: user.avatar };
            } catch {
              return { ...r, userName: "Usuário", avatar: null };
            }
          })
        );

        const normalized = enriched.map((r) => ({
          ...r,
          helpfulCount: r.helpfulCount ?? r.helpful ?? 0,
          userMarkedHelpful: !!r.userMarkedHelpful,
          userName: r.userName ?? (r.user ?? "Usuário"),
        }));

        setReviews(normalized);
      } catch (err) {
        console.error("Erro ao carregar reviews:", err);
      }
    }

    loadReviews();
  }, [mediaId]);

  // verifica se o usuário já avaliou essa mídia
  const userReview = useMemo(
    () => reviews.find((r) => currentUser && r.userId === currentUser.id),
    [reviews, currentUser]
  );

  // 🆕 Handlers para rating e input
  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  // criar review
  const handleSubmitReview = async (e) => {
  e.preventDefault();

  if (!currentUser) return showToast("Faça login para enviar uma avaliação.", "warning");

  // Se já existe review do usuário, não permitir novo
  if (userReview) {
    return showToast(
      "Você já avaliou esta mídia. Tente editar sua avaliação existente.",
      "warning"
    );
  }

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

    const created = await createReview({
      mediaId,
      userId: currentUser.id,
      rating,
      comment,
    });

    setReviews((prev) =>
      prev.map((r) => (r.id === tempId ? { ...r, ...created } : r))
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

  // editar review
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
        prev.map((r) => (r.id === reviewId ? { ...r, ...updated } : r))
      );
      showToast("Avaliação editada com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao editar:", err);
      showToast("Erro ao editar avaliação.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // deletar review
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

  // toggle helpful
  const handleHelpfulToggle = async (reviewId) => {
    if (!currentUser) return showToast("Faça login para marcar como útil.", "warning");
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    if (review.userId === currentUser.id) {
    return showToast("Você não pode marcar sua própria avaliação como útil.", "warning");
    }

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              userMarkedHelpful: !r.userMarkedHelpful,
              helpfulCount: (r.helpfulCount ?? 0) + (r.userMarkedHelpful ? -1 : 1),
            }
          : r
      )
    );

    try {
      const updated = await toggleHelpfulService(reviewId);
      if (updated) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, ...updated } : r))
        );
      }
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
        showUserInfo={true}        // mostra quem fez
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