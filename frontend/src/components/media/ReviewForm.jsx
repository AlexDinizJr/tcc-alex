import StarRating from "../StarRating";
import { useAuth } from "../../hooks/useAuth";

export default function ReviewForm({ 
  newReview, 
  isSubmitting, 
  onRatingChange, 
  onInputChange, 
  onSubmit 
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Faça login para avaliar
          </h3>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para compartilhar sua opinião.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Deixe sua avaliação</h3>
          <p className="text-sm text-gray-600">Logado como {user?.name || 'Usuário'}</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sua avaliação *
          </label>
          <StarRating onRatingChange={onRatingChange} />
          {newReview.rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {newReview.rating} {newReview.rating === 1 ? 'estrela' : 'estrelas'}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Seu comentário *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={newReview.comment}
            onChange={onInputChange}
            placeholder="Compartilhe sua opinião..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || newReview.rating === 0}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </button>

        <p className="text-sm text-gray-500">* Campos obrigatórios</p>
      </form>
    </div>
  );
}