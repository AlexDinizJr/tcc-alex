import { Link } from "react-router-dom";

export default function Favorites({ userFavorites, username }) {
  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {/* Ícone de favoritos */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Favoritos
        </h2>
        {userFavorites.length > 0 && (
          <Link 
            to={`/users/${username}/favorites`} 
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
      
      {userFavorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {userFavorites.slice(0, 4).map((item) => (
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
          {/* Ícone de coração para estado vazio */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-300">
            {username ? 'Este usuário ainda não tem nenhum item favoritado.' : 'Você ainda não tem nenhum item favoritado.'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {username ? 'Os favoritos aparecerão aqui quando forem adicionados.' : 'Explore a plataforma e salve seus favoritos!'}
          </p>
        </div>
      )}
    </div>
  );
}