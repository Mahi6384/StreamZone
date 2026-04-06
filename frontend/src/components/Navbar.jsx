import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { HiSearch, HiCloudUpload, HiUserCircle } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [isAuthModalOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleUploadClick = () => {
    if (user) {
      navigate("/upload");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleMyUploadsClick = () => {
    if (user) {
      navigate("/my-uploads");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-3 flex items-center justify-between ${scrolled ? (theme === "dark" ? "bg-[#0f0f0f]/90 backdrop-blur-md shadow-2xl" : "bg-white/90 backdrop-blur-md shadow-lg") : "bg-transparent"}`}>
      <div className="flex items-center gap-0">
        <h1 className="text-2xl sm:text-4xl font-black cursor-pointer tracking-tighter text-red-600 uppercase" style={{ fontFamily: "'Arial Black', sans-serif" }} onClick={() => navigate("/")}>StreamZone</h1>
      </div>
      <div className="hidden md:flex flex-1 max-w-2xl mx-12">
        <div className="relative w-full group">
          <input
            type="text"
            placeholder="Search for videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className={`w-full ${theme === 'dark' ? 'bg-[#1e1e1e] text-white border-white/10' : 'bg-gray-100 text-black border-gray-200'} border rounded-full py-2.5 px-12 focus:outline-none focus:border-red-600 transition-all duration-300 text-sm placeholder:text-gray-500`}
          />
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl group-focus-within:text-red-500 transition-colors" />
        </div>
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-black/10 text-gray-700'}`}
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>

        <button
          onClick={handleUploadClick}
          className="group flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-all duration-300 shadow-lg shadow-red-600/20"
        >
          <HiCloudUpload className="text-xl group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {!user ? (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
          >
            Sign In
          </button>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <span className={`text-sm font-medium hidden sm:block truncate max-w-[100px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {user?.name?.split(" ")[0] || "User"}
              </span>
              <div className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-red-600 transition-all overflow-hidden bg-gray-800">
                <img
                  alt="Profile"
                  src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random&color=fff`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content mt-3 z-[110] p-2 shadow-2xl border rounded-xl w-52 ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/10 text-white' : 'bg-white border-gray-200 text-black'}`}
            >
              <li className={`p-3 border-b mb-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">My Account</p>
                <p className="text-sm font-bold truncate">{user.email}</p>
              </li>
              <li>
                <a onClick={handleMyUploadsClick} className="py-3 flex items-center justify-between cursor-pointer">
                  My Uploads <span className="p-1 px-1.5 bg-red-600/20 text-red-500 rounded text-[10px] font-bold">PRO</span>
                </a>
              </li>
              <li><a className="py-3">Profile Settings</a></li>
              <li className={`mt-2 pt-2 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                <a onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-500/10">Sign Out</a>
              </li>
            </ul>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
