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
      className="bg-gray-800/80 border border-gray-700/50 shadow-md hover:shadow-2xl transition-transform transform-gpu duration-300 relative rounded-2xl w-full h-83 hover:scale-105 hover:z-10 overflow-hidden flex flex-col"
    >
      {/* Imagem */}
      <div className="relative w-full h-56 overflow-hidden rounded-t-2xl">
        <img 
          src={media.image} 
          alt={media.title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col justify-between flex-1 p-4"> {/* Seção compacta e ajustável */}
        {/* Título */}
        <h3 className="font-bold text-white text-base line-clamp-2">
          {media.title}
        </h3>
        
        {/* Informações secundárias */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex flex-col justify-center">
            {media.year && (
              <span className="text-gray-400 text-xs">{media.year}</span>
            )}
          </div>

          {media.rating && (
            <div className="flex items-center bg-gray-700/50 rounded-full px-2 py-0.5 border border-gray-600/50">
              <FaStar className="text-yellow-400 w-3.5 h-3.5 mr-1" />
              <span className="text-gray-200 text-xs font-medium">{media.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}