import { Link } from "react-router-dom";
import { convertMediaIdsToObjects } from "../../utils/MediaHelpers";

export default function ListCard({ list, username }) { // Adicione a prop username
  const mediaItems = Array.isArray(list.items) 
    ? convertMediaIdsToObjects(list.items).slice(0, 4)
    : [];

  return (
    <Link
      to={username ? `/users/${username}/lists/${list.id}` : `/lists/${list.id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
    >
      {/* Header da Lista */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {list.name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              list.isPublic
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {list.isPublic ? "Pública" : "Privada"}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {list.description || "Sem descrição"}
        </p>
      </div>

      {/* Conteúdo da Lista */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {mediaItems.length} itens
          </span>
          {list.createdAt && (
            <span className="text-xs text-gray-500">
              Criada em {new Date(list.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Preview dos itens */}
        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mediaItems.map((item, index) => (
              <div
                key={item.id || index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                {item.image || item.poster ? (
                  <img
                    src={item.image || item.poster}
                    alt={item.title || ""}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center bg-gray-200" style={{ display: item.image ? 'none' : 'flex' }}>
                  <span className="text-gray-400 text-xs">{item.type}</span>
                </div>
              </div>
            ))}
            {list.items?.length > 4 && (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-sm">
                  +{list.items.length - 4}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-300 text-4xl mb-2">📝</div>
            <p className="text-gray-500 text-sm">Lista vazia</p>
          </div>
        )}
      </div>
    </Link>
  );
}