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
      transition-transform transform-gpu duration-300 hover:scale-105 hover:z-10 cursor-pointer border border-gray-700/50
      min-w-[250px] max-w-[350px] w-full h-30"
    >
      {/* Informações do usuário */}
      <div className="flex flex-col justify-between h-full">
        <div>
          
          <h2 className="text-lg font-semibold text-white flex items-center gap-1">
            <span
              className="overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {user.name}
            </span>
          </h2>

          <p className="text-gray-400 text-sm flex items-center gap-1">
            @{user.username}
          </p>

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
