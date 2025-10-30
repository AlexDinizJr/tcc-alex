import { useMemo } from "react";

export default function HeroHeader({
  title,
  items = [],
  totalItems = 0,
  sortBy,
  onChangeSort,
  backgroundImage,
}) {
  const highlight = items[0] || null;

  const stats = useMemo(() => {
    return { count: Number(totalItems) || 0 };
  }, [totalItems]);

  const tabs = [
    { label: "Populares", value: "popular" },
    { label: "Lançamentos", value: "newest" },
    { label: "Melhor avaliados", value: "rating" },
    { label: "A-Z", value: "title" },
  ];

  const bg = backgroundImage || highlight?.image || "";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-700/60 mb-6">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/90" />
      <div className="relative z-10 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white drop-shadow">{title}</h2>
              {stats.count > 0 && (
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/90">{stats.count} itens</span>
              )}
            </div>
            {highlight?.description && (
              <p className="hidden md:block text-gray-300 line-clamp-2 max-w-3xl">{highlight.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChangeSort?.(t.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    sortBy === t.value
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-800/70 text-gray-200 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {highlight?.image && (
            <div className="hidden md:block w-44 h-64 rounded-xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0">
              <img
                src={highlight.image}
                alt={highlight.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
