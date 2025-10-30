import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Register";
import RecoveryPassword from "../pages/auth/RecoveryPassword";
import Preferences from "../pages/auth/Preferences";
import { ROUTES } from "./paths";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export const authRoutes = [
  { path: ROUTES.LOGIN, element: (
    <GuestRoute>
      <Login />
    </GuestRoute>
  ) },
  { path: ROUTES.SIGNUP, element: (
    <GuestRoute>
      <Signup />
    </GuestRoute>
  ) },
  { path: ROUTES.RECOVERY_PASSWORD, element: (
    <GuestRoute>
      <RecoveryPassword />
    </GuestRoute>
  ) },
  {
    path: ROUTES.PREFERENCES,
    element: (
      <ProtectedRoute>
        <Preferences />
      </ProtectedRoute>
    ),
  },
];
