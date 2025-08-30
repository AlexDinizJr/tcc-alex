import { useEffect, useState } from "react";
import ReviewGrid from "../components/reviews/ReviewGrid";
import { useAuth } from "../hooks/useAuth";
import { ensureArray, getReviewsByUserId } from "../utils/MediaHelpers";
import { ALL_MEDIA } from "../mockdata/mockMedia";

export default function UserReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

useEffect(() => {
    const userReviewsRaw = ensureArray(user?.reviews);
    const initialReviews = userReviewsRaw.length > 0 && user?.id
      ? userReviewsRaw 
      : user?.id ? getReviewsByUserId(user.id) : [];

    // Enriquecer as reviews
    const enrichedReviews = initialReviews.map(review => {
      const media = ALL_MEDIA.find(m => m.id === review.mediaId);
      return {
        ...review,
        user: user?.name || 'Usuário',
        avatar: user?.avatar,
        mediaTitle: media?.title || `Mídia #${review.mediaId}`,
        helpful: review.helpful || 0
      };
    });

    setReviews(enrichedReviews);
  }, [user]);

  const handleHelpfulClick = (reviewId) => {
    // Atualizar o estado das reviews
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: (review.helpful || 0) + 1 }
        : review
    );
    setReviews(updatedReviews);
    console.log('Review marcada como útil:', reviewId);
    // Aqui você atualizaria o backend
  };

  const handleEditClick = (reviewId, newComment, newRating) => {
    // Atualizar o estado das reviews
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            comment: newComment, 
            rating: newRating,
            date: new Date().toLocaleDateString('pt-BR') // Atualizar data
          }
        : review
    );
    setReviews(updatedReviews);
    console.log('Editando review:', reviewId, 'Novo comentário:', newComment, 'Nova nota:', newRating);
    // Aqui você atualizaria o backend
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ReviewGrid 
          reviews={reviews}
          title="Minhas Avaliações"
          showViewAll={false}
          emptyMessage="Você ainda não avaliou nenhum conteúdo."
          onHelpfulClick={handleHelpfulClick}
          onEditClick={handleEditClick}
        />
      </div>
    </div>
  );
}