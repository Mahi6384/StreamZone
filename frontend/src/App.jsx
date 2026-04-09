import { Routes, Route, BrowserRouter, Navigate, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShareExperiencePage from "./pages/ShareExperiencePage";
import MyExperiences from "./pages/MyExperiences";
import About from "./pages/About";
import ExperienceDetail from "./components/ExperienceDetail";
import ThemedToaster from "./components/ThemedToaster";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";

function LegacyWatchRedirect() {
  const { id } = useParams();
  return <Navigate to={`/experience/${id}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ThemedToaster />
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/share" element={<ShareExperiencePage />} />
          <Route path="/upload" element={<Navigate to="/share" replace />} />
          <Route path="/experience/:id" element={<ExperienceDetail />} />
          <Route path="/watch/:id" element={<LegacyWatchRedirect />} />
          <Route path="/my-experiences" element={<MyExperiences />} />
          <Route path="/my-uploads" element={<Navigate to="/my-experiences" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
