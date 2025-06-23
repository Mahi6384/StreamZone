import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [like, setLike] = useState(0);
  const [dislike, setDislike] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(res.data);
        setLike(res.data.likes);
        setDislike(res.data.dislikes);
      } catch (err) {
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/videos/${id}/likes`
      );
      setLike(res.data.likes);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/videos/${id}/dislikes`
      );
      setDislike(res.data.dislikes);
    } catch (err) {
      console.log("Error", err);
    }
  };

  if (loading)
    return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  if (!video) return null;

  return (
    <div className="px-4 py-2 max-w-5xl mx-auto">
      {/* Video Section */}
      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
        <video className="w-full h-full object-contain" controls>
          <source src={video.filePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Metadata */}
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-gray-200 mt-6">{video.title}</h2>
        <div className="flex flex-wrap items-center gap-6 mt-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-blue-100 hover:text-blue-600 transition duration-200"
          >
            <FaThumbsUp /> <span>{like}</span>
          </button>

          <button
            onClick={handleDislike}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-red-100 hover:text-red-600 transition duration-200"
          >
            <FaThumbsDown /> <span>{dislike}</span>
          </button>

          <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-green-100 hover:text-green-600 transition duration-200">
            Comments
          </button>
        </div>
      </div>
      <p className="mt-2 text-gray-500 leading-relaxed">{video.description}</p>
      <p className="text-sm text-gray-500 mt-1">
        <span className="font-medium">{video.creator}</span>
      </p>

      {/* Interactions */}
    </div>
  );
};

export default VideoPlayer;
