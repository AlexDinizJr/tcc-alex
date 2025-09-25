import { useState, useRef, useEffect } from "react";
import api from "../../services/api";

export default function ListSearchBar({ onSearchResults, modalMode = false }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Busca no backend sempre que a query mudar
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        if (modalMode && onSearchResults) onSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/media/search", { params: { q: query } });
        const searchResults = Array.isArray(response.data.results) ? response.data.results : [];
        setResults(searchResults);

        if (modalMode && onSearchResults) {
          onSearchResults(searchResults);
        }
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
        setResults([]);
        if (modalMode && onSearchResults) onSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, modalMode, onSearchResults]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!modalMode) setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalMode]);

  const handleInputFocus = () => setIsOpen(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) e.preventDefault();
  };

  const showInput = modalMode || isExpanded;
  const showResults = !modalMode && isOpen && query;

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center">
        {showInput && (
          <div className="relative mr-2">
            <input
              type="text"
              placeholder="Buscar filmes, séries, games, músicas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              onKeyPress={handleKeyPress}
              className={`${
                modalMode 
                  ? "w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400" 
                  : "w-64 px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              }`}
            />
            {modalMode && (
              <div className="absolute right-3 top-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
          </div>
        )}
        {!modalMode && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Buscar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 shadow-xl rounded-xl p-4 text-left max-h-80 overflow-y-auto z-50 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-white text-sm uppercase tracking-wide">
              Resultados da busca
            </h2>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
              {results.length} encontrados
            </span>
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Carregando...</p>
          ) : results.length > 0 ? (
            <ul className="space-y-2">
              {results.slice(0, 5).map((media) => (
                <li key={media.id}>
                  <a
                    href={`/media/${media.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setQuery("");
                      setIsOpen(false);
                      setIsExpanded(false);
                      window.location.href = `/media/${media.id}`;
                    }}
                    className="block p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer border border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={media.image} 
                        alt={media.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium truncate">{media.title}</span>
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full whitespace-nowrap border border-blue-500/30">{media.type}</span>
                        </div>
                        {media.year && <p className="text-sm text-gray-400 mt-1">{media.year}</p>}
                        {media.rating && (
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className="text-xs text-gray-400 ml-1">{media.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="text-center py-4">
              <div className="text-gray-400 text-4xl mb-2">🔍</div>
              <p className="text-gray-400">Nenhum resultado encontrado para</p>
              <p className="text-white font-medium">"{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}