import { useState, useEffect } from "react";

const StarRating = ({ maxStars = 5, onRatingChange, initialRating = 0, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverValue, setHoverValue] = useState(null);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleSet = (value) => {
    if (readOnly) return;
    const floatValue = parseFloat(value);
    setRating(floatValue);
    if (onRatingChange) onRatingChange(floatValue);
  };

  const handleClick = (e, starIndex) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    const value = starIndex - (isHalf ? 0.5 : 0);
    handleSet(value);
  };

  return (
    <div className={`flex space-x-1 ${readOnly ? "" : "cursor-pointer"}`}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const starIndex = i + 1;
        const hv = hoverValue;
        const effectiveValue = hv !== null ? hv : rating;

        // Lógica para estrelas cheias ou metade
        const fullStar = effectiveValue >= starIndex;
        const halfStar = effectiveValue >= starIndex - 0.5 && effectiveValue < starIndex;

        return (
          <div
            key={i}
            onMouseMove={(e) => {
              if (readOnly) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isHalf = x < rect.width / 2;
              setHoverValue(starIndex - (isHalf ? 0.5 : 0));
            }}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            onClick={(e) => handleClick(e, starIndex)}
            className="relative w-6 h-6"
            role={readOnly ? undefined : "button"}
            aria-label={`Estrela ${starIndex}`}
          >
            {/* Estrela de fundo (sempre cinza) */}
            <svg
              viewBox="0 0 20 20"
              className="w-6 h-6 absolute top-0 left-0 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            {/* Estrela amarela (preenchimento total ou parcial) */}
            {(fullStar || halfStar) && (
              <div 
                className="absolute top-0 left-0 overflow-hidden"
                style={{ 
                  width: fullStar ? '100%' : '50%',
                  height: '100%'
                }}
              >
                <svg
                  viewBox="0 0 20 20"
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}

            {/* Overlay para modo leitura (exibe a "meia estrela") */}
            {readOnly && halfStar && (
              <div className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: "none" }}>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;