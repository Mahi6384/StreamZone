import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { HiDocumentAdd, HiHome, HiUserCircle } from "react-icons/hi";
import { navBg, ghostButton, primaryButton } from "../theme/ui";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

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
    if (!isAccountOpen) return;

    const onDocMouseDown = (e) => {
      if (!accountRef.current) return;
      if (accountRef.current.contains(e.target)) return;
      setIsAccountOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsAccountOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isAccountOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAccountOpen(false);
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

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const navSurface = `${navBg(theme, scrolled)} backdrop-blur-sm`;
  const accountMenuCls = useMemo(() => {
    return `absolute right-0 top-full z-[110] mt-2 w-52 rounded-xl border p-2 shadow-lg ${
      theme === "dark"
        ? "border-slate-700 bg-slate-900 text-slate-100"
        : "border-slate-200 bg-white text-slate-900"
    }`;
  }, [theme]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-200 ${navSurface}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="shrink-0 text-left"
          >
            <span className="block text-base font-semibold tracking-tight text-emerald-400 sm:text-lg">
              InsightHire
            </span>
            <span className="hidden text-[9px] font-medium uppercase tracking-wider text-slate-500 sm:block">
              Interview knowledge
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`${ghostButton(theme)} inline-flex shrink-0 items-center gap-1.5 !px-2.5 sm:!px-3`}
            title="Home"
          >
            <HiHome className="h-4 w-4 text-emerald-500" aria-hidden />
            <span className="text-sm font-medium">Home</span>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => navigate("/about")}
            className={`${ghostButton(theme)} hidden sm:inline-flex`}
          >
            What is InsightHire?
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-[3.25rem] items-center rounded-full border transition-colors ${
              theme === "dark"
                ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="sr-only">Toggle theme</span>
            <span
              className={`absolute left-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-transform ${
                theme === "dark"
                  ? "translate-x-5 bg-slate-700 text-slate-200"
                  : "translate-x-0 bg-slate-100 text-slate-700"
              }`}
            >
              {theme === "dark" ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </span>
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
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
                className={`flex items-center gap-2 rounded-lg px-1 py-1 ${
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
              </button>

              {isAccountOpen ? (
                <div role="menu" className={accountMenuCls}>
                  <div className={`mb-2 border-b px-3 pb-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Account</p>
                    <p className="truncate text-sm font-medium">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountOpen(false);
                      handleMyExperiencesClick();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                    }`}
                  >
                    My experiences
                    <HiUserCircle className="opacity-60" />
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountOpen(false);
                      navigate("/about");
                    }}
                    className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                    }`}
                  >
                    What is InsightHire?
                    <span className="text-xs opacity-60">↗</span>
                  </button>

                  <div className={`mt-2 border-t pt-2 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                        theme === "dark"
                          ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
