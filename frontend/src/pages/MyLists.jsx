import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListCard from "../components/lists/ListCard";
import EmptyListsState from "../components/lists/EmptyListsState";
import { ensureArray, getListsByUserId } from "../utils/MediaHelpers";

export default function MyLists() {
  const { user } = useAuth();
  
  // Garantir que user.id existe antes de usar
  const userId = user?.id;
  
  // Usando o utilitário para garantir array
  const userLists = ensureArray(user?.lists);
  const displayLists = userLists.length > 0 && userId
    ? userLists
    : userId ? getListsByUserId(userId) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Minhas Listas</h1>
              <p className="text-gray-600">
                {displayLists.length} listas criadas
              </p>
            </div>
            <Link
              to="/lists/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Criar Nova Lista
            </Link>
          </div>
        </div>

        {/* Grid de Listas */}
        {displayLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <EmptyListsState />
        )}
      </div>
    </div>
  );
}