import { useAuth } from "../hooks/useAuth";
import RecommendationGrid from "../components/home/RecommendationGrid";
import TrendingSection from "../components/home/TrendingSection";
import UnauthRecommendationCTA from "../components/home/UnauthRecommendationCTA";
import CustomRecommendationButton from "../components/home/CustomRecommendationButton";
import { FaPlayCircle } from "react-icons/fa";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full flex flex-col items-center px-4 py-12 relative">
     
      {/* Título principal */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center flex items-center justify-center gap-3 animate-fadeSlideIn">
        <FaPlayCircle className="text-blue-500 drop-shadow-md" size={50} />
        <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow">
          MediaHub
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10 text-center leading-relaxed">
        Explore, descubra e compartilhe seus{" "}
        <span className="text-blue-400 font-semibold">favoritos</span> em{" "}
        <b>filmes</b>, <b>games</b>, <b>músicas</b>, <b>séries</b> e <b>livros</b>. 
      </p>

      <div className="w-full max-w-7xl flex flex-col items-center gap-12">
        {isAuthenticated ? (
          <>
            <RecommendationGrid />
            <TrendingSection />
            <CustomRecommendationButton />
          </>
        ) : (
          <UnauthRecommendationCTA />
        )}
      </div>
    </div>
  );
}
