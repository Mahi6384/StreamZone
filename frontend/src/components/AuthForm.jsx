import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ensureGoogleIdInitialized, requestGoogleOneTap } from "../utils/googleIdentity";
import {
  pageBg,
  panel,
  labelCls,
  inputCls,
  headingPage,
  subheading,
  primaryButton,
} from "../theme/ui";
import { useTheme } from "../context/ThemeContext";
import { USERS_API } from "../config/api";

const getGoogleClientId = () => process.env.REACT_APP_GOOGLE_CLIENT_ID;

const AuthForm = ({ title, buttonText, showName, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleBusyRef = useRef(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = showName ? "signup" : "login";
    const payload = showName ? { name, email, password } : { email, password };

    try {
      const res = await axios.post(`${USERS_API}/${endpoint}`, payload);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(`${showName ? "Welcome to InsightHire." : "Signed in successfully."}`);
      if (onClose) onClose();
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Authentication failed";
      toast.error(errorMessage);
    }
  };

  const handleGoogle = async () => {
    if (googleBusyRef.current) return;
    const clientId = getGoogleClientId();
    if (!clientId) {
      toast.error("Google sign-in is not configured: missing REACT_APP_GOOGLE_CLIENT_ID");
      return;
    }
    if (!window.google?.accounts?.id) {
      toast.error("Google sign-in failed to load. Please refresh and try again.");
      return;
    }

    if (!ensureGoogleIdInitialized(clientId)) {
      toast.error("Google sign-in failed to load. Please refresh and try again.");
      return;
    }

    googleBusyRef.current = true;

    const onCredential = async (response) => {
      try {
        if (!response?.credential) {
          toast.error("Google did not return a sign-in token. Please try again.");
          return;
        }
        const res = await axios.post(`${USERS_API}/google`, {
          credential: response.credential,
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Signed in with Google.");
        if (onClose) onClose();
        navigate("/");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Google authentication failed";
        toast.error(errorMessage);
      } finally {
        googleBusyRef.current = false;
      }
    };

    try {
      requestGoogleOneTap(onCredential, {
        onPromptBlocked: () => {
          googleBusyRef.current = false;
          toast.error("Google sign-in was blocked or closed. Please try again.", {
            id: "google-sign-in-prompt-blocked",
          });
        },
        onDismissed: () => {
          googleBusyRef.current = false;
        },
      });
    } catch {
      googleBusyRef.current = false;
      toast.error("Google sign-in failed to start. Please try again.");
    }
  };

  const inModal = Boolean(onClose);

  const inner = (
    <div className={`w-full ${inModal ? "p-6 sm:p-8" : "mx-auto max-w-md px-4 py-16 sm:py-20"}`}>
      <div className={`${inModal ? "" : `${panel(theme)} rounded-2xl p-8 sm:p-10`}`}>
        <div className="mb-8 text-center">
          <h2 className={`text-2xl font-bold tracking-tight ${headingPage(theme)}`}>{title}</h2>
          <p className={`mt-2 text-sm ${subheading}`}>Interview experience sharing</p>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-4">
          <button
            type="button"
            onClick={handleGoogle}
            className={`flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-medium transition-colors ${
              theme === "dark"
                ? "border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700/90"
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className={`h-px flex-1 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`} />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">or</span>
            <div className={`h-px flex-1 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {showName && (
              <div>
                <label className={labelCls} htmlFor="auth-name">
                  Full name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  className={inputCls(theme)}
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className={labelCls} htmlFor="auth-email">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                className={inputCls(theme)}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="auth-password">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                className={inputCls(theme)}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={`${primaryButton} mt-2 w-full`}>
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  if (inModal) return inner;

  return <div className={`min-h-screen pt-20 ${pageBg(theme)}`}>{inner}</div>;
};

export default AuthForm;
