import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { HiDocumentAdd, HiUserCircle } from "react-icons/hi";
import { navBg, ghostButton, primaryButton } from "../theme/ui";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  }, [isAuthModalOpen]);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleShareClick = () => {
    if (user) navigate("/share");
    else setIsAuthModalOpen(true);
  };

  const handleMyExperiencesClick = () => {
    if (user) navigate("/my-experiences");
    else setIsAuthModalOpen(true);
  };

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const navSurface = `${navBg(theme, scrolled)} backdrop-blur-sm`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-200 ${navSurface}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="shrink-0 text-left"
        >
          <span className="block text-lg font-semibold tracking-tight text-blue-500 sm:text-xl">
            InterviewShare
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:block">
            Interview knowledge
          </span>
        </button>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={ghostButton(theme)}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareClick}
            className={`${primaryButton} hidden sm:inline-flex !py-2 !text-xs sm:!text-sm`}
          >
            <HiDocumentAdd className="h-4 w-4" />
            <span>Share experience</span>
          </button>

          <button
            type="button"
            onClick={handleShareClick}
            className={`${primaryButton} sm:hidden !p-2`}
            title="Share experience"
          >
            <HiDocumentAdd className="h-5 w-5" />
          </button>

          {!user ? (
            <button type="button" onClick={() => setIsAuthModalOpen(true)} className={ghostButton(theme)}>
              Sign in
            </button>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 ${
                  theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-slate-100"
                }`}
              >
                <span className={`hidden max-w-[5rem] truncate text-sm font-medium sm:block ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-600 bg-slate-800">
                  <img
                    alt=""
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=334155&color=e2e8f0`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className={`menu dropdown-content menu-sm z-[110] mt-2 w-52 rounded-xl border p-2 shadow-lg ${
                  theme === "dark"
                    ? "border-slate-700 bg-slate-900 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <li className={`mb-2 border-b px-3 pb-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Account</p>
                  <p className="truncate text-sm font-medium">{user.email}</p>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleMyExperiencesClick}
                    className="flex w-full items-center justify-between rounded-lg py-2 text-left"
                  >
                    My experiences
                    <HiUserCircle className="opacity-60" />
                  </button>
                </li>
                <li>
                  <span className="block py-2 text-sm opacity-50">Profile settings</span>
                </li>
                <li className={`mt-1 border-t pt-1 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`w-full rounded-lg py-2 text-left text-sm font-medium ${
                      theme === "dark"
                        ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
