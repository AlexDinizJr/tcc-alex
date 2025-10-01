import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { fetchUserById } from "../../services/userService";

export default function UserCard({ user: userProp }) {
  const { user: loggedInUser } = useAuth();
  const userId = userProp?.id;
  const isOwner = loggedInUser?.id === userId;

  const [user, setUser] = useState(userProp || {});

  useEffect(() => {
    if (!isOwner && userId) {
      async function loadUser() {
        try {
          const data = await fetchUserById(userId);
          setUser(data);
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
      }
      loadUser();
    } else if (isOwner) {
      setUser(loggedInUser);
    }
  }, [userId, isOwner, loggedInUser]);

  const avatarUrl = user.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;

  return (
    <Link to={`/users/${user.username}`} className="block mx-auto w-full max-w-xs">
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-4 flex justify-between items-center 
      hover:shadow-white/20 transition-shadow cursor-pointer border border-gray-700/50
      min-w-[250px] max-w-[350px] w-full h-30"
    >
      {/* Informações do usuário */}
      <div className="flex flex-col justify-between h-full">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-1">
            {user.name}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7.5 7.5 0 0112 15a7.5 7.5 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </h2>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v4m0 0l-3-3m3 3l3-3" />
            </svg>
            @{user.username}
          </p>
          {user.bio && (
            <p className="text-gray-300 text-xs mt-1 line-clamp-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="w-16 h-16 ml-4 flex-shrink-0 relative">
        <img
          src={avatarUrl}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
        />
      </div>
    </div>
  </Link>
  );
}
