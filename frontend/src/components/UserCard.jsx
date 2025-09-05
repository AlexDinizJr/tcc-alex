import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { mockUsers } from "../mockdata/mockUsers";

export default function UserCard({ user: userProp }) {
  const { user: loggedInUser } = useAuth();

  // Caso receba um usuário como prop, usamos ele; senão fallback para logado ou mock
  const userId = userProp?.id;
  const isOwner = loggedInUser?.id === userId;

  // Se for o próprio usuário, pega os dados atualizados do contexto
  // Caso contrário, usa a prop ou busca nos mockUsers
  const user = isOwner
    ? loggedInUser
    : userProp || mockUsers.find(u => u.id === userId) || {};

  const avatarUrl = user.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;

  return (
    <Link to={`/users/${user.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center hover:shadow-lg transition-shadow cursor-pointer">
        {/* Informações do usuário */}
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          {user.bio && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>

        {/* Avatar */}
        <div className="w-16 h-16 ml-4 flex-shrink-0">
          <img
            src={avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      </div>
    </Link>
  );
}
