import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isMediaSaved, saveMediaForUser, unsaveMediaForUser } from "../utils/saveMedia";

export default function MediaCarouselCard({ media }) {
  const { user, updateUser } = useAuth();
  const isSaved = user ? isMediaSaved(user, media.id) : false;

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const updatedUser = isSaved
      ? unsaveMediaForUser(user, media.id)
      : saveMediaForUser(user, media.id);

    updateUser(updatedUser);
  };

  return (
    <Link
      to={`/media/${media.id}`}
      className="block bg-white shadow-md hover:shadow-xl transition relative w-[180px] flex-shrink-0 h-[260px] rounded-2xl" // Added rounded-2xl here
    >
      {/* Botão de salvar */}
      <button
        onClick={handleSave}
        className={`absolute top-2 right-2 p-2 rounded-full transition-all z-10 ${
          isSaved
            ? "bg-green-100 text-green-600 hover:bg-green-200"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        }`}
        title={isSaved ? "Remover dos salvos" : "Salvar para depois"}
      >
        <svg
          className="w-4 h-4"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>

      {/* Imagem - arredondada apenas no topo */}
      <div className="w-full h-[150px] overflow-hidden rounded-t-2xl"> {/* Added rounded-t-2xl */}
        <img
          src={media.image}
          alt={media.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo textual compacto */}
      <div className="p-2 flex flex-col justify-between h-[110px] text-center">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
          {media.title}
        </h3>
        <div className="flex items-center justify-center gap-1 mb-1">
          {media.type && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              {media.type}
            </span>
          )}
          {media.rating && (
            <span className="text-xs text-yellow-600 font-semibold">
              ⭐ {media.rating}
            </span>
          )}
        </div>
        {media.year && (
          <p className="text-xs text-gray-500 mt-0">{media.year}</p>
        )}
      </div>
    </Link>
  );
}