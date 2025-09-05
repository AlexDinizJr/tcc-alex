import { Link } from "react-router-dom";

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
      <div className="p-4 flex flex-col">
        {/* Linha do título + ano + nota */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            {/* Título */}
            <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
              {media.title}
            </h3>

            {/* Ano de lançamento */}
            {media.year && (
              <span className="text-sm text-gray-500">{media.year}</span>
            )}
          </div>

          {/* Avaliação */}
          {media.rating && (
            <div className="flex items-center ml-2">
              <span className="text-yellow-500 mr-1">⭐</span>
              <span className="text-sm text-gray-700">{media.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
