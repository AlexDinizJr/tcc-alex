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
      <section className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50 mb-8 text-center">
        <div className="text-4xl mb-4 text-gray-100">🔒</div>
        <h3 className="text-xl font-semibold text-gray-100 mb-2">
          Faça login para avaliar
        </h3>
        <p className="text-gray-300 mb-4">
          Você precisa estar logado para compartilhar sua opinião.
        </p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors cursor-pointer"
        >
          Fazer Login
        </a>
      </section>
    );
  }

  return (
    <section className="mt-8 p-6 bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-700" />
          ) : (
          <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-100">Deixe sua avaliação</h3>
          <p className="text-sm text-gray-300">Logado como {user?.name || 'Usuário'}</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-100 mb-2">
            Sua avaliação *
          </label>
          {/* 🔥 CORREÇÃO: Mude 'value' para 'rating' */}
          <StarRating 
            rating={newReview.rating} 
            onRatingChange={onRatingChange} 
          />
          {newReview.rating > 0 && (
            <p className="text-sm text-gray-300 mt-2">
              {/* 🔥 MOSTRE NOTA DECIMAL CORRETAMENTE */}
              {newReview.rating.toFixed(1)} {newReview.rating === 1 ? 'estrela' : 'estrelas'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-100 mb-2">
            Seu comentário *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={newReview.comment}
            onChange={onInputChange}
            placeholder="Compartilhe sua opinião..."
            rows={4}
            className="w-full p-3 border border-gray-600 rounded-xl resize-none bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Campo para digitar seu comentário"
            aria-required="true"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || newReview.rating === 0}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </button>

        <p className="text-sm text-gray-400">* Campos obrigatórios</p>
      </form>
    </section>
  );
}