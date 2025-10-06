import { useState, useEffect } from "react";
import { fetchUsers } from "../../services/userService";
import UserCard from "../../components/contents/UserCard";
import Pagination from "../../components/Pagination";

export default function UsersPage() {
  const itemsPerPage = 30;

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const data = await fetchUsers({ search: searchQuery, page: currentPage, limit: itemsPerPage });
      setUsers(data.users || []);
      setTotalPages(data.pagination?.pages || 1);
      setLoading(false);
    }
    loadUsers();
  }, [searchQuery, currentPage]);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="md:text-4xl font-extrabold mb-8 tracking-wide drop-shadow-lg">Usuários</h2>

      {/* Barra de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar usuários..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // resetar página ao digitar
        }}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {loading ? (
        <p className="text-gray-400">Carregando usuários...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400">Nenhum usuário encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {/* Paginação */}
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