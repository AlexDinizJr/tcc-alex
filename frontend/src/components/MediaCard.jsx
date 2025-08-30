import { Link } from "react-router-dom";

export default function MediaCard({ media }) {
    const handleClick = () => {
    // Scroll suave para o topo da página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Link 
      to={`/media/${media.id}`}
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* Imagem */}
      <div className="relative">
        <img 
          src={media.image} 
          alt={media.title}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {media.title}
        </h3>

        {/* Avaliação */}
        {media.rating && (
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="text-sm text-gray-700">{media.rating}</span>
          </div>
        )}
      </div>
    </Link>
  );
}