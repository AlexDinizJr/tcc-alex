import { useState, useEffect } from "react";
import { fetchAllLists } from "../../services/listsService";
import ListCard from "../../components/lists/ListCard";
import Pagination from "../../components/Pagination";

export default function Lists() {
  const itemsPerPage = 12;
  const [lists, setLists] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLists() {
      setLoading(true);
      const data = await fetchAllLists({ search: searchQuery, page: currentPage, limit: itemsPerPage });
      setLists(data.lists || []);
      setTotalPages(data.pagination.pages || 1);
      setLoading(false);
    }
    loadLists();
  }, [searchQuery, currentPage]);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="md:text-4xl font-extrabold mb-8 tracking-wide drop-shadow-lg">Listas</h2>

      <input
        type="text"
        placeholder="Pesquisar listas..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // resetar página ao digitar
        }}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {loading ? (
        <p className="text-gray-400">Carregando listas...</p>
      ) : lists.length === 0 ? (
        <p className="text-gray-400">Nenhuma lista encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {lists.map((list) => (
            <ListCard 
            key={list.id}
            list={list}
            username={list.user?.username}  />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
