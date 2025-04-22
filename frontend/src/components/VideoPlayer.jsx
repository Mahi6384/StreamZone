// src/components/VideoPlayer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const VideoPlayer = () => {
  const { id } = useParams(); // Grab the video ID from the URL
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
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!video) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
        <video className="max-h-full max-w-full" controls>
          <source src={video.filePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Title + Description */}
      <h2 className="text-2xl font-bold mt-6">{video.title}</h2>
      <p className="mt-2 text-gray-700">{video.description}</p>
      <p className="text-sm text-gray-500 mt-1">By {video.creator}</p>

      {/* Like / Dislike / Comment (UI only) */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={() => {
            handleLike();
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600
          transition"
        >
          {" "}
          👍<span>Like {like}</span>
        </button>

        <button
          onClick={() => {
            handleDislike();
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
        >
          👎 <span>Dislike {dislike}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
          💬 <span>Comments</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
