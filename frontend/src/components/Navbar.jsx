import React from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-100 shadow-sm px-4 relative">
      {/* LEFT: Logo */}
      <div className="flex-1">
        <a className="text-3xl  bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500 text-transparent bg-clip-text  ml-12">
          StreamZone
        </a>
      </div>

      {/* CENTER: Search Bar - Absolute Centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-xl hidden sm:block">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-full"
        />
      </div>
      <button
        onClick={() => navigate("/upload")}
        className=" btn mr-5 text-transparent text-white "
        // bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500  text-lg "
      >
        Upload Video
      </button>
      <h3
        onClick={() => navigate("/signup")}
        className="mr-3 text-sm text-gray-500 hover:text-white cursor-pointer"
      >
        Register/Login
      </h3>
      {/* RIGHT: Avatar Dropdown */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Upload Profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a
                className="justify-between"
                onClick={() => navigate("/upload")} // No navigate now!
              >
                Upload Video <span className="badge">Upload</span>
              </a>
            </li>
            <li>
              <a className="justify-between">
                Profile <span className="badge">Change Profile</span>
              </a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
