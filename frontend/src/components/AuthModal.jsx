import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { IoClose } from "react-icons/io5";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Background Overlay with Blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg mx-4 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10"
        >
          <IoClose size={28} />
        </button>

        {/* Modal Toggles */}
        <div className="flex border-b border-white/5 bg-[#1a1a1a]">
          <button 
            className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-all ${isLogin ? 'text-red-600 bg-[#141414]' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-all ${!isLogin ? 'text-red-600 bg-[#141414]' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="p-2">
          {isLogin ? (
            <AuthForm 
              title="Welcome Back" 
              buttonText="Sign In" 
              showName={false} 
              onClose={onClose} 
            />
          ) : (
            <AuthForm 
              title="Stream Unlimited" 
              buttonText="Get Started" 
              showName={true} 
              onClose={onClose} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
