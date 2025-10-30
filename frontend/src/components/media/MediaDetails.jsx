import { useState } from "react";
import { FaAward } from "react-icons/fa";

export default function MediaDetails({ mediaItem }) {
  const [showFullCast, setShowFullCast] = useState(false);
  const [showAllAwards, setShowAllAwards] = useState(false);
  const renderMediaField = (field, label, renderFunction) => {
    if (!field) return null;
    if (Array.isArray(field) && field.length === 0) return null;
    if (renderFunction) return renderFunction(field);

    return (
      <p className="text-gray-200">
        <span className="font-semibold">{label}:</span>{" "}
        {Array.isArray(field) ? field.join(", ") : field}
      </p>
    );
  };

  return (
    <div>
      <div className="mb-2">
      {/* Gêneros */}
      {mediaItem.genres && mediaItem.genres.length > 0 && (
        <p className="text-gray-200">
          {mediaItem.genres.map((genre, index) => (
            <span key={genre} className="inline-flex items-center">
              <span>{genre}</span>
              {index < mediaItem.genres.length - 1 && (
                <span className="mx-2 text-gray-400">•</span> // ponto com espaçamento
              )}
            </span>
          ))}
        </p>
      )}
      </div>

      {renderMediaField(mediaItem.directors, "Diretor(es)")}
      {renderMediaField(mediaItem.authors, "Autor(es)")}
      {renderMediaField(mediaItem.artists, "Artista(s)")}
      {renderMediaField(mediaItem.developer, "Desenvolvedor(es)")}
      {renderMediaField(mediaItem.publisher, "Publisher")}
      {renderMediaField(mediaItem.producers, "Produtor(es)")}
      {renderMediaField(mediaItem.writers, "Roteirista(s)")}

      {renderMediaField(mediaItem.cast, "Elenco", (cast) => (
        <p className="text-gray-200">
          <span className="font-semibold">Elenco:</span>{" "}
          {(showFullCast ? cast : cast.slice(0, 3)).join(", ")}
          {!showFullCast && cast.length > 3 && (
            <>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-2"
                onClick={() => setShowFullCast(true)}
              >
                {`ver mais (${cast.length - 3})`}
              </button>
            </>
          )}
          {showFullCast && cast.length > 3 && (
            <>
              {" "}
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2"
                onClick={() => setShowFullCast(false)}
              >
                ver menos
              </button>
            </>
          )}
        </p>
      ))}

      {mediaItem.platforms && mediaItem.platforms.length > 0 && (
        <div className="mt-2">
          <span className="font-semibold text-gray-200">Plataformas:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {mediaItem.platforms.map((platform, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      )}

      {mediaItem.awards && mediaItem.awards.length > 0 && (
        <div className="mt-2">
          <span className="font-semibold text-gray-200">Prêmios:</span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {(showAllAwards ? mediaItem.awards : mediaItem.awards.slice(0, 3)).map((award, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-700/20 text-yellow-400 rounded-full text-sm flex items-center gap-1"
              >
                <FaAward /> {award}
              </span>
            ))}
            {mediaItem.awards.length > 3 && (
              <button
                type="button"
                className="text-sm text-yellow-300 hover:text-yellow-200 underline underline-offset-2"
                onClick={() => setShowAllAwards((v) => !v)}
              >
                {showAllAwards ? "ver menos" : `ver mais (${mediaItem.awards.length - 3})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
