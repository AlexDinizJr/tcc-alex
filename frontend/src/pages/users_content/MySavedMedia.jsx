import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MediaGrid from "../../components/contents/MediaGrid";
import Pagination from "../../components/Pagination";
import { BackToProfile } from "../../components/profile/BackToProfile";
import { fetchUserByUsername } from "../../services/userService";
import { fetchUserSavedMedia } from "../../services/listsService";

function normalizeMediaList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.savedMedia)) return data.savedMedia;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.media)) return data.media;
  return [];
}

export default function MySavedItems() {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const isOwner = loggedInUser?.username === username;

  const [profileUser, setProfileUser] = useState(isOwner ? loggedInUser : null);
  const [savedMedia, setSavedMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;

    const loadSavedMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Buscar os dados do usuário, se não for o dono
        let userData = profileUser;
        if (!isOwner) {
          userData = await fetchUserByUsername(username);
          if (!userData) throw new Error("Usuário não encontrado");
          if (!active) return;
          setProfileUser(userData);
        } else {
          if (!profileUser && loggedInUser) setProfileUser(loggedInUser);
          userData = loggedInUser || profileUser;
        }

        if (!userData?.id) throw new Error("ID do usuário não encontrado");

        // 2) Buscar mídias salvas do backend
        const response = await fetchUserSavedMedia(userData.id);
        if (!active) return;

        const mediaList = normalizeMediaList(response);
        setSavedMedia(mediaList);
      } catch (err) {
        console.error("Erro ao buscar mídias salvas:", err);
        setError(err.message || "Erro ao buscar mídias salvas");
        setSavedMedia([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSavedMedia();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, isOwner, loggedInUser]);

  // Filtragem e ordenação
  const filteredAndSortedMedia = useMemo(() => {
    let items = [...savedMedia];

    return items;
  }, [savedMedia]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedMedia.length / itemsPerPage)
  );

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const savedMediaToShow = filteredAndSortedMedia.slice(startIdx, endIdx);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-400">
          Carregando itens salvos...
        </p>
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
        <p className="text-lg font-semibold text-gray-600">
          Usuário não encontrado.
        </p>
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
            {isOwner ? "Meus Itens Salvos" : `Itens Salvos de ${profileUser.name}`}
          </h1>
          <p className="text-gray-400">{savedMedia.length} itens salvos</p>
        </div>

        <MediaGrid
          items={savedMediaToShow}
          emptyMessage={
            isOwner
              ? "Você ainda não salvou nenhum item."
              : `${profileUser.name} ainda não salvou nenhum item.`
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
