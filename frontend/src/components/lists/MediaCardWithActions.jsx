import { Link } from "react-router-dom";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import DeleteItemModal from "./DeleteItemModal";

export default function MediaCardWithActions({ 
  media, 
  onDelete, 
  showDelete = false,
  onAddToList,
  showAddToList = false 
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) await onDelete(media.id);
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAddToListClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToList) onAddToList(media);
  };

  return (
    <>
      <div className="relative bg-gray-800/80 border border-gray-700/50 rounded-2xl overflow-hidden hover:scale-105 transform-gpu transition-transform duration-300">

        {/* Botões flutuantes */}
        {showDelete && onDelete && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(true); }}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-red-500/90 text-white hover:bg-red-600 border border-red-400/50 backdrop-blur-sm"
            title="Remover item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {showAddToList && onAddToList && (
          <button
            onClick={handleAddToListClick}
            className="absolute top-2 left-2 z-10 p-2 rounded-full bg-blue-500/90 text-white hover:bg-blue-600 border border-blue-400/50 backdrop-blur-sm"
            title="Adicionar à lista"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

        {/* Imagem */}
        <Link to={`/media/${media.id}`} onClick={handleClick} className="block w-full h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-t-2xl">
          <img src={media.image} alt={media.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"/>
        </Link>

        {/* Conteúdo */}
        <Link to={`/media/${media.id}`} onClick={handleClick} className="block p-4 flex flex-col justify-between h-[110px]">
          <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">{media.title}</h3>
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
      </div>

      <DeleteItemModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={media.title}
        isDeleting={isDeleting}
      />
    </>
  );
}
