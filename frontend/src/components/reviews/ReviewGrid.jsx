import ReviewCard from "./ReviewCard";

export default function ReviewGrid({ 
  reviews, 
  title = "Avaliações", 
  emptyMessage = "Nenhuma avaliação encontrada. Seja o primeiro a avaliar!", 
  showViewAll = true,
  onHelpfulClick,
  onEditClick,
  onDeleteClick, 
  currentUserId = null,
  showContainer = true,
  showMediaTitle = false,
  showUserInfo = true,
}) {
  
  const content = (
    <>
      {(title || showViewAll) && (
        <div className="flex justify-between items-center mb-6">
          {title && (
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {title}
            </h2>
          )}
        </div>
      )}
      
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onHelpfulClick={onHelpfulClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              canEdit={currentUserId ? review.userId === currentUserId : false}
              currentUserId={currentUserId}
              showMediaTitle={showMediaTitle}
              showUserInfo={showUserInfo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400 mb-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
            />
          </svg>
          <p className="text-gray-300">{emptyMessage}</p>
        </div>
      )}
    </>
  );

  if (!showContainer) {
    return content;
  }

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50">
      {content}
    </div>
  );
}
