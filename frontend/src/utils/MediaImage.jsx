import { useState } from "react";

export function MediaImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-t-2xl bg-gray-700/50 relative">
      {!loaded && <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-transform duration-300 hover:scale-110 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}