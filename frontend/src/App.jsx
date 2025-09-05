import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/layout/ScrolltoTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Games from "./pages/Games";
import Musics from "./pages/Musics";
import TVSeries from "./pages/TVSeries";
import Books from "./pages/Books";
import Media from "./pages/Media";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import RecoveryPassword from "./pages/RecoveryPassword";
import MyProfile from "./pages/MyProfile";
import Preferences from "./pages/Preferences";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import MyLists from "./pages/MyLists";
import SavedItems from "./pages/MySavedMedia";
import MyFavorites from "./pages/MyFavorites";
import Users from "./pages/Users"
import UserPage from "./pages/UserPage"
import MyReviews from "./pages/MyReviews";
import UserList from "./pages/UserList";
import CreateList from "./pages/CreateList";
import CustomRecommendations from "./pages/CustomRecommendations";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/games" element={<Games />} />
            <Route path="/musics" element={<Musics />} />
            <Route path="/tvseries" element={<TVSeries />} />
            <Route path="/books" element={<Books />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserPage />} />
            <Route path="/media/:id" element={<Media />} />
            <Route path="/lists/:id" element={<UserList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/recovery-password" element={<RecoveryPassword />} />
            <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
            <Route path="/myprofile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/mylists" element={<ProtectedRoute><MyLists /></ProtectedRoute>} />
            <Route path="/lists/create" element={<ProtectedRoute><CreateList /></ProtectedRoute>} />
            <Route path="/saved-items" element={<ProtectedRoute><SavedItems /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
            <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
            <Route path="/custom-recommendations" element={<ProtectedRoute><CustomRecommendations /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;