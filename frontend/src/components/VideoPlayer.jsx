import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiThumbUp, HiThumbDown, HiChatAlt2, HiShare } from "react-icons/hi";
import toast from "react-hot-toast";

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = localStorage.getItem("theme") || "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const videoRes = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(videoRes.data);
        setLikes(videoRes.data.likes || []);
        setDislikes(videoRes.data.dislikes || []);
        setComments(videoRes.data.comments || []);

        const allRes = await axios.get("http://localhost:5000/api/videos");
        setSuggestedVideos(allRes.data.filter(v => v._id !== id));
      } catch (err) {
        setError("Failed to load video content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleInteraction = async (type) => {
    if (!user) {
      toast.error("Please login to interact with videos!");
      return;
    }

    try {
      const endpoint = type === "like" ? "likes" : "dislikes";
      const res = await axios.patch(`http://localhost:5000/api/videos/${id}/${endpoint}`, { userId: user._id });
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login to comment");
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/videos/${id}/comments`, {
        userId: user._id,
        userName: user.name,
        text: newComment
      });
      setComments(res.data);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
      <span className="loading loading-spinner text-red-600 loading-lg"></span>
    </div>
  );

  if (error) return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'} flex-col gap-4`}>
      <p className="text-red-500 font-bold text-xl">{error}</p>
      <button onClick={() => navigate("/")} className={`btn btn-outline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Back to Home</button>
    </div>
  );

  if (!video) return null;

  const isLiked = likes.includes(user?._id);
  const isDisliked = dislikes.includes(user?._id);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'} pt-24 px-4 sm:px-8 lg:px-12 pb-12 transition-colors`}>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            <video 
              key={video.filePath}
              className="w-full h-full object-contain" 
              controls 
              autoPlay
            >
              <source src={video.filePath} type="video/mp4" />
            </video>
          </div>

          <div className="mt-8">
            <h1 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-black'} leading-tight`}>
              {video.title}
            </h1>
            
            <div className={`mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-xl text-xl">
                  {video.creator?.[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{video.creator || "Anonymous"}</h4>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Creator</p>
                </div>
              </div>

              <div className={`flex items-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} rounded-full p-1 border shadow-sm`}>
                <button 
                  onClick={() => handleInteraction("like")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full hover:bg-black/5 transition-all font-bold text-sm border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                >
                  <HiThumbUp className={`text-xl ${isLiked ? 'text-red-500' : 'text-gray-400'}`} /> {likes.length}
                </button>
                <button 
                  onClick={() => handleInteraction("dislike")}
                  className="flex items-center gap-2 px-5 py-2 rounded-full hover:bg-black/5 transition-all font-bold text-sm"
                >
                  <HiThumbDown className={`text-xl ${isDisliked ? 'text-red-500' : 'text-gray-400'}`} /> {dislikes.length}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className={`btn btn-circle btn-sm ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                  <HiShare className={theme === 'dark' ? 'text-white' : 'text-black'} />
                </button>
              </div>
            </div>

            <div className={`mt-8 p-6 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'} rounded-2xl border`}>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed font-medium`}>
                {video.description || "No description provided for this video."}
              </p>
            </div>

            <div className="mt-12">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                Comments <span className="text-gray-500 text-sm">({comments.length})</span>
              </h3>
              
              <form onSubmit={handleAddComment} className="mt-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shrink-0">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={`flex-1 bg-transparent border-b ${theme === 'dark' ? 'border-white/10 text-white' : 'border-gray-200 text-black'} focus:border-red-600 outline-none pb-1 transition-colors`}
                  />
                  <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-all">Comment</button>
                </div>
              </form>

              <div className="mt-10 space-y-8">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-white shrink-0">
                      {comment.userName?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{comment.userName}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[380px] flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-400 px-1 uppercase tracking-widest text-sm">Suggested Videos</h3>
          {suggestedVideos.map((item) => (
            <div 
              key={item._id} 
              onClick={() => navigate(`/watch/${item._id}`)}
              className={`group flex gap-4 cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'} p-2 rounded-xl transition-all`}
            >
              <div className="w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 relative">
                <img 
                  src={item.thumbnail || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'} line-clamp-2 leading-snug group-hover:text-red-500 transition-colors`}>
                  {item.title}
                </h4>
                <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{item.creator || "Anonymous"}</p>
              </div>
            </div>
          ))}
          {(!suggestedVideos || suggestedVideos.length === 0) && (
            <p className="text-gray-600 text-sm italic px-2">No other videos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
