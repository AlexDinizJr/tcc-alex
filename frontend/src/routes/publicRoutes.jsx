import Home from "../pages/Home";
import { MoviesPage, GamesPage, MusicsPage, TVSeriesPage, BooksPage }  from "../pages/media_content/MediaPage";
import Media from "../pages/media_content/Media";
import Users from "../pages/users_content/Users";
import Lists from "../pages/users_content/Lists";
import UserPage from "../pages/users_content/UserPage";
import Search from "../pages/fallback/Search";
import { ROUTES } from "./paths";

export const publicRoutes = [
  // Home
  { path: ROUTES.HOME, element: <Home /> },

  // Movies
  { path: ROUTES.MOVIES, element: <MoviesPage /> },
  { path: ROUTES.MOVIES_PAGE, element: <MoviesPage /> },

  // Games
  { path: ROUTES.GAMES, element: <GamesPage /> },
  { path: ROUTES.GAMES_PAGE, element: <GamesPage /> },

  // Musics
  { path: ROUTES.MUSICS, element: <MusicsPage /> },
  { path: ROUTES.MUSICS_PAGE, element: <MusicsPage /> },

  // TV Series
  { path: ROUTES.TVSERIES, element: <TVSeriesPage /> },
  { path: ROUTES.TVSERIES_PAGE, element: <TVSeriesPage /> },

  // Books
  { path: ROUTES.BOOKS, element: <BooksPage /> },
  { path: ROUTES.BOOKS_PAGE, element: <BooksPage /> },

  // Media details
  { path: ROUTES.MEDIA, element: <Media /> },

  // Users
  { path: ROUTES.USERS, element: <Users /> },
  { path: ROUTES.USERS_PAGES, element: <Users /> },

  // Lists
  { path: ROUTES.LISTS, element: <Lists /> },
  { path: ROUTES.LISTS_PAGES, element: <Lists /> },

  { path: ROUTES.USER_PAGE, element: <UserPage /> },

  // Search
  { path: ROUTES.SEARCH, element: <Search /> },
];
