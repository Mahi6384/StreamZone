import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { ToastBar } from "react-hot-toast";
const AuthForm = ({ title, buttonText, showName }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const [formdata, setFormdata] = useState({
  //   name: "Mahi",
  //   email: "mahiii@gmail.com",
  //   password: "mahijain",
  // });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showName) {
      try {
        const res = await axios.post("http://localhost:5000/api/users/signup", {
          name,
          email,
          password,
        });
        console.log(res.data);
        navigate("/ ");
        toast.success("Signup successful!");
      } catch (error) {
        toast.error("Error Signing Up");
        console.error("Signup error:", error.response?.data || error.message);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/users/login", {
          email,
          password,
        });
        console.log(res.data);
        navigate("/ ");
        toast.success("Login successful!");
      } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        toast.error("Error Loging In");
      }
    }

    const formData = showName ? { name, email, password } : { email, password };
    // console.log("first");
  };
  // const handleChange = (e) => {
  //   setFormdata({
  //     ...formdata,
  //     [e.target.name]: e.target.value,
  //   });
  // };

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
                // value={formdata.name}
                onChange={(e) => setName(e.target.value)}
                required
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
              required
              // onChange={handleChange}
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
              required
              // onChange={handleChange}
            />
          </div>
        </form>

        <div className="flex flex-col items-center gap-4">
          {showName && (
            <p className="text-md text-gray-400 mt-4">
              Already a user?{" "}
              <span
                className="text-blue-400 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
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
