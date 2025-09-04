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
  const { id } = useParams();
  const { user: loggedInUser } = useAuth();

  const userId = parseInt(id);
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Usuário não encontrado.
        </p>
      </div>
    );
  }

  const isOwner = loggedInUser?.id === user.id;

  // Se o perfil é privado e não for o dono, bloqueia algumas informações
  const canViewSaved = user.privacy?.showSavedItems || isOwner;
  const canViewFavorites = user.privacy?.showFavorites || isOwner;
  const canViewReviews = user.privacy?.showReviews || isOwner;

  const savedMediaItems = canViewSaved ? convertMediaIdsToObjects(user.savedMedia) : [];
  const userFavoritesItems = canViewFavorites ? convertMediaIdsToObjects(user.favorites) : [];
  const userReviews = canViewReviews 
    ? (ensureArray(user.reviews).length > 0 ? ensureArray(user.reviews) : getReviewsByUserId(user.id))
    : [];

  const userLists = ensureArray(user.lists).length > 0 
    ? ensureArray(user.lists) 
    : getListsByUserId(user.id);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ProfileHeader user={user} isOwner={isOwner} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {canViewSaved && <SavedItems savedItems={savedMediaItems} />}
          {canViewFavorites && <UserFavorites userFavorites={userFavoritesItems} />}
          {canViewReviews && <UserReviews userReviews={userReviews} />}
          <UserLists userLists={userLists} />
          <UserStats user={user} />
        </div>
      </div>
    </div>
  );
}
