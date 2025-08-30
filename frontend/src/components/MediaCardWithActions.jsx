// components/MediaCardWithActions.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import DeleteItemModal from "./lists/DeleteItemModal";

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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(media.id);
      }
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
    if (onAddToList) {
      onAddToList(media);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group">
        {/* Botão de exclusão */}
        {showDelete && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
            title="Remover item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Botão de adicionar à lista */}
        {showAddToList && onAddToList && (
          <button
            onClick={handleAddToListClick}
            className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-blue-600"
            title="Adicionar à lista"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

        <Link 
          to={`/media/${media.id}`}
          onClick={handleClick}
          className="block"
        >
          {/* Imagem */}
          <div className="relative">
            <img 
              src={media.image} 
              alt={media.title}
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Conteúdo */}
          <div className="p-4">
            {/* Título */}
            <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
              {media.title}
            </h3>

            {/* Tipo */}
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
              {media.type}
            </span>

            {/* Avaliação */}
            {media.rating && (
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span className="text-sm text-gray-700">{media.rating}</span>
              </div>
            )}

            {/* Ano */}
            {media.year && (
              <p className="text-sm text-gray-500 mt-1">{media.year}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Modal de confirmação de exclusão */}
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