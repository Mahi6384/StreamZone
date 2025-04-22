import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const Allvideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos");
        setVideos(res.data);
      } catch (err) {
        console.log("Error fetching Videos", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center text-lg font-semibold text-gray-500">
          Loading videos...
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : videos.length > 0 ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              onClick={() => navigate(`watch/${video._id}`)}
              key={video._id}
              className="card bg-base-100 shadow-md hover:scale-105 transition-transform"
            >
              <figure className="relative overflow-hidden rounded-lg shadow-lg group">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://dummyimage.com/320x180/cccccc/000000&text=No+Thumbnail";
                  }}
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300  flex flex-col
 items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="text-white text-4xl"
                  />

                  <p className="text-white text-sm">Watch Now</p>
                </div>
              </figure>

              <div className="card-body p-4">
                <h2 className="card-title text-base">{video.title}</h2>
                <p className="text-sm text-gray-500">{video.creator}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No videos available....</div>
      )}
    </div>
  );
};

export default Allvideos;
