import { Link } from "react-router-dom";

export function BackToProfile({ username, className }) {
  if (!username) return null;

  return (
    <Link
      to={`/users/${username}`}
      className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className || ""}`}
    >
      {/* Ícone opcional de voltar */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Voltar ao Perfil
    </Link>
  );
}