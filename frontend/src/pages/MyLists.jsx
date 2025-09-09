import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListCard from "../components/lists/ListCard";
import EmptyListsState from "../components/lists/EmptyListsState";
import { ensureArray, getListsByUserId } from "../utils/MediaHelpers";
import Pagination from "../components/Pagination";
import { mockUsers } from "../mockdata/mockUsers";
import { BackToProfile } from "../components/BackToProfile";

export default function MyLists() {
  const { username } = useParams(); // username da URL
  const { user: loggedInUser } = useAuth();
  
  // verifica se é o dono da página
  const isOwner = loggedInUser?.username === username;
  const user = isOwner ? loggedInUser : mockUsers.find(u => u.username === username);

  const [allLists, setAllLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Carregar listas
  useEffect(() => {
    if (user) {
      const userLists = ensureArray(user?.lists);
      if (userLists.length > 0) {
        setAllLists(userLists);
      } else {
        const storedLists = getListsByUserId(user.id);
        setAllLists(storedLists);
      }
    } else {
      setAllLists([]);
    }
  }, [user]);

  // 🔹 Filtrar listas privadas (só o dono pode ver)
  const visibleLists = allLists.filter((list) => {
    if (isOwner) return true;     // dono vê todas
    return list.isPublic;         // visitante só vê públicas
  });

  // Paginação
  const totalPages = Math.max(1, Math.ceil(visibleLists.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const listsToShow = visibleLists.slice(startIdx, endIdx);

  // Resetar página se necessário
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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
        {/* Header */}
        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isOwner ? "Minhas Listas" : `Listas de ${user.name}`}
            </h1>
            <p className="text-gray-400">{visibleLists.length} listas visíveis</p>
          </div>
          
          {/* Botão criar lista só pro dono */}
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
            {listsToShow.map((list) => (
              <ListCard 
                key={list.id} 
                list={list} 
                username={user.username} 
                isOwner={isOwner}
              />
            ))}
          </div>
        ) : (
          <EmptyListsState isOwner={isOwner} />
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
