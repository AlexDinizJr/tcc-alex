import MediaActions from "./MediaActions";
import MediaMetadata from "./MediaMetadata";
import MediaDetails from "./MediaDetails";
import StreamingServices from "./StreamingServices";

export default function MediaHeader({ mediaItem, description }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagem da mídia */}
        <div className="lg:w-1/3">
          <img
            src={mediaItem.image}
            alt={mediaItem.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Conteúdo principal */}
        <div className="lg:w-2/3">
          {/* Cabeçalho com tipo e rating */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full text-sm">
                {mediaItem.type.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-yellow-600">
                ⭐ {mediaItem.rating}
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{mediaItem.title}</h1>

          {/* Metadados (ano, duração, etc.) */}
          <MediaMetadata mediaItem={mediaItem} />

          {/* Botões de ação */}
          <MediaActions mediaItem={mediaItem} />

          {/* Detalhes específicos */}
          <MediaDetails mediaItem={mediaItem} />

          {/* Serviços de streaming */}
          <StreamingServices mediaItem={mediaItem} />

          {/* Sinopse */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Sinopse</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}