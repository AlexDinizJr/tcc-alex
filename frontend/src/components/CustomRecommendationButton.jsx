import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

export default function CustomRecommendationButton() {
  return (
    <div className="w-full flex justify-center my-12">
      <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8 max-w-3xl text-center">
        
        {/* Título com ícone SVG */}
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <svg 
            className="w-6 h-6 text-blue-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
          Procurando algo mais específico?
        </h3>
        
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Use nossa ferramenta avançada para criar recomendações super específicas 
          por gênero, plataforma, ano e muito mais!
        </p>
        
        {/* Botão de ação */}
        <Link
          to="/custom-recommendations"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-lg group"
        >
          {/* Ícone de engrenagem */}
          <FiSettings className="w-5 h-5 mr-3" />

          Criar Recomendações Personalizadas
          <svg 
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        
        <p className="text-sm text-gray-400 mt-4">
          Filtre por: Gênero • Plataforma • Ano • Classificação • e muito mais!
        </p>
      </div>
    </div>
  );
}
