import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiPlay } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const Allvideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = localStorage.getItem("theme") || "dark";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get("search");
        const url = search 
          ? `http://localhost:5000/api/videos?search=${search}` 
          : "http://localhost:5000/api/videos";
        
        const res = await axios.get(url);
        setVideos(res.data);
      } catch (err) {
        console.log("Error fetching Videos", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="loading loading-ring loading-lg text-red-600"></span>
        <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} font-medium animate-pulse`}>Searching for the best content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold text-xl">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={`mt-4 px-6 py-2 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'} rounded-full transition-colors`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-12 px-6 sm:px-10 min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'} transition-colors`}>
      {!videos || videos.length === 0 ? (
        <div className={`text-center py-40 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} rounded-3xl border`}>
          <p className="text-gray-400 text-xl font-medium">No videos available at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">Check back later or upload your own!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-10 gap-x-6">
          {videos.map((video) => (
            <div
              key={video._id}
              onClick={() => navigate(`/watch/${video._id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-red-600/10 active:scale-95">
                <img
                  src={video.thumbnail || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
                  }}
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                    <HiPlay className="text-white text-3xl ml-1" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <div className="flex-1">
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-black'} font-bold text-sm sm:text-base line-clamp-2 group-hover:text-red-500 transition-colors`}>
                    {video.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <span className="hover:text-red-500 transition-colors">{video.creator || "Anonymous"}</span>
                    <span>•</span>
                    <span>{new Date(video.createdAt).toLocaleDateString() || "Recently"}</span>
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

export default Allvideos;
