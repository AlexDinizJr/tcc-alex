import { FiCalendar, FiClock, FiBook, FiTv, FiFilm, FiMusic, FiShield } from "react-icons/fi";

export default function MediaMetadata({ mediaItem }) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {mediaItem.year && (
        <span className="text-gray-200 font-medium flex items-center gap-1">
          <FiCalendar /> {mediaItem.year}
        </span>
      )}
      {mediaItem.classification && (
        <span className="text-gray-200 font-medium flex items-center gap-1">
          <FiShield /> {mediaItem.classification}
        </span>
      )}
      {mediaItem.duration && (
        <span className="text-gray-200 font-medium flex items-center gap-1">
          <FiClock /> {mediaItem.duration} min
        </span>
      )}
      {mediaItem.pages && (
        <span className="text-gray-200 font-medium flex items-center gap-1">
          <FiBook /> {mediaItem.pages} páginas
        </span>
      )}
      {mediaItem.seasons && (
        <span className="text-gray-200 font-medium flex items-center gap-1">
          <FiTv /> {mediaItem.seasons} temporada(s)
        </span>
      )}
      {mediaItem.episodes && (
        <span className="text-gray-200 font-medium flex items-center gap-1">
          <FiFilm /> {mediaItem.episodes} episódios
        </span>
      )}
      {mediaItem.tracks && (
        <span className="text-gray-200 font-medium flex items-center gap-1">
          <FiMusic /> {mediaItem.tracks} faixas
        </span>
      )}
    </div>
  );
}