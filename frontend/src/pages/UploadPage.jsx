import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCloudUpload, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const UploadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = localStorage.getItem("theme") || "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to upload videos");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", file);
    formData.append("creator", user.name || "Anonymous");
    if (user._id) formData.append("creatorId", user._id);
    formData.append("visibility", visibility);

    try {
      await axios.post(
        "http://localhost:5000/api/videos/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Video uploaded successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'} pt-28 px-4 pb-12 flex items-center justify-center transition-colors`}>
      <div className={`w-full max-w-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden relative group`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600/10 text-red-500 mb-4 ring-1 ring-red-500/20">
            <HiCloudUpload size={32} />
          </div>
          <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Upload New Video</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-widest">Share your content with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Video Title</label>
            <input
              type="text"
              placeholder="Give your masterpiece a name"
              className={`w-full ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/5 text-white focus:bg-[#2a2a2a]' : 'bg-white border-gray-200 text-black focus:bg-gray-50'} border rounded-xl py-3 px-4 focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-600 shadow-inner`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Context / Description</label>
            <textarea
              placeholder="What's this video about?"
              rows="4"
              className={`w-full ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/5 text-white focus:bg-[#2a2a2a]' : 'bg-white border-gray-200 text-black focus:bg-gray-50'} border rounded-xl py-3 px-4 focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-600 shadow-inner resize-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Privacy Settings</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className={`w-full ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/5 text-white' : 'bg-white border-gray-200 text-black'} border rounded-xl py-3 px-4 focus:outline-none focus:border-red-600 transition-all shadow-inner`}
            >
              <option value="public">Public (Everyone can see)</option>
              <option value="private">Private (Only you can see in My Uploads)</option>
            </select>
          </div>

          <div className="relative group">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Video File</label>
            <input
              type="file"
              accept="video/*"
              id="file-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <label 
              htmlFor="file-upload" 
              className={`flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} rounded-xl cursor-pointer hover:border-red-600/50 transition-all`}
            >
              <span className="text-gray-400 group-hover:text-red-500 transition-colors flex items-center gap-2">
                {file ? <><HiCheckCircle className="text-green-500" /> {file.name}</> : "Choose a video file"}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
              uploading 
              ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
              : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-95"
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-xs"></span>
                Uploading...
              </span>
            ) : "Publish Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
