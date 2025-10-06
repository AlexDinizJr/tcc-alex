import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import { FaStar } from "react-icons/fa";
import ShareMediaModal from "./ShareMediaModal";
import AddToListModal from "./AddToListModal";
import { excludeFromRecommendations } from "../services/recommendationService";
import { toggleSaveMedia, toggleFavoriteMedia, fetchUserFavorites, fetchUserSavedMedia } from "../services/listsService";
import { MediaImage } from "../utils/MediaImage";

export default function MediaCarouselCard({ media }) {
  const { user, updateProfile, refreshUserOnInteraction, addMediaToList, updateUser, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [addToListOpen, setAddToListOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(user?.savedMedia?.some(m => m.id === media.id));
  const [isFavorited, setIsFavorited] = useState(user?.favorites?.some(m => m.id === media.id));
  const menuRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    setIsSaved(user?.savedMedia?.some(m => m.id === media.id) || false);
    setIsFavorited(user?.favorites?.some(m => m.id === media.id) || false);
  }, [user, media.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    try {
      await toggleSaveMedia(media.id);
      setIsSaved(prev => !prev);

      const savedMedia = await fetchUserSavedMedia(user.id);
      const favorites = await fetchUserFavorites(user.id);
      updateProfile({ ...user, savedMedia, favorites });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    try {
      await toggleFavoriteMedia(media.id);
      refreshUserOnInteraction();
      setIsFavorited(prev => !prev);

      const savedMedia = await fetchUserSavedMedia(user.id);
      const favorites = await fetchUserFavorites(user.id);
      updateProfile({ ...user, savedMedia, favorites });

      setMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotInterested = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (!user) return;

    try {
      const result = await excludeFromRecommendations(media.id);
      
      if (result?.success) {
        const updatedExcluded = [...(user.excludedMedia || []), media];
        updateProfile({ ...user, excludedMedia: updatedExcluded });
        showToast("Você não receberá mais este conteúdo", "success");
        return;
      }
    } catch (err) {
      console.error("Erro ao excluir mídia:", err);
    }
  };

  const handleAddToList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast("Você precisa estar logado para adicionar itens a listas!", "warning");
      setMenuOpen(false);
      return;
    }
    setAddToListOpen(true);
    setMenuOpen(false);
  };

  const handleAddToListConfirm = async (listId, listName = null, isPublic = false) => {
    if (!isAuthenticated) {
      showToast("Você precisa estar logado para adicionar itens a listas!", "warning");
      return;
    }
    if (!media?.id) {
      showToast("Erro: Item de mídia inválido!", "error");
      return;
    }

    try {
      const result = await addMediaToList(media, listId, listName, isPublic);

      if (result.success) {
        if (listName && result.list) {
          updateUser(prev => ({
            ...prev,
            lists: [...(prev.lists || []), result.list]
          }));
        }

        showToast(
          listName 
            ? `Lista "${listName}" criada com "${media.title}" adicionada!` 
            : `"${media.title}" adicionado à lista!`,
          "success"
        );
        setAddToListOpen(false);

      } else if (result.isDuplicate) {
        showToast(`"${media.title}" já está nesta lista!`, "warning");
        setAddToListOpen(false);

      } else {
        showToast(result.error || "Erro ao adicionar à lista", "error");
      }

    } catch (error) {
      console.error("Erro inesperado ao adicionar à lista:", error);
      showToast("Erro inesperado ao adicionar à lista", "error");
    }
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareOpen(true);
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
    <>
      <div className="bg-gray-800/80 border border-gray-700/50 shadow-md hover:shadow-2xl transition-transform transform-gpu duration-300 relative rounded-2xl w-full h-auto hover:scale-105 hover:z-10">

        {/* Botão + Dropdown */}
        <div ref={menuRef} className="absolute top-3 left-3 z-20">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full transition-all bg-gray-900/80 text-gray-200 hover:bg-blue-600/30 backdrop-blur-sm"
            title="Mais opções"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>

          {menuOpen && (
            <div className="mt-2 bg-gray-900/95 shadow-xl rounded-lg py-1 min-w-[185px] border border-gray-700 backdrop-blur-sm">
              <button
                onClick={handleNotInterested}
                className="w-full text-left px-3 py-1.5 text-[11px] text-gray-200 hover:bg-blue-600/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Não recomendar mais
              </button>

              <button
                onClick={handleAddToFavorites}
                className="w-full text-left px-3 py-1.5 text-[11px] text-gray-200 hover:bg-blue-600/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              </button>

              <button
                onClick={handleAddToList}
                className="w-full text-left px-3 py-1.5 text-[11px] text-gray-200 hover:bg-blue-600/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Adicionar à lista
              </button>

              <button
                onClick={handleShare}
                className="w-full text-left px-3 py-1.5 text-[11px] text-gray-200 hover:bg-blue-600/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartilhar
              </button>
            </div>
          )}
        </div>

        {/* Botão salvar */}
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

        {/* Imagem com lazy loading */}
        <Link to={`/media/${media.id}`} className="block">
          <MediaImage src={media.image} alt={media.title} />
        </Link>

        {/* Conteúdo */}
        <Link to={`/media/${media.id}`} className="block p-4 flex flex-col justify-between h-[105px]">
          <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 leading-tight">{media.title}</h3>
          <div className="flex items-center justify-between">
            {media.type && (
              <span className="text-xs px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
                {media.type}
              </span>
            )}
            {media.rating && (
              <div className="flex items-center bg-gray-700/50 rounded-full px-2 py-0.5 border border-gray-600/50">
                <FaStar className="text-yellow-400 w-3.5 h-3.5 mr-1" />
                <span className="text-gray-200 text-xs font-medium">{media.rating}</span>
              </div>
            )}
          </div>
        </Link>

        {shareOpen && (
          <ShareMediaModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            media={media}
          />
        )}
      </div>

      {/* Modal AddToListModal renderizado fora do card */}
      {addToListOpen && (
        <AddToListModal 
          mediaItem={media}
          userLists={user?.lists || []}
          onAddToList={handleAddToListConfirm}
          onClose={() => setAddToListOpen(false)}
        />
      )}
    </>
  );
}