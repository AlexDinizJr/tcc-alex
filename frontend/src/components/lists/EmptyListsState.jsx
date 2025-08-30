import { Link } from "react-router-dom";

export default function EmptyListsState() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
      <div className="text-gray-300 text-6xl mb-6">📋</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Nenhuma lista criada
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Organize seus itens favoritos em listas temáticas. Crie listas para filmes para assistir, jogos para jogar, e muito mais!
      </p>
      <Link
        to="/list/create"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
      >
        <span>+</span>
        Criar Minha Primeira Lista
      </Link>
    </div>
  );
}