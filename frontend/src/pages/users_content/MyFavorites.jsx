import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MediaCarousel from "../../components/MediaCarousel";
import Pagination from "../../components/Pagination";
import { BackToProfile } from "../../components/profile/BackToProfile";
import { fetchUserByUsername } from "../../services/userService";
import { fetchUserFavorites } from "../../services/listsService";

function normalizeMediaList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.favorites)) return data.favorites;
  if (Array.isArray(data.savedMedia)) return data.savedMedia;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.media)) return data.media;
  return [];
}

export default function MyFavorites() {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const isOwner = loggedInUser?.username === username;

  const [profileUser, setProfileUser] = useState(isOwner ? loggedInUser : null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Obter o objeto de usuário (profileUser) se não for dono com dados já disponíveis.
        let userData = profileUser;
        if (!isOwner) {
          userData = await fetchUserByUsername(username);
          if (!userData) {
            throw new Error("Usuário não encontrado");
          }
          if (!active) return;
          setProfileUser(userData);
        } else {
          // caso seja owner, garantimos que profileUser esteja sincronizado com loggedInUser
          if (!profileUser && loggedInUser) setProfileUser(loggedInUser);
          userData = loggedInUser || profileUser;
        }

        const userId = userData?.id;
        if (!userId) {
          throw new Error("ID do usuário não disponível");
        }

        // 2) Buscar favoritos da rota específica (usa seu service)
        const favResp = await fetchUserFavorites(userId);
        if (!active) return;

        const favs = normalizeMediaList(favResp);
        setFavorites(favs);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
        setError(err.message || "Erro ao carregar favoritos");
        setFavorites([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, isOwner, loggedInUser]);

  // filtering / sorting
  const filteredAndSortedFavorites = useMemo(() => {
    let items = [...favorites];

    return items;
  }, [favorites]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedFavorites.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const favoritesToShow = filteredAndSortedFavorites.slice(startIdx, endIdx);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-400">Carregando favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-700 rounded-2xl p-6 text-center">
          <h3 className="text-white font-medium text-lg mb-2">Erro</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BackToProfile username={username} />
        </div>

        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isOwner ? "Meus Favoritos" : `Favoritos de ${profileUser.name}`}
          </h1>
          <p className="text-gray-400">{favorites.length} favoritos</p>
        </div>

        <MediaCarousel
          items={favoritesToShow}
          emptyMessage={
            isOwner
              ? "Você ainda não favoritou nenhum item."
              : `${profileUser.name} ainda não favoritou nenhum item.`
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