import { useState } from "react";
import StarRating from "../StarRating";

export default function ReviewCard({ 
  review, 
  showUserInfo = true,
  onHelpfulClick,
  onEditClick,
  canEdit = false
}) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(review.comment || "");
  const [editedRating, setEditedRating] = useState(review.rating || 0);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);

  const handleHelpfulClick = () => {
    if (onHelpfulClick) {
      onHelpfulClick(review.id);
      setHelpfulCount(prev => prev + 1);
    }
  };

  const handleEditClick = () => {
    if (canEdit) {
      setIsEditing(true);
      setEditedRating(review.rating || 0);
    }
  };

  const handleSaveClick = () => {
    if (onEditClick && canEdit) {
      onEditClick(review.id, editedComment, editedRating);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedComment(review.comment || "");
    setEditedRating(review.rating || 0);
    setIsEditing(false);
  };

  const handleRatingChange = (newRating) => {
    if (canEdit) {
      setEditedRating(newRating);
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50">
      <div className="flex flex-col">
        
        {/* Header com informações do usuário */}
        {showUserInfo && (
          <div className="flex items-center gap-3 mb-4">
            {review.avatar ? (
              <img 
                src={review.avatar} 
                alt={review.user}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600">
                <span className="text-gray-400 text-sm">👤</span>
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-white">{review.user}</h4>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                {/* Ícone de calendário */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {review.date}
              </p>
            </div>
          </div>
        )}

        {/* Rating e título da mídia */}
        <div className="mb-4">
          {review.mediaTitle && (
            <h3 className="font-semibold text-white text-lg mb-2">
              {review.mediaTitle}
            </h3>
          )}
          
          {isEditing ? (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sua avaliação:
              </label>
              <StarRating 
                maxStars={5} 
                onRatingChange={handleRatingChange}
                initialRating={editedRating}
              />
              <span className="ml-2 text-gray-300 font-medium">{editedRating}.0</span>
            </div>
          ) : (
            <div className="flex items-center">
              <StarRating 
                maxStars={5} 
                initialRating={review.rating}
                readOnly={true}
              />
              <span className="ml-2 text-gray-300 font-medium">{review.rating}.0</span>
            </div>
          )}
        </div>

        {/* Comentário - Modo edição ou visualização */}
        {isEditing ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seu comentário:
            </label>
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-700 text-white"
              rows={4}
              placeholder="Digite seu comentário..."
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm border border-blue-500/50"
              >
                Salvar
              </button>
              <button
                onClick={handleCancelClick}
                className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm border border-gray-500/50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          review.comment && (
            <div className="mb-4">
              <p className="text-gray-300 text-base leading-relaxed">
                {review.comment}
              </p>
            </div>
          )
        )}

        {/* Ações */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-600/30">
          <button 
            onClick={handleHelpfulClick}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 text-sm px-3 py-1 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/30 hover:border-blue-400/30"
          >
            {/* Ícone de útil */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Útil ({helpfulCount})
          </button>

          {!isEditing && canEdit && (
            <button
              onClick={handleEditClick}
              className="text-gray-400 hover:text-gray-300 text-sm px-3 py-1 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/30 hover:border-gray-500/30"
            >
              Editar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}