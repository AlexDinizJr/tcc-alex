import { useState, useMemo } from "react";
import { mockUsers } from "../mockdata/mockUsers";
import UserCard from "../components/UserCard";
import Pagination from "../components/Pagination";

export default function Users() {
  const itemsPerPage = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtra usuários pelo nome
  const filteredUsers = useMemo(() => {
    if (searchQuery.trim() === "") return mockUsers;
    return mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const usersToShow = filteredUsers.slice(startIdx, endIdx);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuários</h2>

      {/* Barra de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar usuários..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
        {usersToShow.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
