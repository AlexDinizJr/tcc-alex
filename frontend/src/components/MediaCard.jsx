import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function MediaCard({ media }) {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Link 
      to={`/media/${media.id}`}
      onClick={handleClick}
      className="block bg-gray-800/80 rounded-2xl shadow-md hover:shadow-white/20 transition-shadow duration-300 cursor-pointer border border-gray-700/50 overflow-hidden group"
    >
      {/* Imagem */}
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={media.image} 
          alt={media.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay sutil no hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-bold text-white text-lg line-clamp-2 mb-1">
          {media.title}
        </h3>
        
        {/* Informações secundárias */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            {/* Ano */}
            {media.year && (
              <span className="text-gray-400 text-sm">{media.year}</span>
            )}
          </div>

          {/* Avaliação */}
          {media.rating && (
            <div className="flex items-center bg-gray-700/50 rounded-full px-3 py-1 border border-gray-600/50">
              <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
              <span className="text-gray-200 text-sm font-medium">{media.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}