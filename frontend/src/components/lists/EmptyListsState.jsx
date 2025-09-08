import { Link } from "react-router-dom";

export default function EmptyListsState({ isOwner }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl shadow-md">
      <p className="text-gray-600 mb-4">
        {isOwner 
          ? "Você ainda não criou nenhuma lista." 
          : "Este usuário ainda não possui listas."}
      </p>

      {/* 🔹 Botão só aparece se for o dono */}
      {isOwner && (
        <Link
          to="/lists/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Criar sua primeira lista
        </Link>
      )}
    </div>
  );
}
