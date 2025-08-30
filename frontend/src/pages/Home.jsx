import RecommendationGrid from "../components/RecommendationGrid";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        RecommendationHub 🎬🎮🎵📺📚
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl">
        Conheça novas experiências de <b>filmes</b>, <b>games</b>, <b>músicas</b>,{" "}
        <b>séries de TV</b> e <b>livros</b>.
      </p>

      <div className="p-4 w-full flex flex-col items-center">
        {/* Barra de pesquisa sempre visível */}

        {/* Grid só aparece se logado */}
        {isAuthenticated && <RecommendationGrid />}
      </div>
    </div>
  );
}
