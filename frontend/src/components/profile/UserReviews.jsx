import { Link } from "react-router-dom";
import { ALL_MEDIA } from "../../mockdata/mockMedia"; // Importe para pegar o título da mídia

export default function UserReviews({ userReviews }) {
  // Função para obter o título da mídia baseado no mediaId
  const getMediaTitle = (mediaId) => {
    const media = ALL_MEDIA.find(m => m.id === mediaId);
    return media ? media.title : `Mídia #${mediaId}`;
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString; // Retorna o original se não puder formatar
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Minhas Avaliações</h2>
        <Link to="/my-reviews" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          Ver todas
        </Link>
      </div>
      
      {userReviews.length > 0 ? (
        <div className="space-y-4">
          {userReviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">
                  {getMediaTitle(review.mediaId)} {/* Usando mediaId para pegar o título */}
                </h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">{review.comment || "Sem comentário"}</p>
              <p className="text-gray-400 text-xs mt-2">{formatDate(review.date)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-gray-500">Você ainda não fez nenhuma avaliação.</p>
          <p className="text-gray-400 text-sm mt-1">Compartilhe suas opiniões sobre os conteúdos!</p>
        </div>
      )}
    </div>
  );
}