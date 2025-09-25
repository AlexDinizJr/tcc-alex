import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchUserByUsername } from "../services/userService";
import { BackToProfile } from "../components/profile/BackToProfile";
import { FaLock } from "react-icons/fa";

export default function ProtectedContentRoute({ children, contentType }) {
  const { username, id } = useParams();
  const { user: loggedInUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner = loggedInUser?.username === username;

  useEffect(() => {
    async function loadUser() {
      if (isOwner) {
        setUser(loggedInUser);
        setLoading(false);
      } else {
        try {
          const data = await fetchUserByUsername(username);
          setUser(data);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    }
    loadUser();
  }, [username, isOwner, loggedInUser]);

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Usuário não encontrado.
        </p>
      </div>
    );
  }

  const canViewContent = () => {
    if (isOwner) return true;

    switch (contentType) {
      case "lists":
        return (user.lists || []).some(list => list.isPublic);
      case "list":
        const targetListId = parseInt(id);
        const targetList = (user.lists || []).find(l => l.id === targetListId);
        return targetList ? targetList.isPublic : false;
      case "reviews":
        return user.showReviews === true;
      case "favorites":
        return user.showFavorites === true;
      case "saved":
        return user.showSavedItems === true;
      case "stats":
        return user.showStats === true;
      default:
        return false;
    }
  };

  if (!canViewContent()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaLock className="text-3xl text-gray-400 mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Conteúdo Restrito
        </h2>
        <p className="text-gray-400 text-center">
          Este usuário optou por manter seu {contentType} privado.
        </p>
        <BackToProfile username={username} className="mt-4" />
      </div>
    );
  }

  return children;
}