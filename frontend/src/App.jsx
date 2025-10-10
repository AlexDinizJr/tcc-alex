import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FeedbackLink from "./components/FeedbackLink";

import { publicRoutes } from "./routes/publicRoutes";
import { userRoutes } from "./routes/userRoutes";
import { authRoutes } from "./routes/authRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { fallbackRoutes } from "./routes/fallbackRoutes";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <ScrollToTop />
        <Navbar />
        <FeedbackLink />
        <main className="flex-1 mx-auto w-full">
          <Routes>
            {[...publicRoutes, ...userRoutes, ...authRoutes, ...protectedRoutes, ...fallbackRoutes].map(
              ({ path, element }) => (
                <Route key={path} path={path} element={element} />
              )
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
