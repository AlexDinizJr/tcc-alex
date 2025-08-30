import { useAuth } from "../hooks/useAuth";
import ProfileHeader from "../components/profile/ProfileHeader";
import UserLists from "../components/profile/UserLists";
import SavedItems from "../components/profile/SavedItems";
import UserReviews from "../components/profile/UserReviews";
import UserStats from "../components/profile/UserStats";
import { userLists, userReviews, userStats, savedItems } from "../mockdata/mockUserData"; 

export default function MyProfile() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Você precisa estar logado para ver seu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ProfileHeader user={user} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SavedItems savedItems={savedItems} />
          <UserReviews userReviews={userReviews} />
          <UserLists userLists={userLists} />
          <UserStats stats={userStats} />
        </div>
      </div>
    </div>
  );
}