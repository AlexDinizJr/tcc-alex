import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import ProfileHeader from "../../components/profile/ProfileHeader";
import UserLists from "../../components/profile/UserLists";
import SavedItems from "../../components/profile/UserSavedItems";
import UserFavorites from "../../components/profile/UserFavorites";
import UserReviews from "../../components/profile/UserReviews";
import UserStats from "../../components/profile/UserStats";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";
import { fetchUserByUsername } from "../../services/userService"; 
import { fetchUserLists, fetchUserSavedMedia, fetchUserFavorites } from "../../services/listsService";
import { fetchReviewsByUserId } from "../../services/reviewService";

export default function UserProfilePage() {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();
  const isOwner = loggedInUser?.username === username;

  const [user, setUser] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Buscando usuário:", username);
        const fetchedUser = await fetchUserByUsername(username);
        console.log("👤 Usuário encontrado:", fetchedUser);
        
        if (!fetchedUser) {
          setError("Usuário não encontrado");
          return;
        }

        setUser(fetchedUser);

        const userId = fetchedUser.id;
        if (!userId) {
          setError("ID do usuário não disponível");
          return;
        }

        console.log("📥 Buscando dados do usuário ID:", userId);

        // Busca os dados individualmente para debug
        try {
          const savedData = (fetchedUser.showSavedItems || isOwner) 
            ? await fetchUserSavedMedia(userId)
            : [];
          console.log("💾 Itens salvos:", savedData);
          setSavedItems(Array.isArray(savedData.savedMedia) ? savedData.savedMedia : []);
        } catch (err) {
          console.error("Erro ao buscar salvos:", err);
          setSavedItems([]);
        }

        try {
          const favoritesData = (fetchedUser.showFavorites || isOwner) 
            ? await fetchUserFavorites(userId)
            : [];
          console.log("⭐ Favoritos:", favoritesData);
          setFavorites(Array.isArray(favoritesData.favorites) ? favoritesData.favorites : []);
        } catch (err) {
          console.error("Erro ao buscar favoritos:", err);
          setFavorites([]);
        }

        try {
          const reviewsData = await fetchReviewsByUserId(fetchedUser.id);
          // reviewsData é o objeto { reviews: [...], pagination: {...} }
          const reviewsArray = Array.isArray(reviewsData.reviews) ? reviewsData.reviews : [];
          setReviews(reviewsArray);
          console.log("📝 Reviews carregadas:", reviewsArray);
        } catch (err) {
          console.error("Erro ao buscar reviews:", err);
          setReviews([]);
        }

        try {
          const listsData = await fetchUserLists(userId);
          console.log("📋 Listas:", listsData);
          setLists(Array.isArray(listsData.lists) ? listsData.lists : []);
        } catch (err) {
          console.error("Erro ao buscar listas:", err);
          setLists([]);
        }

        console.log("✅ Dados carregados:", {
          salvos: savedItems.length,
          favoritos: favorites.length,
          reviews: reviews.length,
          listas: lists.length
        });

      } catch (err) {
        console.error("❌ Erro ao carregar dados do usuário:", err);
        setError("Erro ao carregar perfil do usuário");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadUserData();
    }
  }, [username, isOwner]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando perfil de {username}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-700 rounded-2xl p-6 text-center">
          <FaExclamationTriangle className="text-3xl text-red-400 mx-auto mb-3" />
          <h3 className="text-white font-medium text-lg mb-2">Erro</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>Usuário não encontrado</p>
        </div>
      </div>
    );
  }

  const isPrivate = user.profileVisibility === "private" && !isOwner;
  const canViewSaved = !isPrivate && (user.showSavedItems || isOwner);
  const canViewFavorites = !isPrivate && (user.showFavorites || isOwner);
  const canViewReviews = !isPrivate && (user.showReviews || isOwner);
  const canViewStats = !isPrivate && (user.showStats || isOwner);

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
          {canViewSaved ? (
            <SavedItems savedItems={savedItems} username={user.username} />
          ) : (
            <PrivateCard message="Este usuário mantém seus itens salvos privados." />
          )}

          {canViewFavorites ? (
            <UserFavorites userFavorites={favorites} username={user.username} />
          ) : (
            <PrivateCard message="Este usuário mantém seus favoritos privados." />
          )}

          {canViewReviews ? (
            <UserReviews userReviews={reviews} username={user.username} />
          ) : (
            <PrivateCard message="Este usuário mantém suas avaliações privadas." />
          )}

          {canViewStats ? (
            <UserStats user={user} />
          ) : (
            <PrivateCard message="Este usuário mantém suas estatísticas privadas." />
          )}

          <UserLists userLists={lists} username={user.username} />
        </div>
      </div>
    </div>
  );
}
