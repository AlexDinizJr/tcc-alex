import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProfileHeader from "../components/profile/ProfileHeader";
import UserLists from "../components/profile/UserLists";
import SavedItems from "../components/profile/SavedItems";
import UserFavorites from "../components/profile/UserFavorites";
import UserReviews from "../components/profile/UserReviews";
import UserStats from "../components/profile/UserStats";
import { 
  convertMediaIdsToObjects, 
  ensureArray, 
  getListsByUserId, 
  getReviewsByUserId, 
} from "../utils/MediaHelpers";
import { mockUsers } from "../mockdata/mockUsers";

export default function UserProfilePage() {
  const { username } = useParams(); // Alterado para receber username
  const { user: loggedInUser } = useAuth();

  // Encontrar usuário pelo username em vez do ID
  const isOwner = loggedInUser?.username === username;
  const user = isOwner 
    ? loggedInUser  // pega os dados atualizados do contexto
    : mockUsers.find(u => u.username === username); // Busca por username

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

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <ProfileHeader user={user} isOwner={isOwner} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">

          {/* Itens Salvos */}
          {canViewSaved ? (
            <SavedItems savedItems={savedMediaItems} />
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[180px]">
              <span className="text-3xl mb-3">🔒</span>
              <p className="text-gray-600 font-medium">
                Este usuário mantém seus itens salvos privados.
              </p>
            </div>
          )}

          {/* Favoritos */}
          {canViewFavorites ? (
            <UserFavorites userFavorites={userFavoritesItems} />
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[180px]">
              <span className="text-3xl mb-3">🔒</span>
              <p className="text-gray-600 font-medium">
                Este usuário mantém seus favoritos privados.
              </p>
            </div>
          )}

          {/* Avaliações */}
          {canViewReviews ? (
            <UserReviews userReviews={userReviews} />
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[180px]">
              <span className="text-3xl mb-3">🔒</span>
              <p className="text-gray-600 font-medium">
                Este usuário mantém suas avaliações privadas.
              </p>
            </div>
          )}

          {/* Estatísticas */}
          {canViewStats ? (
            <UserStats user={user} />
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[180px]">
              <span className="text-3xl mb-3">🔒</span>
              <p className="text-gray-600 font-medium">
                Este usuário mantém suas estatísticas privadas.
              </p>
            </div>
          )}

          {/* Listas */}
          <UserLists userLists={userLists} />

        </div>
      </div>
    </div>
  );
}