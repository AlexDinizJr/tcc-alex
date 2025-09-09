import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  isMediaSaved, saveMediaForUser, unsaveMediaForUser,
  isMediaFavorited, addMediaToFavorites, removeMediaFromFavorites
} from "../utils/saveMedia";
import { useState, useRef, useEffect } from "react";
import ShareMediaModal from "./ShareMediaModal";

export default function MediaCarouselCard({ media }) {
  const { user, updateUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const menuRef = useRef(null);

  const isSaved = user ? isMediaSaved(user, media.id) : false;
  const isFavorited = user ? isMediaFavorited(user, media.id) : false;

  // Salvar para depois
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    const updatedUser = isSaved
      ? unsaveMediaForUser(user, media.id)
      : saveMediaForUser(user, media.id);
    updateUser(updatedUser);
  };

  // Favoritos
  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    const updatedUser = isFavorited
      ? removeMediaFromFavorites(user, media.id)
      : addMediaToFavorites(user, media.id);
    updateUser(updatedUser);
    setMenuOpen(false);
  };

  // Menu
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  // Compartilhar
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareOpen(true);
    setMenuOpen(false);
  };

  const handleNotInterested = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Não recomendar mais:", media.title);
    setMenuOpen(false);
  };

  const handleReportContent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Reportar conteúdo:", media.title);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-800/80 border border-gray-700/50 shadow-md hover:shadow-2xl transition-transform transform-gpu duration-300 relative rounded-2xl w-full h-auto hover:scale-105 hover:z-10">

      {/* Botão de menu */}
      <button
        onClick={toggleMenu}
        className="absolute top-3 left-3 p-2 rounded-full transition-all z-10 bg-gray-900/80 text-gray-200 hover:bg-blue-600/30 backdrop-blur-sm"
        title="Mais opções"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-12 left-3 bg-gray-900/95 shadow-xl rounded-lg py-2 z-20 min-w-[180px] border border-gray-700 backdrop-blur-sm"
        >
          <button
            onClick={handleNotInterested}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-blue-600/20 transition-colors flex items-center gap-3"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Não recomendar mais
          </button>

          <button
            onClick={handleAddToFavorites}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-blue-600/20 transition-colors flex items-center gap-3"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          </button>

          <button
            onClick={handleShare}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-blue-600/20 transition-colors flex items-center gap-3"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartilhar
          </button>

          <hr className="my-2 border-gray-700" />

          <button
            onClick={handleReportContent}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 transition-colors flex items-center gap-3"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Reportar conteúdo
          </button>
        </div>
      )}

      {/* Salvar */}
      <button
        onClick={handleSave}
        className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 backdrop-blur-sm ${
          isSaved ? "bg-green-600/90 text-white hover:bg-green-500/90" : "bg-blue-600/90 text-white hover:bg-blue-500/90"
        }`}
        title={isSaved ? "Remover dos salvos" : "Salvar para depois"}
      >
        <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      {/* Imagem */}
      <Link to={`/media/${media.id}`} className="block w-full h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-t-2xl">
        <img src={media.image} alt={media.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"/>
      </Link>

      {/* Conteúdo */}
      <Link to={`/media/${media.id}`} className="block p-4 flex flex-col justify-between h-[120px]">
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 leading-tight">{media.title}</h3>
        <div className="flex items-center justify-between">
          {media.type && (
            <span className="text-xs px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
              {media.type}
            </span>
          )}
          {media.rating && (
            <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
              ⭐ {media.rating}
            </span>
          )}
        </div>
        {media.year && <p className="text-xs text-gray-400 text-right">{media.year}</p>}
      </Link>

      {/* Modal de compartilhamento */}
      {shareOpen && (
        <ShareMediaModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          media={media}
        />
      )}
    </div>
  );
}