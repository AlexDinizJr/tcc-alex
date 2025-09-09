import { Link } from "react-router-dom";
import { convertMediaIdsToObjects } from "../../utils/MediaHelpers";

export default function ListCard({ list, username }) {
  const mediaItems = Array.isArray(list.items)
    ? convertMediaIdsToObjects(list.items).slice(0, 4)
    : [];

  return (
    <Link
      to={username ? `/users/${username}/lists/${list.id}` : `/lists/${list.id}`}
      className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Header da Lista */}
      <div className="px-6 py-4 border-b border-gray-700/40">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-blue-500 transition-colors">
            {list.name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              list.isPublic
                ? "bg-green-800/20 text-green-400"
                : "bg-blue-800/20 text-blue-400"
            }`}
          >
            {list.isPublic ? "Pública" : "Privada"}
          </span>
        </div>
      </div>

      {/* Conteúdo da Lista */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">{mediaItems.length} itens</span>
          {list.createdAt && (
            <span className="text-xs text-gray-500">
              Criada em {new Date(list.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mediaItems.map((item, index) => (
              <div
                key={item.id || index}
                className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center"
              >
                {item.image || item.poster ? (
                  <img
                    src={item.image || item.poster}
                    alt={item.title || ""}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ display: item.image ? "none" : "flex" }}
                >
                  <span className="text-gray-400 text-xs text-center">{item.type}</span>
                </div>
              </div>
            ))}
            {list.items?.length > 4 && (
              <div className="aspect-square rounded-lg bg-gray-700/50 flex items-center justify-center">
                <span className="text-gray-400 text-sm">+{list.items.length - 4}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-400 text-4xl mb-2">📝</div>
            <p className="text-gray-500 text-sm">Lista vazia</p>
          </div>
        )}
      </div>
    </Link>
  );
}
