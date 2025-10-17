import { Link } from "react-router-dom";

export default function ListCard({  list, username, isOwner }) {
  const mediaItems = Array.isArray(list.items) ? list.items : [];

  if (!username) {
    console.warn("Lista sem username definido:", list);
    return null;
  }

  const listUsername = username || list.user?.username;

  return (
    <Link
      to={`/users/${listUsername}/lists/${list.id}`}
      className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="px-6 py-4 border-b border-gray-700/40">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-blue-500 transition-colors">
            {list.name}
          </h3>
          <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${list.isPublic ? "bg-green-800/20 text-green-400" : "bg-blue-800/20 text-blue-400"}`}>
            {list.isPublic ? "Pública" : "Privada"}
          </span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">
            {mediaItems.length} {mediaItems.length === 1 ? 'item' : 'itens'}
          </span>
          {list.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(list.createdAt).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>

        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mediaItems.slice(0, 5).map((item, index) => (
              <div key={item.id || index} className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                {(item.image || item.poster || item.coverImage) ? (
                  <img 
                    src={item.image || item.poster || item.coverImage} 
                    alt={item.title || item.name || ""} 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">🎬</span>
                  </div>
                )}
              </div>
            ))}
            
            {mediaItems.length > 4 && (
              <div className="aspect-square rounded-lg bg-gray-700/50 flex items-center justify-center">
                <span className="text-gray-400 text-sm">+{mediaItems.length - 4}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-400 text-4xl mb-2">📝</div>
            <p className="text-gray-500 text-sm">
              {isOwner ? "Sua lista está vazia" : "Lista vazia"}
            </p>
            {isOwner && (
              <p className="text-gray-400 text-xs mt-1">Adicione itens para ver aqui</p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}