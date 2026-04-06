import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthForm = ({ title, buttonText, showName, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = showName ? "signup" : "login";
    const payload = showName ? { name, email, password } : { email, password };

    try {
      const res = await axios.post(`http://localhost:5000/api/users/${endpoint}`, payload);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(`${showName ? "Welcome to StreamZone!" : "Logged in successfully!"}`);
      if (onClose) onClose();
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Authentication failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full p-6 sm:p-10 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
        <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold">Premium Experience</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {/* Google Login Button (Primary) */}
        <button 
          onClick={() => toast.success("Google Login coming soon! Provide creds.")}
          className="w-full bg-white text-black py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {showName && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
              <input
                type="text"
                className="w-full bg-[#1e1e1e] border border-white/10 focus:border-red-600 py-3.5 px-4 rounded-lg text-white transition-all outline-none text-sm placeholder:text-gray-600 shadow-inner"
                placeholder="eg. Mahi Jain"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <input
              type="email"
              className="w-full bg-[#1e1e1e] border border-white/10 focus:border-red-600 py-3.5 px-4 rounded-lg text-white transition-all outline-none text-sm placeholder:text-gray-600 shadow-inner"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <input
              type="password"
              className="w-full bg-[#1e1e1e] border border-white/10 focus:border-red-600 py-3.5 px-4 rounded-lg text-white transition-all outline-none text-sm placeholder:text-gray-600 shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-black text-sm uppercase tracking-widest transition-all mt-4 shadow-xl shadow-red-600/10 active:scale-95"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
