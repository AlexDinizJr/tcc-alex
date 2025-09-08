import { Link } from "react-router-dom";

export default function Favorites({ userFavorites, username }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Favoritos</h2>
        {userFavorites.length > 0 && (
          <Link 
            to={`/users/${username}/favorites`} 
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Ver todos
          </Link>
        )}
      </div>
      
      {userFavorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {userFavorites.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              to={`/media/${item.id}`}
              className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
            >
              <div className="h-24 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                <span className="text-gray-400 text-xs">{item.type}</span>
              </div>
              <h3 className="font-medium text-gray-800 text-sm truncate">{item.title}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-gray-500">
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