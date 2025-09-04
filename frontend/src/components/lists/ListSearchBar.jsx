import { useState, useRef, useEffect } from "react";
import { ALL_MEDIA } from "../../mockdata/mockMedia";

export default function ListSearchBar({ onSearchResults, modalMode = false }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);
  
  const filteredResults = ALL_MEDIA.filter((media) =>
    media.title.toLowerCase().includes(query.toLowerCase())
  );

  // Notificar resultados quando em modal mode
  useEffect(() => {
    if (modalMode && onSearchResults) {
      onSearchResults(filteredResults);
    }
  }, [query, modalMode, onSearchResults, filteredResults]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!modalMode) {
          setIsExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalMode]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault(); // Prevenir submit em forms
    }
  };

  // No modal mode, o input está sempre visível e expandido
  const showInput = modalMode || isExpanded;
  
  // NOVO: No modal mode, NÃO mostrar resultados próprios
  const showResults = !modalMode && isOpen && query;

  return (
    <div className="relative" ref={searchRef}>
      {/* Container da busca */}
      <div className="flex items-center">
        {/* Input de busca - aparece quando expandido ou no modal */}
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
                  ? "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  : "w-64 px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              }`}
            />
            
            {/* Ícone de pesquisa dentro do input no modal mode */}
            {modalMode && (
              <div className="absolute right-3 top-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resultados da busca - APENAS quando NÃO for modal mode */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-xl p-4 text-left max-h-80 overflow-y-auto z-50 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
              Resultados da busca
            </h2>
          </div>
          
          {filteredResults.slice(0, 5).length > 0 ? (
            <ul className="space-y-2">
              {filteredResults.slice(0, 5).map((media) => (
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
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={media.image} 
                        alt={media.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium truncate">
                            {media.title}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                            {media.type}
                          </span>
                        </div>
                        {media.year && (
                          <p className="text-sm text-gray-500 mt-1">
                            {media.year}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 py-4 text-center">Nenhum resultado encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}