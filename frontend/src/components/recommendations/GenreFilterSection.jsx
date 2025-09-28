// components/recommendations/GenreFilterSection.jsx
import { useState, useMemo } from "react";

export default function GenreFilterSection({ genres, selectedGenres, onGenreChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Filtra e limita gêneros
  const filteredGenres = useMemo(() => {
    let filtered = genres;
    
    // Filtra por busca
    if (searchTerm) {
      filtered = filtered.filter(genre => 
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Limita a exibição se não estiver mostrando todos
    if (!showAll) {
      filtered = filtered.slice(0, 30); // Mostra apenas os 30 primeiros
    }
    
    return filtered;
  }, [genres, searchTerm, showAll]);

  // Divide em 3 colunas
  const columns = useMemo(() => {
    const columnCount = 3;
    const columnSize = Math.ceil(filteredGenres.length / columnCount);
    
    const columns = [];
    for (let i = 0; i < columnCount; i++) {
      columns.push(filteredGenres.slice(i * columnSize, (i + 1) * columnSize));
    }
    
    return columns;
  }, [filteredGenres]);

  return (
    <div className="space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar gêneros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Gêneros em 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
        {columns.map((columnGenres, columnIndex) => (
          <div key={columnIndex} className="space-y-2">
            {columnGenres.map((genre) => (
              <label key={genre} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => onGenreChange(genre)}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-400 bg-gray-700/70"
                />
                <span className="ml-2 text-sm text-white truncate" title={genre}>
                  {genre}
                </span>
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Contador e botão Mostrar Mais/Menos */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>
          {selectedGenres.length} de {genres.length} gêneros selecionados
        </span>
        
        {genres.length > 30 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {showAll ? 'Mostrar menos' : `Mostrar todos (${genres.length})`}
          </button>
        )}
      </div>

      {/* Gêneros selecionados */}
      {selectedGenres.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-300 mb-2">
            Gêneros selecionados:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white"
              >
                {genre}
                <button
                  onClick={() => onGenreChange(genre)}
                  className="ml-1 hover:text-blue-200"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}