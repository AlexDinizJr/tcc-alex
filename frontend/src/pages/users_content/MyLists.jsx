import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ListCard from "../../components/lists/ListCard";
import EmptyListsState from "../../components/lists/EmptyListsState";
import Pagination from "../../components/Pagination";
import { fetchUserByUsername } from "../../services/userService";
import { fetchUserLists } from "../../services/listsService";
import { BackToProfile } from "../../components/profile/BackToProfile";

export default function MyLists() {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [allLists, setAllLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isOwner = loggedInUser?.username === username;

  // 🔹 Carregar usuário e listas
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let userData = null;
        if (isOwner) {
          userData = loggedInUser;
        } else {
          userData = await fetchUserByUsername(username);
        }

        if (!userData) throw new Error(`Usuário "${username}" não encontrado`);

        setProfileUser(userData);

        const listsResponse = await fetchUserLists(userData.id);
        const listsArray = Array.isArray(listsResponse?.lists)
          ? listsResponse.lists
          : Array.isArray(listsResponse)
          ? listsResponse
          : [];

        setAllLists(listsArray);
      } catch (err) {
        setError(err.message);
        setProfileUser(null);
        setAllLists([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) loadData();
    else {
      setError("Username não especificado na URL");
      setLoading(false);
    }
  }, [username, isOwner, loggedInUser]);

  // 🔹 Ajustar página caso total de páginas mude
  const visibleLists = allLists.filter((list) => isOwner || list.isPublic);
  const totalPages = Math.max(1, Math.ceil(visibleLists.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const listsToShow = visibleLists.slice(startIdx, startIdx + itemsPerPage);

  // 🔹 Render Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  // 🔹 Render Error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p className="text-gray-300 mb-2">{error}</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  // 🔹 Render se usuário não encontrado
  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Usuário não encontrado.</p>
      </div>
    );
  }

  // 🔹 Render principal
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <BackToProfile username={username} />
        </div>

        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isOwner ? "Minhas Listas" : `Listas de ${profileUser.name}`}
            </h1>
            <p className="text-gray-400">{visibleLists.length} listas visíveis</p>
          </div>

          {isOwner && (
            <Link
              to="/lists/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>+</span> Criar Nova Lista
            </Link>
          )}
        </div>

        {listsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listsToShow.map((list) => {
            console.log("📤 Passando lista para ListCard:", list);
            return (
              <ListCard 
                key={list.id} 
                list={list} 
                username={profileUser.username} 
                isOwner={isOwner} 
              />
            );
          })}
          </div>
        ) : (
          <EmptyListsState isOwner={isOwner} />
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </div>
  );
}