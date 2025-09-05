import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListCard from "../components/lists/ListCard";
import EmptyListsState from "../components/lists/EmptyListsState";
import { ensureArray, getListsByUserId } from "../utils/MediaHelpers";
import Pagination from "../components/Pagination";

export default function MyLists() {
  const { user } = useAuth();
  const userId = user?.id;

  const [allLists, setAllLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Carregar listas do usuário
  useEffect(() => {
    if (userId) {
      // Primeiro tenta pegar das listas do usuário
      const userLists = ensureArray(user?.lists);
      
      if (userLists.length > 0) {
        setAllLists(userLists);
      } else {
        // Se não tiver, busca do storage/local
        const storedLists = getListsByUserId(userId);
        setAllLists(storedLists);
      }
    } else {
      setAllLists([]);
    }
  }, [user, userId]);

  // Calcular dados da paginação
  const totalPages = Math.max(1, Math.ceil(allLists.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const listsToShow = allLists.slice(startIdx, endIdx);

  // Resetar página se necessário
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Minhas Listas</h1>
            <p className="text-gray-600">{allLists.length} listas criadas</p>
          </div>
          <Link
            to="/lists/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> Criar Nova Lista
          </Link>
        </div>

        {listsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listsToShow.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <EmptyListsState />
        )}

        {/* ALTERAÇÃO: Paginação visível quando totalPages > 0 (para teste) */}
        {totalPages > 0 && (
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