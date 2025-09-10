import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrolltoTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Movies from "./pages/media_content/Movies";
import Games from "./pages/media_content/Games";
import Musics from "./pages/media_content/Musics";
import TVSeries from "./pages/media_content/TVSeries";
import Books from "./pages/media_content/Books";
import Media from "./pages/media_content/Media";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Register";
import RecoveryPassword from "./pages/auth/RecoveryPassword";
import Preferences from "./pages/auth/Preferences";
import MyLists from "./pages/users_content/MyLists";
import MySavedItems from "./pages/users_content/MySavedMedia";
import MyFavorites from "./pages/users_content/MyFavorites";
import MyReviews from "./pages/users_content/MyReviews";
import Users from "./pages/users_content/Users";
import UserPage from "./pages/users_content/UserPage";
import UserListPage from "./pages/users_content/UserListPage";
import CreateList from "./pages/users_functions/CreateList";
import Settings from "./pages/users_functions/Settings";
import CustomRecommendations from "./pages/users_functions/CustomRecommendations";
import Search from "./pages/fallback/Search";
import NotFound from "./pages/fallback/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedContentRoute from "./routes/ProtectedContentRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 mx-auto px-4 py-6 max-w-[1500px] w-full">
          <Routes>
            {/* Páginas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/games" element={<Games />} />
            <Route path="/musics" element={<Musics />} />
            <Route path="/tvseries" element={<TVSeries />} />
            <Route path="/books" element={<Books />} />
            <Route path="/media/:id" element={<Media />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:username" element={<UserPage />} />
            <Route path="/search" element={<Search />} />

            {/* Páginas de listas e conteúdos de usuário */}
            <Route
              path="/users/:username/lists"
              element={<ProtectedContentRoute contentType="lists"><MyLists /></ProtectedContentRoute>}
            />
            <Route
              path="/users/:username/lists/:id"
              element={<ProtectedContentRoute contentType="list"><UserListPage /></ProtectedContentRoute>}
            />
            <Route
              path="/users/:username/saved-items"
              element={<ProtectedContentRoute contentType="saved"><MySavedItems /></ProtectedContentRoute>}
            />
            <Route
              path="/users/:username/favorites"
              element={<ProtectedContentRoute contentType="favorites"><MyFavorites /></ProtectedContentRoute>}
            />
            <Route
              path="/users/:username/reviews"
              element={<ProtectedContentRoute contentType="reviews"><MyReviews /></ProtectedContentRoute>}
            />

            {/* Rotas protegidas (necessário login) */}
            <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/lists/create" element={<ProtectedRoute><CreateList /></ProtectedRoute>} />
            <Route path="/custom-recommendations" element={<ProtectedRoute><CustomRecommendations /></ProtectedRoute>} />

            {/* Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/recovery-password" element={<RecoveryPassword />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
