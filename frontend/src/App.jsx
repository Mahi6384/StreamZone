import React, { lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter, Navigate, useParams } from "react-router-dom";
import Home from "./pages/Home";
import ThemedToaster from "./components/ThemedToaster";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy-loaded pages — each becomes its own JS chunk
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ShareExperiencePage = lazy(() => import("./pages/ShareExperiencePage"));
const MyExperiences = lazy(() => import("./pages/MyExperiences"));
const About = lazy(() => import("./pages/About"));
const ExperienceDetail = lazy(() => import("./components/ExperienceDetail"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="loading loading-spinner loading-lg text-emerald-500" />
    </div>
  );
}

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/share" element={<ShareExperiencePage />} />
            <Route path="/experience/:id/edit" element={<ShareExperiencePage />} />
            <Route path="/upload" element={<Navigate to="/share" replace />} />
            <Route path="/experience/:id" element={<ExperienceDetail />} />
            <Route path="/watch/:id" element={<LegacyWatchRedirect />} />
            <Route path="/my-experiences" element={<MyExperiences />} />
            <Route path="/my-uploads" element={<Navigate to="/my-experiences" replace />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

