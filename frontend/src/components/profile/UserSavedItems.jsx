import { Link } from "react-router-dom";

export default function SavedItems({ savedItems, username }) {
  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {/* Ícone de itens salvos */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Itens Salvos
        </h2>
        {savedItems.length > 0 && (
          <Link 
            to={`/users/${username}/saved-items`} 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Ver todos
            {/* Ícone de seta */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      
      {savedItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {savedItems.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              to={`/media/${item.id}`}
              className="block bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition border border-gray-600/50 group"
            >
              <div className="h-24 bg-gray-600/50 rounded-md mb-2 flex items-center justify-center group-hover:bg-gray-600 transition-colors overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">{item.type}</span>
                )}
              </div>
              <h3 className="font-medium text-white text-sm truncate">{item.title}</h3>
              {item.rating && (
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 text-xs">⭐</span>
                  <span className="text-gray-300 text-xs ml-1">{item.rating}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-gray-300">
            {username ? 'Este usuário ainda não salvou nenhum item.' : 'Você ainda não salvou nenhum item.'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {username ? 'Os itens salvos aparecerão aqui quando forem adicionados.' : 'Explore a plataforma e salve seus itens favoritos!'}
          </p>
        </div>
      )}
    </div>
  );
}