import { Link } from "react-router-dom";

export default function ProfileHeader({ user, isOwner }) {
  const hasBio = user?.bio && user.bio.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
      {/* Header */}
      <div className="h-40 relative">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Capa"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        )}

        {/* Avatar sobreposto */}
        <div className="absolute -bottom-12 left-6">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-400 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="pt-16 pb-6 px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            {/* Nome e Username */}
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h1>
            <p className="text-gray-500 mb-1 py-1">@{user.username}</p> {/* Adicionado username */}
            
            {/* Bio */}
            {hasBio ? (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">📝<b> Biografia</b></h3>
                <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm italic">
                  Este usuário ainda não adicionou uma biografia.
                </p>
              </div>
            )}
            
            <p className="text-gray-500 text-xs">📅 Membro desde Jan 2023</p>
          </div>
          
          {/* Botão de Configurações apenas se dono do perfil */}
          {isOwner && (
            <div className="mt-4 md:mt-0">
              <Link
                to="/settings"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Configurações
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}