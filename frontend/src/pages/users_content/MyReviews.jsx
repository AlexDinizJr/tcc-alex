import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReviewGrid from "../../components/reviews/ReviewGrid";
import Pagination from "../../components/Pagination";
import { useAuth } from "../../hooks/useAuth";
import { fetchReviewsByUserId } from "../../services/reviewService"; 
import { fetchMediaById } from "../../services/mediaService";
import { fetchUserByUsername } from "../../services/userService";
import { BackToProfile } from "../../components/profile/BackToProfile";
import { useToast } from "../../hooks/useToast";

export default function MyReviews() {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const isOwner = loggedInUser?.username === username;
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const itemsPerPage = 5;
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUserAndReviews() {
      try {
        let selectedUser = isOwner ? loggedInUser : null;

        if (!selectedUser && username) {
          selectedUser = await fetchUserByUsername(username);
        }

        if (!selectedUser?.id) {
          setUser(null);
          setReviews([]);
          return;
        }

        setUser(selectedUser);

        const response = await fetchReviewsByUserId(selectedUser.id);

      const enrichedReviews = await Promise.all(
        (response.reviews || []).map(async (r) => {
          console.log("Review:", r);
          if (!r.mediaId) return r;
          try {
            const media = await fetchMediaById(r.mediaId);
            console.log("Media fetched:", media);
            return { ...r, media };
          } catch (err) {
            console.error("Erro ao buscar mídia:", err);
            return { ...r, media: { title: "Mídia desconhecida" } };
          }
        })
      );

        setReviews(enrichedReviews);
      } catch (err) {
        console.error("Erro ao carregar usuário ou avaliações:", err);
        setUser(null);
        setReviews([]);
      }
    }

    loadUserAndReviews();
  }, [username, loggedInUser, isOwner]);

  const handleHelpfulClick = (reviewId) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    if (review.userId === loggedInUser?.id) {
      return showToast("Você não pode marcar sua própria avaliação como útil.", "warning");
    }

    setReviews((reviews) =>
      reviews.map((r) =>
        r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
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
        r.media?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "mediaTitle") {
      list.sort((a, b) => a.media?.title.localeCompare(b.media?.title));
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
        <div className="mb-4">
          <BackToProfile username={username} />
        </div>

        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isOwner ? "Minhas Avaliações" : `Avaliações de ${user.name}`}
          </h1>
          <p className="text-gray-400">{reviews.length} avaliações</p>
        </div>

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
            className="px-4 py-2 border rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Ordenar por</option>
            <option value="mediaTitle">Nome</option>
            <option value="rating">Avaliação</option>
            <option value="helpful">Útil</option>
          </select>
        </div>

        <ReviewGrid
          reviews={reviewsToShow}
          showUserInfo={false}        // não mostra info do usuário
          showMediaTitle={true}  
          currentUserId={loggedInUser?.id}
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