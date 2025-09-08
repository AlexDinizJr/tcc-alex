import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 to-gray-100 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Ícone animado */}
        <div className="mb-6">
          <div className="text-8xl mb-2">🔍</div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
        </div>

        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página não encontrada
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Não conseguimos encontrar <strong>{currentPath}</strong>. 
          A página pode ter sido movida ou não existe mais.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Ir para a página inicial
          </Link>

          <button
            onClick={() => window.history.back()}
            className="block w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Voltar
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Precisa de ajuda?{" "}
            <a href="/#" className="text-blue-600 hover:text-blue-800">
              Entre em contato com o suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}