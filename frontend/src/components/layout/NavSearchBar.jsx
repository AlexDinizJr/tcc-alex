import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchMediaByQuery } from "../../services/mediaService";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Buscar resultados do backend sempre que query mudar
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      const data = await searchMediaByQuery(query);
      // garante que results seja sempre array
      setResults(Array.isArray(data) ? data : []);
    };

    fetchResults();
  }, [query]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchIconClick = () => {
    if (isExpanded && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsExpanded(false);
      setIsOpen(false);
      setQuery("");
    } else {
      setIsExpanded(true);
      setTimeout(() => {
        if (searchRef.current) searchRef.current.querySelector('input').focus();
      }, 10);
    }
  };

  const handleInputFocus = () => setIsOpen(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsExpanded(false);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700" ref={searchRef}>
      <div className="flex items-center">
        {isExpanded && (
          <div className="relative mr-2">
            <input
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              onKeyPress={handleKeyPress}
              className="w-50 px-3 py-1 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}
        
        <button
          onClick={handleSearchIconClick}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
          title="Buscar mídias"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {isExpanded && (
          <button
            onClick={() => {
              setIsExpanded(false);
              setIsOpen(false);
              setQuery("");
              setResults([]);
            }}
            className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
            title="Fechar busca"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 shadow-xl rounded-xl p-4 text-gray-100 max-h-64 overflow-y-auto z-50 scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-100 text-sm uppercase tracking-wide">
              Resultados da busca
            </h2>
            <Link
              to={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => {
                setIsOpen(false);
                setIsExpanded(false);
                setQuery("");
                setResults([]);
              }}
              className="text-xs text-blue-400 hover:text-blue-500 font-medium"
            >
              Ver todos →
            </Link>
          </div>
          
          {results.slice(0, 5).length > 0 ? (
            <ul className="space-y-2">
              {results.slice(0, 5).map((media) => (
                <li key={media.id}>
                  <Link
                    to={`/media/${media.id}`}
                    onClick={() => {
                      setQuery("");
                      setIsOpen(false);
                      setIsExpanded(false);
                      setResults([]);
                    }}
                    className="block p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={media.image} 
                        alt={media.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-100 font-medium truncate">
                            {media.title}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-700 text-blue-100 rounded-full whitespace-nowrap">
                            {media.type}
                          </span>
                        </div>
                        {media.year && (
                          <p className="text-sm text-gray-400 mt-1">{media.year}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 py-4 text-center">Nenhum resultado encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}