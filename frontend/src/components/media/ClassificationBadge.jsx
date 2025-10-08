export default function ClassificationBadge({ classification }) {
  if (!classification) return null;

  // Mapeamento da classificação para o caminho do SVG
  const icons = {
    L: "/classifications/DJCTQ_-_L.svg.png",
    TEN: "/classifications/DJCTQ_-_10.svg.png",
    TWELVE: "/classifications/DJCTQ_-_12.svg.png",
    FOURTEEN: "/classifications/DJCTQ_-_14.svg.png",
    SIXTEEN: "/classifications/DJCTQ_-_16.svg.png",
    EIGHTEEN: "/classifications/DJCTQ_-_18.svg.png",
  };

  const iconSrc = icons[classification];
  if (!iconSrc) return null;

  return (
    <img
      src={iconSrc}
      alt={classification}
      className="h-6 w-6 border border-gray-400 rounded-sm"
    />
  );
}
