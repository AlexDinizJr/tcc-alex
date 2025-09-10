import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { mockUsers } from "../mockdata/mockUsers";
import { BackToProfile } from "../components/profile/BackToProfile";
import { FaLock } from "react-icons/fa";

export default function ProtectedContentRoute({ children, contentType }) {
  const params = useParams();
  const { username } = params;
  const { user: loggedInUser } = useAuth();

  const isOwner = loggedInUser?.username === username;
  const user = isOwner ? loggedInUser : mockUsers.find(u => u.username === username);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Usuário não encontrado.
        </p>
      </div>
    );
  }

  // Função que verifica se o usuário pode ver o conteúdo
  const canViewContent = () => {
    if (isOwner) return true; // dono sempre vê

    switch (contentType) {
      case "lists":
        // Rota de todas as listas: libera se houver pelo menos uma pública
        return (user.lists || []).some(list => list.isPublic);

      case "list": {
        // Lista individual: permite se for pública
        const targetListId = parseInt(params.id);
        const targetList = (user.lists || []).find(l => l.id === targetListId);
        return targetList ? targetList.isPublic : false;
      }

      case "reviews":
        return user.privacy?.showReviews === true;
      case "favorites":
        return user.privacy?.showFavorites === true;
      case "saved":
        return user.privacy?.showSavedItems === true;
      case "stats":
        return user.privacy?.showStats === true;
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
