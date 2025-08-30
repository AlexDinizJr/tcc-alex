export default function MediaMetadata({ mediaItem }) {
  return (
    <div className="flex items-center gap-6 mb-6">
      {mediaItem.year && (
        <span className="text-gray-700 font-medium">
          🗓️ {mediaItem.year}
        </span>
      )}
      {mediaItem.duration && (
        <span className="text-gray-700 font-medium">
          ⏱️ {mediaItem.duration} min
        </span>
      )}
      {mediaItem.pages && (
        <span className="text-gray-700 font-medium">
          📖 {mediaItem.pages} páginas
        </span>
      )}
      {mediaItem.seasons && (
        <span className="text-gray-700 font-medium">
          📺 {mediaItem.seasons} temporada(s)
        </span>
      )}
      {mediaItem.episodes && (
        <span className="text-gray-700 font-medium">
          🎬 {mediaItem.episodes} episódios
        </span>
      )}
      {mediaItem.tracks && (
        <span className="text-gray-700 font-medium">
          🎵 {mediaItem.tracks} faixas
        </span>
      )}
    </div>
  );
}