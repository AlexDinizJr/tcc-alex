import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Register";
import RecoveryPassword from "../pages/auth/RecoveryPassword";
import Preferences from "../pages/auth/Preferences";
import { ROUTES } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

export const authRoutes = [
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.SIGNUP, element: <Signup /> },
  { path: ROUTES.RECOVERY_PASSWORD, element: <RecoveryPassword /> },
  {
    path: ROUTES.PREFERENCES,
    element: (
      <ProtectedRoute>
        <Preferences />
      </ProtectedRoute>
    ),
  },
];
