import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
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
import MyProfile from "./pages/MyProfile";
import Preferences from "./pages/Preferences";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/games" element={<Games />} />
            <Route path="/musics" element={<Musics />} />
            <Route path="/tvseries" element={<TVSeries />} />
            <Route path="/books" element={<Books />} />
            <Route path="/media/:id" element={<Media />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
            <Route path="/myprofile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;