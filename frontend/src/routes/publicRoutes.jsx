import Home from "../pages/Home";
import Movies from "../pages/media_content/Movies";
import Games from "../pages/media_content/Games";
import Musics from "../pages/media_content/Musics";
import TVSeries from "../pages/media_content/TVSeries";
import Books from "../pages/media_content/Books";
import Media from "../pages/media_content/Media";
import Users from "../pages/users_content/Users";
import UserPage from "../pages/users_content/UserPage";
import Search from "../pages/fallback/Search";
import { ROUTES } from "./paths";

export const publicRoutes = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.MOVIES, element: <Movies /> },
  { path: ROUTES.GAMES, element: <Games /> },
  { path: ROUTES.MUSICS, element: <Musics /> },
  { path: ROUTES.TVSERIES, element: <TVSeries /> },
  { path: ROUTES.BOOKS, element: <Books /> },
  { path: ROUTES.MEDIA, element: <Media /> },
  { path: ROUTES.USERS, element: <Users /> },
  { path: ROUTES.USER_PAGE, element: <UserPage /> },
  { path: ROUTES.SEARCH, element: <Search /> },
];
