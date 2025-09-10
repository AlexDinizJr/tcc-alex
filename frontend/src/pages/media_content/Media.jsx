import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMediaById, fetchMediaByType } from "../../services/mediaService";
import { fetchUserById } from "../../services/userService";
import { fetchReviewsByMediaId, createReview, editReview, incrementHelpful } from "../../services/reviewService";
import { MediaType } from "../../models/MediaType";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

import MediaGrid from "../../components/contents/MediaGrid";
import MediaHeader from "../../components/media/MediaHeader";
import ReviewGrid from "../../components/reviews/ReviewGrid";
import ReviewForm from "../../components/media/ReviewForm";

export default function MediaPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [mediaItem, setMediaItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [similarMedia, setSimilarMedia] = useState([]);

  // Carrega mídia, similares e reviews
  useEffect(() => {
    async function loadMedia() {
      const media = await fetchMediaById(Number(id));
      setMediaItem(media);

      if (media) {
        const similar = await fetchMediaByType(media.type, { excludeId: media.id, limit: 4 });
        setSimilarMedia(similar);

        const reviewsData = await fetchReviewsByMediaId(media.id);
        const enrichedReviews = await Promise.all(
          reviewsData.map(async (review) => {
            const userData = await fetchUserById(review.userId);
            return {
              ...review,
              user: userData.name,
              avatar: userData.avatar,
            };
          })
        );
        setReviews(enrichedReviews);
      }
    }

    loadMedia();
  }, [id]);

  // Handlers para reviews
  const handleEditClick = async (reviewId, newComment, newRating) => {
    const updatedReview = await editReview(reviewId, newComment, newRating);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, ...updatedReview } : r))
    );
    showToast("Avaliação editada com sucesso!", "success");
  };

  const handleHelpfulClick = async (reviewId) => {
    const updatedReview = await incrementHelpful(reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, ...updatedReview } : r))
    );
  };

  const handleRatingChange = (rating) => setNewReview(prev => ({ ...prev, rating }));
  const handleInputChange = (e) => setNewReview(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return showToast("Faça login para enviar uma avaliação.", "warning");
    if (newReview.rating === 0 || !newReview.comment.trim()) 
      return showToast("Preencha todos os campos obrigatórios.", "warning");

    setIsSubmitting(true);
    try {
      const newReviewData = {
        id: Date.now(),
        mediaId: mediaItem.id,
        userId: user.id,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString("pt-BR"),
        helpful: 0,
      };

      const createdReview = await createReview(newReviewData);

      setReviews(prev => [
        {
          ...createdReview,
          user: user.name,
          avatar: user.avatar,
        },
        ...prev,
      ]);

      setNewReview({ rating: 0, comment: "" });
      showToast("Avaliação enviada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      showToast("Erro ao enviar avaliação.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mediaItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Mídia não encontrada</h1>
        <p className="text-gray-400 text-lg">O item solicitado não existe em nossa base de dados.</p>
      </div>
    );
  }

  const description = mediaItem.description || "Descrição detalhada não disponível.";

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <MediaHeader mediaItem={mediaItem} description={description} />

        {/* Reviews */}
        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Avaliações dos Usuários</h2>

          <ReviewGrid
            reviews={reviews}
            title=""
            showViewAll={false}
            emptyMessage="Seja o primeiro a avaliar este conteúdo!"
            onHelpfulClick={handleHelpfulClick}
            onEditClick={handleEditClick}
            showContainer={false}
            currentUserId={user?.id}
          />

          <ReviewForm
            newReview={newReview}
            isSubmitting={isSubmitting}
            onRatingChange={handleRatingChange}
            onInputChange={handleInputChange}
            onSubmit={handleSubmitReview}
          />
        </div>

        {/* Similar Media */}
        {similarMedia.length > 0 && (
          <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {mediaItem.type === MediaType.MOVIE ? "Filmes" :
               mediaItem.type === MediaType.GAME ? "Jogos" :
               mediaItem.type === MediaType.BOOK ? "Livros" :
               mediaItem.type === MediaType.SERIES ? "Séries" :
               mediaItem.type === MediaType.MUSIC ? "Álbuns" : "Mídias"} Similares
            </h2>
            <MediaGrid items={similarMedia} />
          </div>
        )}

      </div>
    </div>
  );
}
