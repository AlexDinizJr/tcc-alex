import Settings from "../pages/users_functions/Settings";
import CreateList from "../pages/users_functions/CreateList";
import CustomRecommendations from "../pages/users_functions/CustomRecommendations";
import { ROUTES } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

export const protectedRoutes = [
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CREATE_LIST,
    element: (
      <ProtectedRoute>
        <CreateList />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CUSTOM_RECOMMENDATIONS,
    element: (
      <ProtectedRoute>
        <CustomRecommendations />
      </ProtectedRoute>
    ),
  },
];
