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
  // Home
  { path: ROUTES.HOME, element: <Home /> },

  // Movies
  { path: ROUTES.MOVIES, element: <Movies /> },
  { path: ROUTES.MOVIES_PAGE, element: <Movies /> },

  // Games
  { path: ROUTES.GAMES, element: <Games /> },
  { path: ROUTES.GAMES_PAGE, element: <Games /> },

  // Musics
  { path: ROUTES.MUSICS, element: <Musics /> },
  { path: ROUTES.MUSICS_PAGE, element: <Musics /> },

  // TV Series
  { path: ROUTES.TVSERIES, element: <TVSeries /> },
  { path: ROUTES.TVSERIES_PAGE, element: <TVSeries /> },

  // Books
  { path: ROUTES.BOOKS, element: <Books /> },
  { path: ROUTES.BOOKS_PAGE, element: <Books /> },

  // Media details
  { path: ROUTES.MEDIA, element: <Media /> },

  // Users
  { path: ROUTES.USERS, element: <Users /> },
  { path: ROUTES.USERS_PAGES, element: <Users /> },

  { path: ROUTES.USER_PAGE, element: <UserPage /> },

  // Search
  { path: ROUTES.SEARCH, element: <Search /> },
];
