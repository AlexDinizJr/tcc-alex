import { Link } from "react-router-dom";
import { FaUser, FaGenderless, FaMapMarkerAlt } from "react-icons/fa";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { calculateAge } from "../../utils/calculateAge";
import { CiCalendar } from "react-icons/ci";

export default function ProfileHeader({ user, isOwner }) {
  const hasBio = user?.bio && user.bio.trim().length > 0;

  // Calcular idade a partir da data de nascimento
  const age = user?.birthDate ? calculateAge(user.birthDate) : null;

  // Formatar data de criação
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
  const formattedDate = createdAt
    ? new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(createdAt)
    : "Data desconhecida";

  // Formatar gênero para exibição com ícones
  const renderGenderInfo = (gender) => {
    const genderConfig = {
      MALE: { label: "Masculino", icon: <IoMdMale /> },
      FEMALE: { label: "Feminino", icon: <IoMdFemale /> },
      OTHER: { label: "Outro", icon: <FaUser /> },
      NONE: { label: "Não informado", icon: <FaGenderless /> },
    };
    const config = genderConfig[gender] || genderConfig["NONE"];
    return (
      <div className="flex items-center gap-1 text-white text-sm">
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-700/50">
      {/* Header */}
      <div className="h-40 relative">
        {user.coverImage ? (
          <img src={user.coverImage} alt="Capa" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600/70 to-indigo-600/70"></div>
        )}

        {/* Avatar sobreposto */}
        <div className="absolute -bottom-12 left-6">
          <div className="h-24 w-24 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-300 font-bold">{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="pt-12 pb-6 px-6 relative">
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

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Conteúdo principal */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400 py-2 flex items-center gap-1">@{user.username}</p>
                {(age || user.gender || user.location) && (
                  <div className="p-3 mb-2 bg-gray-700/50 rounded-lg border md:ml-4 border-gray-600/50 flex flex-wrap gap-4">
                    {age && (
                      <div className="flex items-center gap-1 text-white text-sm">
                        <span>Idade:</span>
                        <span>{age} anos</span>
                      </div>
                    )}
                    {user.gender && renderGenderInfo(user.gender)}
                    {user.location && (
                      <div className="flex items-center gap-1 text-white text-sm">
                        <FaMapMarkerAlt />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Biografia */}
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
              <CiCalendar /> Membro desde {formattedDate}
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