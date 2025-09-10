import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="relative z-10 bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl w-full max-w-lg border border-gray-700/50 shadow-xl text-center">
      
        <div className="mb-6 flex justify-center">
          <svg
            className="w-20 h-20 text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold bg-blue-600 bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Página não encontrada
        </h2>

        <p className="text-gray-400 mb-6 leading-relaxed">
          Não conseguimos encontrar <strong>{currentPath}</strong>.<br />
          A página pode ter sido movida ou não existe mais.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Ir para a página inicial
          </Link>

          <button
            onClick={() => window.history.back()}
            className="block w-full border border-gray-600 text-gray-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Voltar
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700/40">
          <p className="text-sm text-gray-400">
            Precisa de ajuda?{" "}
            <a href="/#" className="text-blue-400 hover:text-blue-500">
              Entre em contato com o suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
