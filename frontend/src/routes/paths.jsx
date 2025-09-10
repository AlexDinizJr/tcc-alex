export const ROUTES = {
  // Public
  HOME: "/",
  MOVIES: "/movies",
  GAMES: "/games",
  MUSICS: "/musics",
  TVSERIES: "/tvseries",
  BOOKS: "/books",
  MEDIA: "/media/:id",
  USERS: "/users",
  USER_PAGE: "/users/:username",

  // Protected Content
  USER_LISTS: "/users/:username/lists",
  USER_LIST_PAGE: "/users/:username/lists/:id",
  USER_SAVED: "/users/:username/saved-items",
  USER_FAVORITES: "/users/:username/favorites",
  USER_REVIEWS: "/users/:username/reviews",

  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  RECOVERY_PASSWORD: "/recovery-password",
  PREFERENCES: "/preferences",

  // User functions
  SETTINGS: "/settings",
  CREATE_LIST: "/lists/create",
  CUSTOM_RECOMMENDATIONS: "/custom-recommendations",

  // Fallback
  SEARCH: "/search",
  NOT_FOUND: "*",
};
