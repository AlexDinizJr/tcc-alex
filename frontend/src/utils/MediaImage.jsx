import { useState } from "react";

export function MediaImage({ src, alt, index }) {
  const [loaded, setLoaded] = useState(false);

  // As 5 primeiras imagens carregam com prioridade
  const loadingType = index < 10 ? "eager" : "lazy";

  return (
    <div className="w-full h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-t-2xl bg-gray-700/50 relative">
      
      {/* Placeholder com blur */}
      {!loaded && (
        <div
          className="absolute inset-0 w-full h-full bg-gray-700/30 animate-pulse filter blur-sm scale-105"
        ></div>
      )}

      {/* Imagem real */}
      <img
        src={src}
        alt={alt}
        loading={loadingType}
        className={`w-full h-full object-cover transition-all duration-500 ease-in-out transform hover:scale-110 
          ${loaded ? "opacity-100 blur-0 scale-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
