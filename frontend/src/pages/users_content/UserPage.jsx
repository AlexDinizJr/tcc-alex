import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProfileHeader from "../../components/profile/ProfileHeader";
import UserLists from "../../components/profile/UserLists";
import SavedItems from "../../components/profile/UserSavedItems";
import UserFavorites from "../../components/profile/UserFavorites";
import UserReviews from "../../components/profile/UserReviews";
import UserStats from "../../components/profile/UserStats";
import { 
  convertMediaIdsToObjects, 
  ensureArray, 
  getListsByUserId, 
  getReviewsByUserId, 
} from "../../utils/MediaHelpers";
import { mockUsers } from "../../mockdata/mockUsers";
import { FaLock } from "react-icons/fa";

export default function UserProfilePage() {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();

  const isOwner = loggedInUser?.username === username;
  const user = isOwner
    ? loggedInUser
    : mockUsers.find(u => u.username === username);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Usuário não encontrado.
        </p>
      </div>
    );
  }

  // Verifica se o perfil é privado e não é o dono
  const isPrivate = user.privacy?.profileVisibility === "private" && !isOwner;

  const canViewSaved = !isPrivate && (user.privacy?.showSavedItems || isOwner);
  const canViewFavorites = !isPrivate && (user.privacy?.showFavorites || isOwner);
  const canViewReviews = !isPrivate && (user.privacy?.showReviews || isOwner);
  const canViewStats = !isPrivate && (user.privacy?.showStats || isOwner);

  const savedMediaItems = canViewSaved ? convertMediaIdsToObjects(user.savedMedia) : [];
  const userFavoritesItems = canViewFavorites ? convertMediaIdsToObjects(user.favorites) : [];
  const userReviews = canViewReviews 
    ? (ensureArray(user.reviews).length > 0 ? ensureArray(user.reviews) : getReviewsByUserId(user.id))
    : [];

  const userLists = ensureArray(user.lists).length > 0 
    ? ensureArray(user.lists) 
    : getListsByUserId(user.id);

  // Card reutilizável para itens privados
  const PrivateCard = ({ message }) => (
    <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 text-center text-gray-300 flex flex-col items-center justify-center min-h-[180px]">
      <FaLock className="text-3xl mb-3 text-gray-400" />
      <p className="text-white font-medium">{message}</p>
    </div>
  );

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <ProfileHeader user={user} isOwner={isOwner} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">

          {/* Itens Salvos */}
          {canViewSaved ? (
            <SavedItems savedItems={savedMediaItems} username={user.username} />
          ) : (
            <PrivateCard message="Este usuário mantém seus itens salvos privados." />
          )}

          {/* Favoritos */}
          {canViewFavorites ? (
            <UserFavorites userFavorites={userFavoritesItems} username={user.username} />
          ) : (
            <PrivateCard message="Este usuário mantém seus favoritos privados." />
          )}

          {/* Avaliações */}
          {canViewReviews ? (
            <UserReviews userReviews={userReviews} username={user.username} />
          ) : (
            <PrivateCard message="Este usuário mantém suas avaliações privadas." />
          )}

          {/* Estatísticas */}
          {canViewStats ? (
            <UserStats user={user} />
          ) : (
            <PrivateCard message="Este usuário mantém suas estatísticas privadas." />
          )}

          {/* Listas */}
          <UserLists userLists={userLists} username={user.username} />

        </div>
      </div>
    </div>
  );
}
