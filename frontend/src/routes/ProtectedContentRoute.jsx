import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchUserByUsername } from "../services/userService";
import { BackToProfile } from "../components/profile/BackToProfile";
import { FaLock } from "react-icons/fa";

export default function ProtectedContentRoute({ children, contentType }) {
  const { username, id } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = loggedInUser?.username === username;

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchUserByUsername(username, isOwner ? { includePrivate: true } : {});
        
        if (mounted) {
          setProfileUser(data);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        if (mounted) {
          if (error.response?.status === 404) {
            setError("Usuário não encontrado");
          } else {
            setError("Erro ao carregar perfil");
          }
          setProfileUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (username) {
      loadUser();
    } else {
      setLoading(false);
      setError("Username não fornecido");
    }

    return () => {
      mounted = false;
    };
  }, [username, isOwner]);

  const canViewContent = () => {
    if (!profileUser) return false;
    if (isOwner) return true;

    switch (contentType) {
      case "lists":
        if (profileUser.showLists === false) {
          return (profileUser.lists || []).some(
            (list) => list.isPublic && list.isPublicallyViewable === true
          );
        }
        return (profileUser.lists || []).some((list) => list.isPublic);

      case "list":
        const targetListId = parseInt(id);
        const targetList = (profileUser.lists || []).find((l) => l.id === targetListId);
        if (!targetList) return false;

        if (targetList.isPublic) return true;
        if (targetList.isPublicallyViewable === true) return true;

        return false;
      case "reviews":
        return profileUser.showReviews === true;
      case "favorites":
        return profileUser.showFavorites === true;
      case "saved":
        return profileUser.showSavedItems === true;
      case "stats":
        return profileUser.showStats === true;
      default:
        return false;
    }
  };

  const getContentTypeText = () => {
    switch (contentType) {
      case "lists": return "listas";
      case "list": return "esta lista";
      case "reviews": return "avaliações";
      case "favorites": return "favoritos";
      case "saved": return "itens salvos";
      case "stats": return "estatísticas";
      default: return "conteúdo";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-300">Carregando...</span>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <FaLock className="text-5xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2 text-center">
          {error === "Usuário não encontrado" ? "Usuário Não Encontrado" : "Erro ao Carregar"}
        </h2>
        <p className="text-gray-400 text-center mb-4">
          {error === "Usuário não encontrado" 
            ? "O usuário que você está tentando acessar não existe."
            : "Ocorreu um erro ao carregar o perfil do usuário."
          }
        </p>
        <BackToProfile username={username} className="mt-4" />
      </div>
    );
  }

  const canView = canViewContent();
  
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <FaLock className="text-5xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2 text-center">
          Conteúdo Restrito
        </h2>
        <p className="text-gray-400 text-center mb-4">
          {isOwner 
            ? `Você optou por manter ${getContentTypeText()} privado.`
            : `Este usuário optou por manter ${getContentTypeText()} privado.`
          }
        </p>
        <BackToProfile username={username} className="mt-4" />
      </div>
    );
  }

  return children;
}