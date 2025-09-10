import NotFound from "../pages/fallback/NotFound";
import { ROUTES } from "./paths";

export const fallbackRoutes = [
  { path: ROUTES.NOT_FOUND, element: <NotFound /> },
];
