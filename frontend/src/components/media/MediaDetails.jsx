import { FaAward } from "react-icons/fa";

export default function MediaDetails({ mediaItem }) {
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
      {/* Gêneros */}
      {mediaItem.genres && mediaItem.genres.length > 0 && (
        <p className="text-gray-200">
          <span className="font-semibold">Gêneros:</span> {mediaItem.genres.join(", ")}
        </p>
      )}

      {renderMediaField(mediaItem.directors, "Diretor(es)")}
      {renderMediaField(mediaItem.authors, "Autor(es)")}
      {renderMediaField(mediaItem.artists, "Artista(s)")}
      {renderMediaField(mediaItem.developers, "Desenvolvedor(es)")}
      {renderMediaField(mediaItem.producers, "Produtor(es)")}
      {renderMediaField(mediaItem.writers, "Roteirista(s)")}
      {renderMediaField(mediaItem.musicians, "Músico(s)")}

      {renderMediaField(mediaItem.cast, "Elenco", (cast) => (
        <p className="text-gray-200">
          <span className="font-semibold">Elenco:</span> {cast.slice(0, 3).join(", ")}
          {cast.length > 3 && ` e mais ${cast.length - 3}`}
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

      {renderMediaField(mediaItem.publisher, "Editora")}
      {renderMediaField(mediaItem.language, "Idioma")}
      {renderMediaField(mediaItem.country, "País")}

      {mediaItem.awards && mediaItem.awards.length > 0 && (
        <div className="mt-2">
          <span className="font-semibold text-gray-200">Prêmios:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {mediaItem.awards.map((award, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-700/20 text-yellow-400 rounded-full text-sm flex items-center gap-1"
              >
                <FaAward /> {award}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
