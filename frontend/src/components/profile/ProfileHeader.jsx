import { Link } from "react-router-dom";

export default function ProfileHeader({ user, isOwner }) {
  const hasBio = user?.bio && user.bio.trim().length > 0;

  // Formatar data de criação
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
  const formattedDate = createdAt
    ? new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(createdAt)
    : "Data desconhecida";

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-700/50">
      {/* Header */}
      <div className="h-40 relative">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Capa"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600/70 to-indigo-600/70"></div>
        )}

        {/* Avatar sobreposto */}
        <div className="absolute -bottom-12 left-6">
          <div className="h-24 w-24 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-300 font-bold">
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
            <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
            <p className="text-gray-400 mb-1 py-1 flex items-center gap-1">
              {/* ícone de @ */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v4m0 0l-3-3m3 3l3-3" />
              </svg>
              @{user.username}
            </p>
            
            {/* Bio */}
            {hasBio ? (
              <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                  {/* ícone de biografia */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8a9 9 0 110-18 9 9 0 010 18z" />
                  </svg>
                  <b>Biografia</b>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <p className="text-gray-400 text-sm italic flex items-center gap-1">
                  {/* ícone de informação */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Este usuário ainda não adicionou uma biografia.
                </p>
              </div>
            )}
            
            {/* Data de criação */}
            <p className="text-gray-400 text-xs flex items-center gap-1">
              {/* ícone de calendário */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Membro desde {formattedDate}
            </p>
          </div>
          
          {/* Botão de Configurações apenas se dono do perfil */}
          {isOwner && (
            <div className="mt-4 md:mt-0">
              <Link
                to="/settings"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition text-sm hover:bg-blue-700 border border-blue-500/50"
              >
                {/* ícone de configurações */}
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
