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

export default function MyProfile() {
  const { user: currentUser } = useAuth();
  
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Você precisa estar logado para ver seu perfil.
        </p>
      </div>
    );
  }
  const profileUser = currentUser;
  const isOwner = profileUser.id === currentUser.id;
  const savedMediaItems = convertMediaIdsToObjects(currentUser.savedMedia);
  const userFavoritesItems = convertMediaIdsToObjects(currentUser.favorites);
  const userReviews = ensureArray(currentUser.reviews).length > 0 
    ? ensureArray(currentUser.reviews) 
    : getReviewsByUserId(currentUser.id);
  const userLists = ensureArray(currentUser.lists).length > 0 
    ? ensureArray(currentUser.lists) 
    : getListsByUserId(currentUser.id);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <ProfileHeader user={profileUser} isOwner={isOwner} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SavedItems savedItems={savedMediaItems} />
          <UserFavorites userFavorites={userFavoritesItems} />
          <UserReviews userReviews={userReviews} />
          <UserLists userLists={userLists} />
          <UserStats user={currentUser} />
        </div>
      </div>
    </div>
  );
}