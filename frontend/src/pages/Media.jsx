import { useState } from "react";
import { useParams } from "react-router-dom";
import { getMediaById, getMediaByType, getReviewsByMediaId } from "../utils/MediaHelpers";
import { MediaType } from "../models/MediaType";
import { addReview } from "../utils/AddReview";
import { useAuth } from "../hooks/useAuth";
import MediaGrid from "../components/MediaGrid";
import MediaHeader from "../components/media/MediaHeader";
import ReviewList from "../components/media/ReviewList";
import ReviewForm from "../components/media/ReviewForm";

export default function Media() {
  const { id } = useParams();
  const mediaItem = getMediaById(Number(id));
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState(getReviewsByMediaId(Number(id)));
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = (e) => {
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
      const addedReview = addReview(
        mediaItem.id,
        {
          rating: newReview.rating,
          comment: newReview.comment
        },
        user.id,
        user.name, 
        user.avatar
      );
      
      user.reviews = {
        ...user.reviews,
        [mediaItem.id]: addedReview.id
      };
      
      setReviews(prev => [addedReview, ...prev]);
      setNewReview({ rating: 0, comment: "" });
    alert("Avaliação enviada com sucesso!");
    } catch {
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <MediaHeader mediaItem={mediaItem} description={description} />
      
      {/* Reviews Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Avaliações dos Usuários</h2>
        
        <ReviewList reviews={reviews} />
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