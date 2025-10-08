import { Link } from "react-router-dom";
import { FiUser, FiList } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";

export default function AuthSection({ user, isAuthenticated, onLogout, mobile = false, profileLink = "#", listsLink = "#" }) {
  if (mobile) {
    return (
      <div className="space-y-3">
        {isAuthenticated ? (
          <>
            {/* Avatar + nome como botão do perfil */}
            <Link
              to={profileLink}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors group"
              title="Meu Perfil"
            >
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-500 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || user?.email}</p>
                {user?.username && <p className="text-xs text-gray-400">@{user.username}</p>}
              </div>
            </Link>

            <Link 
              to={listsLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiList className="text-gray-300" />
              Minhas Listas
            </Link>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-red-400 transition-colors w-full text-left"
            >
              <FiLogOut className="text-gray-300" />
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cadastre-se
            </Link>
          </>
        )}
      </div>
    );
  }

  // Versão desktop
  return (
    <div className="text-sm font-medium flex items-center gap-4">
      {isAuthenticated ? (
        <>
          {/* Avatar + nome como botão do perfil */}
          <Link
            to={profileLink}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-700 transition-colors group"
            title="Meu Perfil"
          >
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-500 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-sm text-gray-300 block">{user?.name || user?.email}</span>
              {user?.username && <span className="text-xs text-gray-400 block">@{user.username}</span>}
            </div>
          </Link>

          {/* Minhas Listas */}
          <Link 
            to={listsLink}
            className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <FiList className="text-gray-300" />
            Minhas Listas
          </Link>

          {/* Botão de sair */}
          <button
            onClick={onLogout}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-700 bg-red-600 transition-colors text-sm"
          >
            <FiLogOut className="text-gray-300" />
            Sair
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg hover:bg-blue-700 bg-blue-600 transition-colors"
          >
            Cadastre-se
          </Link>
        </>
      )}
    </div>
  );
}