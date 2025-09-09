import { Link } from "react-router-dom";
import { FiUser, FiList } from "react-icons/fi";

export default function AuthSection({ user, isAuthenticated, onLogout, mobile = false, profileLink = "#", listsLink = "#" }) {
  if (mobile) {
    return (
      <div className="space-y-3">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || user?.email}</p>
                {user?.username && <p className="text-xs text-gray-400">@{user.username}</p>}
              </div>
            </div>
            
            <Link
              to={profileLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiUser className="text-gray-300" />
              Meu Perfil
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
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-700 bg-red-600 transition-colors flex items-center gap-2"
            >
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
              className="block px-4 py-2 rounded-lg hover:bg-blue-700 bg-blue-600 transition-colors"
            >
              Cadastre-se
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-500">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="hidden lg:block">
              <span className="text-sm text-gray-300 block">Olá, {user?.name || user?.email}</span>
              {user?.username && <span className="text-xs text-gray-400 block">@{user.username}</span>}
            </div>
          </div>
          
          <Link
            to={profileLink}
            className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <FiUser className="text-gray-300" />
            Meu Perfil
          </Link>

          <Link 
            to={listsLink}
            className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <FiList className="text-gray-300" />
            Minhas Listas
          </Link>
          
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg hover:bg-red-700 bg-red-600 transition-colors text-sm"
          >
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
