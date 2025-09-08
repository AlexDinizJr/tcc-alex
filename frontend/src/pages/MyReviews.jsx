import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReviewGrid from "../components/reviews/ReviewGrid";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth";
import { ensureArray, getReviewsByUserId } from "../utils/MediaHelpers";
import { ALL_MEDIA } from "../mockdata/mockMedia";
import { mockUsers } from "../mockdata/mockUsers";
import { BackToProfile } from "../components/BackToProfile";

export default function MyReviews() {
  const { username } = useParams(); // pega o username da URL
  const { user: loggedInUser } = useAuth();

  const isOwner = loggedInUser?.username === username;
  const user = isOwner
    ? loggedInUser
    : mockUsers.find((u) => u.username === username);

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    if (!user) {
      setReviews([]);
      return;
    }

    const userReviewsRaw = ensureArray(user?.reviews);
    const initialReviews =
      userReviewsRaw.length > 0 && user?.id
        ? userReviewsRaw
        : user?.id
        ? getReviewsByUserId(user.id)
        : [];

    const enrichedReviews = initialReviews.map((review) => {
      const media = ALL_MEDIA.find((m) => m.id === review.mediaId);
      return {
        ...review,
        user: user?.name || "Usuário",
        avatar: user?.avatar,
        mediaTitle: media?.title || `Mídia #${review.mediaId}`,
        helpful: review.helpful || 0,
      };
    });

    setReviews(enrichedReviews);
  }, [user]);

  const handleHelpfulClick = (reviewId) => {
    setReviews((reviews) =>
      reviews.map((r) =>
        r.id === reviewId
          ? { ...r, helpful: (r.helpful || 0) + 1 }
          : r
      )
    );
  };

  const handleEditClick = (reviewId, newComment, newRating) => {
    setReviews((reviews) =>
      reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              comment: newComment,
              rating: newRating,
              date: new Date().toLocaleDateString("pt-BR"),
            }
          : r
      )
    );
  };

  const filteredAndSortedReviews = useMemo(() => {
    let list = [...reviews];

    if (searchQuery.trim() !== "") {
      list = list.filter((r) =>
        r.mediaTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "mediaTitle") {
      list.sort((a, b) => a.mediaTitle.localeCompare(b.mediaTitle));
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "helpful") {
      list.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    }

    return list;
  }, [reviews, searchQuery, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedReviews.length / itemsPerPage)
  );
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const reviewsToShow = filteredAndSortedReviews.slice(startIdx, endIdx);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Usuário não encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Botão de voltar para o perfil */}
        <div className="mb-4">
          <BackToProfile username={username} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isOwner ? "Minhas Avaliações" : `Avaliações de ${user.name}`}
          </h1>
          <p className="text-gray-600">{reviews.length} avaliações</p>
        </div>

        {/* Busca e ordenação */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full sm:w-1/2"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Ordenar por</option>
            <option value="mediaTitle">Nome</option>
            <option value="rating">Avaliação</option>
            <option value="helpful">Útil</option>
          </select>
        </div>

        <ReviewGrid
          reviews={reviewsToShow}
          showViewAll={false}
          emptyMessage={
            isOwner
              ? "Você ainda não avaliou nenhum conteúdo."
              : `${user.name} ainda não avaliou nenhum conteúdo.`
          }
          onHelpfulClick={handleHelpfulClick}
          onEditClick={handleEditClick}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
