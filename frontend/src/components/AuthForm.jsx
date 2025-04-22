import React, { useState } from "react";

const AuthForm = ({ title, buttonText, showName }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = showName ? { name, email, password } : { email, password };
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="w-full sm:w-4/5 md:w-1/2 h-[90vh] border border-gray-500 rounded-2xl shadow-xl p-8 flex flex-col justify-between bg-white/10 backdrop-blur-3xl">
        <h2 className="text-3xl font-bold text-center">{title}</h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          {showName && (
            <div className="form-control w-full sm:w-3/5 md:w-2/5">
              <label className="label mb-1">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-control w-full sm:w-3/5 md:w-2/5">
            <label className="label mb-1">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control w-full sm:w-3/5 md:w-2/5">
            <label className="label mb-1">Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>

        <div className="flex flex-col items-center gap-4">
          {showName && (
            <p className="text-md text-gray-400 mt-4">
              Already a user?{" "}
              <span className="text-blue-400 cursor-pointer">Login</span>
            </p>
          )}

          <button onClick={handleSubmit} className="btn btn-primary w-2/5">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
