import MediaActions from "./MediaActions";
import MediaMetadata from "./MediaMetadata";
import MediaDetails from "./MediaDetails";
import StreamingServices from "./StreamingServices";

export default function MediaHeader({ mediaItem, description }) {
  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50 p-8 mb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagem da mídia */}
        <div className="lg:w-1/3">
          <img
            src={mediaItem.image}
            alt={mediaItem.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg border border-white/10"
          />
        </div>

        {/* Conteúdo principal */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {/* Cabeçalho com tipo e rating */}
          <div className="flex items-start justify-between">
            <div>
              <span className="px-4 py-2 bg-blue-800/20 text-blue-400 font-medium rounded-full text-sm">
                {mediaItem.type.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.065 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"/>
                </svg>
                {mediaItem.rating}
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-white mb-4 line-clamp-2">{mediaItem.title}</h1>

          {/* Metadados */}
          <MediaMetadata mediaItem={mediaItem} darkMode />

          {/* Detalhes específicos */}
          <MediaDetails mediaItem={mediaItem} darkMode />

          {/* Botões de ação */}
          <MediaActions mediaItem={mediaItem} darkMode />

          {/* Serviços de streaming */}
          <StreamingServices mediaItem={mediaItem} darkMode />

          {/* Sinopse */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Sinopse</h3>
            <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
