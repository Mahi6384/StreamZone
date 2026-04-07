import React, { useState } from "react";
import { createPortal } from "react-dom";
import AuthForm from "./AuthForm";
import { IoClose } from "react-icons/io5";
import { panel } from "../theme/ui";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const theme = localStorage.getItem("theme") || "dark";

  if (!isOpen) return null;

  // Portal: nav uses backdrop-blur, which makes fixed descendants position vs the nav
  // box instead of the viewport — portal escapes that so the overlay covers the page.
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        className={`relative w-full max-w-md overflow-hidden rounded-xl shadow-xl ${panel(theme)}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute right-4 top-4 rounded-lg p-1 transition-colors ${
            theme === "dark"
              ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>

        <div
          className={`flex border-b ${
            theme === "dark" ? "border-slate-700 bg-slate-900/80" : "border-slate-200 bg-slate-50"
          }`}
        >
          <button
            type="button"
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              isLogin
                ? "border-b-2 border-blue-500 text-blue-500"
                : theme === "dark"
                  ? "text-slate-500 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              !isLogin
                ? "border-b-2 border-blue-500 text-blue-500"
                : theme === "dark"
                  ? "text-slate-500 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Create account
          </button>
        </div>

        <div className="bg-transparent">
          {isLogin ? (
            <AuthForm title="Welcome back" buttonText="Sign in" showName={false} onClose={onClose} />
          ) : (
            <AuthForm title="Join InterviewShare" buttonText="Create account" showName={true} onClose={onClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
