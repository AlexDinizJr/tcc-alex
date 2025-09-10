import MyLists from "../pages/users_content/MyLists";
import MySavedItems from "../pages/users_content/MySavedMedia";
import MyFavorites from "../pages/users_content/MyFavorites";
import MyReviews from "../pages/users_content/MyReviews";
import UserListPage from "../pages/users_content/UserListPage";
import ProtectedContentRoute from "./ProtectedContentRoute";
import { ROUTES } from "./paths";

export const userRoutes = [
  {
    path: ROUTES.USER_LISTS,
    element: (
      <ProtectedContentRoute contentType="lists">
        <MyLists />
      </ProtectedContentRoute>
    ),
  },
  {
    path: ROUTES.USER_LIST_PAGE,
    element: (
      <ProtectedContentRoute contentType="list">
        <UserListPage />
      </ProtectedContentRoute>
    ),
  },
  {
    path: ROUTES.USER_SAVED,
    element: (
      <ProtectedContentRoute contentType="saved">
        <MySavedItems />
      </ProtectedContentRoute>
    ),
  },
  {
    path: ROUTES.USER_FAVORITES,
    element: (
      <ProtectedContentRoute contentType="favorites">
        <MyFavorites />
      </ProtectedContentRoute>
    ),
  },
  {
    path: ROUTES.USER_REVIEWS,
    element: (
      <ProtectedContentRoute contentType="reviews">
        <MyReviews />
      </ProtectedContentRoute>
    ),
  },
];
