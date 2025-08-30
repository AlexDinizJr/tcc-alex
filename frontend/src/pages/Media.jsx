import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMediaById, getMediaByType } from "../utils/MediaHelpers";
import { MediaType } from "../models/MediaType";
import { useAuth } from "../hooks/useAuth";
import MediaGrid from "../components/MediaGrid";
import MediaHeader from "../components/media/MediaHeader";
import ReviewGrid from "../components/reviews/ReviewGrid";
import ReviewForm from "../components/media/ReviewForm";
import { getReviewsByMediaId } from "../utils/MediaHelpers";
import { getUserById } from "../utils/userHelpers";

export default function Media() {
  const { id } = useParams();
  const mediaItem = getMediaById(Number(id));
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mediaItem) {
      const mediaReviews = getReviewsByMediaId(mediaItem.id);
      
      const enrichedReviews = mediaReviews.map(review => {
        const userData = getUserById(review.userId);
        return {
          ...review,
          user: userData.name,
          avatar: userData.avatar,
          userId: review.userId
        };
      });
      
      setReviews(enrichedReviews);
    }
  }, [mediaItem]);

  // Função para lidar com edição de reviews
  const handleEditClick = (reviewId, newComment, newRating) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            comment: newComment, 
            rating: newRating,
            date: new Date().toLocaleDateString('pt-BR')
          }
        : review
    );
    setReviews(updatedReviews);
    console.log('Review editada:', reviewId, 'Novo comentário:', newComment, 'Nova nota:', newRating);
    
    // Aqui você faria a chamada para a API para atualizar a review
    // updateReview(reviewId, newComment, newRating);
  };

  const handleHelpfulClick = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: (review.helpful || 0) + 1 }
        : review
    );
    setReviews(updatedReviews);
    console.log('Review marcada como útil:', reviewId);
  };

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Por favor, faça login para enviar uma avaliação.");
      return;
    }
    
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

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
        date: new Date().toLocaleDateString('pt-BR'),
        helpful: 0,
        mediaTitle: mediaItem.title
      };

      setReviews(prev => [newReviewData, ...prev]);
      setNewReview({ rating: 0, comment: "" });
      alert("Avaliação enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mediaItem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mídia não encontrada</h1>
        <p className="text-gray-600 text-lg">O item solicitado não existe em nossa base de dados.</p>
      </div>
    );
  }

  const similarMedia = getMediaByType(mediaItem.type).filter(item => item.id !== Number(id)).slice(0, 4);
  const description = mediaItem.description || "Descrição detalhada não disponível.";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <MediaHeader mediaItem={mediaItem} description={description} />
      
      {/* Reviews Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Avaliações dos Usuários</h2>
        
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
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {mediaItem.type === MediaType.MOVIE ? 'Filmes' : 
             mediaItem.type === MediaType.GAME ? 'Jogos' :
             mediaItem.type === MediaType.BOOK ? 'Livros' :
             mediaItem.type === MediaType.SERIES ? 'Séries' : 
             mediaItem.type === MediaType.MUSIC ? 'Álbuns' : 'Mídias'} Similares
          </h2>
          <MediaGrid items={similarMedia} />
        </div>
      )}
    </div>
  );
}