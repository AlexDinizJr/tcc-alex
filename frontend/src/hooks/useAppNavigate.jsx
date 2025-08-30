import { useNavigate } from "react-router-dom";

export const useAppNavigate = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");
  const goToPreferences = () => navigate("/preferences");
  const goToProfile = () => navigate("/myprofile");
  const goHome = () => navigate("/");
  const goToMedia = (id) => navigate(`/media/${id}`);

  return { goToLogin, goToRegister, goToPreferences, goToProfile, goHome, goToMedia };
};
