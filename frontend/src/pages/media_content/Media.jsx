import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMediaById, fetchMediaByType } from "../../services/mediaService";
import { fetchUserById } from "../../services/userService";
import { MediaType } from "../../models/MediaType";
import { useAuth } from "../../hooks/useAuth";

import MediaGrid from "../../components/contents/MediaGrid";
import MediaHeader from "../../components/media/MediaHeader";
import ReviewGrid from "../../components/reviews/ReviewGrid";
import ReviewForm from "../../components/media/ReviewForm";

export default function MediaPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [mediaItem, setMediaItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [similarMedia, setSimilarMedia] = useState([]);

  // Busca o item de mídia
  useEffect(() => {
    async function loadMedia() {
      const media = await fetchMediaById(Number(id));
      setMediaItem(media);

      if (media) {
        // Carregar mídias similares
        const similar = await fetchMediaByType(media.type, { excludeId: media.id, limit: 4 });
        setSimilarMedia(similar);

        // Carregar avaliações
        if (media.reviews?.length) {
          const enrichedReviews = await Promise.all(
            media.reviews.map(async (review) => {
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
    }
    loadMedia();
  }, [id]);

  const handleEditClick = (reviewId, newComment, newRating) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, comment: newComment, rating: newRating, date: new Date().toLocaleDateString("pt-BR") }
          : r
      )
    );
  };

  const handleHelpfulClick = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
      )
    );
  };

  const handleRatingChange = (rating) => setNewReview(prev => ({ ...prev, rating }));
  const handleInputChange = (e) => setNewReview(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Faça login para enviar uma avaliação.");
    if (newReview.rating === 0 || !newReview.comment.trim()) return alert("Preencha todos os campos obrigatórios.");

    setIsSubmitting(true);
    try {
      const newReviewData = {
        id: Date.now(),
        mediaId: mediaItem.id,
        userId: user.id,
        user: user.name,
        avatar: user.avatar,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString("pt-BR"),
        helpful: 0,
      };
      setReviews(prev => [newReviewData, ...prev]);
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
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
            darkMode
          />

          <ReviewForm
            newReview={newReview}
            isSubmitting={isSubmitting}
            onRatingChange={handleRatingChange}
            onInputChange={handleInputChange}
            onSubmit={handleSubmitReview}
            darkMode
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
            <MediaGrid items={similarMedia} darkMode />
          </div>
        )}

      </div>
    </div>
  );
}
