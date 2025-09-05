export default function MediaDetails({ mediaItem }) {
  const renderMediaField = (field, label, renderFunction) => {
    if (!field) return null;
    if (Array.isArray(field) && field.length === 0) return null;
    if (renderFunction) return renderFunction(field);

    return (
      <p className="text-gray-700">
        <span className="font-semibold">{label}:</span>{" "}
        {Array.isArray(field) ? field.join(", ") : field}
      </p>
    );
  };

  return (
    <div className="mb-6">
      {/* Gêneros */}
      {mediaItem.genres && mediaItem.genres.length > 0 && (
        <p className="text-gray-700">
          <span className="font-semibold">Gêneros:</span>{" "}
          {mediaItem.genres.join(", ")}
        </p>
      )}

      {/* Classificação etária */}
      {mediaItem.classification && (
        <p className="text-gray-700">
          <span className="font-semibold">Classificação:</span>{" "}
          {mediaItem.classification}
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
        <p className="text-gray-700">
          <span className="font-semibold">Elenco:</span> {cast.slice(0, 3).join(", ")}
          {cast.length > 3 && ` e mais ${cast.length - 3}`}
        </p>
      ))}
      
      {mediaItem.platforms && mediaItem.platforms.length > 0 && (
        <div className="mt-2">
          <span className="font-semibold text-gray-700">Plataformas:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {mediaItem.platforms.map((platform, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
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
          <span className="font-semibold text-gray-700">Prêmios:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {mediaItem.awards.map((award, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                🏆 {award}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
