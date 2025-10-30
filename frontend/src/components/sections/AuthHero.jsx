import { useEffect, useState } from "react";
import { fetchTrending } from "../../services/recommendationService";

export default function AuthHero({ title, subtitle, children, rightAside }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetchTrending(12);
        const dataArray = Array.isArray(res?.data) ? res.data : [];
        const imgs = dataArray
          .map((m) => m.image)
          .filter((src) => typeof src === "string" && src.length > 0)
          .slice(0, 12);
        if (active) setImages(imgs);
      } catch {
        // fallback silencioso
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-indigo-900/20" />

      {/* Colagem de imagens (desktop) */}
      <div className="pointer-events-none absolute inset-0 opacity-25 hidden md:block">
        <div className="absolute left-0 top-0 w-full h-full">
          <div className="grid grid-cols-6 gap-1 w-full h-full">
            {images.map((src, i) => (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt="trending"
                  loading="lazy"
                  className="w-full h-full object-cover aspect-[2/3]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/90" />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Coluna esquerda - pitch/benefícios */}
          <div className="hidden md:block space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Descubra novas mídias
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-prose">
              Explore tendências, salve favoritos e receba recomendações
              personalizadas para filmes, séries, jogos, músicas e livros.
            </p>
            <ul className="text-gray-300 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Recomendações inteligentes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" /> Salve e favorite conteúdos
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Compartilhe listas
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Explore por plataformas
              </li>
            </ul>
            {rightAside}
          </div>

          {/* Coluna direita - Card de formulário (glass) */}
          <div className="backdrop-blur bg-gray-800/60 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl max-w-md w-full mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h2>
              {subtitle && <p className="text-gray-300 mt-2 text-sm">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
