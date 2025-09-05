import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isMediaSaved, saveMediaForUser, unsaveMediaForUser } from "../utils/saveMedia";
import { useState, useRef, useEffect } from "react";

export default function MediaCarouselCard({ media }) {
  const { user, updateUser } = useAuth();
  const isSaved = user ? isMediaSaved(user, media.id) : false;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const updatedUser = isSaved
      ? unsaveMediaForUser(user, media.id)
      : saveMediaForUser(user, media.id);

    updateUser(updatedUser);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleNotInterested = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Não recomendar mais:", media.title);
    // Aqui você implementaria a lógica para não recomendar mais este conteúdo
    setMenuOpen(false);
  };

  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Adicionar aos favoritos:", media.title);
    // Lógica para adicionar aos favoritos
    setMenuOpen(false);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Compartilhar:", media.title);
    // Lógica de compartilhamento
    setMenuOpen(false);
  };

  // Fechar o menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Link
      to={`/media/${media.id}`}
      className="block bg-white shadow-md hover:shadow-xl transition relative w-[180px] flex-shrink-0 h-[260px] rounded-2xl"
    >
      {/* Botão de menu (3 pontinhos) */}
      <button
        onClick={toggleMenu}
        className="absolute top-2 left-2 p-2 rounded-full transition-all z-10 bg-gray-100 text-gray-400 hover:bg-gray-200"
        title="Mais opções"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Menu dropdown */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-10 left-2 bg-white shadow-lg rounded-lg py-2 z-20 min-w-[160px] border border-gray-200"
        >
          <button
            onClick={handleNotInterested}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Não recomendar mais
          </button>
          
          <button
            onClick={handleAddToFavorites}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favoritos
          </button>
          
          <button
            onClick={handleShare}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartilhar
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Reportar conteúdo:", media.title);
              setMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Reportar conteúdo
          </button>
        </div>
      )}

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
      <div className="w-full h-[150px] overflow-hidden rounded-t-2xl">
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