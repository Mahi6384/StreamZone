import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiPlay, HiLockClosed, HiGlobeAlt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const MyUploads = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = localStorage.getItem("theme") || "dark";

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchMyVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/videos/user/${user._id}`);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching my videos", err);
        setError("Failed to load your uploads.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyVideos();
  }, [user?._id, navigate]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
        <span className="loading loading-ring loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-12 px-6 sm:px-10 min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'} transition-colors`}>
      <div className="mb-10 text-center">
        <h2 className={`text-3xl sm:text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-black'} tracking-tight uppercase`}>
           My Uploads
        </h2>
        <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-[0.2em]">Manage your content</p>
      </div>

      {videos.length === 0 ? (
        <div className={`text-center py-32 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} rounded-3xl border`}>
          <p className="text-gray-400 text-xl">You haven't uploaded any videos yet.</p>
          <button 
            onClick={() => navigate("/upload")}
            className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all shadow-lg active:scale-95"
          >
            Start Uploading
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((video) => (
            <div
              key={video._id}
              className={`group relative rounded-2xl overflow-hidden border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-xl transition-all hover:shadow-red-600/10`}
            >
              <div 
                className="relative aspect-video cursor-pointer overflow-hidden"
                onClick={() => navigate(`/watch/${video._id}`)}
              >
                <img
                  src={video.thumbnail || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                    <HiPlay className="text-white text-2xl ml-1" />
                  </div>
                </div>
                
                {/* Visibility Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 backdrop-blur-md shadow-lg ${
                  video.visibility === 'private' ? 'bg-red-600/90 text-white' : 'bg-green-500/90 text-white'
                }`}>
                  {video.visibility === 'private' ? <HiLockClosed /> : <HiGlobeAlt />}
                  {video.visibility}
                </div>
              </div>

              <div className="p-5">
                <h3 className={`font-bold text-sm sm:text-base line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {video.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">{new Date(video.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <button className="text-[10px] font-bold text-red-500 hover:underline">Delete</button>
                    <button className="text-[10px] font-bold text-gray-400 hover:underline">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
