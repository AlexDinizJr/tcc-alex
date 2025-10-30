import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FeedbackLink from "./components/FeedbackLink";

import { publicRoutes } from "./routes/publicRoutes";
import { userRoutes } from "./routes/userRoutes";
import { authRoutes } from "./routes/authRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { fallbackRoutes } from "./routes/fallbackRoutes";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-pageSlide">
      <Routes location={location}>
        {[...publicRoutes, ...userRoutes, ...authRoutes, ...protectedRoutes, ...fallbackRoutes].map(
          ({ path, element }) => (
            <Route key={path} path={path} element={element} />
          )
        )}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <ScrollToTop />
        <Navbar />
        <FeedbackLink />
        <main className="flex-1 mx-auto w-full">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
