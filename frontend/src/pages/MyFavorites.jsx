import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MediaPageHeader from "../components/MediaPageHeader";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import { convertMediaIdsToObjects } from "../utils/MediaHelpers";
import { mockUsers } from "../mockdata/mockUsers";
import { BackToProfile } from "../components/BackToProfile";

export default function MyFavorites() {
  const { username } = useParams(); // pega o username da URL
  const { user: loggedInUser } = useAuth();

  const isOwner = loggedInUser?.username === username;
  const user = isOwner
    ? loggedInUser
    : mockUsers.find((u) => u.username === username);

  const allFavorites = convertMediaIdsToObjects(user?.favorites || []);
  const itemsPerPage = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredAndSortedFavorites = useMemo(() => {
    let items = [...allFavorites];

    if (searchQuery.trim() !== "") {
      items = items.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "title") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "year") {
      items.sort((a, b) => b.year - a.year);
    }

    return items;
  }, [allFavorites, searchQuery, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedFavorites.length / itemsPerPage)
  );
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const favoritesToShow = filteredAndSortedFavorites.slice(startIdx, endIdx);

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
      <div className="max-w-6xl mx-auto">
        {/* Botão de voltar para o perfil */}
        <div className="mb-4">
          <BackToProfile username={username} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isOwner ? "Meus Favoritos" : `Favoritos de ${user.name}`}
          </h1>
          <p className="text-gray-600">{allFavorites.length} favoritos</p>
        </div>

        <MediaPageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={["title", "rating", "year"]}
          searchPlaceholder="Pesquisar favoritos..."
        />

        <MediaGrid
          items={favoritesToShow}
          emptyMessage={
            isOwner
              ? "Você ainda não favoritou nenhum item."
              : `${user.name} ainda não favoritou nenhum item.`
          }
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
