import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const useAppNavigate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");
  const goToPreferences = () => navigate("/preferences");
  const goToProfile = () => navigate(`/users/${user?.username || ''}`)
  const goToOtherUserProfile = (username) => navigate(`/users/${username}`);
  const goHome = () => navigate("/");
  const goToMedia = (id) => navigate(`/media/${id}`);

  return { 
    goToLogin, 
    goToRegister, 
    goToPreferences, 
    goToProfile, 
    goToOtherUserProfile,
    goHome, 
    goToMedia 
  };
};