import { Link } from "react-router-dom";
import { FaUser, FaGenderless, FaMapMarkerAlt } from "react-icons/fa";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { calculateAge } from "../../utils/calculateAge"

export default function ProfileHeader({ user, isOwner }) {
  const hasBio = user?.bio && user.bio.trim().length > 0;
  
  // Calcular idade a partir da data de nascimento
  const age = user?.birthDate ? calculateAge(user.birthDate) : null;
  
  // Verificar se há informações adicionais para mostrar
  const hasAdditionalInfo = age || user?.gender || user?.location;

  // Formatar data de criação
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
  const formattedDate = createdAt
    ? new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(createdAt)
    : "Data desconhecida";

  // Formatar gênero para exibição com ícones
  const renderGenderInfo = (gender) => {
    const genderConfig = {
      'MALE': { 
        label: 'Masculino', 
        icon: <IoMdMale />,
      },
      'FEMALE': { 
        label: 'Feminino', 
        icon: <IoMdFemale />,
      },
      'OTHER': { 
        label: 'Outro', 
        icon: <FaUser />,
      },
      'NONE': { 
        label: 'Não informado', 
        icon: <FaGenderless />,
      }
    };

    const config = genderConfig[gender] || genderConfig['NONE'];
    
    return (
      <div className="flex items-center gap-2">
        <span className={`text-lg ${config.color}`}>
          {config.icon}
        </span>
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">Gênero:</span>
          <span className="text-white font-medium text-sm">{config.label}</span>
        </div>
      </div>
    );
  };

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
      <div className="pt-16 pb-6 px-6 relative">
        {/* Botão de Configurações Desktop */}
        {isOwner && (
          <div className="hidden md:block absolute top-6 right-6">
            <Link
              to="/settings"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition text-sm hover:bg-blue-700 border border-blue-500/50"
            >
              Configurações
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          {/* Conteúdo principal: nome, username e bio */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
            <p className="text-gray-400 mb-3 py-1 flex items-center gap-1">
              @{user.username}
            </p>

            {/* Informações adicionais - idade, gênero e localidade */}
            {hasAdditionalInfo && (
              <div className="mb-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Idade */}
                  {age && (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Idade:</span>
                        <span className="text-white font-medium text-sm">{age} anos</span>
                      </div>
                    </div>
                  )}

                  {/* Gênero */}
                  {user.gender && renderGenderInfo(user.gender)}

                  {/* Localização */}
                  {user.location && (
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt />
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Localização:</span>
                        <span className="text-white font-medium text-sm">{user.location}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasBio ? (
              <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                  <b>Biografia</b>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <p className="text-gray-400 text-sm italic flex items-center gap-1">
                  Este usuário ainda não adicionou uma biografia.
                </p>
              </div>
            )}

            <p className="text-gray-400 text-xs flex items-center gap-1">
              Membro desde {formattedDate}
            </p>
          </div>
        </div>

        {/* Botão de Configurações Mobile */}
        {isOwner && (
          <div className="mt-4 md:hidden flex justify-start">
            <Link
              to="/settings"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition text-sm hover:bg-blue-700 border border-blue-500/50"
            >
              Configurações
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}